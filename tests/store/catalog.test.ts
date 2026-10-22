import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { getStorePurchaseAction, parseStoreCatalog, toPublicStoreCatalog } from "../../packages/schemas/src/store.ts";
import { loadCatalog, loadCatalogSources } from "../../scripts/store-catalog.mts";
import { qualifySyntheticRoute, SYNTHETIC_STORE_DISCLOSURES } from "./fixtures/readiness.ts";

const base = (id: string) => ({ schemaVersion: 3, sourceLocale: "en", id, slug: id, title: id, description: "Fictional test entry", visibility: "public" });
const design = () => ({ ...base("design-test"), kind: "design", artworkRevision: 1, artwork: { kind: "placeholder", label: "Test placeholder" }, contextIds: [] });
const product = () => ({ ...base("product-test"), kind: "product", designIds: ["design-test"], purchase: { state: "preview" } });
const parse = (...values: unknown[]) => parseStoreCatalog(values.map((value, index) => ({ source: `entry-${index}.json`, value })));
const cliPath = fileURLToPath(new URL("../../scripts/store-catalog.mts", import.meta.url));
const cli = (...args: string[]) => spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });

function liveFixture() {
  const art = { ...design(), artwork: { kind: "image", src: "/store/test.webp", alt: "Test artwork" } };
  const item = { ...product(), purchase: {
    state: "live", provider: "fourthwall", routeId: "route-test",
    variants: [{ id: "variant-small", label: "Small", providerVariantId: "provider-small" }],
    displayPrice: { amountMinor: 2500, currency: "USD", authority: "provider-checkout" },
  } };
  const route = qualifySyntheticRoute({
    id: "route-test", provider: "fourthwall", productId: "product-test",
    checkoutUrl: "https://test-fixture.fourthwall.com/products/test-item",
    providerVariantIds: ["provider-small"], artworkRevisions: [{ designId: "design-test", revision: 1 }],
  }, item, [art]);
  const catalog = () => parseStoreCatalog([{ source: "art.json", value: art }, { source: "item.json", value: item }], [route]);
  return { art, item, route, catalog };
}

test("a standalone design can be reused by multiple products without song membership", () => {
  const catalog = parse(design(), product(), { ...product(), ...base("product-second") });
  assert.equal(catalog.entries.length, 3);
  assert.deepEqual(getStorePurchaseAction(catalog, "product-test"), { kind: "disabled", label: "Preview — coming later" });
});

test("unknown fields, versions, duplicate identities, and invalid references name their source and field", () => {
  const cases: [unknown[], RegExp][] = [
    [[{ ...design(), schemaVersion: 99 }], /entry-0.json:schemaVersion/],
    [[{ ...design(), supplierCost: 12 }], /entry-0.json:\$:.*supplierCost/],
    [[design(), { ...design(), slug: "different-slug" }], /entry-1.json:id: Duplicate/],
    [[design(), { ...design(), id: "design-second" }], /entry-1.json:slug: Duplicate/],
    [[product()], /entry-0.json:designIds.0: Expected design/],
    [[design(), { ...product(), designIds: ["product-test"] }], /entry-1.json:designIds.0: Expected design/],
    [[{ ...design(), contextIds: ["design-test"] }], /entry-0.json:contextIds.0: Expected context/],
    [[design(), { ...product(), designIds: ["design-test", "design-test"] }], /Duplicate reference/],
  ];
  for (const [values, error] of cases) assert.throws(() => parse(...values), error);
});

test("public projection excludes drafts and public references cannot expose them", () => {
  const draft = { ...design(), visibility: "draft" };
  assert.equal(toPublicStoreCatalog(parse(draft)).entries.length, 0);
  assert.equal(getStorePurchaseAction(parse(draft), draft.id).kind, "disabled");
  assert.throws(() => parse(draft, product()), /Public entries cannot reference draft/);
  assert.throws(() => parse(draft, { ...base("collection-test"), kind: "collection", designIds: [draft.id] }), /Public entries cannot reference draft/);
});

test("preview and unavailable states cannot carry checkout configuration or prices", () => {
  for (const state of ["preview", "unavailable"]) {
    const purchase = state === "preview" ? { state } : { state, reason: "Not ready" };
    const catalog = parse(design(), { ...product(), purchase });
    assert.equal(getStorePurchaseAction(catalog, "product-test").kind, "disabled");
    for (const extra of [{ checkoutUrl: "https://example.com" }, { routeId: "route-test" }, { displayPrice: { amountMinor: 1 } }]) {
      assert.throws(() => parse(design(), { ...product(), purchase: { ...purchase, ...extra } }), /purchase/);
    }
  }
});

test("live action requires an approved route, exact product, variants, and artwork revision", () => {
  const fixture = liveFixture();
  assert.deepEqual(getStorePurchaseAction(fixture.catalog(), "product-test"), {
    kind: "external", label: "Shop on Fourthwall", href: fixture.route.checkoutUrl,
    disclosures: SYNTHETIC_STORE_DISCLOSURES,
  });
  assert.throws(() => parse(fixture.art, fixture.item), /require a reviewed route/);
  fixture.item.purchase.variants[0]!.providerVariantId = "unreviewed-variant";
  assert.throws(fixture.catalog, /Variant is not on the reviewed route/);
  fixture.item.purchase.variants[0]!.providerVariantId = "provider-small";
  fixture.art.artworkRevision = 2;
  assert.throws(fixture.catalog, /reviewed revision/);
  fixture.art.artworkRevision = 1;
  fixture.route.productId = "product-missing";
  assert.throws(fixture.catalog, /Unknown product/);
});

test("placeholder artwork and duplicate mappings block live purchases", () => {
  const fixture = liveFixture();
  assert.throws(() => parseStoreCatalog([
    { source: "art.json", value: design() }, { source: "item.json", value: fixture.item },
  ], [fixture.route]), /require image artwork/);
  fixture.item.purchase.variants.push({ ...fixture.item.purchase.variants[0]! });
  assert.throws(fixture.catalog, /Duplicate variant mapping/);
});

test("unsafe destinations and noninteger prices cannot become checkout actions", () => {
  const fixture = liveFixture();
  const valid = fixture.route.checkoutUrl;
  for (const url of [
    "http://test-fixture.fourthwall.com/products/test-item",
    "https://test-fixture.fourthwall.com.evil.example/products/test-item",
    "https://user:pass@test-fixture.fourthwall.com/products/test-item",
    `${valid}?redirect=https://example.com`, `${valid}#buy`, "javascript:alert(1)",
  ]) {
    fixture.route.checkoutUrl = url;
    assert.throws(fixture.catalog, /checkout-routes:0.checkoutUrl/);
  }
  fixture.route.checkoutUrl = valid;
  fixture.item.purchase.displayPrice.amountMinor = 25.5;
  assert.throws(fixture.catalog, /amountMinor/);
});

test("public projection removes routes belonging only to drafts", () => {
  const fixture = liveFixture();
  fixture.art.visibility = "draft";
  fixture.item.visibility = "draft";
  assert.deepEqual(toPublicStoreCatalog(fixture.catalog()), { schemaVersion: 3, entries: [], checkoutRoutes: [] });
});

test("the shipped catalog is discoverable and every mock product is unpurchasable", async () => {
  const catalog = await loadCatalog();
  assert.ok(catalog.entries.some((entry) => entry.kind === "design" && entry.contextIds.length === 0));
  assert.ok(catalog.entries.some((entry) => entry.kind === "context" && entry.contextType === "song"));
  assert.ok(catalog.entries.some((entry) => entry.kind === "collection"));
  for (const entry of catalog.entries) if (entry.kind === "product") {
    assert.equal(getStorePurchaseAction(catalog, entry.id).kind, "disabled");
  }
});

test("CLI adds a valid draft, discovers new files automatically, and never overwrites", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "store-authoring-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const args = ["add-design", "--directory", directory, "--slug", "my-design", "--title", "My Design"];
  const created = cli(...args);
  assert.equal(created.status, 0, created.stderr);
  const file = join(directory, "my-design.design.json");
  const bytes = readFileSync(file, "utf8");
  const entry = JSON.parse(bytes) as { id: string; visibility: string };
  assert.match(entry.id, /^design-[a-f0-9-]{36}$/);
  assert.equal(entry.visibility, "draft");
  assert.equal((await loadCatalog(directory, [])).entries.length, 1);
  assert.notEqual(cli(...args).status, 0);
  assert.equal(readFileSync(file, "utf8"), bytes);
  mkdirSync(join(directory, "nested"));
  writeFileSync(join(directory, "nested", "new-design.json"), JSON.stringify({ ...design(), ...base("design-nested") }));
  assert.equal((await loadCatalog(directory, [])).entries.length, 2);
  const sources = await loadCatalogSources(directory);
  assert.deepEqual(sources.map(({ source }) => source), sources.map(({ source }) => source).sort());
});

test("CLI rejects invalid arguments and malformed input without partial writes", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "store-invalid-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const args of [
    ["add-design", "--slug", "../escape", "--title", "Test"],
    ["add-design", "--slug", "valid"], ["validate", "--unknown", "value"],
  ]) assert.notEqual(cli(...args, "--directory", directory).status, 0);
  assert.deepEqual(readdirSync(directory), []);
  writeFileSync(join(directory, "broken.json"), "{broken");
  const result = cli("add-design", "--directory", directory, "--slug", "valid", "--title", "Test");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /broken.json: invalid JSON/);
  assert.deepEqual(readdirSync(directory), ["broken.json"]);
});
