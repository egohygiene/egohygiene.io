import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loadRepositoryDirectory } from "../../scripts/intelligence-directory.mts";
import { loadOrganizationIntelligence } from "../../scripts/vite-organization-intelligence.mts";

const capsule = fileURLToPath(
  new URL("../../contracts/organization-intelligence/directory/", import.meta.url),
);
const digest = (raw) => createHash("sha256").update(raw).digest("hex");
async function changed(change) {
  const parent = await mkdtemp(join(tmpdir(), "intelligence-directory-"));
  const root = join(parent, "capsule");
  await cp(capsule, root, { recursive: true });
  try {
    await change(root);
    const value = await loadRepositoryDirectory({ root });
    assert.deepEqual(value, {
      state: "unavailable",
      source: null,
      catalog: null,
      sourceInventory: null,
      entries: [],
    });
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
}
async function resealPayload(root, mutate) {
  const path = "docs/intelligence/repository-directory.json";
  const file = join(root, "owner", path);
  const payload = JSON.parse(await readFile(file, "utf8"));
  mutate(payload);
  const bytes = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(file, bytes);
  const lockPath = join(root, "input-lock.json");
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  lock.files[path] = digest(bytes);
  await writeFile(lockPath, `${JSON.stringify(lock)}\n`);
}

test("admits the exact reviewed directory with dated, declared and unknown states", async () => {
  const directory = await loadRepositoryDirectory();
  assert.equal(directory.state, "admitted");
  assert.equal(directory.source.revision, "834d7fd51c48860b2cc4f1a6a262ce466f2004db");
  assert.equal(
    directory.source.sha256,
    "d29435982560531d31e7698c31fb40e55cfc0849615f4d094be6cb4342ee04fd",
  );
  assert.equal(directory.entries.length, 28);
  assert.equal(
    directory.entries.filter((row) => row.dashboard.link_state === "publication-recorded").length,
    2,
  );
  assert.equal(
    directory.entries.filter((row) => row.dashboard.link_state === "source-declared").length,
    3,
  );
  assert.equal(
    directory.entries.filter((row) => row.dashboard.link_state === "unknown").length,
    23,
  );
  assert.equal(
    directory.entries.find((row) => row.repository === "egohygiene/empathy").dashboard.publication
      .observed_at,
    "2026-11-14T06:35:35.745Z",
  );
});

test("a Core-null build keeps navigation separate and honors a narrower admitted scope", async () => {
  const source = await loadOrganizationIntelligence({
    filename: "",
    auditsFilename: "",
    sanityFilename: "",
    allowedRepositories: new Set(["egohygiene/empathy"]),
  });
  assert.equal(source.presentation.state, "unavailable");
  assert.equal(source.presentation.snapshotId, null);
  assert.deepEqual(source.presentation.repositories, []);
  assert.deepEqual(
    source.presentation.directory.entries.map((row) => row.repository),
    ["egohygiene/empathy"],
  );
  assert.ok(!source.moduleCode.includes('"repository":"egohygiene/akashic"'));
});

test("rejected navigation is isolated from the Core/module skeleton", async () => {
  const source = await loadOrganizationIntelligence({
    filename: "",
    auditsFilename: "",
    sanityFilename: "",
    directoryRoot: join(tmpdir(), "absent-directory-capsule"),
  });
  assert.equal(source.presentation.directory.state, "unavailable");
  assert.deepEqual(source.presentation.directory.entries, []);
  assert.equal(source.presentation.code, "NOT_CONFIGURED");
  assert.ok(source.presentation.modules.length > 0);
});

test("a locally resealed plausible publication URL cannot replace accepted source evidence", async () => {
  await changed((root) =>
    resealPayload(root, (payload) => {
      payload.entries.find((row) => row.repository === "egohygiene/empathy").dashboard.url =
        "https://egohygiene.github.io/holon/intelligence/";
    }),
  );
});
test("a locally resealed date cannot refresh a retained publication record", async () => {
  await changed((root) =>
    resealPayload(root, (payload) => {
      payload.entries[0].dashboard.publication.observed_at = "2026-11-14T19:00:00Z";
    }),
  );
});
test("nonpublic identities cannot be introduced even by resealing the projection", async () => {
  await changed((root) =>
    resealPayload(root, (payload) => {
      payload.entries[0].repository = "egohygiene/private-do-not-publish";
      payload.entries[0].repository_url = "https://github.com/egohygiene/private-do-not-publish";
    }),
  );
});
test("altered original source bytes remain rejected", async () => {
  await changed(async (root) => {
    const path = "docs/intelligence/repositories.source.json";
    const raw = `${await readFile(join(root, "owner", path), "utf8")} `;
    await writeFile(join(root, "owner", path), raw);
    const lockPath = join(root, "input-lock.json");
    const lock = JSON.parse(await readFile(lockPath, "utf8"));
    lock.files[path] = digest(raw);
    await writeFile(lockPath, JSON.stringify(lock));
  });
});
test("symlinked and duplicate-key capsule inputs are rejected without exposing metadata", async () => {
  await changed(async (root) => {
    const file = join(root, "owner/docs/intelligence/repository-directory.schema.json");
    await rm(file);
    await symlink(join(capsule, "owner/docs/intelligence/repository-directory.schema.json"), file);
  });
  await changed(async (root) => {
    const lockPath = join(root, "input-lock.json");
    const raw = await readFile(lockPath, "utf8");
    await writeFile(lockPath, raw.replace("{", '{"owner":"egohygiene/.github",'));
  });
});
