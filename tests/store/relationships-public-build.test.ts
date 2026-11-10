import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "vite";
import { loadPublicStoreSnapshot, publicStoreCatalog } from "../../scripts/vite-store-catalog.mts";
import { relationshipFixture } from "./fixtures/relationships.ts";

test("actual Vite admission emits only selected public references, including source maps; bad drafts/private fields stop the build", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "relationships-public-34-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "entries");
  const publicDirectory = join(root, "public");
  const routesFile = join(root, "routes.json");
  const referencesFile = join(root, "references.json");
  const { catalog, references } = relationshipFixture();
  const draftDesign = catalog.entries.find((entry) => entry.id === "design-fictional-draft");
  if (draftDesign?.kind === "design" && draftDesign.artwork.kind === "image")
    draftDesign.artwork.src = "/store/design-fictional-shared.webp";
  await mkdir(directory);
  await mkdir(join(publicDirectory, "store"), { recursive: true });
  for (const entry of catalog.entries) {
    await writeFile(join(directory, `${entry.id}.json`), JSON.stringify(entry));
    if (entry.kind === "design" && entry.artwork.kind === "image")
      await writeFile(
        join(publicDirectory, entry.artwork.src),
        "SYNTHETIC_IMAGE_BYTES_NOT_RENDERED",
      );
  }
  await writeFile(routesFile, "[]");
  await writeFile(referencesFile, JSON.stringify(references));
  await writeFile(join(root, "index.html"), '<script type="module" src="/main.ts"></script>');
  await writeFile(
    join(root, "main.ts"),
    'import { storeCatalog, storeReferences } from "virtual:store-catalog"; globalThis.fixture = { storeCatalog, storeReferences };',
  );
  const options = { directory, publicDirectory, routesFile, curationFile: null, referencesFile };
  const run = () =>
    build({
      root,
      configFile: false,
      logLevel: "silent",
      publicDir: publicDirectory,
      plugins: [publicStoreCatalog(options)],
      build: { outDir: join(root, "dist"), sourcemap: true, modulePreload: false },
    });
  await run();
  const files = await readdir(join(root, "dist/assets"));
  const text = (
    await Promise.all(files.map((file) => readFile(join(root, "dist/assets", file), "utf8")))
  ).join("\n");
  assert.match(text, /recording-fictional-one/);
  for (const marker of [
    "recording-fictional-draft",
    "design-fictional-draft",
    "work-fictional-draft",
    referencesFile,
  ])
    assert.ok(!text.includes(marker), marker);
  assert.ok(!(await readdir(join(root, "dist"))).includes("references.json"));
  const normal = await loadPublicStoreSnapshot({
    directory,
    publicDirectory,
    routesFile,
    curationFile: null,
  });
  assert.ok(!normal.moduleCode.includes("storeReferences"));
  await writeFile(
    referencesFile,
    JSON.stringify({ ...references, privateCrosswalk: "SYNTHETIC_PRIVATE_SENTINEL" }),
  );
  await assert.rejects(run(), /privateCrosswalk|Unrecognized key/);
  references.recordings[2]!.workId = "work-missing";
  await writeFile(referencesFile, JSON.stringify(references));
  await assert.rejects(run(), /Expected an existing song context/);
  await writeFile(
    join(publicDirectory, "references.json"),
    JSON.stringify({ schemaVersion: 1, recordings: [], designRecordings: [] }),
  );
  await assert.rejects(
    loadPublicStoreSnapshot({
      ...options,
      referencesFile: join(publicDirectory, "references.json"),
    }),
    /outside public assets/,
  );
  const linked = join(root, "linked-references.json");
  await symlink(referencesFile, linked);
  await assert.rejects(
    loadPublicStoreSnapshot({ ...options, referencesFile: linked }),
    /regular non-symlink/,
  );
});
