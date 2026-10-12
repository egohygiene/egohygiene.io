import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { supportsNode } from "../../scripts/store-environment.mjs";

const scriptSource = new URL("../../scripts/store-environment.mjs", import.meta.url);
const nodeRange = ">=24.21.0 <25";

async function createCheckout(context, options = {}) {
  const root = await mkdtemp(join(tmpdir(), "store-preview-tools-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "scripts"));
  await mkdir(join(root, "bin"));
  await copyFile(scriptSource, join(root, "scripts", "store-environment.mjs"));
  await writeFile(join(root, "package.json"), JSON.stringify({
    type: "module",
    packageManager: "pnpm@11.28.5",
    engines: { node: nodeRange, pnpm: "11.28.5" },
  }));
  await writeFile(join(root, ".tool-versions"), "nodejs 24.21.0\npnpm 11.28.5\n");
  const logPath = join(root, "commands.jsonl");
  for (const [tool, version] of Object.entries(options.tools ?? { pnpm: "11.28.5" })) {
    await writeFile(join(root, "bin", tool), [
      `#!${process.execPath}`,
      "import { appendFileSync } from \"node:fs\";",
      "const arguments_ = process.argv.slice(2);",
      `if (arguments_[0] === "--version") { console.log(${JSON.stringify(version)}); }`,
      "else {",
      `  appendFileSync(${JSON.stringify(logPath)}, JSON.stringify({ tool: ${JSON.stringify(tool)}, arguments: arguments_, cwd: process.cwd(), preview: process.env["VITE_STORE_PREVIEW"] ?? null }) + "\\n");`,
      `  process.exitCode = ${options.exitCode ?? 0};`,
      "}",
    ].join("\n"), { mode: 0o755 });
  }
  return {
    root,
    run(arguments_, environment = {}, nodeVersion) {
      const invocation = nodeVersion ? [
        "--input-type=module", "--eval",
        `Object.defineProperty(process.versions, "node", { value: ${JSON.stringify(nodeVersion)} });\nimport("./scripts/store-environment.mjs").then(({ runStoreEnvironment }) => runStoreEnvironment(${JSON.stringify(arguments_)})).then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = 1; });`,
      ] : ["scripts/store-environment.mjs", ...arguments_];
      return spawnSync(process.execPath, invocation, {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, PATH: join(root, "bin"), VITE_STORE_PREVIEW: "", ...environment },
      });
    },
    async commands() {
      try {
        return (await readFile(logPath, "utf8")).trim().split("\n").map((line) => JSON.parse(line));
      } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
      }
    },
  };
}

test("Node compatibility accepts the supported LTS range and rejects older/new major or prerelease versions", () => {
  assert.equal(supportsNode("24.21.0", nodeRange), true);
  assert.equal(supportsNode("v24.22.1", nodeRange), true);
  for (const version of ["24.20.9", "22.21.0", "25.0.0", "24.21.0-rc.1", "invalid"]) {
    assert.equal(supportsNode(version, nodeRange), false, version);
  }
});

test("an unsupported active Node fails before install with an exact actionable version hint", async (context) => {
  const checkout = await createCheckout(context);
  const result = checkout.run(["setup"], {}, "24.19.0");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Node 24\.19\.0 is active/);
  assert.match(result.stderr, /mise exec node@24\.21\.0 -- task preview:store/);
  assert.deepEqual(await checkout.commands(), []);
});

test("setup reuses pinned pnpm and safely rechecks the frozen install on subsequent runs", async (context) => {
  const checkout = await createCheckout(context);
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const result = checkout.run(["setup"]);
    assert.equal(result.status, 0, result.stderr);
  }
  const commands = await checkout.commands();
  assert.equal(commands.length, 2);
  for (const command of commands) {
    assert.equal(command.tool, "pnpm");
    assert.deepEqual(command.arguments, ["install", "--frozen-lockfile", "--ignore-scripts"]);
    assert.equal(command.cwd, checkout.root);
  }
});

test("missing or mismatched pnpm uses the exact npm-cached package without a global install", async (context) => {
  for (const tools of [{ npm: "11.10.0" }, { npm: "11.10.0", pnpm: "10.0.0" }]) {
    const checkout = await createCheckout(context, { tools });
    const result = checkout.run(["setup"]);
    assert.equal(result.status, 0, result.stderr);
    const [command] = await checkout.commands();
    assert.equal(command.tool, "npm");
    assert.deepEqual(command.arguments, [
      "exec", "--yes", "--ignore-scripts", "--package=pnpm@11.28.5", "--", "pnpm",
      "install", "--frozen-lockfile", "--ignore-scripts",
    ]);
  }
});

test("missing package managers stop setup with recovery instructions", async (context) => {
  const checkout = await createCheckout(context, { tools: {} });
  const result = checkout.run(["setup"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /pnpm 11\.28\.5 is unavailable and npm is missing/);
});

test("failed dependency installation preserves its failure status", async (context) => {
  const checkout = await createCheckout(context, { exitCode: 23 });
  assert.equal(checkout.run(["setup"]).status, 23);
});

test("preview builds into a separate directory and serves only on loopback with a strict port", async (context) => {
  const checkout = await createCheckout(context);
  assert.equal(checkout.run(["build"]).status, 0);
  assert.equal(checkout.run(["preview"]).status, 0);
  const [build, preview] = await checkout.commands();
  assert.deepEqual(build.arguments, ["--filter", "@egohygiene/egohygiene.io", "build", "--outDir", "dist-preview"]);
  assert.equal(build.preview, "true");
  assert.deepEqual(preview.arguments, [
    "--filter", "@egohygiene/egohygiene.io", "preview", "--outDir", "dist-preview",
    "--host", "127.0.0.1", "--port", "4173", "--strictPort", "--open", "/store",
  ]);
});

test("live editing supports an explicit alternate port and headless browser setting", async (context) => {
  const checkout = await createCheckout(context);
  const result = checkout.run(["dev"], { STORE_OPEN_BROWSER: "false", STORE_DEV_PORT: "5174" });
  assert.equal(result.status, 0, result.stderr);
  const [command] = await checkout.commands();
  assert.deepEqual(command.arguments, [
    "--filter", "@egohygiene/egohygiene.io", "dev",
    "--host", "127.0.0.1", "--port", "5174", "--strictPort",
  ]);
  assert.equal(command.preview, "true");
});

test("malformed port or browser settings never start a server", async (context) => {
  const checkout = await createCheckout(context);
  for (const environment of [
    { STORE_PREVIEW_PORT: "0" }, { STORE_PREVIEW_PORT: "65536" },
    { STORE_PREVIEW_PORT: "4173 --host 0.0.0.0" }, { STORE_OPEN_BROWSER: "sometimes" },
  ]) {
    assert.equal(checkout.run(["preview"], environment).status, 1);
  }
  assert.deepEqual(await checkout.commands(), []);
});

test("run forwards pnpm arguments unchanged without enabling preview mode", async (context) => {
  const checkout = await createCheckout(context);
  assert.equal(checkout.run(["run", "catalog:validate", "a path with spaces"]).status, 0);
  const [command] = await checkout.commands();
  assert.deepEqual(command.arguments, ["catalog:validate", "a path with spaces"]);
  assert.notEqual(command.preview, "true");
});
