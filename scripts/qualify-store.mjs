/** Local website qualification. Fresh builds are prerequisites, never optional. */
import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "test-results/store-qualification/profile");
const environmentRunner = "scripts/store-environment.mjs";
const report = {
  startedAt: new Date().toISOString(),
  sourceCommit: spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim(),
  sourceStatus: spawnSync("git", ["status", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
  }).stdout.trim(),
  node: process.version,
  scope:
    "Local website contracts, production/isolated-preview browser behavior and synthetic layout qualification. No hosted CI, deployment, real provider or physical-device qualification.",
  status: "running",
  steps: [],
};

async function saveReport() {
  await writeFile(path.join(output, "checks.json"), `${JSON.stringify(report, null, 2)}\n`);
}

async function run(name, args) {
  process.stdout.write(`\nStore qualification: ${name}\n`);
  const startedAt = new Date().toISOString();
  const started = performance.now();
  const step = { name, command: ["node", ...args], startedAt, status: "running" };
  report.steps.push(step);
  await saveReport();
  const child = spawn(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    // Ambient preview configuration must not turn the normal build into a demo.
    env: { ...process.env, VITE_STORE_PREVIEW: "false" },
  });
  const interrupt = () => child.kill("SIGINT");
  const terminate = () => child.kill("SIGTERM");
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", terminate);
  try {
    const exitCode = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code) => resolve(code ?? 1));
    });
    Object.assign(step, {
      status: exitCode === 0 ? "passed" : "failed",
      exitCode,
      elapsedMs: Math.round(performance.now() - started),
    });
    await saveReport();
    if (exitCode !== 0) throw new Error(`${name} failed with exit code ${exitCode}`);
  } finally {
    process.off("SIGINT", interrupt);
    process.off("SIGTERM", terminate);
  }
}

await mkdir(output, { recursive: true });
await saveReport();
try {
  await run("application, catalog and portable-domain types", [
    environmentRunner,
    "run",
    "typecheck",
  ]);
  await run("browser test types", [
    environmentRunner,
    "run",
    "exec",
    "tsc",
    "--project",
    "tsconfig.store-browser.json",
    "--noEmit",
  ]);
  await run("interface message review types", [
    environmentRunner,
    "run",
    "exec",
    "tsc",
    "--project",
    "tsconfig.locales.json",
    "--noEmit",
  ]);
  await run("interface message and human-review contracts", [
    "--test",
    "tests/tooling/locale-catalog.test.mjs",
  ]);
  await run("interface messages and translation review freshness", [
    "scripts/checks/check-locales.ts",
  ]);
  await run("portable import boundary", ["scripts/checks/check-store-boundaries.ts"]);
  await run("catalog and artifact contracts", [environmentRunner, "run", "catalog:test"]);
  await run("store, preview, theme and locale units", [
    environmentRunner,
    "run",
    "test:unit",
    "apps/egohygiene.io/src/features/store",
    "apps/egohygiene.io/src/features/fourthwall-preview",
    "apps/egohygiene.io/src/features/artist-preview",
    "apps/egohygiene.io/src/i18n",
    "apps/egohygiene.io/src/components",
    "apps/egohygiene.io/src/pages",
    "packages/themes",
    "packages/i18n",
  ]);
  await run("website semantic component checks", [
    environmentRunner,
    "run",
    "exec",
    "vitest",
    "run",
    "--config",
    "vitest.accessibility.config.ts",
    "tests/accessibility/site-accessibility.test.tsx",
  ]);
  await run("fresh normal build", [environmentRunner, "run", "build"]);
  await run("production artifacts and provisional regression budgets", [
    "tests/store-qualification/artifacts.mts",
    "--output",
    "test-results/store-qualification/profile/production-artifact.json",
  ]);
  await run("production website journeys and accessibility", [
    environmentRunner,
    "run",
    "test:store",
  ]);
  await run("fresh isolated preview build", [environmentRunner, "build"]);
  await run("isolated Fourthwall and artist journeys", [
    environmentRunner,
    "run",
    "test:store:preview",
  ]);
  await run("intercepted checkout handoff", [
    "tests/checkout-handoff/run.mts",
    "--output-dir",
    "test-results/store-qualification/profile/handoff",
  ]);
  await run("locale journeys, expanded text and synthetic RTL layout", [
    "tests/storefront-qualification/run.mjs",
    "--output-dir",
    "test-results/store-qualification/profile/layout",
  ]);
  await run("catalog localization and intercepted identity journeys", [
    "tests/catalog-localization/run.mts",
    "--output-dir",
    "test-results/store-qualification/profile/catalog-localization",
  ]);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${report.failure}\n`);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await saveReport();
}
