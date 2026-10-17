# One canonical V1 storefront in the website

Date: **2026-10-17 UTC**. Status: **accepted by the maintainer; paired ownership PRs merged on 2026-10-17**. Scope: ownership and preservation
plan, not application migration or deployment.
Owner: [website #75](https://github.com/egohygiene/egohygiene.io/issues/75).

## Context and evidence

The website and `egohygiene/store` both contain working React/Vite storefront
source. The website's high-level ADR-004 selected an integrated store when
comparing private merch sources; it did not inspect the separate public app.
Store ADR-003 instead selected independent deployment. The
[pinned comparison](../storefront-ownership.md) now audits both implementations,
their tests, current CI limitations and license declarations.

## Decision

Select `apps/egohygiene.io` in `egohygiene/egohygiene.io` as the canonical
customer-facing store and use one composed static website build for V1. The
website owns root/store routing and the future development/release coordinator.
Keep `egohygiene/store` preserved as commerce code/reference and provider/product
research. Adapt useful capabilities behind the website's portable/domain and
explicit I/O boundaries only in bounded, separately verified slices.

Retain stable catalog IDs, product/design/collection URLs, public projection,
artwork approvals and disabled purchase defaults. A provider's catalog/IDs must
not replace the canonical design/song/product graph. Keep private creative
sources separate. No repository transfer or archival follows from this choice.

## Alternatives and consequences

- **Separate store as canonical application:** it has real cart/provider I/O,
  but lacks the existing design/collection graph and reviewed public projection.
  Adopting it wholesale would move more established responsibility than importing
  selected commerce capabilities. Its current E2E failure and missing provider
  tests also prevent treating it as production-qualified.
- **Independent applications under a path proxy:** viable later, but adds routing,
  deployment and shared-shell coordination for no demonstrated V1 requirement.
- **Website with selective commerce adaptation:** retains the strongest existing
  product/catalog boundary and one site build; cart/provider integration remains
  real work. This is the selected option, not a claim that checkout is complete.

Website licensing remains unresolved under #59 (empty LICENSE versus Apache-2.0
metadata). Preserve the separate store's complete MIT notice with any substantial
copied code. No code is imported by this ADR. Hosting stays undecided for
production; Netlify development remains a preference, not configured service.

## Relationship to earlier records

This resolves the ownership/topology question in
[ADR 0006](0006-store-launch-direction.md), reaffirms website
[high-level ADR-004](../../../DECISIONS.md#adr-004-consolidate-the-store-v1-website-and-use-hosted-checkout),
and supersedes the independent V1 store deployment part of store ADR-003 through
its reciprocal [ADR-005](https://github.com/egohygiene/store/blob/main/DECISIONS.md#adr-005-select-the-website-as-the-v1-storefront-owner).
Other ecosystem products can still deploy independently under website ADR-002.
Historical records and implementation evidence remain intact.

## Integration and reconsideration

The comparison owns per-source dispositions, integration gates and rollback.
Revert isolated imported slices or redeploy a recorded known-good website
artifact; do not fail over to an unqualified application. Inspect provider-side
state separately. Reconsider independent deployment when actual capability,
ownership or release needs justify its additional boundaries.

Validation for this checkpoint is source review and documentation/link/context
checks. Current CI failures remain recorded; no fresh browser/provider tests,
license repair, code migration, purchase or deployment are claimed.
