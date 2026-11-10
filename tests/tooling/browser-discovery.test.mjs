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
    config: { rootDir: path.join(root, "tests"), projects: names.map((name) => ({ name })) },
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
