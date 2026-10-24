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

## B/C — Implementation and verification plan

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
