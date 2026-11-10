/** Docker-specific adapter for the existing local qualification runner. */
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";

import { EXCLUDED_MARKERS, qualifyArtifact } from "../tests/store-qualification/artifacts.mts";
import { inspectPublicArtifact } from "../tests/store-qualification/public-rendering.mjs";
import { inspectStaticResponses } from "../tests/store-qualification/static-serving.mjs";
import { sameSmokeSource, smokeSourceIdentity } from "./build-smoke.mts";
import {
  inspectDockerContext,
  prepareDockerContextProbe,
  verifyDockerContextProbe,
} from "./docker-context.mjs";

const execute = promisify(execFile);

export function localDockerEndpoint(endpoint) {
  assert.ok(
    typeof endpoint === "string" &&
      /^(?:unix:\/\/\/[^\0\r\n]+|npipe:\/\/\/\/\.\/pipe\/[^/\0\r\n]+)$/.test(endpoint),
    "Use a local Docker Desktop/Engine socket; remote Docker contexts are outside this local profile.",
  );
  return endpoint;
}

async function selectedDockerEndpoint(docker) {
  // Resolve the selected endpoint before transmitting a build context.
  let endpoint = process.env.DOCKER_HOST;
  if (!endpoint || process.env.DOCKER_CONTEXT) {
    const selected =
      process.env.DOCKER_CONTEXT || (await docker("selected-context", ["context", "show"]));
    const contexts = JSON.parse(await docker("context-endpoint", ["context", "inspect", selected]));
    endpoint = contexts[0]?.Endpoints?.docker?.Host;
  }
  return localDockerEndpoint(endpoint);
}

async function waitForHealth(base, signal) {
  for (let attempt = 0; attempt < 40; attempt++) {
    signal.throwIfAborted();
    try {
      const response = await fetch(`${base}/healthz`, {
        redirect: "manual",
        signal: AbortSignal.timeout(1_000),
      });
      if (response.status === 200 && (await response.text()) === "ok") return;
    } catch {
      /* Readiness fails below unless a later bounded probe succeeds. */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Invocation-owned Caddy did not become healthy.");
}

async function saveBuildLog(output, label, result) {
  if (label.includes("build"))
    await writeFile(
      path.join(output, `${label}.log`),
      `${result.stdout ?? ""}${result.stderr ?? ""}`,
    );
}

async function main() {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const { values } = parseArgs({ options: { "output-dir": { type: "string" } } });
  const output = path.resolve(
    root,
    values["output-dir"] ?? "test-results/store-qualification/static-server",
  );
  assert.ok(output.startsWith(`${path.join(root, "test-results/store-qualification")}${path.sep}`));
  await mkdir(output, { recursive: true });
  const invocation = randomUUID();
  const containerName = `egohygiene-static-${invocation}`;
  const temporary = await mkdtemp(path.join(tmpdir(), "egohygiene-static-"));
  const abort = new AbortController();
  const interrupt = () => abort.abort();
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", interrupt);
  const report = {
    schemaVersion: 1,
    invocation,
    startedAt: new Date().toISOString(),
    result: "fail",
    scope:
      "Local Docker context, fresh normal image and Caddy HTTP verification. Browser, hosted CI, deployment and licensing acceptance are separate.",
    node: process.version,
    commands: [],
    limits: [
      "Base image patch tags remain mutable; the resulting local image ID is recorded.",
      "Existing artifact budgets remain strict and can fail this profile after HTTP evidence is collected.",
    ],
  };
  const save = () =>
    writeFile(path.join(output, "static-server.json"), `${JSON.stringify(report, null, 2)}\n`);
  let dockerPrefix = [];
  let createAttempted = false;
  const docker = async (label, args, { cleanup = false } = {}) => {
    const entry = { label, status: "running", startedAt: new Date().toISOString() };
    report.commands.push(entry);
    process.stdout.write(`Static serving: ${label}\n`);
    await save();
    const options = {
      cwd: root,
      env: {
        ...process.env,
        DOCKER_CONTEXT: "",
        DOCKER_HOST: "",
        BUILDX_BUILDER: "",
        BUILDKIT_HOST: "",
        DOCKER_BUILDKIT: "1",
      },
      encoding: "utf8",
      timeout: label.includes("build") ? 30 * 60_000 : 60_000,
      maxBuffer: 16 * 1024 * 1024,
      ...(cleanup ? {} : { signal: abort.signal }),
    };
    try {
      const result = await execute("docker", [...dockerPrefix, ...args], options);
      entry.status = "pass";
      // Build output is local diagnostic evidence, never copied into public docs.
      await saveBuildLog(output, label, result);
      return result.stdout.trim();
    } catch (error) {
      entry.status = "fail";
      await saveBuildLog(output, label, error);
      if (error.code === "ENOENT")
        throw new Error(
          "Docker is unavailable. Start Docker Desktop on your Mac, then rerun task qualify:static.",
        );
      throw new Error(
        `${label} failed; inspect local Docker output and ${path.relative(root, output)}.`,
        { cause: error },
      );
    } finally {
      entry.finishedAt = new Date().toISOString();
      await save();
    }
  };
  try {
    report.source = await smokeSourceIdentity(root);
    dockerPrefix = ["--host", await selectedDockerEndpoint(docker)];
    const versions = JSON.parse(
      await docker("engine-version", ["version", "--format", "{{json .}}"]),
    );
    report.docker = { client: versions.Client?.Version, server: versions.Server?.Version };
    assert.ok(report.docker.server, "Start the local Docker engine before running this profile.");

    const probeRoot = path.join(temporary, "probe");
    const probe = await prepareDockerContextProbe(root, probeRoot);
    const probeOutput = path.join(temporary, "probe-export");
    await docker("probe-context-build", [
      "build",
      "--builder",
      "default",
      "--file",
      path.join(probeRoot, "infra/docker/Dockerfile"),
      "--target",
      "context",
      "--output",
      `type=local,dest=${probeOutput}`,
      probeRoot,
    ]);
    report.contextProbe = await verifyDockerContextProbe(probeOutput, probe);
    const contextOutput = path.join(temporary, "checkout-export");
    await docker("checkout-context-build", [
      "build",
      "--builder",
      "default",
      "--file",
      "infra/docker/Dockerfile",
      "--target",
      "context",
      "--output",
      `type=local,dest=${contextOutput}`,
      ".",
    ]);
    report.context = await inspectDockerContext(root, contextOutput);

    const iidfile = path.join(temporary, "image.id");
    await docker("normal-image-build", [
      "build",
      "--builder",
      "default",
      "--pull",
      "--no-cache",
      "--file",
      "infra/docker/Dockerfile",
      "--iidfile",
      iidfile,
      ".",
    ]);
    const imageId = (await readFile(iidfile, "utf8")).trim();
    assert.match(imageId, /^sha256:[a-f0-9]{64}$/);
    const [image] = JSON.parse(await docker("image-identity", ["image", "inspect", imageId]));
    report.image = {
      id: image.Id,
      architecture: image.Architecture,
      os: image.Os,
      repoDigests: image.RepoDigests,
    };
    assert.equal(image.Id, imageId);
    createAttempted = true;
    const containerId = await docker("create-owned-container", [
      "create",
      "--name",
      containerName,
      "--label",
      `io.egohygiene.qualification=${invocation}`,
      "--publish",
      "127.0.0.1::80",
      imageId,
    ]);
    assert.match(containerId, /^[a-f0-9]{64}$/);
    report.containerId = containerId;
    const artifactRoot = path.join(output, "artifact");
    await rm(artifactRoot, { recursive: true, force: true });
    await mkdir(artifactRoot);
    await docker("extract-served-artifact", ["cp", `${containerId}:/srv/.`, artifactRoot]);
    report.publicArtifact = await inspectPublicArtifact(artifactRoot);
    for (const { source, marker, label } of EXCLUDED_MARKERS)
      assert.ok(
        (await readFile(path.join(root, source), "utf8")).includes(marker),
        `Excluded-marker source is stale: ${label}`,
      );
    report.artifact = await qualifyArtifact(artifactRoot, {
      publicImageSource: path.join(
        root,
        "apps/egohygiene.io/public/store/heartburst/heartburst-light.webp",
      ),
    });
    assert.ok(
      report.artifact.findings.every(({ rule }) => rule === "size-budget"),
      "Image artifact has non-budget validation failures; HTTP checks stopped.",
    );
    await docker("start-owned-container", ["start", containerId]);
    const [container] = JSON.parse(
      await docker("bound-port", ["container", "inspect", containerId]),
    );
    assert.equal(container.Image, imageId);
    const bindings = container.NetworkSettings.Ports["80/tcp"];
    assert.equal(bindings?.length, 1);
    assert.equal(bindings[0].HostIp, "127.0.0.1");
    assert.match(bindings[0].HostPort, /^[0-9]+$/);
    const base = `http://127.0.0.1:${bindings[0].HostPort}`;
    report.caddyVersion = await docker("server-version", ["exec", containerId, "caddy", "version"]);
    await waitForHealth(base, abort.signal);
    report.http = await inspectStaticResponses(artifactRoot, report.publicArtifact, base);
    assert.ok(
      sameSmokeSource(report.source, await smokeSourceIdentity(root)),
      "Source changed during static-server qualification.",
    );
    assert.equal(
      report.artifact.result,
      "pass",
      "HTTP checks finished, but existing artifact qualification findings remain. See static-server.json; budgets were not bypassed.",
    );
    report.result = "pass";
  } catch (error) {
    report.failure = error instanceof Error ? error.message : String(error);
    process.exitCode = 1;
  } finally {
    if (createAttempted) {
      try {
        const [owned] = JSON.parse(
          await docker("cleanup-ownership", ["container", "inspect", containerName], {
            cleanup: true,
          }),
        );
        assert.equal(owned.Config.Labels["io.egohygiene.qualification"], invocation);
        await docker(
          "remove-owned-container",
          ["container", "rm", "--force", "--volumes", owned.Id],
          { cleanup: true },
        );
        report.cleanup = "pass";
      } catch {
        report.cleanup = "fail";
        report.result = "fail";
        report.cleanupFailure = `Check invocation container ${containerName}; cleanup did not complete.`;
        process.exitCode = 1;
      }
    }
    await rm(temporary, { recursive: true, force: true });
    process.off("SIGINT", interrupt);
    process.off("SIGTERM", interrupt);
    report.finishedAt = new Date().toISOString();
    await save();
    process.stdout.write(
      `Static serving: ${report.result}. Report: ${path.relative(root, path.join(output, "static-server.json"))}\n`,
    );
    if (report.failure) process.stderr.write(`${report.failure}\n`);
    if (report.cleanupFailure) process.stderr.write(`${report.cleanupFailure}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
