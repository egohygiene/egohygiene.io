# ADR 0005: An app-owned portable store domain and preview adapters

- Status: accepted for the local preview checkpoint
- Date: 2026-10-13
- Related: #69, ADR 0004; provider adoption #61, real-product qualification #38

## Context

Catalog validation and purchase routes already live in a framework-independent
schema package. Store selectors were pure but mixed with the presentation
directory. The Fourthwall tryout page understood provider stock, attributes and
price shapes, and its handoff rules lived inside the provider contract.

## Decision

Expose pure selectors and synthetic offer/handoff behavior from
`features/store/domain/index.ts`. Keep this module app-owned until another
application needs it; do not create or publish a package for a hypothetical
framework migration.

Use one small `StorePreviewAdapter` contract to normalize validated provider-shaped
input. The domain's `createStorePreviewOffer` combines that data with canonical
identity and eligibility to produce a `StorePreviewOffer`. Fourthwall
has the implemented synthetic adapter. A test-only alternate provider fixture
uses a deliberately fictional payload and has no hosted-checkout capability.
The same eligibility function keeps its handoff disabled. It is not an
integration or a statement about a provider's current API or commercial terms.

Canonical ID, title and slug come from the catalog. Provider product/variant
identifiers remain distinct. Offers always carry `kind: "synthetic"` and
`purchaseEnabled: false`; mock handoffs contain no URL and perform no I/O. The
existing approved live-route contract is unchanged. A mock result is never input
to live checkout, inventory, fulfillment or a payment API.

React owns controls and rendering; the router owns URL state; the build adapter
owns discovery and projection. There is no remote offer cache or server API yet.
Actual remote loading, freshness and order eligibility require the separate
provider qualification work rather than extending the mock by flipping a flag.

## Consequences

The Node consumer exercises collection → product → variant → mock handoff
through the same public entry point as the page, with no browser or Vite loader.
A DOM-free compilation and focused import check protect that boundary. Existing
preview interaction tests exercise the React consumer.

We retain React/Vite, schemas, UI packages and the existing dependency checks.
We defer a provider registry, generic service layer, global state container,
new framework, shared commerce package and deployment. The checkpoint introduces
no runtime dependency or persisted schema version. Reverting its code and docs
together restores the earlier preview without a data migration.

## Artwork reference order — #54

Accepted in PR #81 on 2026-10-18 (merge
`28a2ed2d712becf1513d1bd3d6190502db876a69`): the portable `getEntryDesigns` selector
resolves a product's `designIds` in declared order. For a collection, resolve its
explicit `designIds` first, then each referenced product in `productIds` order,
then that product's `designIds` order. Keep the first occurrence of each design.
The first resolved public design supplies the cover; the same list supplies the
gallery. A design's own display remains that canonical design.

Catalog discovery order and filenames are not presentation priorities. Resolve
IDs to the original canonical objects without sorting or mutating the catalog.
Keep existing visibility filtering and validation boundaries: public projection
rejects invalid references before rendering; this selector does not approve
content, repair malformed input or change purchase eligibility.

An extra cover field is unnecessary while the first declared reference expresses
the intended cover. This fixes the existing relationship semantics without a
version bump or data migration. Reverting the selector restores catalog-order
presentation without changing stored records. See the [#54 checkpoint](../../store/design-order-54.md)
for implementation and verification status.
