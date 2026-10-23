# ADR 0012 — Build-time rendering of the existing public routes

- Date: 2026-10-23 (America/New_York).
- Status: Implemented for checkpoint B review in draft #95; C/browser/host acceptance remains.
- Owner: [#91](https://github.com/egohygiene/egohygiene.io/issues/91), bounded
  current-route slice of [#22](https://github.com/egohygiene/egohygiene.io/issues/22).
- Source: `2096c75d381a3027d6b133f2a873f432fe2057a3`, unmerged #94 atop #87.

## Context

The website uses React/React DOM 19.2.8, react-router-dom 7.18.2 and Vite 8.2.0.
Normal pages are eagerly imported and use synchronous local public data. The
browser router is constructed at module import; App imports that singleton and
main always calls createRoot. Two metadata components update title/description
only in effects. The HTML template has an empty root; robots advertises a sitemap
without an implemented generator. This is source inspection, not a new build run.

The [A receipt](../../design/public-rendering-91a.md) records all 26 current paths,
existing missing/preview states and precise source ownership. We need useful
initial HTML without rebuilding the catalog, introducing future content platforms
or making Chromium/paid hosting part of the build.

## Decision

Retain React, Vite and React Router Data Mode. Add one build-time Node renderer
using a Vite SSR bundle and the existing router's static APIs. No request-time
server, framework-mode migration, dependency upgrade or second catalog is selected.

1. Extract one environment-neutral route-object definition from router.tsx.
   The browser adapter constructs its router separately; neither the shared route
   module nor static entry may import a browser-router singleton. Share RootLayout,
   pages, feature components, messages and public data across both entries.
2. Validate authoring inputs through the existing Node catalog loader, public
   projection and curation validation. Both client and renderer consume the same
   public module boundary and identical inputs: capture an immutable public
   catalog/curation snapshot or compare their digests across both builds and fail
   on drift. Calling the loader twice alone does not guarantee equality.
   Enumerate detail paths through isBrowsableEntry and
   storeEntryPath; artist paths through getCuratedStoreArtists/storeArtistPath;
   ecosystem gateways through the existing products source. Fixed pages remain
   owned by the same route declarations, not a parallel hand-maintained slug list.
3. Build normal browser assets with Vite, then a build-only SSR entry outside the
   public output. Use createStaticHandler/query, createStaticRouter and
   StaticRouterProvider from the pinned router dependency. Initially render the
   synchronous tree with renderToString, then insert markup and escaped metadata
   into the same build's transformed HTML template. This choice follows the pinned
   router's documented integration and avoids an additional renderer dependency.
   Do not use renderToStaticMarkup: interactive output must be hydratable.
4. The synchronous scope is a constraint: unresolved Suspense, lazy normal routes,
   remote data or an error response must fail generation rather than publish a
   loading/error shell as a successful page. If actual public content needs async
   rendering, prefer React's prerenderToNodeStream and revise the adapter with
   focused evidence; do not silently broaden this initial contract.
5. Emit root index.html, each known path's directory/index.html, a separate
   noindex 404.html, sitemap.xml and a deterministic build route receipt. All use
   the same route/metadata resolution. Finish generation before reporting build
   success; stale output, duplicate paths, invalid slugs, traversal, collisions,
   missing metadata or unexplained publication dispositions fail the build.
   Nothing imports the SSR bundle into the browser or copies it into dist.
6. Browser startup hydrates marked, matching prerendered output with hydrateRoot.
   Keep createRoot for the empty dev/isolated-preview shell and for an explicitly
   mismatched fallback artifact; never hydrate the homepage as another route.
   Preserve the root error boundary, IDs and one provider tree in both entries.
   Use the router's public hydration context when needed; do not invent a second
   routing state store. Any serialized data must be public and script-safe.

## Deterministic first render

Generated pages use English, no query/filter/hash state, and a stable theme-control
snapshot. Hydration must use that same snapshot before applying browser state.
The existing pre-paint theme CSS script remains, but ThemeProvider must not read
and persist a different initial preference before hydration finishes. Restore a
saved preference without overwriting it with the build default, then preserve
normal preference/media-query behavior, including denied storage.

Locale selection remains ADR 0009: URL, saved preference, source. Establish an
explicit source-locale/search snapshot for SSR and first hydration rather than
relying on a caught ReferenceError from window access. Catalog and artist filters
currently read useSearchParams directly; their first hydrating render must also
use the generated snapshot, then apply the actual URL without losing query/hash,
Back/Forward behavior or an explicit language choice. A single app-owned hydration
boundary or server-snapshot hook can supply this; do not duplicate locale runtimes.

Legacy /store filter/hash forwarding to /store/catalog must run after hydration.
No generic suppressHydrationWarning, empty initial page or assumed browser pass
may conceal mismatches. A build artifact marker includes its canonical pathname;
trailing-slash/unknown-path fallback must not hydrate a different page's markup.

## Metadata, canonical and discovery ownership

One app-owned pure route/metadata resolver supplies static head output and client
navigation updates. It reads existing interface messages, ecosystem records and
localized public catalog selectors. Consolidate PageMetadata/StoreMetadata through
that boundary, preserving title formatting and fallback behavior; do not author a
second set of page descriptions. Domain selectors remain free of React/DOM/Node.

Use the existing public origin https://egohygiene.io with root / and existing
no-trailing-slash paths. Query/hash controls are preserved in navigation but
excluded from canonical/sitemap URLs. Explicit ?lang=en still works; production
registers only English, so emit no fabricated hreflang alternatives. Canonical
URL, og:url and sitemap identity must agree. Validate origin/path construction;
never derive canonical origin from an untrusted request host or private env input.
Actual alias redirects and final host behavior remain #89/#39.

Each successful page receives a title, description, canonical and explicit
indexing disposition, plus consistent Open Graph/social text. Use only existing
approved public imagery where appropriate; a site icon is not an approved garment
or a new large social card. Any emitted image must have a valid absolute public
URL and truthful alt text. Record absent purpose-specific imagery rather than
claim a complete image-card rollout. No invented business attribution, ratings,
price, stock, offer or action data. This checkpoint adds no Product/Offer JSON-LD;
a later truthful structured-data slice must preserve ADR 0011 eligibility.

Discovery eligibility is separate from visibility, curation and purchase approval.
Use a small app-owned publication disposition keyed by canonical catalog IDs,
with reasons; derive paths from public selectors. Reject unknown public browsable
IDs and stale policy keys until their disposition is reviewed. Never classify
fictional data by ID spelling, require a live offer to index a genuine artwork,
or infer publication approval from curated placement. Fixed-page dispositions
belong with route metadata. Artist routes require an actual curated artist.

The A inventory, implemented for B review, selects 26 HTML destinations, ten sitemap entries and 16 noindex
pages. Fictional examples, the generic demo browser, reserved gateways and
provisional policies remain usable but excluded from the sitemap with
noindex,follow. Missing/error pages have noindex and no misleading canonical to
home. Draft/private records and isolated preview routes are not generated at all.
The status of provisional policies is preserved in visible and metadata copy.

Sort unique sitemap URLs deterministically, XML-escape values, and omit lastmod
until a truthful content modification source exists. No build-time timestamps,
made-up priorities or change frequencies. Keep robots.txt crawl rules compatible
with reading noindex; it is not an access-control or noindex mechanism. Its sitemap
pointer must resolve to the emitted artifact. Reconcile the existing llms.txt with
the actual current website and public destinations; it remains a curated summary,
not a second content/catalog authority or promise of AI indexing.

## Alternatives considered

| Option | Disposition |
| --- | --- |
| Client-only SPA plus sitemap | Insufficient: useful page text/head still depend on browser JavaScript. |
| Existing Vite + static React Router adapter | Selected: shares current components/data, adds a bounded build adapter and explicit hydration work. We own this adapter and must test it. |
| Browser-snapshot prerender | Not selected: makes the build depend on Chromium and effect/preference timing; does not remove the need for canonical/publication rules. |
| React Router framework mode | Credible later: built-in route/prerender conventions, but introduces framework tooling, route-module/output migration and a larger change than current synchronous pages require. |
| New application/framework or runtime SSR service | No demonstrated requirement for this issue; changes deployment and ownership unnecessarily. |

The low-level adapter must stay small. Reconsider framework mode if it grows a
custom loader framework, large async/content graph, request-specific server data
or repeated router-internal compatibility patches. The existing dependency remains
pinned; broader dependency cleanup belongs to #92.

## Delivery, verification and rollback

A remains the architecture/inventory record. [B implementation and evidence](../../design/public-rendering-91b.md) now implement this decision; C reviews freshly generated HTML and locally served responses. B rejects loaders/actions as well as lazy routes in the synchronous renderer, validates each published path against its expected route ID, and uses a frozen public module for both builds. Fixed path declarations also supply route metadata. The build CLI retains normal `dist` and isolated `dist-preview` outputs. Existing aggregate artifact-size ceilings remain unchanged and currently fail after adding route documents; C/final #37 must reconcile those measured findings. Unit/DOM hydration checks are local evidence, not actual Chromium.
Full Chromium/responsive/keyboard/AT qualification remains #37/#49/#70 on Alan's
Mac. Local static-server status/MIME behavior belongs with #57; deployed redirects,
canonical-origin and deep-link checks belong to #89/#39. 404.html alone does not
prove a 404 HTTP response; the current Caddy SPA fallback requires reconciliation.

Revert the renderer/client-entry integration and metadata outputs together to a
recorded compatible build if necessary. Catalog v3, stable IDs/URLs, readiness
records and disabled purchases remain unchanged. No schema migration is required.
Do not republish stale generated HTML or treat rollback as product requalification.

## Sources and provenance

Reviewed on 2026-10-23; no external implementation or assets copied:

- [React Router 7.18.2 Data Mode custom SSR guide](https://github.com/remix-run/react-router/blob/react-router%407.18.2/docs/start/data/custom.md)
  and its release-tag exports; APIs available through the existing dependency.
- [Vite SSR/SSG guide](https://vite.dev/guide/ssr.html): shared application entries,
  production bundle and known-route static generation. Local Vite is pinned above.
- [React renderToString](https://react.dev/reference/react-dom/server/renderToString),
  [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot) and
  [prerenderToNodeStream](https://react.dev/reference/react-dom/static/prerenderToNodeStream):
  hydration matching, synchronous limits and async SSG alternative. Current web
  docs identify React 19.3; the repo uses 19.2.8, so B verifies exact installed APIs.
- [Sitemaps protocol](https://www.sitemaps.org/protocol.html),
  [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
  and [Open Graph](https://ogp.me/): format, crawl/index separation and metadata.

The recent discovery-file discussion is retained in the receipt. Hygiene's
proposed profile and open Holon/Relay/Pace rollout do not require implementing all
experimental files or agent capabilities in #91.
