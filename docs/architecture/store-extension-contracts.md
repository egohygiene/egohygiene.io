# Extending the current store

Start with [dependency rules](dependency-rules.md). The public store domain entry
is `apps/egohygiene.io/src/features/store/domain/index.ts`; it is app-owned source,
not a published package. [ADR 0005](decisions/0005-portable-store-domain.md) records
why this checkpoint adds a provider adapter without adding a framework or engine.

## Data and state ownership

| Data / state | Authority | Consumer behavior |
| --- | --- | --- |
| IDs, slugs, artwork revisions, design/product/context relationships | Validated catalog v2 | Derive views through selectors; never replace IDs with provider IDs |
| Source copy, translations and their review bindings | Canonical entry with explicit `sourceLocale` | Public projection retains current reviewed fields; selected-language rendering/search follows in #65 B |
| Creator and rights-holder declarations | Explicit catalog attribution | Default to unknown; do not infer from contexts, curation or collection membership |
| Public browser catalog | Node loader → `toPublicStoreCatalog` → Vite adapter | Import `src/content/store/index.ts`; no raw authoring JSON imports |
| Shop and artist selections | Validated storefront curation v1 | Resolve ordered canonical IDs through domain selectors; membership does not imply authorship or purchase eligibility |
| `q`, `view`, `story` and navigation | Router URL/search parameters | Derive filters on render; retain unrelated query parameters |
| Gallery selection, size, quantity and displayed mock summary | Local React state | Derive selected objects/eligibility; clear the summary when selection changes |
| Theme preference and system resolution | One `ThemeProvider` | `useTheme` and semantic variables; storage failure must not block the app |
| Locale, messages and formatting | App router → one `LocaleProvider` → shared `I18nProvider` | URL/preference/source selection; do not add feature-level locale state |
| Synthetic normalized offer | Fixture + selected adapter + canonical product | Derive once for the immutable preview input; no fetch/cache/store |
| Future remote stock, price, variants | Qualified provider service, once implemented | One remote authority and freshness policy; do not copy stock into catalog or component state |
| Public site configuration | `@egohygiene/config` explicit input parser | Known public fields only; no provider credentials in `VITE_*` or catalog JSON |

Canonical JSON is the content authority; provider research is not an order API.
`providers.json` schema v1 permits only disabled placeholders. The approved live
checkout route list is empty. `getStorePurchaseAction` still owns actual catalog
purchase links and revalidates live mappings/artwork approvals. Preview adapters
produce only inert summaries and cannot activate that path.

Current catalog parsing accepts version `2` only, including required canonical
`sourceLocale`. Provider and curation manifests retain their independent version
`1`. Unknown fields and unsupported versions fail validation. Shared Zod schemas
in `store.ts` compose the localization/review/attribution contract from
`store-localization.ts`; inferred types and exports remain in
`@egohygiene/schemas`, not a second app model.

`store-migrations.ts` accepts v1 solely through an explicit migration, with the
reviewed source language supplied by the caller. The CLI writes a new v2 envelope
without overwriting its input or existing output; it does not silently migrate
loaders or rewrite individual authoring files. Restore the retained v1 inputs and
compatible consumer/schema code together on rollback. Compatible optional/defaulted
v2 additions must preserve existing v2 fixtures; breaking changes need the next
version and an explicit migration. Future digital or license offers need a reviewed
product/purchase contract and delivery/terms policy under the same version policy;
v2 does not implement them. See [catalog authoring](../store/catalog-authoring.md#schema-changes)
for the runnable migration and [ADR 0010](decisions/0010-versioned-catalog-localization.md)
for the durable contract. #55's validated public projection remains the build boundary.

The portable import checker follows transitive imports from the store profile,
including these shared schema modules. It permits Zod for schema validation,
rejects application imports from schemas, and keeps provider adapters out of the
domain. The module inventory grows with imports; it is not a fixed allowlist of
schema filenames. File discovery, migration file output and artwork checks remain
in Node tooling rather than the portable schemas.

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
`src/i18n/resources.ts` supplies the source namespaces, with Fourthwall preview
copy included only by the isolated preview build. The existing
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
and recover from storage denial. [Checkpoint B](../store/locale-service-64b.md)
connects the existing data router through app composition to one browser locale
provider, native language selector and `html lang`/`dir`. Internal `LocaleLink` /
`LocaleNavLink` consumers retain explicit/non-source selection without changing
canonical domain paths or external destinations. Only selecting a language saves
a preference; opening a shared URL does not overwrite it. Back to an unqualified
URL resolves the current saved preference.

[Checkpoint C](../store/locale-review-64c.md) implements the message inventory,
translation review workflow and browser journey definitions. `check-locales.ts`
discovers all English namespaces, including isolated preview copy, and checks
message keys, string shape, placeholders, cardinal plural categories and required
`_other` forms. Partial dictionaries report source/category fallback. Deterministic
source and translation hashes bind human message-review records; future production
locale directories require a current review, while external candidate directories
can be checked before review. Actual Chromium execution remains deferred to the
final #37 qualification phase. The validator and journey definitions do not count
as a passing browser run.

Actual new public languages require reviewed dictionaries, registry entries and
a catalog mapping supplied by app composition. Missing partial dictionaries use
source fallback. The production selector currently lists English only.
#65 A / #34 establish the v2 catalog contract below; #65 B will connect catalog
fallback/rendering and search to this existing locale service. Preserve canonical
IDs, stored currency codes, asset paths and provider destinations. Language
selection must not imply a new currency or shipping country. #22 owns
crawler-visible locale/canonical outputs before multilingual publication.

## Add catalog translations or attribution

Keep translations on the existing canonical entry, with its actual source language
in `sourceLocale`. Optional `translations` default empty and cover only supported
presentation fields. Creative names may stay untranslated. Image alt text and
placeholder labels must match the artwork kind; unavailable copy and variant
labels must match the product's purchase state and canonical variant IDs.

Each translated field starts as draft. A reviewed field binds exact source/target
language and text, plus artwork revision or variant ID where applicable, with a
public reviewer ID and date. Changed bindings become stale; applicability errors
remain validation failures even on drafts. `inspectStoreTranslations` reports
present fields, and `toPublicStoreCatalog` removes draft/stale fields after full
validation. Current reviewed fields retain their review bindings for downstream
revalidation. These are exact catalog snapshots, separate from the interface
message hashes described above. Keep private contacts, business records and rights
evidence out of all review metadata: the authoring repository and public projection
are public. Structurally valid metadata cannot establish identity or translation
quality.

Attribution defaults to `status: "unknown"`. A supported public declaration can
name creators and/or rights holders through existing artist or brand context IDs.
References must be unique per role, of the right kind and respect visibility.
Context membership and artist/song/collection selection remain discovery data;
they never infer ownership or approve selling. All migrated records keep unknown
attribution until a supported declaration is authored.

Source catalog fields still render unchanged in checkpoint A. Selected-language
rendering, deterministic fallback and multilingual search remain #65 B; no public
language is enabled by adding translation data. See the
[catalog checkpoint](../store/catalog-localization-65a.md) and
[authoring examples](../store/catalog-authoring.md#catalog-translations-and-attribution).

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

Use pinned Node `24.21.0` and pnpm `11.28.5` (Node range `>=24.21.0 <25`). Choose
focused type/contract checks and relevant unit tests for the changed behavior;
preserve normal-build exclusion of preview routes and synthetic fixtures.
On 2026-10-20, Alan deferred Chromium execution, unrelated refactoring and broad
lint/testing/CI repair to the final #37 qualification phase, coordinated with
#29/#52/#49/#70. This changes execution order, not the passing criteria or evidence.

The final full profile includes `pnpm typecheck`, `pnpm catalog:test`,
`pnpm test:unit` and `pnpm check`. For preview interaction, build with
`task build:store` before `pnpm test:store:preview`. [Local preview](../store/local-preview.md)
describes the build isolation and runtime setup. Record exact commands and results;
local checks are not hosted CI or production qualification.

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
