import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getStorePurchaseAction,
  parseStoreCatalog,
  type StoreCatalog,
  StoreCatalogError,
  storeCatalogSchema,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import { qualifySyntheticRoute, SYNTHETIC_STORE_DISCLOSURES } from "./fixtures/readiness.ts";

function liveCatalog(): StoreCatalog {
  const common = {
    schemaVersion: 3,
    sourceLocale: "en",
    description: "Fictional envelope fixture",
    visibility: "public",
  };
  const sources = [
    {
      source: "design.json",
      value: {
        ...common,
        id: "design-envelope",
        slug: "envelope-art",
        title: "Envelope artwork",
        kind: "design",
        artworkRevision: 1,
        artwork: { kind: "image", src: "/store/envelope.webp", alt: "Fictional test artwork" },
      },
    },
    {
      source: "product.json",
      value: {
        ...common,
        id: "product-envelope",
        slug: "envelope-product",
        title: "Envelope product",
        kind: "product",
        designIds: ["design-envelope"],
        purchase: {
          state: "live",
          provider: "fourthwall",
          routeId: "route-envelope",
          variants: [{ id: "variant-small", label: "Small", providerVariantId: "provider-small" }],
        },
      },
    },
  ];
  return parseStoreCatalog(sources, [
    qualifySyntheticRoute(
      {
        id: "route-envelope",
        provider: "fourthwall",
        productId: "product-envelope",
        checkoutUrl: "https://fixture.fourthwall.com/products/envelope",
        providerVariantIds: ["provider-small"],
        artworkRevisions: [{ designId: "design-envelope", revision: 1 }],
      },
      sources[1]?.value,
      [sources[0]?.value],
    ),
  ]);
}

const project = (value: unknown) => toPublicStoreCatalog(value as StoreCatalog);
const action = (value: unknown) =>
  getStorePurchaseAction(value as StoreCatalog, "product-envelope");

test("current version 3 envelopes preserve identities, defaults and reviewed actions without mutation", () => {
  const catalog = liveCatalog();
  const before = JSON.stringify(catalog);
  assert.deepEqual(storeCatalogSchema.parse(catalog), catalog);
  assert.deepEqual(project(catalog), catalog);
  assert.deepEqual(action(catalog), {
    kind: "external",
    label: "Shop on Fourthwall",
    href: "https://fixture.fourthwall.com/products/envelope",
    disclosures: SYNTHETIC_STORE_DISCLOSURES,
  });
  assert.equal(JSON.stringify(catalog), before);
  assert.deepEqual(catalog.entries[0]?.kind === "design" && catalog.entries[0].contextIds, []);
  assert.deepEqual(project({ schemaVersion: 3, entries: [], checkoutRoutes: [] }), {
    schemaVersion: 3,
    entries: [],
    checkoutRoutes: [],
  });
});

test("publication and live actions reject unsupported, missing and mistyped envelope versions", () => {
  for (const schemaVersion of [1, 2, 99, undefined, "3", null]) {
    const catalog = { ...liveCatalog(), schemaVersion };
    for (const boundary of [project, action]) {
      assert.throws(
        () => boundary(catalog),
        (error: unknown) => {
          assert.ok(error instanceof StoreCatalogError);
          assert.match(error.message, /catalog:schemaVersion/);
          return true;
        },
      );
    }
  }
});

test("unknown envelope metadata fails instead of disappearing at publication or checkout", () => {
  const catalog = { ...liveCatalog(), authoringNotes: "Unexpected private metadata" };
  for (const boundary of [project, action]) {
    assert.throws(() => boundary(catalog), /catalog:\$:.*authoringNotes/);
  }
});

test("the envelope requires entry and route arrays with valid record shapes", () => {
  for (const field of ["entries", "checkoutRoutes"]) {
    for (const value of [undefined, null, {}, "not-an-array", [null]]) {
      const catalog = { ...liveCatalog(), [field]: value };
      assert.throws(() => project(catalog), new RegExp(`catalog:${field}`));
      assert.equal(storeCatalogSchema.safeParse(catalog).success, false);
      if (field === "checkoutRoutes") {
        assert.throws(() => action(catalog), /catalog:checkoutRoutes/);
      }
    }
  }
});

test("invalid drafts still block projection and live actions before they can be filtered out", () => {
  const catalog = liveCatalog();
  const validDraft = {
    schemaVersion: 3,
    sourceLocale: "en",
    id: "product-draft",
    slug: "draft",
    title: "Draft",
    description: "Draft test product",
    kind: "product",
    visibility: "draft",
    designIds: ["design-envelope"],
    purchase: { state: "preview" },
  };
  const withDraft = (draft: unknown) => ({ ...catalog, entries: [...catalog.entries, draft] });
  assert.deepEqual(project(withDraft(validDraft)), catalog);
  for (const [draft, expected] of [
    [{ ...validDraft, title: "" }, /catalog:entries.2.title/],
    [
      { ...validDraft, designIds: ["design-missing"] },
      /product-draft:designIds.0: Expected design/,
    ],
  ] as const) {
    for (const boundary of [project, action]) {
      assert.throws(() => boundary(withDraft(draft)), expected);
    }
  }
});

test("envelope shape acceptance does not replace relationship or artwork approval checks", () => {
  const catalog = liveCatalog();
  const approval = catalog.checkoutRoutes[0]?.artworkRevisions[0];
  assert.ok(approval);
  approval.revision = 2;
  assert.equal(storeCatalogSchema.safeParse(catalog).success, true);
  for (const boundary of [project, action]) {
    assert.throws(
      () => boundary(catalog),
      /product-envelope:designIds.0: Live products require image artwork at the reviewed revision/,
    );
  }
});

test("non-live actions remain disabled without requiring publication validation", () => {
  const catalog = liveCatalog();
  const product = catalog.entries.find((entry) => entry.kind === "product");
  assert.ok(product?.kind === "product");
  product.purchase = { state: "preview" };
  assert.deepEqual(action({ ...catalog, schemaVersion: 99 }), {
    kind: "disabled",
    label: "Preview — coming later",
  });
  product.purchase = { state: "unavailable", reason: "Awaiting review" };
  assert.deepEqual(action({ ...catalog, schemaVersion: 99 }), {
    kind: "disabled",
    label: "Awaiting review",
  });
});
