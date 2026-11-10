import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { localDockerEndpoint } from "../../scripts/static-server.mjs";

const repository = fileURLToPath(new URL("../../", import.meta.url));

// The real adapter runs in a temporary checkout with deterministic child-command
// fixtures. This proves orchestration and cleanup, never Docker/Caddy execution.
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "static-runner-57-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const modules = {
    "scripts/static-server.mjs": await readFile(
      path.join(repository, "scripts/static-server.mjs"),
      "utf8",
    ),
    "scripts/build-smoke.mts":
      'export const smokeSourceIdentity = async () => ({ commit: "fixture", digest: "unchanged" }); export const sameSmokeSource = (left, right) => JSON.stringify(left) === JSON.stringify(right);',
    "scripts/docker-context.mjs":
      'export const prepareDockerContextProbe = async () => ({}); export const verifyDockerContextProbe = async () => ({ result: "pass" }); export const inspectDockerContext = async () => ({ result: "pass" });',
    "tests/store-qualification/artifacts.mts":
      'export const EXCLUDED_MARKERS = []; export const qualifyArtifact = async () => process.env.FIXTURE_MODE === "budget" ? { result: "fail", findings: [{ rule: "size-budget" }] } : { result: "pass", findings: [] };',
    "tests/store-qualification/public-rendering.mjs":
      'export const inspectPublicArtifact = async () => ({ result: "pass", pages: [] });',
    "tests/store-qualification/static-serving.mjs":
      'export const inspectStaticResponses = async () => ({ result: "pass", requestCount: 1, fixture: true });',
  };
  for (const [name, source] of Object.entries(modules)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), source);
  }
  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  const binary = path.join(root, "bin/docker");
  await mkdir(path.dirname(binary));
  await writeFile(
    binary,
    `#!${process.execPath}
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
const args = process.argv.slice(2);
if (process.env.BUILDX_BUILDER || process.env.BUILDKIT_HOST) process.exit(97);
if (args[0] === "--host") args.splice(0, 2);
appendFileSync(process.env.FIXTURE_COMMANDS, JSON.stringify(args) + "\\n");
const image = "sha256:" + "a".repeat(64);
const container = "b".repeat(64);
const mode = process.env.FIXTURE_MODE;
const print = (value) => process.stdout.write(typeof value === "string" ? value : JSON.stringify(value));
const fail = () => process.exit(23);
if (args[0] === "version") print({ Client: { Version: "fixture-client" }, Server: { Version: "fixture-server" } });
else if (args[0] === "build") {
  if (args[args.indexOf("--builder") + 1] !== "default" || process.env.DOCKER_BUILDKIT !== "1") process.exit(96);
  if (args.includes("--iidfile")) {
    if (mode === "build-failure") fail();
    writeFileSync(args[args.indexOf("--iidfile") + 1], image);
  }
} else if (args[0] === "image" && args[1] === "inspect") print([{ Id: image, Architecture: "fixture", Os: "fixture", RepoDigests: [] }]);
else if (args[0] === "create") {
  writeFileSync(process.env.FIXTURE_STATE, args[args.indexOf("--label") + 1].split("=")[1]);
  print(container);
} else if (args[0] === "cp") { if (mode === "after-create" || mode === "foreign-label") fail(); }
else if (args[0] === "start") print(container);
else if (args[0] === "container" && args[1] === "inspect") print([{
  Id: container,
  Image: image,
  Config: { Labels: { "io.egohygiene.qualification": mode === "foreign-label" ? "another-invocation" : readFileSync(process.env.FIXTURE_STATE, "utf8") } },
  NetworkSettings: { Ports: { "80/tcp": [{ HostIp: "127.0.0.1", HostPort: process.env.FIXTURE_PORT }] } }
}]);
else if (args[0] === "container" && args[1] === "rm") print(container);
else if (args[0] === "exec") print("fixture-caddy");
else { process.stderr.write("Unexpected fixture command " + JSON.stringify(args)); process.exit(98); }
`,
  );
  await chmod(binary, 0o755);
  // The fake executable is an ESM file without an extension.
  await writeFile(path.join(root, "package.json"), '{"type":"module"}\n');
  return { root, port: server.address().port };
}

async function runFixture({ root, port }, mode, endpoint = "unix:///fixture/docker.sock") {
  const commandFile = path.join(root, "commands.jsonl");
  const child = spawn(process.execPath, ["scripts/static-server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      PATH: `${path.join(root, "bin")}${path.delimiter}${process.env.PATH}`,
      BUILDX_BUILDER: "remote-fixture",
      BUILDKIT_HOST: "tcp://remote-fixture:1234",
      DOCKER_CONTEXT: "",
      DOCKER_HOST: endpoint,
      FIXTURE_MODE: mode,
      FIXTURE_COMMANDS: commandFile,
      FIXTURE_STATE: path.join(root, "state.txt"),
      FIXTURE_PORT: String(port),
    },
    timeout: 15_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", resolve);
  });
  const report = JSON.parse(
    await readFile(
      path.join(root, "test-results/store-qualification/static-server/static-server.json"),
      "utf8",
    ),
  );
  let commands = [];
  try {
    commands = (await readFile(commandFile, "utf8"))
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return { code, report, commands, output };
}

test("local Docker endpoint validation rejects TCP, SSH and remote Windows pipes", () => {
  for (const endpoint of ["unix:///var/run/docker.sock", "npipe:////./pipe/docker_engine"])
    assert.equal(localDockerEndpoint(endpoint), endpoint);
  for (const endpoint of [
    "tcp://127.0.0.1:2375",
    "ssh://server",
    "npipe:////server/pipe/docker_engine",
    "unix://server/socket",
    "",
    undefined,
  ])
    assert.throws(() => localDockerEndpoint(endpoint), /local Docker/);
});

test("remote endpoint rejection happens before any Docker command", async (t) => {
  const result = await runFixture(await fixture(t), "", "tcp://server:2375");
  assert.equal(result.code, 1, result.output);
  assert.match(result.report.failure, /local Docker/);
  assert.deepEqual(result.commands, []);
});

test("failed image build stops before creating any container", async (t) => {
  const result = await runFixture(await fixture(t), "build-failure");
  assert.equal(result.code, 1, result.output);
  assert.equal(result.report.result, "fail");
  assert.match(result.report.failure, /normal-image-build failed/);
  assert.ok(result.commands.every((args) => args[0] !== "create" && args[0] !== "container"));
});

test("failure after creation removes only the invocation-owned container", async (t) => {
  const result = await runFixture(await fixture(t), "after-create");
  assert.equal(result.code, 1, result.output);
  assert.match(result.report.failure, /extract-served-artifact failed/);
  assert.equal(result.report.cleanup, "pass");
  const removal = result.commands.find((args) => args[0] === "container" && args[1] === "rm");
  assert.deepEqual(removal, ["container", "rm", "--force", "--volumes", "b".repeat(64)]);
  assert.ok(result.commands.every((args) => args[0] !== "start"));
});

test("cleanup refuses a container carrying another invocation's label", async (t) => {
  const result = await runFixture(await fixture(t), "foreign-label");
  assert.equal(result.code, 1, result.output);
  assert.equal(result.report.cleanup, "fail");
  assert.match(result.report.cleanupFailure, /cleanup did not complete/);
  assert.ok(result.commands.every((args) => !(args[0] === "container" && args[1] === "rm")));
});

test("budget failure retains HTTP evidence while leaving the overall profile failed", async (t) => {
  const result = await runFixture(await fixture(t), "budget");
  assert.equal(result.code, 1, result.output);
  assert.equal(result.report.http.result, "pass");
  assert.equal(result.report.artifact.result, "fail");
  assert.equal(result.report.result, "fail");
  assert.equal(result.report.cleanup, "pass");
  assert.match(result.report.failure, /budgets were not bypassed/);
});
