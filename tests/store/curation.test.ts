import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  getCuratedStoreEntries,
  storeEntryPath,
} from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import {
  emptyStorefrontCuration,
  parseStorefrontCuration,
} from "../../packages/schemas/src/storefront-curation.ts";
import {
  loadCatalog,
  loadStorefrontCuration,
  runCatalogCommand,
} from "../../scripts/store-catalog.mts";

const base = (id: string, visibility = "public") => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title: id,
  description: "Fictional curation test entry",
  visibility,
});
const design = (id = "design-test", visibility = "public") => ({
  ...base(id, visibility),
  kind: "design",
  artworkRevision: 1,
  artwork: { kind: "placeholder", label: "Test design" },
});
const values = [
  design(),
  {
    ...base("product-test"),
    kind: "product",
    designIds: ["design-test"],
    purchase: { state: "preview" },
  },
  { ...base("collection-test"), kind: "collection", productIds: ["product-test"] },
  { ...base("context-test"), kind: "context", contextType: "realm" },
  design("design-draft", "draft"),
];
const catalog = parseStoreCatalog(values.map((value) => ({ source: `${value.id}.json`, value })));
const curated = () => ({
  ...emptyStorefrontCuration(),
  egoHygieneEntryIds: ["product-test"],
  incomprisEntryIds: ["collection-test", "design-test", "product-test"],
  featuredIncomprisEntryIds: ["product-test", "design-test"],
});

test("curation preserves explicit mixed ordering, canonical objects, and optional overlapping placements", () => {
  const curation = parseStorefrontCuration(curated(), catalog);
  const entries = getCuratedStoreEntries(catalog, curation.featuredIncomprisEntryIds);
  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["product-test", "design-test"],
  );
  assert.equal(entries[0], getCuratedStoreEntries(catalog, curation.egoHygieneEntryIds)[0]);
  assert.ok(entries[0]);
  assert.equal(storeEntryPath(entries[0]), "/store/products/product-test");
  assert.equal(getStorePurchaseAction(catalog, "product-test").kind, "disabled");
  assert.deepEqual(getCuratedStoreEntries(catalog, ["design-test"])[0]?.contextIds, []);
});

test("empty lists and unchanged v1 catalog fixtures remain valid", () => {
  assert.deepEqual(
    parseStorefrontCuration(emptyStorefrontCuration(), catalog),
    emptyStorefrontCuration(),
  );
  assert.deepEqual(getCuratedStoreEntries(catalog, []), []);
  assert.equal(catalog.schemaVersion, 2);
  assert.equal(catalog.entries.length, values.length);
  assert.equal(toPublicStoreCatalog(catalog).entries.length, values.length - 1);
});

test("unknown curation fields and versions name the manifest and field", () => {
  assert.throws(
    () => parseStorefrontCuration({ ...curated(), schemaVersion: 2 }, catalog, "selection.json"),
    /selection.json:schemaVersion/,
  );
  assert.throws(
    () => parseStorefrontCuration({ ...curated(), supplierCost: 12 }, catalog),
    /storefront-curation.json:\$:.*supplierCost/,
  );
  assert.throws(
    () => parseStorefrontCuration({ ...curated(), egoHygieneEntryIds: ["../escape"] }, catalog),
    /egoHygieneEntryIds.0/,
  );
});

test("each curation list rejects missing, context, draft, and duplicate references", () => {
  for (const field of [
    "egoHygieneEntryIds",
    "incomprisEntryIds",
    "featuredIncomprisEntryIds",
  ] as const) {
    for (const [ids, pattern] of [
      [["design-missing"], /Expected design, product, or collection reference/],
      [["context-test"], /Expected design, product, or collection reference/],
      [["design-draft"], /cannot reference draft/],
      [["design-test", "design-test"], /Duplicate reference/],
    ] as [string[], RegExp][]) {
      assert.throws(
        () => parseStorefrontCuration({ ...curated(), [field]: ids }, catalog),
        pattern,
      );
    }
  }
});

test("featured entries must be explicit members rather than inherited collection contents", () => {
  const curation = { ...curated(), incomprisEntryIds: ["collection-test"] };
  assert.throws(
    () => parseStorefrontCuration(curation, catalog),
    /Featured entries must also appear in incomprisEntryIds/,
  );
  assert.deepEqual(
    getCuratedStoreEntries(catalog, curation.incomprisEntryIds).map((entry) => entry.id),
    ["collection-test"],
  );
});

test("the selector cannot surface drafts or contexts from an unfiltered catalog", () => {
  const entries = getCuratedStoreEntries(catalog, [
    "design-draft",
    "context-test",
    "design-missing",
    "design-test",
    "design-test",
  ]);
  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["design-test"],
  );
});

test("the approved storefront places only heartburst as artwork and leaves Ego Hygiene empty", async () => {
  const current = await loadCatalog();
  const curation = await loadStorefrontCuration(current);
  assert.deepEqual(curation, {
    schemaVersion: 1,
    egoHygieneEntryIds: [],
    incomprisEntryIds: ["design-heartburst"],
    featuredIncomprisEntryIds: ["design-heartburst"],
    artists: [{ artistId: "artist-play", standaloneEntryIds: [], songCollectionIds: [] }],
  });
  const [entry] = getCuratedStoreEntries(current, curation.featuredIncomprisEntryIds);
  assert.equal(entry?.kind, "design");
  assert.deepEqual(entry?.contextIds, []);
  assert.ok(
    !current.entries.some(
      (item) => item.kind === "product" && item.designIds.includes("design-heartburst"),
    ),
  );
});

test("custom catalogs opt into curation and invalid selections block CLI writes", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "store-curation-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "entries");
  const curationFile = join(root, "storefront-curation.json");
  await mkdir(directory);
  await writeFile(join(directory, "design.json"), JSON.stringify(design()));
  assert.equal((await loadCatalog(directory)).entries.length, 1);
  assert.match(
    await runCatalogCommand(["validate", "--directory", directory]),
    /empty \(custom catalog\)/,
  );

  await writeFile(
    curationFile,
    JSON.stringify({ ...emptyStorefrontCuration(), incomprisEntryIds: ["design-test"] }),
  );
  const args = ["--directory", directory, "--curation-file", curationFile];
  assert.match(await runCatalogCommand(["validate", ...args]), /curation: validated/);
  await writeFile(
    curationFile,
    JSON.stringify({ ...emptyStorefrontCuration(), incomprisEntryIds: ["design-missing"] }),
  );
  await assert.rejects(loadCatalog(directory, [], undefined, curationFile), /incomprisEntryIds.0/);
  await assert.rejects(runCatalogCommand(["validate", ...args]), /incomprisEntryIds.0/);
  await assert.rejects(
    runCatalogCommand(["add-design", "--slug", "new-entry", "--title", "New entry", ...args]),
    /incomprisEntryIds.0/,
  );
  assert.deepEqual(await readdir(directory), ["design.json"]);
});
