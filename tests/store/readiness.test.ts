import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getStorePurchaseAction,
  getStoreReadinessSnapshot,
  isStoreQualificationCurrent,
  parseStoreCatalog,
  storeEntrySchema,
  toPublicStoreCatalog,
  type StoreCatalog,
  type StoreDesign,
} from "../../packages/schemas/src/store.ts";
import {
  CHECKOUT_HANDOFF_FIXTURE,
  createCheckoutHandoffInputs,
} from "../checkout-handoff/inputs.ts";

/** All approvals here are fictional test data; no destination is requested. */
function fixture() {
  const inputs = createCheckoutHandoffInputs();
  const entries = inputs.sources.map(({ value }) => storeEntrySchema.parse(value));
  const product = entries.find((entry) => entry.id === CHECKOUT_HANDOFF_FIXTURE.live.id);
  assert.ok(product?.kind === "product" && product.purchase.state === "live");
  const route = inputs.routes[0];
  assert.ok(route?.qualification.status === "reviewed");
  const designs = entries.filter((entry): entry is StoreDesign => entry.kind === "design");
  const design = designs.find((entry) => entry.id === CHECKOUT_HANDOFF_FIXTURE.designId);
  assert.ok(design?.artwork.kind === "image");
  const parse = () => parseStoreCatalog(
    entries.map((value) => ({ source: `${value.id}.json`, value })),
    [route],
  );
  return { entries, product, route, designs, design, parse };
}

test("a current synthetic qualification preserves its exact handoff and public customer links", () => {
  const input = fixture();
  const before = JSON.stringify(input);
  assert.equal(isStoreQualificationCurrent(input.route, input.product, input.designs), true);
  const catalog = toPublicStoreCatalog(input.parse());
  assert.deepEqual(getStorePurchaseAction(catalog, input.product.id), {
    kind: "external",
    label: "Shop on Fourthwall",
    href: CHECKOUT_HANDOFF_FIXTURE.checkoutUrl,
    disclosures: input.route.disclosures,
  });
  assert.deepEqual(toPublicStoreCatalog(catalog), catalog);
  assert.deepEqual(catalog.checkoutRoutes[0]?.qualification, input.route.qualification);
  assert.equal(JSON.stringify(input), before);
});

test("the public readiness helper rejects a different canonical product or purchase route", () => {
  const input = fixture();
  assert.equal(isStoreQualificationCurrent(input.route, { ...input.product, id: "different-product" }, input.designs), false);
  assert.ok(input.product.purchase.state === "live");
  const differentRoute = { ...input.product, purchase: { ...input.product.purchase, routeId: "different-route" } };
  assert.equal(isStoreQualificationCurrent(input.route, differentRoute, input.designs), false);
  assert.throws(() => getStoreReadinessSnapshot(input.route, differentRoute, input.designs), /exact product and purchase route/);
});

test("live products cannot use a missing or explicitly unreviewed qualification", () => {
  for (const qualification of [undefined, { status: "unreviewed" }]) {
    const input = fixture();
    const catalog = input.parse();
    const route = { ...input.route, qualification };
    assert.throws(
      () => parseStoreCatalog(input.entries.map((value) => ({ source: value.id, value })), [route]),
      /Live products require a current reviewed qualification/,
    );
    const runtime = { ...catalog, checkoutRoutes: [route] } as unknown as StoreCatalog;
    assert.throws(() => toPublicStoreCatalog(runtime), /current reviewed qualification/);
    assert.throws(() => getStorePurchaseAction(runtime, input.product.id), /current reviewed qualification/);
  }
});

test("unreviewed routes can be prepared without granting a preview purchase", () => {
  const input = fixture();
  input.product.purchase = { state: "preview" };
  const { qualification: _qualification, disclosures: _disclosures, ...route } = input.route;
  const catalog = parseStoreCatalog(
    input.entries.map((value) => ({ source: value.id, value })),
    [route],
  );
  assert.deepEqual(catalog.checkoutRoutes[0]?.qualification, { status: "unreviewed" });
  assert.equal(getStorePurchaseAction(catalog, input.product.id).kind, "disabled");
  assert.deepEqual(toPublicStoreCatalog(catalog).checkoutRoutes, []);
});

test("review bindings become stale when the configured offer changes", () => {
  const changes: Array<[string, (input: ReturnType<typeof fixture>) => void]> = [
    ["destination", ({ route }) => { route.checkoutUrl = "https://test-handoff-37a.fourthwall.com/products/changed-offer"; }],
    ["route identity", ({ route, product }) => {
      route.id = "test-handoff-38-new-route";
      assert.ok(product.purchase.state === "live");
      product.purchase.routeId = route.id;
    }],
    ["canonical variant identity", ({ product }) => {
      assert.ok(product.purchase.state === "live");
      product.purchase.variants[0]!.id = "test-handoff-38-new-variant";
    }],
    ["canonical variant label", ({ product }) => {
      assert.ok(product.purchase.state === "live");
      product.purchase.variants[0]!.label = "Different physical size";
    }],
    ["provider variant mapping", ({ route, product }) => {
      assert.ok(product.purchase.state === "live");
      product.purchase.variants[0]!.providerVariantId = "changed-provider-variant";
      route.providerVariantIds = ["changed-provider-variant"];
    }],
    ["artwork revision", ({ route, design }) => {
      design.artworkRevision += 1;
      route.artworkRevisions[0]!.revision = design.artworkRevision;
    }],
    ["artwork source", ({ design }) => {
      assert.ok(design.artwork.kind === "image");
      design.artwork.src = "/store/test-handoff-38/changed.png";
    }],
    ["added display price", ({ product }) => {
      assert.ok(product.purchase.state === "live");
      product.purchase.displayPrice = { amountMinor: 1234, currency: "USD", authority: "provider-checkout" };
    }],
    ["support destination", ({ route }) => {
      assert.ok(route.disclosures);
      route.disclosures.supportUrl = "https://example.com/changed-support";
    }],
    ["shipping policy", ({ route }) => {
      assert.ok(route.disclosures);
      route.disclosures.shippingPolicyUrl = "https://example.com/changed-shipping";
    }],
    ["returns policy", ({ route }) => {
      assert.ok(route.disclosures);
      route.disclosures.returnsPolicyUrl = "https://example.com/changed-returns";
    }],
  ];
  for (const [label, change] of changes) {
    const input = fixture();
    change(input);
    assert.equal(isStoreQualificationCurrent(input.route, input.product, input.designs), false, label);
    assert.throws(input.parse, /current reviewed qualification/, label);
  }
});

test("removing or changing a reviewed display price requires renewed review", () => {
  for (const change of ["remove", "amount", "currency"] as const) {
    const input = fixture();
    assert.ok(input.product.purchase.state === "live");
    input.product.purchase.displayPrice = { amountMinor: 2500, currency: "USD", authority: "provider-checkout" };
    assert.ok(input.route.qualification.status === "reviewed");
    input.route.qualification.snapshot = getStoreReadinessSnapshot(input.route, input.product, input.designs);
    input.parse();
    if (change === "remove") delete input.product.purchase.displayPrice;
    else if (change === "amount") input.product.purchase.displayPrice.amountMinor += 1;
    else input.product.purchase.displayPrice.currency = "CAD";
    assert.throws(input.parse, /current reviewed qualification/, change);
  }
});

test("public projection and runtime actions recheck stale qualifications after parsing", () => {
  const input = fixture();
  const catalog = input.parse();
  const route = catalog.checkoutRoutes[0];
  assert.ok(route?.disclosures);
  route.disclosures.supportUrl = "https://example.com/new-support";
  assert.throws(() => toPublicStoreCatalog(catalog), /current reviewed qualification/);
  assert.throws(() => getStorePurchaseAction(catalog, input.product.id), /current reviewed qualification/);
});

test("presentation edits and provenance dates do not silently revoke an unchanged offer", () => {
  const input = fixture();
  input.product.title = "A revised public title";
  input.product.description = "A revised public description";
  assert.ok(input.design.artwork.kind === "image");
  input.design.artwork.alt = "A clearer alternative description of the same artwork";
  assert.ok(input.route.qualification.status === "reviewed");
  input.route.qualification.reviewedAt = "2020-01-01";
  assert.equal(isStoreQualificationCurrent(input.route, input.product, input.designs), true);
  assert.equal(getStorePurchaseAction(input.parse(), input.product.id).kind, "external");
});

test("reordering the same approved artwork and variants preserves eligibility without accepting duplicates", () => {
  const input = fixture();
  const second: StoreDesign = {
    ...structuredClone(input.design),
    id: "test-readiness-second-design",
    slug: "test-readiness-second-design",
    artwork: { kind: "image", src: "/store/test-readiness/second.png", alt: "Second fictional swatch" },
  };
  input.entries.push(second);
  input.designs.push(second);
  input.product.designIds.push(second.id);
  input.route.artworkRevisions.push({ designId: second.id, revision: second.artworkRevision });
  assert.ok(input.product.purchase.state === "live");
  input.product.purchase.variants.push({
    id: "test-readiness-second-variant",
    label: "Second fictional size",
    providerVariantId: "test-readiness-second-provider-variant",
  });
  input.route.providerVariantIds.push("test-readiness-second-provider-variant");
  assert.ok(input.route.qualification.status === "reviewed");
  input.route.qualification.snapshot = getStoreReadinessSnapshot(input.route, input.product, input.designs);
  input.parse();

  input.product.designIds.reverse();
  input.product.purchase.variants.reverse();
  input.route.providerVariantIds.reverse();
  input.route.artworkRevisions.reverse();
  input.designs.reverse();
  assert.equal(isStoreQualificationCurrent(input.route, input.product, input.designs), true);
  assert.equal(getStorePurchaseAction(input.parse(), input.product.id).kind, "external");

  input.route.qualification.snapshot.artwork.push({ ...input.route.qualification.snapshot.artwork[0]! });
  assert.equal(isStoreQualificationCurrent(input.route, input.product, input.designs), false);
  assert.throws(input.parse, /current reviewed qualification/);
});

test("invalid readiness records cannot be hidden in draft products", () => {
  const input = fixture();
  input.product.visibility = "draft";
  input.route.qualification = { status: "unreviewed" };
  assert.throws(input.parse, /current reviewed qualification/);
});

test("qualification metadata rejects malformed dates, private contact identifiers and unknown evidence fields", () => {
  const changes = [
    { reviewedAt: "2026-02-30" },
    { reviewerId: "private@example.com" },
    { evidenceRefs: [] },
    { evidenceRefs: ["test-evidence", "test-evidence"] },
    { evidenceRefs: ["https://private.example.com/contract"] },
    { privateNotes: "Business record must not be accepted" },
  ];
  for (const change of changes) {
    const input = fixture();
    const route = { ...input.route, qualification: { ...input.route.qualification, ...change } };
    assert.throws(
      () => parseStoreCatalog(input.entries.map((value) => ({ source: value.id, value })), [route]),
      /qualification/,
    );
  }
});

test("readiness cannot approve a paid, merchant-funded or unreviewed fulfillment arrangement", () => {
  for (const change of [
    { channel: "fulfillment-api" },
    { orderFunding: "merchant-funded" },
    { noMerchantAdvance: false },
    { paidSubscriptionRequired: true },
    { artworkRights: "unreviewed" },
    { productTemplate: "unreviewed" },
  ]) {
    const input = fixture();
    assert.ok(input.route.qualification.status === "reviewed");
    const route = {
      ...input.route,
      qualification: {
        ...input.route.qualification,
        assessment: { ...input.route.qualification.assessment, ...change },
      },
    };
    assert.throws(
      () => parseStoreCatalog(input.entries.map((value) => ({ source: value.id, value })), [route]),
      /qualification.assessment/,
    );
  }
});

test("customer disclosures reject unsafe URLs before a review can authorize them", () => {
  for (const value of [
    "javascript:alert(1)",
    "http://example.com/support",
    "https://user:password@example.com/support",
    "https://user@example.com/support",
    "//example.com/support",
  ]) {
    const input = fixture();
    assert.ok(input.route.disclosures);
    input.route.disclosures.supportUrl = value;
    assert.throws(input.parse, /disclosures.*supportUrl/);
  }
});
