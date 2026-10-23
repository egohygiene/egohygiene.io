# Extending the current store

Start with [dependency rules](dependency-rules.md). The public store domain entry
is `apps/egohygiene.io/src/features/store/domain/index.ts`; it is app-owned source,
not a published package. [ADR 0005](decisions/0005-portable-store-domain.md) records
why this checkpoint adds a provider adapter without adding a framework or engine.

## Data and state ownership

| Data / state | Authority | Consumer behavior |
| --- | --- | --- |
| IDs, slugs, artwork revisions, design/product/context relationships | Validated catalog v3 | Derive views through selectors; never replace IDs with provider IDs |
| Source copy, translations and their review bindings | Canonical entry with explicit `sourceLocale` | Public projection retains current reviewed fields; pure content selectors resolve presentation fields for the selected language |
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

Current catalog parsing accepts version `3` only. Provider and curation manifests
retain independent version `1`. Unknown fields/versions fail validation. Shared
Zod contracts in `store.ts`, `store-localization.ts` and `store-readiness.ts` own
the inferred types. Reviewed live routes bind the exact offer, variant labels and
mapping, artwork revision/image source, optional displayed price and three customer
policy/support links. Missing, unreviewed or stale qualification fails publication
and runtime purchase validation; successful actions carry the reviewed disclosures.
Dates are provenance, not an automatic time-to-live. External facts still need
human requalification. See [ADR 0011](decisions/0011-reviewed-product-readiness.md)
and [onboarding workflow](../store/product-readiness.md).

`store-migrations.ts` retains explicit adjacent v1→v2 and v2→v3 functions. The CLI
writes a new v3 envelope without overwriting input. The second step refuses legacy
live products rather than manufacturing readiness; retain and deliberately review
those inputs before requalification. Restore compatible code/data together on
rollback. See [catalog authoring](../store/catalog-authoring.md#schema-changes).
Future digital/license products need their own reviewed delivery/terms contract;
no download purchase capability is introduced here. #55's public projection remains
the browser build boundary.

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

For a fixed page, declare its path, existing message keys and explicit publication
disposition in `src/content/publication.ts`, then add its component to the fixed
page map in `src/app/router.tsx`. Both browser and static adapters reuse this route
tree under `RootLayout`. Dynamic routes need a matching generated inventory and
expected route identity; new browsable catalog IDs require an explicit indexing
disposition. The app supplies theme/i18n providers. Add new leaf message keys to
the English dictionaries and use the same key in the page. Follow ADR 0012 for
synchronous rendering, public inputs and deterministic first hydration.
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
reviewed catalog content. Missing partial dictionaries use source fallback. The
production registry and selector still enable **English only**; adding translation
records does not activate a locale. #65 B connects catalog rendering and search to
this existing service through `features/store/useStoreContent.ts`. It supplies the
selected content `id` and ordered registry fallback IDs to the portable resolver,
while `useI18n().locale` remains the selected `formatLocale`. Isolated consumers
without the website service use their runtime locale and each entry's source,
without inventing an additional registry or implicit regional fallback.

Preserve canonical IDs, stored currency codes, asset paths, variant mappings and
provider destinations. Prices format their declared numeric amount/currency using
the selected formatting locale; there is no exchange-rate conversion, currency
selector or shipping-country inference. The supported minor-unit currencies keep
the existing two-decimal policy. Counts use the existing number formatter; future
actual dates should use the existing date formatter rather than invented catalog
date fields. Provider checkout totals, shipping, tax, regional eligibility and
checkout language remain provider authority and require #38 evidence. #22 owns
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

`getStoreEntryContent(entry, selection)` in the portable domain returns only
presentation fields as `{ value, locale }`, with variant labels retaining their
canonical `variantId`. It does not clone or rewrite a canonical entry/catalog.
Keep the original entry for relationship selectors, canonical paths, purchase
validation and provider normalization; use the returned fields for visible copy,
artwork alternatives and client metadata inputs. Changing selected language must
not invalidate review bindings by replacing the source fields being reviewed.

Resolution is per field: selected content locale, explicitly declared fallback
locales, then the entry's own `sourceLocale`, with stable deduplication. The source
wins whenever it is first encountered, including before later configured fallbacks.
Missing, draft and stale translations fall through to the next eligible source;
only current reviewed fields can display. There is no implicit region matching.
Consumers retain the resolved `locale` and apply per-field `lang`, so untranslated
creative names and fallback descriptions have accurate language metadata.

Pass the same `StoreContentSelection` into `filterStoreEntries` for catalog and
artist search. It searches resolved titles/descriptions of the entry and related
public designs/contexts, plus original creative titles as source aliases. It does
not index every translation or replaced source description. Unicode normalization
is NFKC, followed by explicit selected-language casing and NFKC again; diacritics
remain meaningful. There is no implicit transliteration or accent removal.

See the [contract checkpoint](../store/catalog-localization-65a.md),
[rendering/search checkpoint B](../store/catalog-localization-65b.md),
[ADR 0010](decisions/0010-versioned-catalog-localization.md) and
[authoring examples](../store/catalog-authoring.md#catalog-translations-and-attribution).
[C's reusable integration fixtures](../store/catalog-localization-65c.md) and
[first-language review checklist](../store/catalog-language-review.md) are retained.
Actual Chromium and broad qualification stay deferred to final #37. These content APIs
and local checks do not constitute human language review or public activation.

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
