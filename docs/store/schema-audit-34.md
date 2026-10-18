# Catalog schema audit — 2026-10-18

The maintainer requested a quick schema audit and bounded robustness upgrades
before selecting the next roadmap issue. This is a slice of
[#34](https://github.com/egohygiene/egohygiene.io/issues/34), on
`fix/catalog-schema-audit-34`. Starting main:
`d8cf7e8e1825de7241d5ccecb69685e17686a75d`.
Publication and implementation revisions are recorded in the
[continuity ledger](../context/provenance.md#catalog-schema-audit--2026-10-18-utc).
Verified implementation: `57ffa8befabbce6f0f9dc51190a2dc1273380c26`; its complete
Git tree matches the tested local implementation.
Review checkpoint: [draft PR #79](https://github.com/egohygiene/egohygiene.io/pull/79).

## Finding and contract

The entry schemas already reject unsupported versions, but the assembled
`StoreCatalog` envelope was only a handwritten TypeScript type. Public projection
and live-action revalidation reconstructed version 1 from its entries without
checking the envelope. A baseline probe confirmed that version 99, a missing
version, and unexpected top-level metadata all became an ordinary version-1
public catalog. TypeScript types cannot enforce runtime inputs.

The fix adds a strict `storeCatalogSchema` for the existing three fields:
`schemaVersion`, `entries`, and `checkoutRoutes`. `StoreCatalog` is inferred
from it. A private validation helper checks the full envelope, then reuses the
existing cross-record checks before public projection or a live purchase action.
Errors identify `catalog:<field path>` for shape failures and retain entry IDs
for relationship failures. Invalid drafts still fail before filtering.

The exported schema validates shapes, not reference integrity or approval.
Callers still use `parseStoreCatalog` for authoring validation and the existing
projection/purchase boundaries. The non-live purchase path remains a cheap
disabled action; it does not certify or publish its input catalog. No new public
parser, service, framework, dependency or provider rule is introduced.

## Audit disposition and compatibility

| Area | Disposition |
| --- | --- |
| Envelope version and unknown fields | Fixed at publication and live-action boundaries |
| Type ownership | Catalog type now derives from the runtime envelope schema |
| IDs, slugs, references, duplicates and visibility | Existing validation retained and regression suites rerun |
| Prices and checkout destinations | Existing bounded integer/currency and exact Fourthwall URL rules retained |
| Product, variant and artwork approvals | Existing cross-record checks retained; not replaced by envelope parsing |
| Optional contexts, artist selections and display price | Existing optional/defaulted behavior retained |
| New optional image or review metadata | Deferred until a concrete consumer or #38 readiness contract needs it |
| Ownership semantics and executable migrations | Still open in #34; no rights inference or artificial version migration |

Version 1 and all shipped records remain unchanged. No content migration is
required. The intentionally stricter behavior rejects malformed envelopes that
were previously ignored; consumers must provide the declared version and fields.
Rollback restores code and documentation together without changing catalog data.
This implements the existing schema/portable-boundary decisions rather than
introducing a new architectural direction.

## Verification

Used Node 24.21.0 (official archive checksum verified) and pnpm 11.28.5 with the
frozen lockfile and dependency install scripts disabled. No dependency changed.

| Check | Result |
| --- | --- |
| Baseline catalog/provider/curation/artist tests | 32 pass before the fix; separate probe reproduces ignored envelope versions/fields |
| `pnpm catalog:test` | 62 pass, including seven new envelope cases and existing public-build/dev-server boundary cases |
| `pnpm typecheck` | App, Node catalog and portable domain pass |
| Focused store/Fourthwall/artist fixture unit run | 49 pass across nine files after repairing the stale fixture described below |
| `pnpm build` | 10 entries, one image, 177 modules; JS 434.23 kB / gzip 130.00 kB |
| `node scripts/store-environment.mjs build` | Isolated preview passes; 184 modules |
| Portable import guard | 12 modules pass |
| Independent review | No blocking findings; verified that envelope shape parsing does not replace cross-record checks |

The first broader unit run passed 47 cases and failed two Fourthwall page cases
because their unchanged fixture lacked the `I18nProvider` now required by the
existing artwork component. A separate baseline reproduction confirmed this.
The test now supplies the app's existing provider/messages; assertions and
runtime presentation are unchanged. The Fourthwall-only rerun passed seven
cases, followed by the complete 49-case focused rerun above.

New-test format/import checks and changed-line whitespace pass. Existing source
formatting debt, non-null lint warnings and module/config-loader warnings remain;
this is not repository-wide lint cleanup. Current main's CI/CodeQL still report
failure, and the prior dependency-review configuration blocker remains separate
under #29/#73. No gate or configuration was changed.

The audit does not claim new browser/device, hosted CI, live-provider,
deployment or physical-product qualification. No artwork, product association,
purchase state, checkout route or provider setting changes.

The next action is to review this audit checkpoint with Alan. #34 remains open
for its broader ownership/migration work; #54's ordering fix, #37's intercepted
checkout journey and #38's readiness preparation remain the proposed sequence.
