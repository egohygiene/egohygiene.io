# Ecosystem card navigation — #60

Recorded 2026-10-24 (America/New_York). Owner: [#60](https://github.com/egohygiene/egohygiene.io/issues/60),
under setup #88 and roadmap #84. Alan selected this issue after #91 C.

## A — Destination contract

Input: draft #95 at `54e8dac7dcc3206dca05efd2951f1233daba9d99`.
Main remains `07d25941ceeefa53089afa025b612c6aa54f36c4`; existing drafts are
unmerged. Work is isolated on `fix/ecosystem-links-60`, stacked on #95.

The existing [software registry](../../apps/egohygiene.io/src/content/products.ts)
is the authority for each card's name, local path, status and optional repository.
This is separate from the merchandise catalog. The current cards show paths as
plain text and only expose two external repository anchors. No local card link
exists at this input revision.

| Product | Primary local destination | Existing route behavior | Registry status |
| --- | --- | --- | --- |
| Mindcap | `/mindcap` | Project status page | development |
| Mindgarden | `/mindgarden` | Project status page | planned |
| Renderflow | `/renderflow` | Project status page | planned |
| Egolint | `/egolint` | Project status page | development |
| Reflector | `/reflector` | Project status page | planned |
| Aether | `/aether` | Project status page | development |
| Store | `/store` | Curated website storefront | development |

Use `product.path` directly in the existing `LocaleLink`; do not derive a path
from an identifier/name or create another product/destination registry. A single
native linked heading per card provides the product name as its accessible name.
Keep the status badge, category and displayed path. Optional repository anchors
remain separate, unchanged destinations, with visible product-specific GitHub and
external labels; do not append locale queries to them or force a new tab.

The existing router's explicit `/store` route must continue to win over the
generic project gateway. Planned/development gateway pages remain informative,
not working applications. Update directory/gateway explanatory copy for visitors.
Do not change statuses, route definitions, publication/indexing decisions,
catalog entries, purchase states or deployment assumptions.

This applies existing [locale](../architecture/decisions/0009-single-locale-runtime.md)
and [public rendering](../architecture/decisions/0012-static-public-route-rendering.md)
decisions; no new architectural boundary or schema is needed.

## B/C — Original implementation and verification plan

After saving this contract in a draft PR, add the local links and source-language
messages. Use focused real-router DOM tests for every destination, the explicit
store page, Back navigation, locale retention, external-link separation and
unknown-route recovery. Check server-rendered links and matching hydration.
Build normally and reuse #91's raw/HTTP inspection for all current destinations.

Retain keyboard/Enter, reload and recovery browser cases in the existing suite
for Alan's final Mac pass. Chromium execution is deferred by the standing user
instruction; authored tests and simulated DOM are not browser acceptance. Keep C
open until that evidence exists. Broader focus/contrast, responsive/assistive
technology, host status and CI work retain #49/#70/#57/#29/#37 ownership.

The prior three artifact-size failures and hosted workflow failures remain
explicit; no budgets or gates may change here. No merge, deployment, real-product
activation, provider request, purchase or spending is part of #60.

## B — Implemented in draft #98

[Draft #98](https://github.com/egohygiene/egohygiene.io/pull/98) first saved A at
`a3f655f0af6142a353a900b6516fe6a5a2740bba`, before implementing B. Source
`b47e7e4165d83feba64ec7320f97943be9140b29`, tree
`e3da3c89b67ed39d2159b6dd1f73be95ed64b24e`, changes six code/message/test files.
The GitHub-created tree matched local staging; fetched source was clean.

All seven card headings are now native locale-aware links to `product.path`.
The two external repository links retain their original URLs and explicitly name
the project, GitHub and external destination. Directory and gateway copy now
explain current status and store browsing in visitor-facing language. Registry,
route definitions, statuses, metadata policy, catalog and purchasing are unchanged.
No new dependency, framework abstraction, schema or ADR is needed.

Nine new DOM/server-rendering tests cover every card, actual route selection,
Back/return links, canonical identity, locale preservation, external separation
and the initial HTML. A tenth new case verifies matching ecosystem hydration
before language-query restoration. Existing translation tests now have the router
required by native links and verify the translated repository-name placeholder.

## C — Local evidence; actual browser acceptance deferred

[Verification](reviews/ecosystem-links-60/verification.json) records exact commands,
source, outcomes and evidence hashes. [Raw/HTTP evidence](reviews/ecosystem-links-60/raw-http-inspection.json)
and the [artifact summary](reviews/ecosystem-links-60/artifact-summary.json) were
captured from a fresh normal build at clean published source using Node 24.21.0
and pnpm 11.28.5. Host UTC timestamps are preserved inside the evidence.

Local passes: 81 focused tests across eight files, application/Node/domain/browser
types, workspace/exports/messages/cycles/domain checks, four-file Biome check,
normal build, and all 26 generated pages/ten sitemap URLs. All 52 known-page HTTP
responses plus four discovery responses match generated bytes. This protects
existing shared rendering while checking the new initial ecosystem links.

Eight new browser definitions are retained in the existing `site.spec.ts` suite:
seven direct-entry, native Tab/Enter, reload and Back journeys with explicit
language retention, plus external-link labelling/focus without leaving localhost.
The existing unknown-route recovery test now checks language retention. Discovery
finds 21 site cases in total; **zero browser cases were executed**. Independent
review caught the native skip link's `#main-content` history entry; the retained
Back expectation now preserves it. DOM and repeated HTTP do not prove browser
keyboard/focus, reload or assistive-technology acceptance. C remains unchecked.

The unchanged artifact qualifier still exits 1 with exactly three size findings:

| Aggregate | Measured bytes | Existing ceiling |
| --- | ---: | ---: |
| Document-like files | 317,615 | 20,000 |
| Separately gzipped document-like files | 85,608 | 10,000 |
| Complete artifact | 1,287,210 | 1,140,000 |

These are the same categories as #91 C, with refreshed values after the link/copy
change. No other targeted scanner finding across 44 files/202 references; public
artwork still matches its source bytes. #52/#92/#37 own budget semantics,
justified reductions and final integrated disposition. No cap or gate changed.
Existing broad formatting, Chromium, responsive/focus and intended-server work
retain #29/#49/#57/#70/#92/#37 ownership. Trailing-slash/unknown-route Vite behavior
is unchanged; clean canonical destinations are the scope here. The full runner
still encounters the artifact-size gate before browser execution.

Source hosted workflows failed independently of the local passes:
[CI 40111860555](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860555),
[dependency review 40111860579](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860579),
[CodeQL 40111860933](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860933).
No new hosted diagnosis, manual dispatch or CI waiver. No production acceptance.

Next: sync on #60 A/B and local C evidence, then #50 in the approved setup order.
Keep #60 open for actual C browser acceptance and integration; #90 contact/copy
and #91 browser gaps remain. Existing draft stack stays unmerged; no deployment,
real-product/provider activation, purchase or spending occurred.
