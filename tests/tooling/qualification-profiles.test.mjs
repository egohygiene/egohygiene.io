import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repository = fileURLToPath(new URL("../../", import.meta.url));

// Real qualifier and freshness code, with child commands confined to a temporary
// fixture. These tests prove selection/fail-stop behavior, never browser results.
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "qualification-profiles-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "scripts"));
  await writeFile(path.join(root, ".gitignore"), "apps/*/dist*/\ntest-results/\n.cache/\n");
  for (const name of ["qualify-store.mjs", "build-smoke.mts"]) {
    await writeFile(
      path.join(root, "scripts", name),
      await readFile(path.join(repository, "scripts", name)),
    );
  }
  const command = `
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const script = path.relative(process.cwd(), process.argv[1]);
const identity = [script, ...args].join(" ");
mkdirSync("test-results", { recursive: true });
appendFileSync("test-results/commands.jsonl", JSON.stringify({ identity, preview: process.env.VITE_STORE_PREVIEW }) + "\\n");
if (process.env.FIXTURE_FAIL && identity.includes(process.env.FIXTURE_FAIL)) process.exit(23);
if (script === "scripts/store-environment.mjs" && args.at(-1) === "build") {
  const app = args.includes("@egohygiene/docs") ? "docs" : args.includes("@egohygiene/playground") ? "playground" : "egohygiene.io";
  const output = path.join("apps", app, args[0] === "build" ? "dist-preview" : "dist");
  mkdirSync(path.join(output, "assets"), { recursive: true });
  writeFileSync(path.join(output, "index.html"), '<!doctype html><html><head><title data-page-metadata>Ego Hygiene fixture</title><script type="module" src="/assets/app.js"></script><link rel="stylesheet" href="/assets/app.css"></head><body><div id="root"><main><h1>Fixture</h1></main></div></body></html>');
  writeFileSync(path.join(output, "assets/app.js"), "export const built = true;\\n");
  writeFileSync(path.join(output, "assets/app.css"), "body { color: black; }\\n");
  if (app === "egohygiene.io") writeFileSync(path.join(output, "public-routes.json"), "{}\\n");
}
`;
  for (const name of [
    "scripts/store-environment.mjs",
    "tests/store-qualification/public-rendering.mjs",
    "tests/store-qualification/artifacts.mts",
    "tests/component-styles/build-consumer.mjs",
    "tests/checkout-handoff/run.mts",
    "tests/storefront-qualification/run.mjs",
    "tests/catalog-localization/run.mts",
  ]) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), command);
  }
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "--quiet",
      "--message",
      "fixture",
    ],
    { cwd: root },
  );
  // A previous successful-looking output must not satisfy the new profile.
  for (const directory of [
    "apps/egohygiene.io/dist",
    "apps/docs/dist",
    "apps/playground/dist",
    "apps/egohygiene.io/dist-preview",
    ".cache/storybook",
    ".cache/component-styles-53/dist",
  ]) {
    await mkdir(path.join(root, directory), { recursive: true });
    await writeFile(path.join(root, directory, "stale.txt"), "stale");
  }
  await writeFile(path.join(root, ".cache/keep.txt"), "unrelated");
  return root;
}

async function runProfile(root, profile, fail = "") {
  const result = spawnSync(process.execPath, ["scripts/qualify-store.mjs", "--profile", profile], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, FIXTURE_FAIL: fail, VITE_STORE_PREVIEW: "true" },
    timeout: 30_000,
  });
  const report = JSON.parse(
    await readFile(
      path.join(
        root,
        "test-results/store-qualification",
        profile === "full" ? "profile" : profile,
        "checks.json",
      ),
      "utf8",
    ),
  );
  const commands = (await readFile(path.join(root, "test-results/commands.jsonl"), "utf8"))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  return { result, report, commands };
}

test("strict non-browser and full profiles retain the artifact failure and stop downstream work", async (t) => {
  for (const profile of ["ci-check", "full"]) {
    await t.test(profile, async (subtest) => {
      const root = await fixture(subtest);
      const { result, report, commands } = await runProfile(root, profile, "artifacts.mts");
      assert.equal(result.status, 1, result.stderr);
      assert.equal(report.status, "failed");
      assert.equal(report.steps.at(-1).exitCode, 23);
      assert.match(report.failure, /regression budgets failed/);
      for (const name of [
        "format:check",
        "lint",
        "typecheck:all",
        "check",
        "catalog:test",
        "test:tooling",
        "test:unit",
        "test:semantic",
        "test:browser:discover",
        "test:components",
      ]) {
        assert.ok(
          commands.some(({ identity }) => identity === `scripts/store-environment.mjs run ${name}`),
          `Missing ${name}`,
        );
      }
      assert.ok(commands.some(({ identity }) => identity.includes("public-rendering.mjs")));
      assert.ok(commands.every(({ preview }) => preview === "false"));
      assert.ok(
        commands.every(
          ({ identity }) =>
            !/storybook:build|test:e2e|run test:store(?: |$)|playwright test|handoff\/run/.test(
              identity,
            ),
        ),
      );
    });
  }
});

test("browser profile fails closed on native Storybook before launching any browser", async (t) => {
  const root = await fixture(t);
  const { result, report, commands } = await runProfile(root, "ci-browser", "storybook:build");
  assert.equal(result.status, 1, result.stderr);
  assert.equal(report.steps.at(-1).exitCode, 23);
  assert.match(report.failure, /native Storybook build failed/);
  assert.ok(commands.some(({ identity }) => identity === "scripts/store-environment.mjs build"));
  assert.ok(
    commands.every(
      ({ identity }) =>
        !/test:e2e|run test:store(?: |$)|playwright test|build-consumer/.test(identity),
    ),
  );
  for (const output of [
    "apps/egohygiene.io/dist",
    "apps/docs/dist",
    "apps/playground/dist",
    "apps/egohygiene.io/dist-preview",
    ".cache/storybook",
  ]) {
    await assert.rejects(readFile(path.join(root, output, "stale.txt")), /ENOENT/);
  }
});

test("independent browser profile prepares fresh prerequisites and selects every maintained journey", async (t) => {
  const root = await fixture(t);
  const { result, report, commands } = await runProfile(root, "ci-browser");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(report.status, "passed");
  const identities = commands.map(({ identity }) => identity);
  const firstBrowser = identities.indexOf("scripts/store-environment.mjs run test:e2e");
  for (const command of [
    "scripts/store-environment.mjs run build",
    "scripts/store-environment.mjs run --filter @egohygiene/docs build",
    "scripts/store-environment.mjs run --filter @egohygiene/playground build",
    "scripts/store-environment.mjs build",
    "scripts/store-environment.mjs run storybook:build",
    "tests/component-styles/build-consumer.mjs",
  ]) {
    assert.ok(
      identities.indexOf(command) >= 0 && identities.indexOf(command) < firstBrowser,
      `Missing prerequisite ${command}`,
    );
  }
  for (const command of [
    "scripts/store-environment.mjs run test:e2e",
    "scripts/store-environment.mjs run test:store",
    "scripts/store-environment.mjs run test:store:preview",
    "scripts/store-environment.mjs run exec playwright test --config playwright.component-styles.config.ts",
  ])
    assert.ok(identities.includes(command), `Missing suite ${command}`);
  for (const script of [
    "tests/checkout-handoff/run.mts",
    "tests/storefront-qualification/run.mjs",
    "tests/catalog-localization/run.mts",
  ]) {
    assert.ok(
      identities.some((identity) => identity.startsWith(`${script} --output-dir `)),
      `Missing journey ${script}`,
    );
  }
  assert.ok(identities.every((identity) => !identity.includes("artifacts.mts")));
  await assert.rejects(
    readFile(path.join(root, ".cache/component-styles-53/dist/stale.txt")),
    /ENOENT/,
  );
  assert.equal(await readFile(path.join(root, ".cache/keep.txt"), "utf8"), "unrelated");
});
