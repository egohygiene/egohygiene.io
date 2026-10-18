import assert from "node:assert/strict";
import { mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  getEntryDesigns,
  type StoreCollection,
} from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import {
  parseStoreCatalog,
  type StoreCatalog,
  type StoreDesign,
  type StoreProduct,
} from "../../packages/schemas/src/store.ts";
import { loadCatalog } from "../../scripts/store-catalog.mts";

const base = (id: string, visibility = "public") => ({
  schemaVersion: 1,
  id,
  slug: id,
  title: id,
  description: "Fictional artwork-order fixture",
  visibility,
});
const design = (id: string, visibility = "public") => ({
  ...base(id, visibility),
  kind: "design",
  artworkRevision: 1,
  artwork: { kind: "placeholder", label: id },
});
const product = (id: string, designIds: string[], visibility = "public") => ({
  ...base(id, visibility),
  kind: "product",
  designIds,
  purchase: { state: "preview" },
});
const collection = (designIds: string[], productIds: string[]) => ({
  ...base("collection-order"),
  kind: "collection",
  designIds,
  productIds,
});
const values = [
  design("design-alpha"),
  product("product-first", ["design-charlie", "design-bravo"]),
  design("design-bravo"),
  collection(["design-bravo"], ["product-second", "product-first"]),
  product("product-second", ["design-delta", "design-bravo"]),
  design("design-charlie"),
  design("design-delta"),
];
const parse = (entries: unknown[]) =>
  parseStoreCatalog(entries.map((value, index) => ({ source: `entry-${index}.json`, value })));

function findProduct(catalog: StoreCatalog, id = "product-first"): StoreProduct {
  const entry = catalog.entries.find((candidate) => candidate.id === id);
  assert.ok(entry?.kind === "product");
  return entry;
}

function findCollection(catalog: StoreCatalog): StoreCollection {
  const entry = catalog.entries.find((candidate) => candidate.kind === "collection");
  assert.ok(entry?.kind === "collection");
  return entry;
}

const ids = (designs: StoreDesign[]) => designs.map((entry) => entry.id);

test("product artwork follows declared design order despite reversed or interleaved catalog input", () => {
  for (const input of [
    values,
    [...values].reverse(),
    [...values.slice(3), ...values.slice(0, 3)],
  ]) {
    const catalog = parse(input);
    const entry = findProduct(catalog);
    const before = JSON.stringify(catalog);
    const designs = getEntryDesigns(catalog, entry);
    assert.deepEqual(ids(designs), ["design-charlie", "design-bravo"]);
    for (const artwork of designs) {
      assert.equal(
        artwork,
        catalog.entries.find((candidate) => candidate.id === artwork.id),
      );
    }
    assert.equal(JSON.stringify(catalog), before);
    assert.deepEqual(
      ids(getEntryDesigns(catalog, { ...entry, designIds: [...entry.designIds].reverse() })),
      ["design-bravo", "design-charlie"],
    );
  }
});

test("collections lead with explicit designs then append product artwork in declared traversal order", () => {
  for (const input of [values, [...values].reverse()]) {
    const catalog = parse(input);
    const entry = findCollection(catalog);
    const before = JSON.stringify(catalog);
    const designs = getEntryDesigns(catalog, entry);
    assert.deepEqual(ids(designs), ["design-bravo", "design-delta", "design-charlie"]);
    assert.equal(JSON.stringify(catalog), before);
    for (const artwork of designs) {
      assert.equal(
        artwork,
        catalog.entries.find((candidate) => candidate.id === artwork.id),
      );
    }
    assert.deepEqual(ids(getEntryDesigns(catalog, { ...entry, designIds: [] })), [
      "design-delta",
      "design-bravo",
      "design-charlie",
    ]);
    assert.deepEqual(
      ids(getEntryDesigns(catalog, { ...entry, designIds: ["design-charlie", "design-alpha"] })),
      ["design-charlie", "design-alpha", "design-delta", "design-bravo"],
    );
    assert.deepEqual(
      ids(
        getEntryDesigns(catalog, {
          ...entry,
          designIds: [],
          productIds: [...entry.productIds].reverse(),
        }),
      ),
      ["design-charlie", "design-bravo", "design-delta"],
    );
  }
});

test("design passthrough, a single design, and empty collections retain their behavior", () => {
  const catalog = parse([
    design("design-only"),
    design("design-draft", "draft"),
    product("product-first", ["design-only"]),
    collection([], []),
  ]);
  for (const entry of catalog.entries) {
    if (entry.kind === "design") assert.deepEqual(getEntryDesigns(catalog, entry), [entry]);
  }
  assert.deepEqual(ids(getEntryDesigns(catalog, findProduct(catalog))), ["design-only"]);
  assert.deepEqual(getEntryDesigns(catalog, findCollection(catalog)), []);
});

test("defensive selection skips unresolved, wrong-kind and hidden designs without moving valid artwork", () => {
  const catalog = parse([
    ...values,
    design("design-hidden", "draft"),
    product("product-draft", ["design-alpha", "design-hidden"], "draft"),
  ]);
  const entry = findProduct(catalog);
  const unvalidatedProduct = {
    ...entry,
    designIds: [
      "design-missing",
      "product-second",
      "design-hidden",
      "design-charlie",
      "design-charlie",
      "design-bravo",
    ],
  };
  assert.deepEqual(ids(getEntryDesigns(catalog, unvalidatedProduct)), [
    "design-charlie",
    "design-bravo",
  ]);
  const unvalidatedCollection = {
    ...findCollection(catalog),
    designIds: ["design-hidden", "design-bravo"],
    productIds: ["product-missing", "design-alpha", "product-draft", "product-second"],
  };
  // Existing fallback resolves referenced products even on non-public authoring input;
  // only public designs are returned. The public validation boundary forbids these references.
  assert.deepEqual(ids(getEntryDesigns(catalog, unvalidatedCollection)), [
    "design-bravo",
    "design-alpha",
    "design-delta",
  ]);
  assert.throws(
    () =>
      parse([design("design-only"), product("product-duplicate", ["design-only", "design-only"])]),
    /Duplicate reference/,
  );
  assert.throws(
    () => parse([design("design-hidden", "draft"), product("product-hidden", ["design-hidden"])]),
    /Public entries cannot reference draft/,
  );
  assert.throws(
    () => parse([product("product-missing", ["design-missing"])]),
    /Expected design reference/,
  );
});

test("renaming discovered catalog files changes source order without changing declared covers or galleries", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "store-design-order-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [index, value] of values.entries()) {
    await writeFile(join(directory, `${index}.json`), `${JSON.stringify(value)}\n`);
  }
  const before = await loadCatalog(directory, [], undefined, null);
  for (const index of values.keys()) {
    await rename(
      join(directory, `${index}.json`),
      join(directory, `renamed-${values.length - index}.json`),
    );
  }
  const after = await loadCatalog(directory, [], undefined, null);
  assert.notDeepEqual(
    before.entries.map((entry) => entry.id),
    after.entries.map((entry) => entry.id),
  );
  for (const catalog of [before, after]) {
    assert.deepEqual(ids(getEntryDesigns(catalog, findProduct(catalog))), [
      "design-charlie",
      "design-bravo",
    ]);
    assert.deepEqual(ids(getEntryDesigns(catalog, findCollection(catalog))), [
      "design-bravo",
      "design-delta",
      "design-charlie",
    ]);
  }
});
