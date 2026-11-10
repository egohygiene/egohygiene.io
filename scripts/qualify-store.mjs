/** Local website qualification. Fresh builds are prerequisites, never optional. */
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import {
  createSmokeReceipt,
  smokeApps,
  smokeReceiptPath,
  smokeSourceIdentity,
} from "./build-smoke.mts";

const root = fileURLToPath(new URL("../", import.meta.url));
const { values } = parseArgs({ options: { profile: { type: "string", default: "full" } } });
if (!["full", "smoke"].includes(values.profile))
  throw new Error("Use --profile full or --profile smoke.");
const profile = values.profile;
const output = path.join(
  root,
  "test-results/store-qualification",
  profile === "smoke" ? "smoke" : "profile",
);
const environmentRunner = "scripts/store-environment.mjs";
const report = {
  profile,
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
    profile === "smoke"
      ? "Fresh website/docs/playground HTML and emitted-file smoke checks. No JavaScript execution, browser, hosted CI or deployment qualification."
      : "Local website contracts, production/isolated-preview browser behavior and synthetic layout qualification. No hosted CI, deployment, real provider or physical-device qualification.",
  status: "running",
  steps: [],
};

async function saveReport() {
  await writeFile(path.join(output, "checks.json"), `${JSON.stringify(report, null, 2)}\n`);
}

async function run(name, args, environment = {}) {
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
    env: { ...process.env, VITE_STORE_PREVIEW: "false", ...environment },
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

async function freshBuildSmoke() {
  const invocationId = randomUUID();
  report.smokeInvocationId = invocationId;
  await rm(path.join(root, smokeReceiptPath), { force: true });
  // Only these three owned generated outputs are cleared; source and unrelated outputs stay intact.
  for (const app of smokeApps) {
    await rm(path.join(root, "apps", app, "dist"), { recursive: true, force: true });
  }
  const source = await smokeSourceIdentity(root);
  await run("fresh normal website build", [environmentRunner, "run", "build"]);
  await run("fresh docs build", [
    environmentRunner,
    "run",
    "--filter",
    "@egohygiene/docs",
    "build",
  ]);
  await run("fresh playground build", [
    environmentRunner,
    "run",
    "--filter",
    "@egohygiene/playground",
    "build",
  ]);
  const receipt = await createSmokeReceipt(root, invocationId, source);
  await mkdir(path.dirname(path.join(root, smokeReceiptPath)), { recursive: true });
  await writeFile(path.join(root, smokeReceiptPath), `${JSON.stringify(receipt, null, 2)}\n`);
  await run(
    "fresh all-app build smoke",
    [environmentRunner, "run", "exec", "vitest", "run", "--config", "vitest.smoke.config.ts"],
    { STORE_SMOKE_INVOCATION_ID: invocationId },
  );
  report.smokeReceipt = smokeReceiptPath;
}

await mkdir(output, { recursive: true });
await saveReport();
try {
  if (profile === "smoke") {
    await freshBuildSmoke();
  } else {
    await run("all maintained compiler profiles", [environmentRunner, "run", "typecheck:all"]);
    await run("workspace, exports, locale and import boundaries", [
      environmentRunner,
      "run",
      "check",
    ]);
    await run("catalog and artifact contracts", [environmentRunner, "run", "catalog:test"]);
    await run("all tooling and freshness contracts", [environmentRunner, "run", "test:tooling"]);
    await run("all maintained unit tests", [environmentRunner, "run", "test:unit"]);
    await run("website semantic component checks", [environmentRunner, "run", "test:semantic"]);
    await run("maintained browser discovery", [environmentRunner, "run", "test:browser:discover"]);
    await run("standalone component build contract", [environmentRunner, "run", "test:components"]);
    await freshBuildSmoke();
    await run("raw public HTML and discovery consistency", [
      "tests/store-qualification/public-rendering.mjs",
      "--output",
      "test-results/store-qualification/profile/public-rendering.json",
    ]);
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
  }
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
