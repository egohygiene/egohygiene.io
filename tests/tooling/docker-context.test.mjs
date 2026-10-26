import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  inspectDockerContext,
  prepareDockerContextProbe,
  verifyDockerContextProbe,
} from "../../scripts/docker-context.mjs";

const repository = fileURLToPath(new URL("../../", import.meta.url));

async function fixture(t, actualSource = false) {
  const temporary = await mkdtemp(path.join(tmpdir(), "docker-context-verifier-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const source = path.join(temporary, "source");
  const exported = path.join(temporary, "export");
  const probe = await prepareDockerContextProbe(repository, source);
  await mkdir(exported);
  // This models an already-produced export for verifier tests. Only the supported
  // Docker profile exercises Docker's real ignore engine; no matcher is faked here.
  for (const file of Object.keys(probe.expected)) {
    const from = path.join(actualSource ? repository : source, file);
    let content;
    try {
      content = await readFile(from);
    } catch (error) {
      if (actualSource && error.code === "ENOENT") continue;
      throw error;
    }
    await mkdir(path.dirname(path.join(exported, file)), { recursive: true });
    await writeFile(path.join(exported, file), content);
  }
  return { source, exported, probe };
}

test("context probe verifier binds exported files to expected harmless bytes", async (t) => {
  const { source, exported, probe } = await fixture(t);
  assert.ok(probe.excludedSamples.length > 20);
  for (const file of probe.excludedSamples)
    assert.match(await readFile(path.join(source, file), "utf8"), /Harmless excluded/);
  const result = await verifyDockerContextProbe(exported, probe);
  assert.equal(result.result, "pass");
  assert.equal(result.includedFiles, Object.keys(probe.expected).length);
  await assert.rejects(prepareDockerContextProbe(repository, repository), /outside the source/);
  await assert.rejects(prepareDockerContextProbe(repository, source), /empty directory/);
});

test("context probe verifier fails missing, changed and excluded files", async (t) => {
  for (const [name, change, expected] of [
    ["missing", (directory) => rm(path.join(directory, "package.json")), /unexpected or missing/],
    [
      "changed",
      (directory) => writeFile(path.join(directory, "package.json"), "changed"),
      /bytes changed/,
    ],
    [
      "leaked environment",
      (directory) => writeFile(path.join(directory, ".env.local"), "harmless"),
      /unexpected or missing/,
    ],
  ]) {
    await t.test(name, async (subtest) => {
      const { exported, probe } = await fixture(subtest);
      await change(exported);
      await assert.rejects(verifyDockerContextProbe(exported, probe), expected);
    });
  }
});

test("real-context inspector requires all workspace manifests and checkout byte identity", async (t) => {
  const { exported } = await fixture(t, true);
  const result = await inspectDockerContext(repository, exported);
  assert.equal(result.result, "pass");
  assert.equal(result.workspaceManifests, 14);
  assert.match(result.hashes["pnpm-lock.yaml"], /^[a-f0-9]{64}$/);
  await rm(path.join(exported, "apps/docs/package.json"));
  await assert.rejects(
    inspectDockerContext(repository, exported),
    /missing required build input: apps\/docs\/package.json/,
  );
  await copyFile(
    path.join(repository, "apps/docs/package.json"),
    path.join(exported, "apps/docs/package.json"),
  );
  await writeFile(path.join(exported, "apps/egohygiene.io/src/main.tsx"), "changed source");
  await assert.rejects(inspectDockerContext(repository, exported), /bytes changed/);
});

test("real-context inspector rejects nested secrets and unrelated source before reading bytes", async (t) => {
  for (const [file, expected] of [
    ["apps/egohygiene.io/src/.env.local", /excluded file category/],
    ["packages/ui/src/private/record.json", /excluded file category/],
    ["apps/egohygiene.io/public/credentials.p12", /excluded file category/],
    ["apps/egohygiene.io/public/unapproved.PSD", /excluded file category/],
    ["apps/egohygiene.io/src/business-records/client.json", /excluded file category/],
    ["apps/docs/src/not-required.tsx", /unrelated build input/],
    ["assets/designs/private-master.psd", /excluded file category/],
  ]) {
    await t.test(file, async (subtest) => {
      const { exported } = await fixture(subtest, true);
      const target = path.join(exported, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, "harmless excluded sentinel");
      await assert.rejects(inspectDockerContext(repository, exported), expected);
    });
  }
});

test("context inspections refuse symbolic links instead of following them", async (t) => {
  const { source, exported, probe } = await fixture(t);
  await symlink(path.join(source, "package.json"), path.join(exported, "linked-input"));
  await assert.rejects(verifyDockerContextProbe(exported, probe), /symbolic links/);
  await assert.rejects(inspectDockerContext(repository, exported), /symbolic links/);
});
