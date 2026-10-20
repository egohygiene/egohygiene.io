import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { storeEntryPath } from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import { migrateStoreCatalogV1 } from "../../packages/schemas/src/store-migrations.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  storeCatalogV1Schema,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";

const cliPath = fileURLToPath(new URL("../../scripts/store-catalog.mts", import.meta.url));
const cli = (...args: string[]) =>
  spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });

// Explicit historical v1 fixture. This is synthetic data, not a legacy production claim.
const base = (id: string) => ({
  schemaVersion: 1,
  id,
  slug: id,
  title: `Synthetic ${id}`,
  description: "Synthetic legacy source copy",
  visibility: "public",
});
function legacyFixture() {
  const design = {
    ...base("design-fixture"),
    kind: "design",
    contextIds: [],
    artworkRevision: 3,
    artwork: { kind: "image", src: "/store/synthetic.webp", alt: "Synthetic source artwork" },
  };
  const product = {
    ...base("product-fixture"),
    kind: "product",
    designIds: [design.id],
    contextIds: [],
    purchase: {
      state: "live",
      provider: "fourthwall",
      routeId: "route-fixture",
      variants: [{ id: "variant-small", label: "Small", providerVariantId: "provider-small" }],
      displayPrice: { amountMinor: 2500, currency: "USD", authority: "provider-checkout" },
    },
  };
  const collection = {
    ...base("collection-fixture"),
    kind: "collection",
    designIds: [design.id],
    productIds: [product.id],
    contextIds: [],
  };
  const route = {
    id: "route-fixture",
    provider: "fourthwall",
    productId: product.id,
    checkoutUrl: "https://synthetic-fixture.fourthwall.com/products/synthetic-item",
    providerVariantIds: ["provider-small"],
    artworkRevisions: [{ designId: design.id, revision: 3 }],
  };
  return { schemaVersion: 1, entries: [design, product, collection], checkoutRoutes: [route] };
}

test("explicit v1 migration is deterministic, does not mutate input and preserves canonical content and purchase identity", () => {
  const legacy = legacyFixture();
  const before = structuredClone(legacy);
  const migrated = migrateStoreCatalogV1(legacy, { sourceLocale: "en" });
  assert.deepEqual(migrated, migrateStoreCatalogV1(legacy, { sourceLocale: "en" }));
  assert.deepEqual(legacy, before);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.checkoutRoutes, legacy.checkoutRoutes);
  assert.deepEqual(
    migrated.entries.map((entry) => entry.id),
    legacy.entries.map((entry) => entry.id),
  );
  for (const [index, entry] of migrated.entries.entries()) {
    const { sourceLocale, translations, attribution, schemaVersion, ...unchanged } = entry;
    assert.equal(sourceLocale, "en");
    assert.equal(schemaVersion, 2);
    assert.deepEqual(translations, []);
    assert.deepEqual(attribution, { status: "unknown" });
    assert.deepEqual({ ...unchanged, schemaVersion: 1 }, legacy.entries[index]);
    if (entry.kind !== "context") assert.ok(storeEntryPath(entry).endsWith(`/${entry.slug}`));
  }
  assert.deepEqual(getStorePurchaseAction(toPublicStoreCatalog(migrated), "product-fixture"), {
    kind: "external",
    label: "Shop on Fourthwall",
    href: legacy.checkoutRoutes[0]?.checkoutUrl,
  });
  assert.deepEqual(
    parseStoreCatalog(
      migrated.entries.map((value) => ({ source: value.id, value })),
      migrated.checkoutRoutes,
    ),
    migrated,
  );
});

test("migration requires an explicit canonical source locale without inventing translations or rights", () => {
  const legacy = legacyFixture();
  const alternate = migrateStoreCatalogV1(legacy, { sourceLocale: "fr" });
  assert.ok(
    alternate.entries.every(
      (entry) => entry.sourceLocale === "fr" && entry.translations.length === 0,
    ),
  );
  for (const sourceLocale of ["", "en-us", "not_a_locale"]) {
    assert.throws(() => migrateStoreCatalogV1(legacy, { sourceLocale }), /locale|Locale/);
  }
  assert.throws(
    () => migrateStoreCatalogV1(legacy, {} as { sourceLocale: string }),
    /locale|Locale/,
  );
  assert.throws(
    () => migrateStoreCatalogV1(legacy, undefined as unknown as { sourceLocale: string }),
    /migration:sourceLocale/,
  );
});

test("only the documented v1 input shape can enter the migration chain", () => {
  const legacy = legacyFixture();
  for (const schemaVersion of [0, 2, 99]) {
    assert.throws(
      () => migrateStoreCatalogV1({ ...legacy, schemaVersion }, { sourceLocale: "en" }),
      /schemaVersion/,
    );
  }
  assert.throws(
    () => migrateStoreCatalogV1({ ...legacy, privateSupplierCost: 20 }, { sourceLocale: "en" }),
    /privateSupplierCost/,
  );
  assert.throws(
    () =>
      migrateStoreCatalogV1(
        {
          ...legacy,
          entries: legacy.entries.map((entry, index) =>
            index === 0 ? { ...entry, schemaVersion: 99 } : entry,
          ),
        },
        { sourceLocale: "en" },
      ),
    /schemaVersion/,
  );
  assert.throws(
    () =>
      migrateStoreCatalogV1(
        {
          ...legacy,
          entries: [{ ...base("brand-fixture"), kind: "context", contextType: "brand" }],
          checkoutRoutes: [],
        },
        { sourceLocale: "en" },
      ),
    /contextType/,
  );
});

test("migration cannot launder invalid references, draft visibility or unreviewed checkout mappings", () => {
  const legacy = legacyFixture();
  const product = legacy.entries[1];
  assert.ok(product && "purchase" in product);
  const mutations = [
    { ...legacy, entries: legacy.entries.filter((entry) => entry.id !== "design-fixture") },
    {
      ...legacy,
      entries: legacy.entries.map((entry, index) =>
        index === 0 ? { ...entry, visibility: "draft" } : entry,
      ),
    },
    { ...legacy, checkoutRoutes: [] },
    {
      ...legacy,
      entries: legacy.entries.map((entry, index) =>
        index === 1
          ? {
              ...product,
              purchase: {
                ...product.purchase,
                variants: [
                  { id: "variant-small", label: "Small", providerVariantId: "provider-unreviewed" },
                ],
              },
            }
          : entry,
      ),
    },
  ];
  for (const invalid of mutations) {
    assert.throws(
      () => migrateStoreCatalogV1(invalid, { sourceLocale: "en" }),
      /reference|draft|reviewed|Variant/,
    );
  }
});

test("v2 parsing and public projection do not silently accept unmigrated v1 data", () => {
  const legacy = legacyFixture();
  assert.throws(
    () =>
      parseStoreCatalog(
        legacy.entries.map((value) => ({ source: value.id, value })),
        legacy.checkoutRoutes,
      ),
    /schemaVersion|sourceLocale/,
  );
  const current = migrateStoreCatalogV1(legacy, { sourceLocale: "en" });
  assert.throws(
    () => toPublicStoreCatalog({ ...current, schemaVersion: 1 } as unknown as typeof current),
    /schemaVersion/,
  );
});

test("rollback restores the retained v1 source rather than silently discarding v2 authoring information", () => {
  const legacy = legacyFixture();
  const retainedSource = JSON.stringify(legacy);
  const current = migrateStoreCatalogV1(legacy, { sourceLocale: "en" });
  assert.throws(
    () => storeCatalogV1Schema.parse(current),
    /1|sourceLocale|translations|attribution/,
  );
  assert.deepEqual(storeCatalogV1Schema.parse(JSON.parse(retainedSource)), legacy);
  assert.equal(JSON.stringify(legacy), retainedSource);
});

test("migration CLI writes a reviewable v2 envelope while retaining the exact legacy input and refusing overwrite", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "store-migration-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const input = join(directory, "legacy.json");
  const output = join(directory, "current.json");
  const legacy = legacyFixture();
  const original = `${JSON.stringify(legacy, null, 2)}\n`;
  writeFileSync(input, original);
  const args = ["migrate", "--input", input, "--output", output, "--source-locale", "en"];
  const result = cli(...args);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Migrated 3 entries to catalog v2/);
  assert.equal(readFileSync(input, "utf8"), original);
  const created = readFileSync(output, "utf8");
  assert.deepEqual(JSON.parse(created), migrateStoreCatalogV1(legacy, { sourceLocale: "en" }));
  const repeated = cli(...args);
  assert.equal(repeated.status, 1);
  assert.match(repeated.stderr, /EEXIST|exist/);
  assert.equal(readFileSync(output, "utf8"), created);
  assert.equal(readFileSync(input, "utf8"), original);
  const samePath = cli("migrate", "--input", input, "--output", input, "--source-locale", "en");
  assert.equal(samePath.status, 1);
  assert.equal(readFileSync(input, "utf8"), original);
});

test("migration CLI rejects invalid input and missing source language without creating an output", (context) => {
  const directory = mkdtempSync(join(tmpdir(), "store-migration-invalid-"));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const input = join(directory, "legacy.json");
  const output = join(directory, "current.json");
  const original = JSON.stringify(legacyFixture());
  writeFileSync(input, original);
  const missingLocale = cli("migrate", "--input", input, "--output", output);
  assert.equal(missingLocale.status, 1);
  assert.match(missingLocale.stderr, /--source-locale/);
  assert.equal(existsSync(output), false);
  assert.equal(readFileSync(input, "utf8"), original);
  for (const invalid of [
    "{invalid-json",
    JSON.stringify({ ...legacyFixture(), schemaVersion: 99 }),
  ]) {
    writeFileSync(input, invalid);
    const result = cli("migrate", "--input", input, "--output", output, "--source-locale", "en");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /invalid JSON|schemaVersion/);
    assert.equal(existsSync(output), false);
    assert.equal(readFileSync(input, "utf8"), invalid);
  }
});
