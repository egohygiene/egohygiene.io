# Current-route public rendering — #91 checkpoint A

Prepared 2026-10-23 (America/New_York). Status: **A prepared for review; B/C not
implemented**. Owner: [#91](https://github.com/egohygiene/egohygiene.io/issues/91).
Decision: [ADR 0012](../architecture/decisions/0012-static-public-route-rendering.md).

## Source and integration

Alan selected the next issue after the discovery-file discussion. The existing
one-checkpoint working agreement selects A now, followed by a sync before B.
Recovered the pruned checkout from GitHub and refreshed issue/PR/head/check status
before editing. Main remains `07d25941ceeefa53089afa025b612c6aa54f36c4`.

| Input | Live state at start | Revision |
| --- | --- | --- |
| Website essentials #94 | Draft; base feat/store-readiness-38 | `2096c75d381a3027d6b133f2a873f432fe2057a3` |
| Readiness #87 | Draft; base main | `ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6` |
| Roadmap #93 | Draft; base main | `c7eb41f3966e93e015868f81de128c9414f4cafd` |
| Older CI #73 | Draft; base main | `725e021336fe6675e53d0a3374caf0b102627019` |

This branch, docs/public-rendering-91a, starts exactly at #94 and targets
its docs/website-essentials-90a branch. #94 already contains the #87 and #93
ancestry. No preceding PR is merged or retargeted. The inspected tree is
`2a49c38b5997192fa3d79bed3f72383754fecf19`. All source links below resolve within
that unchanged implementation; Git history records this documentation update.

## Existing routes and proposed publication disposition

There are **26 concrete successful application paths**: 11 fixed pages, six
additional ecosystem gateways, eight browsable catalog records and one curated
artist. This is a source inventory, not a fresh runtime schema-validation pass.
The [machine-readable inventory](reviews/public-rendering-91a/inventory.json)
records source hashes, exact catalog identities and exclusions. B must derive its
actual build inventory from the validated public projection, never from this receipt.

All 26 receive meaningful HTML. The proposed sitemap contains these ten:

| Path | Content owner |
| --- | --- |
| / | HomePage and source messages |
| /about | AboutPage and existing purpose copy |
| /help | HelpPage and public-feedback warning |
| /accessibility | AccessibilityPage and limited review status |
| /ecosystem | EcosystemPage and existing product directory |
| /store | Curated primary shop; legitimate empty selection |
| /store/help | StoreHelpPage; responsibility/support distinctions |
| /store/incompris | Curated Incompris feature |
| /store/incompris/artists/play | Curated artist-play context; empty standalone/song selections |
| /store/designs/heartburst | design-heartburst; approved public artwork preview, no garment |

The other 16 receive useful HTML and proposed **noindex,follow**, with no sitemap
entry. These are publication choices for review, not current implemented controls:

| Paths | Reason |
| --- | --- |
| /privacy, /terms | Explicitly provisional policies; keep their draft status visible |
| /mindcap, /mindgarden, /renderflow, /egolint, /reflector, /aether | Reserved ecosystem gateway pages, not actual separate deployments |
| /store/catalog | Public preview browser including fictional examples |
| /store/designs/signal-heart, /store/designs/static-bloom-artwork, /store/designs/unwritten-realm-cover | Three explicitly fictional designs |
| /store/products/signal-heart-hoodie, /store/products/static-bloom-mug, /store/products/unwritten-realm-comic | Three fictional product examples; two preview, one unavailable |
| /store/collections/static-bloom-collection | Fictional song collection |

Public preview examples are already shipped by the normal app; they are distinct
from isolated fixture routes. Indexability neither grants rights nor approves a
sale. A real unavailable product could be indexable after explicit disposition;
Heartburst does not require a garment. Changing these publication choices requires
reviewing the site policy, not changing canonical identity or activating checkout.
No search-engine removal/indexing guarantee is implied by publishing directives.

## Owning sources and contract gaps

| Responsibility | Existing source relative to repository root |
| --- | --- |
| Route composition and preview flag | apps/egohygiene.io/src/app/router.tsx |
| Browser mount and provider composition | apps/egohygiene.io/src/main.tsx; src/app/App.tsx; src/app/providers.tsx within the app |
| Ecosystem paths/content | apps/egohygiene.io/src/content/products.ts; src/pages/ProductPage.tsx within the app |
| Catalog paths/public selection | apps/egohygiene.io/src/features/store/domain/catalog.ts |
| Artist enumeration/paths | apps/egohygiene.io/src/features/store/domain/artists.ts |
| Validated public input | scripts/store-catalog.mts; scripts/vite-store-catalog.mts; packages/schemas/src/store.ts; app src/content/store/index.ts |
| Editorial placement | apps/egohygiene.io/src/content/store/storefront-curation.json |
| Existing title/description effects | app src/components/PageMetadata/PageMetadata.tsx; src/features/store/StorePages.tsx |
| Source language/preferences | app src/i18n/config.ts, LocaleProvider.tsx and selection.ts; ADR 0009 |
| Theme state and pre-paint behavior | packages/themes/src/components/ThemeProvider.tsx; app index.html |
| Legacy filter forwarding | apps/egohygiene.io/src/features/store/StoreEntryPage.tsx |
| Current local serving assumption | infra/caddy/Caddyfile; blanket SPA fallback |

The shared catalog is v3 at this source. The older framework-migration note still
said v1 was current; this checkpoint corrects that stale statement and links the
new decision, preserving the historical ADRs rather than rewriting their history.

No current schema field marks fictional/indexable entries. Use one small site-owned
policy keyed by stable IDs with explicit reasons, validate completeness/stale keys,
and derive slugs through existing selectors. Do not add a speculative SEO schema,
copy raw authoring JSON into browser code or classify entries by a demo name prefix.
Artist enumeration uses validated curated artists, not every context. There is no
standalone /store/songs/:slug route: song destinations reuse collection URLs.

## URL, metadata and missing states

Keep https://egohygiene.io, existing path spelling and no trailing slash except
root. Query/hash controls are browser state, not independent sitemap destinations.
English is the only public locale; do not index synthetic languages. Metadata uses
the same messages/public content as the rendered page, with source fallback and
consistent canonical/social identity. Preserve policy-draft and unavailable copy.

The following are acceptance cases for B/C, not newly passing checks:

| Case | Required behavior |
| --- | --- |
| Catalog ?q, ?view, ?story | Initial hydration matches static default, then applies actual URL filters; invalid values retain existing fallback |
| Artist ?view=songs and ?q | Empty real song selection remains truthful; no duplicate song/product identity |
| Explicit ?lang=en, invalid/repeated lang, blocked storage | Existing precedence/links survive; first hydration uses a deterministic source snapshot |
| Legacy /store queries and #catalog/#worlds/#store-story | Existing forwarding preserves query/hash after hydration; no server claim for fragments |
| Unknown detail/artist slug | Useful existing missing state, noindex, no sitemap and no home canonical |
| Unknown single/deeper path | Existing ProductPage fallback/wildcard missing state; 404.html is not proof of host HTTP status |
| Trailing slash, path case or fallback artifact mismatch | No new canonical identity or hydration against the wrong page; redirect/alias verification is explicit local/host work |
| Rendering exception | Fail a known-route build; do not publish its error UI as successful content |
| Isolated Fourthwall/artist/localization/qualification previews | Absent from normal route generation, HTML, metadata, sitemap and normal assets |

No missing asset should resolve successfully to homepage HTML. #57 owns local
Docker/Caddy MIME/status qualification; #89/#39 own real-host redirects and delivery.
A production build contract must fail on unexpected public-route collisions and
missing metadata rather than silently dropping a page. Canonical metadata cannot
substitute for configured and verified redirects.

## Discovery-file discussion captured

The preceding read-only investigation found [Holon #7](https://github.com/egohygiene/holon/issues/7)
(generator), [Hygiene #16](https://github.com/egohygiene/hygiene/issues/16)
(policy), [Relay #16](https://github.com/egohygiene/relay/issues/16) (validation)
and [Pace #6](https://github.com/egohygiene/pace/issues/6) (rollout).
Hygiene's merged policy remains proposed 1.0.0-alpha.4 at
[aa6a5e2](https://github.com/egohygiene/hygiene/blob/aa6a5e25ea3ef80e4dcc15570a1ea166b9f4af3d/catalog/agent-ready-web-profile.json).
Downstream generation/validation/rollout remains open; policy merge is not adoption.

Existing website files are robots.txt, a basic llms.txt and site.webmanifest.
For #91, fix the advertised-but-absent sitemap and reconcile llms.txt with current
public pages and truthful preview states. Derive any link list from the same
eligible route input; do not duplicate catalog content. Do not claim freshness
from timestamps or create aliases without a documented consumer need.

Broader optional outputs remain with #22/Holon: generated full-context/Markdown
representations, feeds, humans attribution and applicable discovery integrations.
Holon proposes ai-crawler.txt, cats.txt and entity maps; the current Hygiene
profile places AI crawler guidance in robots.txt and does not register humans.txt.
The profile is not a requirement to create experimental files in this issue.
Security contact publication remains dependent on reviewed #9 facts; advertising
seller declarations require actual applicability. No private masters, business
records, invented contacts, agent purchase authority or AI-use policy is published.

## Checkpoint B implementation sequence

1. Share route definitions and add the pure publication/metadata resolver, keeping
   fixed-route ownership beside the router and dynamic paths derived from public data.
2. Add the Node-only renderer and normal build integration. Use existing pinned
   packages and validation; emit only final static assets, page HTML and discovery
   outputs. Keep the dev and isolated-preview workflows intact.
3. Adapt first hydration for locale, theme and filters; then preserve real URL and
   preference behavior. Consolidate client metadata and preserve purchase guards.
4. Add focused positive/negative route, metadata, escaping, privacy and hydration
   checks. Reuse existing type boundaries and artifact/qualification tooling.
   Record source revision and unresolved implementation questions in the same draft.

C then inspects clean fresh outputs for every inventoried family, determinism and
local delivery. Actual Chromium/keyboard/responsive/AT remains deferred to the
final Mac pass, with explicit retained journeys and no invented executions.
A broader migration, new renderer dependency or public content activation would
need an evidenced scope revision; this decision authorizes none of those by itself.

## Validation and limitations

A changes documentation/evidence only. Validation is JSON/source/path inventory,
relative documentation links, context-manifest targets and diff whitespace, plus
independent route/architecture review. Source hashes bind the inventory to the
inspected base. No fresh application build, runtime catalog-validator run,
unit/DOM/browser suite, server response, provider or deployment test is claimed.
The recovered host's Node 24.19.0 is below the pinned 24.21.0, so no application
command was run under it; B must recover the exact pinned toolchain first.

Refreshed #94 head checks remain failed: CI 39876452521 and dependency review
39876452515. Its earlier implementation-source receipt also records failed CodeQL
39875866901. These are separate revisions/evidence, not a fresh CodeQL run on A.
No failure cause was re-diagnosed, gate disabled or workflow manually dispatched.
Final publication/check status belongs in current-state/provenance and the draft PR.

#90 remains open for its factual/contact disposition and deferred acceptance;
starting #91 does not approve that copy or close #90. #91 remains open after A.
Next: sync on this decision and indexing disposition, then checkpoint B. No merge,
deployment, provider activation, real product, paid order or spending occurred.
