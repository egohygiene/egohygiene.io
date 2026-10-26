import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import {
  checkBrowserDiscovery,
  selectBrowserSpecs,
} from "../../scripts/check-browser-discovery.mjs";

function discovery() {
  const root = path.resolve("browser-discovery-fixture");
  const inventory = ["site", "docs", "playground", "store", "preview", "components"].map(
    (name) => `tests/${name}.spec.ts`,
  );
  const profile = (names, files) => ({
    config: {
      rootDir: path.join(root, "tests"),
      projects: names.map((name) => ({ name, outputDir: path.join(root, "test-results/apps") })),
    },
    errors: [],
    suites: [
      {
        suites: files.map(([file, projectName]) => ({
          specs: [{ file: `${file}.spec.ts`, tests: [{ projectName }] }],
        })),
      },
    ],
  });
  const reports = {
    "playwright.config.ts": profile(
      ["site", "docs", "playground"],
      [
        ["site", "site"],
        ["docs", "docs"],
        ["playground", "playground"],
      ],
    ),
    "playwright.store.config.ts": profile(
      [""],
      [
        ["site", ""],
        ["store", ""],
      ],
    ),
    "playwright.store-preview.config.ts": profile([""], [["preview", ""]]),
    "playwright.component-styles.config.ts": profile([""], [["components", ""]]),
  };
  return { root, inventory, reports };
}

test("browser discovery accepts nested suites and cross-profile file overlap", () => {
  const { root, inventory, reports } = discovery();
  const result = checkBrowserDiscovery(reports, inventory, root);
  assert.equal(result.uniqueFiles, 6);
  assert.equal(
    result.profiles.reduce((total, profile) => total + profile.cases, 0),
    7,
  );
});

test("only the explicit Node consumer contract is separated from browser inventory", () => {
  const browserFiles = ["tests/e2e/site.spec.ts", "tests/component-styles/new.test.mjs"];
  assert.deepEqual(
    selectBrowserSpecs([...browserFiles, "tests/component-styles/consumer.test.mjs"]),
    browserFiles,
  );
  assert.throws(() => selectBrowserSpecs(browserFiles), /Stale separate-runner entry/);
});

test("browser discovery fails when a maintained spec is unselected", () => {
  const { root, inventory, reports } = discovery();
  inventory.push("tests/new-unselected.spec.ts");
  assert.throws(() => checkBrowserDiscovery(reports, inventory, root), /new-unselected\.spec\.ts/);
});

test("production overlap cannot hide a missing or empty default site project", () => {
  for (const removeProject of [true, false]) {
    const { root, inventory, reports } = discovery();
    const report = reports["playwright.config.ts"];
    report.suites[0].suites.shift();
    if (removeProject) report.config.projects.shift();
    assert.throws(
      () => checkBrowserDiscovery(reports, inventory, root),
      removeProject ? /missing maintained project site/ : /project site selects no cases/,
    );
  }
});

test("discovery rejects browser output that can erase or occupy qualification receipts", () => {
  for (const directory of [
    ".",
    "test-results",
    "test-results/store-qualification",
    "test-results/store-qualification/ci-browser",
    "test-results/apps/../store-qualification",
  ]) {
    const { root, inventory, reports } = discovery();
    reports["playwright.config.ts"].config.projects[0].outputDir = path.resolve(root, directory);
    assert.throws(
      () => checkBrowserDiscovery(reports, inventory, root),
      /output directory overlaps qualification receipts/,
      directory,
    );
  }
});

test("discovery accepts shared project outputs and sibling names without a path-prefix collision", () => {
  const { root, inventory, reports } = discovery();
  for (const project of reports["playwright.config.ts"].config.projects) {
    project.outputDir = path.join(root, "test-results/store-qualification-browser");
  }
  const result = checkBrowserDiscovery(reports, inventory, root);
  assert.deepEqual(result.profiles[0].outputDirectories, [
    "test-results/store-qualification-browser",
  ]);
});

test("discovery fails closed when a project output directory is missing or relative", () => {
  for (const outputDir of [undefined, "test-results/apps"]) {
    const { root, inventory, reports } = discovery();
    reports["playwright.store.config.ts"].config.projects[0].outputDir = outputDir;
    assert.throws(
      () => checkBrowserDiscovery(reports, inventory, root),
      /has no absolute output directory/,
    );
  }
});
