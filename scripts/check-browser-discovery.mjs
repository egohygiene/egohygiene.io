/** Check selection only: --list starts neither web servers nor browsers. */
import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const profiles = [
  { config: "playwright.config.ts", requiredProjects: ["site", "docs", "playground"] },
  { config: "playwright.store.config.ts", requiredProjects: [] },
  { config: "playwright.store-preview.config.ts", requiredProjects: [] },
  { config: "playwright.component-styles.config.ts", requiredProjects: [] },
];
const browserRoots = ["tests/e2e", "tests/component-styles"];
// This co-located Node build contract has its own maintained runner.
const separateRunnerTests = [
  { file: "tests/component-styles/consumer.test.mjs", command: "pnpm test:components" },
];
const specPattern = /\.(?:spec|test)\.[cm]?[jt]sx?$/;
const portablePath = (file) => file.split(path.sep).join("/");

async function inventoryFiles(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const file = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return inventoryFiles(file);
      return entry.isFile() && specPattern.test(entry.name) ? [file] : [];
    }),
  );
  return files.flat().sort();
}

export function selectBrowserSpecs(allFiles) {
  for (const { file } of separateRunnerTests) {
    if (!allFiles.includes(file)) throw new Error(`Stale separate-runner entry: ${file}`);
  }
  return allFiles.filter((file) => !separateRunnerTests.some((entry) => entry.file === file));
}

function* listedSpecs(suites) {
  for (const suite of suites) {
    yield* suite.specs ?? [];
    yield* listedSpecs(suite.suites ?? []);
  }
}

function validateReport(report, config) {
  if (
    !report ||
    !Array.isArray(report.suites) ||
    !Array.isArray(report.config?.projects) ||
    !Array.isArray(report.errors) ||
    report.errors.length > 0
  ) {
    throw new Error(`${config}: invalid or failed Playwright discovery report`);
  }
}

function readOutputDirectories(report, config, repositoryRoot) {
  const receipts = path.resolve(repositoryRoot, "test-results/store-qualification");
  const contains = (parent, child) => {
    const relative = path.relative(parent, child);
    return (
      relative === "" ||
      (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
    );
  };
  const outputDirectories = new Set();
  for (const { name, outputDir } of report.config.projects) {
    if (typeof outputDir !== "string" || !path.isAbsolute(outputDir)) {
      throw new Error(`${config}: project ${name || "(default)"} has no absolute output directory`);
    }
    // Playwright removes each project output directory before execution. A shared
    // parent would erase the qualifier's running report and earlier receipts.
    const directory = path.resolve(outputDir);
    if (contains(directory, receipts) || contains(receipts, directory)) {
      throw new Error(
        `${config}: project ${name || "(default)"} output directory overlaps qualification receipts: ${outputDir}`,
      );
    }
    outputDirectories.add(portablePath(path.relative(repositoryRoot, directory)));
  }
  return outputDirectories;
}

function readSelection(report, config, repositoryRoot) {
  validateReport(report, config);
  const outputDirectories = readOutputDirectories(report, config, repositoryRoot);
  const projects = new Map(report.config.projects.map(({ name }) => [name, 0]));
  const files = new Set();
  for (const spec of listedSpecs(report.suites)) {
    const file = portablePath(
      path.relative(repositoryRoot, path.resolve(report.config.rootDir, spec.file)),
    );
    for (const test of spec.tests ?? []) {
      if (!projects.has(test.projectName)) {
        throw new Error(`${config}: unexpected project ${test.projectName}`);
      }
      projects.set(test.projectName, projects.get(test.projectName) + 1);
      files.add(file);
    }
  }
  return { projects, files, outputDirectories };
}

/** Compare actual runner discovery with files on disk, without snapshotting case counts. */
export function checkBrowserDiscovery(reports, inventory, repositoryRoot = root) {
  const discovered = new Set();
  const summaries = profiles.map(({ config, requiredProjects }) => {
    const { projects, files, outputDirectories } = readSelection(
      reports[config],
      config,
      repositoryRoot,
    );
    for (const name of requiredProjects) {
      if (!projects.has(name)) throw new Error(`${config}: missing maintained project ${name}`);
    }
    for (const file of files) discovered.add(file);
    if (projects.size === 0) throw new Error(`${config}: no configured projects`);
    for (const [name, count] of projects) {
      if (count === 0)
        throw new Error(`${config}: project ${name || "(default)"} selects no cases`);
    }
    return {
      config,
      cases: [...projects.values()].reduce((total, count) => total + count, 0),
      projects: [...projects].map(([name, cases]) => ({ name, cases })),
      outputDirectories: [...outputDirectories].sort(),
      files: [...files].sort(),
    };
  });
  if (inventory.length === 0) throw new Error("Maintained browser-spec inventory is empty");
  const missing = inventory.filter((file) => !discovered.has(file));
  if (missing.length > 0)
    throw new Error(`Browser specs selected by no maintained profile: ${missing.join(", ")}`);
  const unexpected = [...discovered].filter((file) => !inventory.includes(file));
  if (unexpected.length > 0)
    throw new Error(`Browser discovery outside maintained inventory: ${unexpected.join(", ")}`);
  return { profiles: summaries, uniqueFiles: discovered.size };
}

async function main() {
  const allFiles = (await Promise.all(browserRoots.map(inventoryFiles))).flat().sort();
  const inventory = selectBrowserSpecs(allFiles);
  const cli = createRequire(import.meta.url).resolve("@playwright/test/cli");
  const environment = { ...process.env };
  // An ambient reporter output path must not divert JSON away from captured stdout.
  for (const name of [
    "PLAYWRIGHT_JSON_OUTPUT_FILE",
    "PLAYWRIGHT_JSON_OUTPUT_DIR",
    "PLAYWRIGHT_JSON_OUTPUT_NAME",
  ]) {
    delete environment[name];
  }
  const reports = {};
  const commands = [];
  for (const { config } of profiles) {
    const args = ["test", "--config", config, "--list", "--reporter=json", "--forbid-only"];
    commands.push(["node", "node_modules/@playwright/test/cli.js", ...args]);
    const result = spawnSync(process.execPath, [cli, ...args], {
      cwd: root,
      env: environment,
      encoding: "utf8",
      timeout: 120_000,
      maxBuffer: 16 * 1024 * 1024,
    });
    if (result.error || result.status !== 0) {
      throw new Error(
        `${config}: --list failed (${result.error?.message ?? result.status}): ${result.stderr?.trim() ?? ""}`,
      );
    }
    reports[config] = JSON.parse(result.stdout);
  }
  process.stdout.write(
    `${JSON.stringify(
      {
        status: "passed",
        scope:
          "Playwright discovery only; no browser execution, server startup or behavior qualification. Profile counts may overlap. Custom journey runners are separate scopes.",
        commands,
        separateRunnerTests,
        ...checkBrowserDiscovery(reports, inventory),
      },
      null,
      2,
    )}\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`Browser discovery failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
