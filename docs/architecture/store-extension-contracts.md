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

The current entry points are `src/i18n/locales/en/*.json`, `src/i18n/resources.ts`
and `src/app/providers.tsx`. `I18nProvider` accepts `locale` and `messages`; it does
not discover locale directories or merge fallbacks. Its `t` reads dotted leaf
keys; missing translations currently expose the requested key.

For a small development example, pass an explicit dictionary and locale through
the existing single provider:

```tsx
const frenchExample = {
  ...resources,
  common: { ...resources.common, tagline: "Des idées et des pratiques pour trouver l’équilibre." },
};
// In AppProviders, replacing its existing I18nProvider:
<I18nProvider locale="fr" messages={frenchExample}>{children}</I18nProvider>
```

This explicitly retains English for unchanged keys; it is not a complete French
locale. For an actual locale, mirror the dictionaries, register them centrally
and implement/verify a leaf-level fallback policy and locale/direction selection
in #65. Update `lang`/`dir` at the app boundary. Pass provider locale into `Intl`
formatting; do not translate canonical IDs, stored currency codes or asset paths.
`check-locales.ts` currently checks only populated English files, not translation
parity. Existing store strings and `en-US` prices still need #65's migration.

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
