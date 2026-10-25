# ADR 0011 — Reviewed readiness at the live-product boundary

- Date: 2026-10-22.
- Status: Implemented for review in the #38 / bounded #9 preparation slice.
- Scope: A local qualification contract and customer disclosures; no real product,
  provider account, paid order, deployment or financial approval.

## Context

Catalog v2 checks hosted destinations, product/variant mappings and approved artwork
revisions, but an otherwise valid live route has no machine-enforced assessment of
customer-funded production or product readiness. The separate provider manifest
contains disabled research placeholders. Its fee descriptions cannot approve an
offer. #9 also needs truthful information at the customer handoff.

## Decision

Keep one canonical catalog and the existing Fourthwall hosted-product URL policy.
Attach qualification to the existing route instead of adding a provider activation
registry, remote service or alternate purchase path. Public customer disclosures
belong to that exact route: HTTPS shipping policy, returns policy and order-support
destinations. Unreviewed routes do not acquire these facts by default.

A reviewed qualification contains a public reviewer ID, calendar date and public-safe
evidence references. Its assessment explicitly covers the Fourthwall catalog
channel, production funded from the sale, no required paid subscription, artwork
rights and the product template. An exact snapshot binds the route and product,
provider variant IDs, canonical variant mappings/labels, displayed price, artwork
revision/image source and customer disclosures. Identity sets compare independent
of order; editorial cover/gallery order remains the separate #54 rule.

The loader validates all records before filtering. Publication and live purchase
actions revalidate the same qualification, including draft records. Missing or
unreviewed qualification and a changed snapshot fail closed. Successful purchase
actions return the reviewed customer links alongside the existing destination;
presentation does not reconstruct eligibility or read unqualified route metadata.
Preview/unavailable products remain inert. Resetting qualification to unreviewed
withdraws approval and requires the associated product to leave the live state.

Snapshot consistency is deterministic. Review dates are provenance; no arbitrary
clock expiration or browser-dependent grace period is invented. External provider
facts can change without catalog edits, so actual activation and known changes
require human requalification. The contract cannot prove identity, rights,
commercial eligibility, remote policy content, stock or physical product quality.
Its public-safe evidence IDs do not publish private evidence or replace its review.

## Versioning and migration

Requiring review invalidates some formerly valid live data. Therefore current
catalog/entry version becomes **3**, rather than silently tightening version 2.
Provider and curation manifests retain their independent version 1.

Preserve explicit historical v1→v2 migration and add v2→v3. The latter preserves
canonical content and order for non-live data but refuses legacy live products:
the caller must deliberately withdraw them before migration and requalify them
under v3. It never manufactures assessment/evidence, drops variant/price mappings
silently or converts a legacy live product into an approved v3 offer. Source input
remains available; the CLI writes a new envelope exclusively and never rewrites
authoring files in place. Restore compatible code and retained data together on
rollback. Do not serve old code as a workaround for a withdrawn qualification.

## Customer presentation and consequences

Use the existing locale service, page primitives and canonical product routes.
`/store/help` provides store-specific guidance; product links come from the successful
purchase action. The existing privacy/terms drafts stay provisional, and public
website feedback is explicitly distinct from private order support. The larger
organization-wide #9 program remains open, including its Holon/Relay dependencies.

No dependency, framework, product identifier, artwork asset, locale activation,
provider capability or deployment topology changes. The current route list remains
empty, provider research disabled and all real products non-purchasable. Synthetic
reviews exist only in test fixtures and do not qualify a real account or product.
The [readiness workflow](../../store/product-readiness.md) owns the onboarding
checklist. Checkpoint evidence is recorded separately; deferred Chromium and final
engineering acceptance remain #37 work.
