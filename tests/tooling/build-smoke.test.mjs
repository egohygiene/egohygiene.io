import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  createSmokeReceipt,
  smokeApps,
  smokeReceiptPath,
  smokeSourceIdentity,
  verifySmokeApp,
} from "../../scripts/build-smoke.mts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const invocation = "test-only-current-invocation";
const html =
  '<!doctype html><html><head><title>Ego Hygiene fixture</title><script type="module" src="/assets/app.js"></script><link rel="stylesheet" href="/assets/app.css"></head><body><div id="root"><main><h1>Fixture</h1></main></div></body></html>';

async function fixture(t, seedBuilds = true) {
  const root = await mkdtemp(path.join(tmpdir(), "fresh-build-smoke-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, ".gitignore"), "apps/*/dist/\ntest-results/\n.cache/\n");
  await writeFile(path.join(root, "source.txt"), "First source revision\n");
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["add", ".gitignore", "source.txt"], { cwd: root });
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Smoke Fixture",
      "-c",
      "user.email=smoke@example.invalid",
      "commit",
      "--quiet",
      "--message",
      "fixture",
    ],
    { cwd: root },
  );
  if (seedBuilds) {
    for (const app of smokeApps) {
      const dist = path.join(root, "apps", app, "dist");
      await mkdir(path.join(dist, "assets"), { recursive: true });
      await writeFile(
        path.join(dist, "index.html"),
        app === "egohygiene.io" ? html.replace("<title>", "<title data-page-metadata>") : html,
      );
      await writeFile(path.join(dist, "assets/app.js"), "export const built = true;\n");
      await writeFile(path.join(dist, "assets/app.css"), "body { color: black; }\n");
      if (app === "egohygiene.io") await writeFile(path.join(dist, "public-routes.json"), "{}\n");
    }
    await refreshReceipt(root);
  }
  return root;
}

async function refreshReceipt(root) {
  const source = await smokeSourceIdentity(root);
  const receipt = await createSmokeReceipt(root, invocation, source);
  await mkdir(path.dirname(path.join(root, smokeReceiptPath)), { recursive: true });
  await writeFile(path.join(root, smokeReceiptPath), JSON.stringify(receipt));
  return receipt;
}

test("fresh smoke validates all apps against invocation, source and artifact identities", async (t) => {
  const root = await fixture(t);
  for (const app of smokeApps) {
    const result = await verifySmokeApp(root, app, invocation);
    assert.deepEqual(result.scripts, ["assets/app.js"]);
    assert.deepEqual(result.styles, ["assets/app.css"]);
    assert.match(result.indexSha256, /^[a-f0-9]{64}$/);
  }
});

test("smoke refuses direct invocation, missing receipts and receipts from an earlier run", async (t) => {
  const root = await fixture(t);
  await assert.rejects(verifySmokeApp(root, "docs", undefined), /fresh builds are required/);
  await assert.rejects(verifySmokeApp(root, "docs", "older-invocation"), /stale/);
  await rm(path.join(root, smokeReceiptPath));
  await assert.rejects(verifySmokeApp(root, "docs", invocation), /ENOENT/);
});

test("smoke refuses changed tracked or new source and source mutation during prerequisites", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "source.txt"), "Changed source revision\n");
  await assert.rejects(verifySmokeApp(root, "docs", invocation), /current source/);
  await refreshReceipt(root);
  const before = await smokeSourceIdentity(root);
  await writeFile(path.join(root, "new-source.txt"), "New uncommitted source\n");
  await assert.rejects(verifySmokeApp(root, "docs", invocation), /current source/);
  await assert.rejects(createSmokeReceipt(root, invocation, before), /source changed/);
});

test("smoke refuses deleted, added or tampered output after a successful build", async (t) => {
  for (const [name, change] of [
    ["deleted", (directory) => rm(path.join(directory, "assets/app.js"))],
    ["added", (directory) => writeFile(path.join(directory, "extra.html"), html)],
    ["tampered", (directory) => writeFile(path.join(directory, "assets/app.js"), "changed")],
  ]) {
    await t.test(name, async (subtest) => {
      const root = await fixture(subtest);
      await change(path.join(root, "apps/docs/dist"));
      await assert.rejects(verifySmokeApp(root, "docs", invocation), /missing, stale or changed/);
    });
  }
});

test("smoke checks meaningful HTML/assets even when a receipt is freshly recorded", async (t) => {
  for (const [name, target, content, expected] of [
    [
      "source path",
      "index.html",
      html.replace("/assets/app.js", "/src/main.tsx"),
      /emitted local asset/,
    ],
    [
      "missing module",
      "index.html",
      html.replace(/<script[^>]*><\/script>/, ""),
      /emitted JavaScript/,
    ],
    ["missing asset", "index.html", html.replace("app.js", "absent.js"), /missing asset/],
    ["HTML fallback", "assets/app.js", "<!doctype html><html></html>", /empty or HTML/],
    ["empty stylesheet", "assets/app.css", "  \n", /empty or HTML/],
  ]) {
    await t.test(name, async (subtest) => {
      const root = await fixture(subtest);
      await writeFile(path.join(root, "apps/docs/dist", target), content);
      await refreshReceipt(root);
      await assert.rejects(verifySmokeApp(root, "docs", invocation), expected);
    });
  }
});

test("smoke rejects a client-only website shell and incomplete build receipts", async (t) => {
  const root = await fixture(t);
  await writeFile(
    path.join(root, "apps/egohygiene.io/dist/index.html"),
    html.replace(/<main>.*<\/main>/, ""),
  );
  const receipt = await refreshReceipt(root);
  await assert.rejects(
    verifySmokeApp(root, "egohygiene.io", invocation),
    /rendered primary content/,
  );
  await writeFile(
    path.join(root, smokeReceiptPath),
    JSON.stringify({ ...receipt, artifacts: receipt.artifacts.slice(0, 2) }),
  );
  await assert.rejects(verifySmokeApp(root, "docs", invocation), /all three completed/);
});

test("failed build prerequisites stop the supported runner and invalidate stale outputs/receipts", async (t) => {
  const root = await fixture(t);
  await mkdir(path.join(root, "scripts"));
  for (const file of ["qualify-store.mjs", "store-environment.mjs", "build-smoke.mts"]) {
    await writeFile(
      path.join(root, "scripts", file),
      await readFile(path.join(repository, "scripts", file)),
    );
  }
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      private: true,
      packageManager: "pnpm@11.28.5",
      engines: { node: ">=24.21.0 <25", pnpm: "11.28.5" },
    }),
  );
  await writeFile(path.join(root, ".tool-versions"), "nodejs 24.21.0\npnpm 11.28.5\n");
  await mkdir(path.join(root, ".cache"));
  await writeFile(path.join(root, ".cache/keep.txt"), "Unrelated output must survive\n");
  const bin = path.join(root, "fixture-bin");
  await mkdir(bin);
  await writeFile(
    path.join(bin, "pnpm"),
    `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
if (args[0] === "--version") { process.stdout.write("11.28.5\\n"); process.exit(0); }
fs.appendFileSync("test-results/build-commands.txt", args.join(" ") + "\\n");
if (args.includes("@egohygiene/docs")) process.exit(17);
process.exit(0);
`,
    { mode: 0o755 },
  );
  const result = spawnSync(process.execPath, ["scripts/qualify-store.mjs", "--profile", "smoke"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH ?? ""}` },
  });
  assert.equal(result.status, 1, result.stderr);
  const report = JSON.parse(
    await readFile(path.join(root, "test-results/store-qualification/smoke/checks.json"), "utf8"),
  );
  assert.equal(report.status, "failed");
  assert.match(report.failure, /fresh docs build failed with exit code 17/);
  assert.deepEqual(
    report.steps.map((step) => step.status),
    ["passed", "failed"],
  );
  const commands = await readFile(path.join(root, "test-results/build-commands.txt"), "utf8");
  assert.doesNotMatch(commands, /playground|vitest/);
  await assert.rejects(readFile(path.join(root, smokeReceiptPath)), /ENOENT/);
  for (const app of smokeApps)
    await assert.rejects(readFile(path.join(root, "apps", app, "dist/index.html")), /ENOENT/);
  assert.equal(
    await readFile(path.join(root, ".cache/keep.txt"), "utf8"),
    "Unrelated output must survive\n",
  );
});
