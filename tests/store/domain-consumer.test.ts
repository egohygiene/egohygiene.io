import assert from "node:assert/strict";
import { test } from "node:test";
import { fourthwallPreviewAdapter } from "../../apps/egohygiene.io/src/features/fourthwall-preview/adapter.ts";
import { createFourthwallFixture } from "../../apps/egohygiene.io/src/features/fourthwall-preview/fixture.ts";
import {
  canPreviewStoreVariant,
  createStorePreviewOffer,
  filterStoreEntries,
  getDesignProducts,
  getEntryDesigns,
  getRelatedCollections,
  previewStoreHandoff,
  storeEntryPath,
} from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import {
  alternatePreviewFixture,
  disabledAlternatePreviewAdapter,
} from "./fixtures/alternate-preview.ts";

const base = (id: string) => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title: id,
  description: "Fictional consumer fixture",
  visibility: "public",
});
const catalog = parseStoreCatalog(
  [
    {
      ...base("design-example"),
      kind: "design",
      artworkRevision: 1,
      artwork: { kind: "placeholder", label: "Example art" },
    },
    {
      ...base("product-example"),
      kind: "product",
      title: "Example hoodie",
      designIds: ["design-example"],
      purchase: { state: "preview" },
    },
    { ...base("collection-example"), kind: "collection", productIds: ["product-example"] },
    {
      ...base("design-draft"),
      kind: "design",
      visibility: "draft",
      artworkRevision: 1,
      artwork: { kind: "placeholder", label: "Draft art" },
    },
  ].map((value) => ({ source: `${value.id}.json`, value })),
);

test("a Node consumer follows collection → product → variant → inert handoff using the public domain entry", () => {
  const before = JSON.stringify(catalog);
  const publicCatalog = toPublicStoreCatalog(catalog);
  const collection = filterStoreEntries(publicCatalog, "", "collection")[0];
  assert.ok(collection?.kind === "collection");
  const design = getEntryDesigns(publicCatalog, collection)[0];
  assert.ok(design);
  const product = getDesignProducts(publicCatalog, design.id)[0];
  assert.ok(product);
  assert.deepEqual(
    getRelatedCollections(publicCatalog, product).map((entry) => entry.id),
    [collection.id],
  );
  assert.equal(storeEntryPath(collection), "/store/collections/collection-example");
  assert.equal(storeEntryPath(product), "/store/products/product-example");
  assert.equal(storeEntryPath(design), "/store/designs/design-example");
  assert.equal(filterStoreEntries(publicCatalog, "draft", "all").length, 0);

  const offer = createStorePreviewOffer(
    product,
    fourthwallPreviewAdapter,
    createFourthwallFixture(product),
  );
  const variant = offer.variants.find((candidate) => candidate.optionLabel === "M");
  assert.ok(variant);
  const handoff = previewStoreHandoff(offer, variant.id, 2);
  assert.deepEqual(handoff, {
    kind: "mock",
    productId: product.id,
    provider: "fourthwall",
    providerProductId: "mock-fourthwall-signal-heart",
    productName: product.title,
    variantName: "Black / M",
    items: [{ variantId: variant.id, quantity: 2 }],
    currency: "USD",
    illustrativeSubtotal: 84,
  });
  assert.equal(offer.purchaseEnabled, false);
  assert.equal(getStorePurchaseAction(publicCatalog, product.id).kind, "disabled");
  assert.equal(
    JSON.stringify(catalog),
    before,
    "Deriving an offer must not mutate catalog identity or purchase state",
  );
});

test("the same consumer keeps an alternate provider disabled without provider branches", () => {
  const product = getDesignProducts(catalog, "design-example")[0];
  assert.ok(product);
  const offer = createStorePreviewOffer(
    product,
    disabledAlternatePreviewAdapter,
    alternatePreviewFixture,
  );
  assert.equal(offer.productId, product.id);
  assert.equal(offer.purchaseEnabled, false);
  assert.equal(offer.variants.length, 1);
  // Stock and a price are insufficient: this fixture has no hosted checkout capability.
  assert.equal(canPreviewStoreVariant(offer, "alternate-small"), false);
  assert.equal(previewStoreHandoff(offer, "alternate-small"), undefined);
  assert.throws(() =>
    createStorePreviewOffer(product, disabledAlternatePreviewAdapter, { reference: 12 }),
  );
});

test("canonical draft, unavailable and live states cannot become synthetic eligible products", () => {
  const product = getDesignProducts(catalog, "design-example")[0];
  assert.ok(product);
  const payload = createFourthwallFixture(product);
  const cases = [
    { ...product, visibility: "draft" as const },
    { ...product, purchase: { state: "unavailable" as const, reason: "Not approved" } },
    {
      ...product,
      purchase: {
        state: "live" as const,
        provider: "fourthwall" as const,
        routeId: "route-example",
        variants: [],
      },
    },
  ];
  for (const canonical of cases) {
    const offer = createStorePreviewOffer(canonical, fourthwallPreviewAdapter, payload);
    assert.equal(offer.available, false);
    assert.equal(previewStoreHandoff(offer, "mock-fourthwall-signal-heart-s"), undefined);
  }
});
