import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createStoreListingEvidenceSchema,
  getStoreListingBinding,
  getStoreListingEvidenceStatus,
  type StoreListingContext,
} from "../../packages/schemas/src/store-listing.ts";
import { qualifySyntheticRoute } from "./fixtures/readiness.ts";
import { relationshipFixture } from "./fixtures/relationships.ts";

const productId = "product-fictional-one";
const asOf = "2026-11-10T12:00:00Z";
const context = (): StoreListingContext => ({
  target: "website",
  websiteOrigin: "https://egohygiene.io",
  sourceCommit: "a".repeat(40),
  projectionSha256: "b".repeat(64),
  buildSha256: "c".repeat(64),
  assets: [{ src: "/store/design-fictional-shared.webp", sha256: "d".repeat(64) }],
});
const review = { reviewerId: "synthetic-reviewer", reviewedAt: "2026-11-10T10:00:00Z" };
function sample() {
  const { catalog } = relationshipFixture();
  const current = context();
  const binding = getStoreListingBinding(catalog, productId, current);
  return { catalog, current, binding, base: { schemaVersion: 1, productId, binding } };
}

test("prepared, approved and dated observed evidence remain separate; nothing activates preview purchasing", () => {
  const { catalog, current, base } = sample();
  const state = (input: unknown, clock = asOf) =>
    getStoreListingEvidenceStatus(catalog, input, current, clock);
  assert.equal(state({ schemaVersion: 1, productId, state: "unknown", binding: null }), "unknown");
  assert.equal(state({ ...base, state: "prepared" }), "prepared");
  assert.equal(state({ ...base, state: "approved", review }), "approved");
  const observed = {
    ...base,
    state: "observed",
    review,
    observation: {
      observedAt: "2026-11-10T11:00:00Z",
      destination: base.binding.destination,
      result: "published",
      validUntil: "2026-11-11T11:00:00Z",
      evidenceId: "synthetic-observation",
    },
  };
  assert.equal(state(observed), "observed");
  assert.equal(state(observed, "2026-11-12T12:00:00Z"), "stale");
  assert.equal(
    state({
      ...base,
      state: "withdrawn",
      withdrawal: {
        observedAt: "2026-11-10T11:30:00Z",
        destination: base.binding.destination,
        result: "withdrawn",
        evidenceId: "synthetic-withdrawal",
      },
    }),
    "withdrawn",
  );
  const product = catalog.entries.find((entry) => entry.id === productId);
  assert.ok(product?.kind === "product");
  assert.equal(product.purchase.state, "preview");
  assert.throws(
    () => createStoreListingEvidenceSchema().parse({ ...base, state: "observed", review }),
    /observation/,
  );
});

for (const field of ["sourceCommit", "projectionSha256", "buildSha256"] as const)
  test(`changed ${field} makes supplied approval stale`, () => {
    const { catalog, current, base } = sample();
    current[field] = "e".repeat(field === "sourceCommit" ? 40 : 64);
    assert.equal(
      getStoreListingEvidenceStatus(catalog, { ...base, state: "approved", review }, current, asOf),
      "stale",
    );
  });

test("changed public bytes, artwork revisions or destination never renew approval", () => {
  for (const change of ["bytes", "revision", "slug", "copy"]) {
    const { catalog, current, base } = sample();
    if (change === "bytes") current.assets[0]!.sha256 = "f".repeat(64);
    const design = catalog.entries.find(
      (entry) => entry.kind === "design" && entry.id === "design-fictional-shared",
    );
    const product = catalog.entries.find(
      (entry) => entry.kind === "product" && entry.id === productId,
    );
    if (change === "revision" && design?.kind === "design") design.artworkRevision += 1;
    if (change === "slug" && product) product.slug = "renamed-product";
    if (change === "copy" && product)
      product.title = "Changed public copy with an old claimed digest";
    assert.equal(
      getStoreListingEvidenceStatus(catalog, { ...base, state: "approved", review }, current, asOf),
      "stale",
    );
  }
});

test("unknown build/bytes/offer can be prepared but cannot supply publication approval", () => {
  const { catalog } = relationshipFixture();
  for (const current of [
    { ...context(), buildSha256: null },
    { ...context(), assets: [] },
    { ...context(), target: "provider" as const },
  ]) {
    const binding = getStoreListingBinding(catalog, productId, current);
    const base = { schemaVersion: 1, productId, binding };
    assert.equal(
      getStoreListingEvidenceStatus(catalog, { ...base, state: "prepared" }, current, asOf),
      "prepared",
    );
    assert.throws(() =>
      createStoreListingEvidenceSchema().parse({ ...base, state: "approved", review }),
    );
  }
});

test("closed objects reject private fields, malformed pins, identity mismatches and future evidence", () => {
  const { catalog, current, base } = sample();
  const approved = { ...base, state: "approved", review };
  for (const input of [
    { ...approved, privateReceipt: "SYNTHETIC_PRIVATE_SENTINEL" },
    { ...approved, binding: { ...base.binding, masterSha256: "SYNTHETIC_PRIVATE_SENTINEL" } },
    { ...approved, binding: { ...base.binding, productId: "product-other" } },
    { ...approved, review: { ...review, reviewedAt: "2026-11-12T12:00:00Z" } },
    { ...approved, binding: { ...base.binding, projectionSha256: "bad" } },
  ])
    assert.throws(() => getStoreListingEvidenceStatus(catalog, input, current, asOf));
});

test("newly requalified variants/offers do not refresh an old listing approval", () => {
  for (const change of ["variant", "price", "offer", "disclosure"]) {
    const { catalog } = relationshipFixture();
    const product = catalog.entries.find((entry) => entry.id === productId);
    const design = catalog.entries.find((entry) => entry.id === "design-fictional-shared");
    assert.ok(product?.kind === "product" && design?.kind === "design");
    product.purchase = {
      state: "live",
      provider: "fourthwall",
      routeId: "route-fictional",
      variants: [{ id: "variant-fictional", label: "Small", providerVariantId: "provider-small" }],
      displayPrice: { amountMinor: 2000, currency: "USD", authority: "provider-checkout" },
    };
    const makeRoute = (slug = "fictional-item") =>
      qualifySyntheticRoute(
        {
          id: "route-fictional",
          provider: "fourthwall",
          productId,
          checkoutUrl: `https://synthetic-relationship.fourthwall.com/products/${slug}`,
          providerVariantIds: ["provider-small"],
          artworkRevisions: [{ designId: design.id, revision: design.artworkRevision }],
        },
        product,
        [design],
      );
    catalog.checkoutRoutes = [makeRoute()];
    const current = { ...context(), target: "provider" as const };
    const binding = getStoreListingBinding(catalog, productId, current);
    const evidence = { schemaVersion: 1, productId, state: "approved", binding, review };
    assert.equal(getStoreListingEvidenceStatus(catalog, evidence, current, asOf), "approved");
    if (change === "variant") product.purchase.variants[0]!.label = "Revised size label";
    if (change === "price") product.purchase.displayPrice!.amountMinor += 100;
    catalog.checkoutRoutes = [makeRoute(change === "offer" ? "changed-offer" : "fictional-item")];
    if (change === "disclosure") {
      const route = catalog.checkoutRoutes[0]!;
      route.disclosures!.supportUrl = "https://support.example.invalid/changed-support";
      route.qualification = { ...qualifySyntheticRoute(route, product, [design]).qualification };
      // The test helper supplies fictional defaults; qualify the explicitly changed public snapshot.
      if (route.qualification.status === "reviewed")
        route.qualification.snapshot.route.disclosures.supportUrl = route.disclosures!.supportUrl;
    }
    assert.equal(getStoreListingEvidenceStatus(catalog, evidence, current, asOf), "stale");
  }
});

test("observations require a known result, exact destination and valid chronology; no result stays unknown", () => {
  const { catalog, current, base } = sample();
  const valid = {
    ...base,
    state: "observed",
    review,
    observation: {
      observedAt: "2026-11-10T11:00:00Z",
      destination: base.binding.destination,
      result: "published",
      validUntil: "2026-11-11T11:00:00Z",
      evidenceId: "synthetic-observation",
    },
  };
  for (const change of [
    { result: null },
    { destination: null },
    { destination: "https://example.invalid/wrong-page" },
    { observedAt: "2026-11-09T11:00:00Z" },
    { observedAt: "2026-11-12T11:00:00Z", validUntil: "2026-11-13T11:00:00Z" },
    { validUntil: "2026-11-10T10:00:00Z" },
  ])
    assert.throws(() =>
      getStoreListingEvidenceStatus(
        catalog,
        { ...valid, observation: { ...valid.observation, ...change } },
        current,
        asOf,
      ),
    );
});
