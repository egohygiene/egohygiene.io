import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { loadCatalog, runCatalogCommand } from "../../scripts/store-catalog.mts";

const cliPath = fileURLToPath(new URL("../../scripts/store-catalog.mts", import.meta.url));

function fixture(t: TestContext, artwork: unknown = { kind: "image", src: "/store/test.webp", alt: "Test artwork" }) {
  const root = mkdtempSync(join(tmpdir(), "store-artwork-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, "entries");
  const publicDirectory = join(root, "public");
  mkdirSync(directory);
  mkdirSync(join(publicDirectory, "store"), { recursive: true });
  writeFileSync(join(directory, "design.json"), JSON.stringify({
    schemaVersion: 3,
    sourceLocale: "en",
    kind: "design",
    id: "design-test",
    slug: "test-design",
    title: "Test Design",
    description: "Temporary test fixture",
    visibility: "draft",
    artworkRevision: 1,
    artwork,
    contextIds: [],
  }));
  return { root, directory, publicDirectory, image: join(publicDirectory, "store", "test.webp") };
}

test("Node load and CLI verify an existing regular artwork file without decoding it", async (t) => {
  const { directory, publicDirectory, image } = fixture(t);
  writeFileSync(image, "");
  assert.equal((await loadCatalog(directory, [], publicDirectory)).entries.length, 1);
  const result = await runCatalogCommand(["validate", "--directory", directory, "--public-directory", publicDirectory]);
  assert.match(result, /Image files verified: 1/);
});

test("missing artwork names the source field, exits nonzero, and blocks add-design before writing", async (t) => {
  const { directory, publicDirectory } = fixture(t);
  await assert.rejects(loadCatalog(directory, [], publicDirectory), /design.json:artwork.src: Cannot resolve artwork file \/store\/test.webp/);
  const result = spawnSync(process.execPath, [cliPath, "validate", "--directory", directory, "--public-directory", publicDirectory], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /design.json:artwork.src/);
  await assert.rejects(runCatalogCommand([
    "add-design", "--directory", directory, "--public-directory", publicDirectory,
    "--slug", "second-design", "--title", "Second Design",
  ]), /design.json:artwork.src/);
  assert.deepEqual(readdirSync(directory), ["design.json"]);
});

test("a directory named like an image is not accepted as artwork", async (t) => {
  const { directory, publicDirectory, image } = fixture(t);
  mkdirSync(image);
  await assert.rejects(loadCatalog(directory, [], publicDirectory), /design.json:artwork.src: Artwork must reference a regular file/);
});

test("file symlinks cannot escape into a sibling directory with the same path prefix", async (t) => {
  const { root, directory, publicDirectory, image } = fixture(t);
  const sibling = join(root, "public-other");
  mkdirSync(sibling);
  const outside = join(sibling, "test.webp");
  writeFileSync(outside, "");
  symlinkSync(outside, image, "file");
  await assert.rejects(loadCatalog(directory, [], publicDirectory), /design.json:artwork.src: Artwork file resolves outside public directory/);
});

test("symlinked parent directories cannot take artwork outside the public root", async (t) => {
  const { root, directory, publicDirectory } = fixture(t, { kind: "image", src: "/store/linked/test.webp", alt: "Test artwork" });
  const outside = join(root, "outside");
  mkdirSync(outside);
  writeFileSync(join(outside, "test.webp"), "");
  symlinkSync(outside, join(publicDirectory, "store", "linked"), "dir");
  await assert.rejects(loadCatalog(directory, [], publicDirectory), /resolves outside public directory/);
});

test("an internal symlink is accepted when its target is a regular file within the public root", async (t) => {
  const { directory, publicDirectory, image } = fixture(t);
  const target = join(publicDirectory, "store", "original.webp");
  writeFileSync(target, "");
  symlinkSync(target, image, "file");
  assert.equal((await loadCatalog(directory, [], publicDirectory)).entries.length, 1);
});

test("path traversal remains a schema error before filesystem checks", async (t) => {
  const { directory, publicDirectory } = fixture(t, { kind: "image", src: "/store/../outside.webp", alt: "Test artwork" });
  await assert.rejects(loadCatalog(directory, [], publicDirectory), /design.json:artwork.src: Use an approved local/);
});

test("custom catalogs remain schema-only without an explicit public directory and say so", async (t) => {
  const { directory } = fixture(t);
  assert.equal((await loadCatalog(directory, [])).entries.length, 1);
  assert.match(await runCatalogCommand(["validate", "--directory", directory]), /Schema only; artwork files were not checked/);
  const created = await runCatalogCommand([
    "add-design", "--directory", directory, "--slug", "second-design", "--title", "Second Design",
  ]);
  assert.match(created, /Schema only; artwork files were not checked/);
  assert.deepEqual(readdirSync(directory).sort(), ["design.json", "second-design.design.json"]);
});

test("placeholders need no public directory or image file", async (t) => {
  const { root, directory } = fixture(t, { kind: "placeholder", label: "Artwork pending" });
  assert.equal((await loadCatalog(directory, [], join(root, "missing-public"))).entries.length, 1);
});

test("the default catalog enables image-file checks without an extra CLI flag", async () => {
  const result = await runCatalogCommand(["validate"]);
  assert.match(result, /Image files verified: \d+/);
  assert.doesNotMatch(result, /Schema only/);
});
