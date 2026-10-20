# Extending the current store

Start with [dependency rules](dependency-rules.md). The public store domain entry
is `apps/egohygiene.io/src/features/store/domain/index.ts`; it is app-owned source,
not a published package. [ADR 0005](decisions/0005-portable-store-domain.md) records
why this checkpoint adds a provider adapter without adding a framework or engine.

## Data and state ownership

| Data / state | Authority | Consumer behavior |
| --- | --- | --- |
| IDs, slugs, artwork revisions, design/product/context relationships | Validated catalog v1 | Derive views through selectors; never replace IDs with provider IDs |
| Public browser catalog | Node loader → `toPublicStoreCatalog` → Vite adapter | Import `src/content/store/index.ts`; no raw authoring JSON imports |
| Shop and artist selections | Validated storefront curation v1 | Resolve ordered canonical IDs through domain selectors; membership does not imply authorship or purchase eligibility |
| `q`, `view`, `story` and navigation | Router URL/search parameters | Derive filters on render; retain unrelated query parameters |
| Gallery selection, size, quantity and displayed mock summary | Local React state | Derive selected objects/eligibility; clear the summary when selection changes |
| Theme preference and system resolution | One `ThemeProvider` | `useTheme` and semantic variables; storage failure must not block the app |
| Locale, messages and formatting | One app `I18nProvider` | Current app defaults to English; do not add feature-level locale state |
| Synthetic normalized offer | Fixture + selected adapter + canonical product | Derive once for the immutable preview input; no fetch/cache/store |
| Future remote stock, price, variants | Qualified provider service, once implemented | One remote authority and freshness policy; do not copy stock into catalog or component state |
| Public site configuration | `@egohygiene/config` explicit input parser | Known public fields only; no provider credentials in `VITE_*` or catalog JSON |

Canonical JSON is the content authority; provider research is not an order API.
`providers.json` schema v1 permits only disabled placeholders. The approved live
checkout route list is empty. `getStorePurchaseAction` still owns actual catalog
purchase links and revalidates live mappings/artwork approvals. Preview adapters
produce only inert summaries and cannot activate that path.

Catalog and provider manifests currently accept version `1` only. Unknown fields
and versions fail validation. Optional/defaulted compatible additions require old
fixtures to keep passing; breaking data changes need an explicit version and
migration. #34 owns catalog evolution and #55's public projection remains the
build boundary. Restore compatible schema code and content together on rollback.
See [catalog authoring](../store/catalog-authoring.md) for runnable content examples.

## Add a page

Create a page under `src/pages/`, or a feature entry point when it has behavior.
Compose existing primitives and supply message content at the page boundary:

```tsx
import { useI18n } from "@egohygiene/i18n";
import { PageSection } from "@egohygiene/ui";

export function ExamplePage() {
  const { t } = useI18n();
  return <PageSection aria-labelledby="example-title">
    <h1 id="example-title">{t("common.siteName")}</h1>
    <p>{t("common.tagline")}</p>
  </PageSection>;
}
```

Register it in `src/app/router.tsx`, under `RootLayout`, before the generic
`:product` route. The app already supplies theme/i18n providers. Add any new leaf
message keys to the English dictionaries and use the same key in the page.
Keep document metadata, navigation and data-loading integration in the React
adapter. Use the store domain to build canonical detail paths rather than
constructing provider-derived routes.

## Add a component variation

First compose existing props: `<Button tone="secondary">{t("common.siteName")}</Button>`
is a valid example using the current API and dictionary. A real new action gets
its own meaningful message key. Do not teach `Button` about a provider or page.
Only extend its supported tones when consumers need a new shared semantic state;
then update its type, token-based CSS, story and relevant behavior check together.

Site-specific art remains in `features/store`. New shared controls take translated
visible text and accessible labels from callers. Use logical spacing, flexible
widths, text wrapping and theme tokens; preserve native keyboard behavior and
visible focus. Check long labels, RTL, reduced motion and the size matrix from
#70. This checkpoint adds no new shared component and does not certify older
hardcoded copy or physical-direction CSS as localized.

## Add a synthetic provider adapter

`StorePreviewAdapter` exposes a provider identifier and a pure
`normalize(input: unknown)` function. Validate provider input at that function,
strip unsupported fields, and return only capabilities, availability, separate
provider product/variant IDs, display options and illustrative price/stock.
Unknown stock meanings become `null`, which cannot grant a handoff.

Use the shared factory and eligibility rules in the composition boundary:

```ts
import {
  createStorePreviewOffer,
  previewStoreHandoff,
} from "./domain/index.ts";

// product is a validated canonical StoreProduct; adapter is a StorePreviewAdapter.
// payload is fictional input in the adapter's own wire shape.
const offer = createStorePreviewOffer(product, adapter, payload);
const summary = previewStoreHandoff(offer, selectedVariantId, quantity);
```

The factory keeps canonical identity and restricts availability to public preview
products. Selection, capability, quantity and stock rules stay provider-neutral.
There is no provider-name switch in those rules or UI controls. The existing
Fourthwall page keeps its provider-specific editorial copy in the feature.

Run the complete executable example from the repository root:

```sh
node --test tests/store/domain-consumer.test.ts
node scripts/checks/check-store-boundaries.ts
pnpm exec tsc --project tsconfig.store-domain.json --noEmit
```

The consumer follows a fictional collection through its design and product to a
mock variant handoff. `tests/store/fixtures/alternate-preview.ts` implements the
same adapter contract with a fictional alternate payload; it stays disabled
because it lacks hosted-checkout capability. Neither fixture documents a live
provider API. Keep alternate fixtures out of app imports and production builds.

For an actual provider, #61 owns adoption and #38 owns qualification. Implement
HTTP, authentication and loading in a separate service with explicit inputs and
a deterministic fake. Define one source for remote offers, error handling,
freshness and cancellation before UI consumes it. Do not turn a synthetic offer
into live checkout by changing `purchaseEnabled`.

## Add a locale

The website registry is `src/i18n/config.ts`; production registers English only.
`src/i18n/resources.ts` still supplies the nine English namespaces. The existing
single `I18nProvider` now accepts optional ordered fallback dictionaries and
`t(key, parameters)`, while plain `t(key)` and safe dotted lookup stay compatible.
[ADR 0009](decisions/0009-single-locale-runtime.md) defines the contract and
[checkpoint A](../store/locale-contract-64a.md) gives a runnable message example.

A locale definition separates selection `id`, explicit `direction`, display
`label` and `formatLocale`. The registry canonicalizes IDs, rejects malformed or
unsupported formatting configuration and validates ordered fallback references.
`getFallbacks(id)` expands the declared chain with stable deduplication and the
source last. Build provider dictionaries with each entry's `formatLocale`; the
provider's current `locale` property is that Intl locale, not an independent
selection identity. Synthetic locale IDs may explicitly format as English.

Use complete messages with `{{name}}` parameters and cardinal suffixes such as
`results_one` / `results_other`. Pass a finite numeric `count` to select a form;
use a separately formatted parameter for the displayed number. Missing keys try
fallback dictionaries; missing parameters stay visible. No rich HTML/ICU parser
is implemented. Ordinary React text rendering remains the output boundary.

Pure helpers in `src/i18n/selection.ts` define `lang` URL selection, optional
`egohygiene.locale` preference and source fallback. They preserve other filters
and recover from storage denial. They are not yet a browser adapter: #64 B owns
the language selector, provider state, `html lang`/`dir` and navigation effects;
C owns browser journeys and the translation key/placeholder review workflow.
`check-locales.ts` still checks four populated English files rather than full
translation parity. Do not present these pending parts as implemented.

Actual new public languages require reviewed dictionaries and registry entries.
#65/#34 own catalog translations and schema migration; preserve canonical IDs,
stored currency codes, asset paths and provider destinations. Language selection
must not imply a new currency or shipping country. #22 owns crawler-visible
locale/canonical outputs before multilingual publication.

## Loading and failure behavior

The catalog is a validated build-time input, so there is no remote loading state
to invent. Invalid source JSON fails build/dev validation with filename/field
diagnostics. Empty searches have an explicit reset state; missing detail slugs
render `StoreMissingPage`; preview/unavailable purchases render disabled copy.
The tryout handles a missing canonical product and unknown/unavailable stock.
An invalid fixture fails its adapter and is caught by the route error boundary.

If async offers are added, make loading, empty, unavailable, ready and error
states explicit in that service/UI adapter and test transitions, retry and stale
request behavior. Keep browser metadata/storage effects out of the portable
module. Existing theme/gallery effects still need review if #22 introduces SSR.

## Local verification and review

Use pinned Node `24.21.0` and pnpm `11.28.5` (Node range `>=24.21.0 <25`). Run the
focused consumer above, `pnpm typecheck`, `pnpm catalog:test`, relevant
`pnpm test:unit` files and `pnpm check`. For the actual preview interaction, use
`task build:store` then `pnpm test:store:preview`; normal output must exclude the
preview route and synthetic fixtures. [Local preview](../store/local-preview.md)
describes the same build isolation and runtime setup.

Record dependency/bundle changes and preserve the public-build fixture checks.
Use the short PR checklist; unrelated changes need not run every possible gate.
See [framework migration](framework-migration.md) for what transfers and what
must be adapted if a future renderer is justified.

The [checkpoint evidence](store-domain-checkpoint.md) records actual checks,
bundle deltas and the browser verification limitation for this implementation.

## Curate the primary shop and Incompris

Checkpoint A of #62 adds a strict `storefront-curation.json` version-1 manifest
beside the authoring catalog. It selects ordered public canonical IDs for the
primary Ego Hygiene shop, Incompris collection and its featured subset; it never
confers ownership, artist attribution or purchase eligibility. Browser consumers
receive `storefrontCuration` alongside `storeCatalog` from `src/content/store`.
Use `getCuratedStoreEntries` from the portable domain entry point to preserve
manual order without copying entries or constructing new detail URLs.

`/store/catalog` retains the uncurated preview browser, including fictional
examples. The curated `/store` and `/store/incompris` pages can stay empty until
approved content exists. Old `/store` filter/section links redirect to the preview
browser; product/design/collection URLs remain unchanged. See the
[checkpoint authoring guide](../design/storefront-62a.md) and
[ADR 0008](decisions/0008-curated-storefront-views.md).

## Artist and song discovery

Checkpoint B adds optional `artists` to the same curation v1 manifest. Each
selection has a public artist-context `artistId`, ordered `standaloneEntryIds`
and ordered `songCollectionIds`. All three arrays default to empty; previous
curation v1 sources still parse. Standalone selections accept public designs,
products and collections. Song selections require public collections with at
least one directly referenced public song context. Duplicate artist IDs or
duplicates within a list, missing/draft references and wrong entry kinds fail
the existing Node validation boundary.

Use `getCuratedStoreArtists` for discovery and `getCuratedStoreArtist` for an
exact slug lookup. They return the canonical artist context, ordered
`standaloneEntries` and `songCollections`; they do not infer extra membership.
`storeArtistPath` supplies `/store/incompris/artists/<artist-slug>`. The reusable
React page owns URL state (`view=songs`, optional `q`), translated controls,
metadata and empty/missing views. Unknown view values use the standalone view;
view changes retain other query parameters.

Song collections keep their existing `storeEntryPath` destination,
`/store/collections/<slug>`, suitable for stable SoundCloud links once published.
Products keep `/store/products/<slug>` in every view. Many artists or song
collections may select the same entry, and the standalone/song views may overlap
intentionally. Selection is editorial discoverability; it does not establish
authorship or require duplicate artist context associations on each collection.
No private song-catalog fetch or new provider routing is involved.

The real `/store/incompris/artists/play` destination is registered with empty
selections. Heartburst remains selected only for Incompris, without an artist or
song attribution. `/store/preview/artists/demo-artist` reuses the same page with
a clearly fictional artist and existing demo entries, lazy-loaded only in the
isolated preview build. Normal builds exclude that route and synthetic artist;
all demo purchase states remain disabled.

See [artist authoring](../store/catalog-authoring.md#curate-an-artist-and-shop-by-song)
for content steps. `tests/store/artists.test.ts` covers compatible defaults,
many-to-many identity, order, stable paths and invalid references. UI/browser
checks exercise URL navigation and empty/populated states; passing these checks
does not qualify a live checkout or a real release's metadata.
