# Catalog localization checkpoint B — #65

Recorded 2026-10-21 UTC (2026-10-20 maintainer session). Continued in
[draft #86](https://github.com/egohygiene/egohygiene.io/pull/86) after Alan selected
B. Source `34a807ef173b2ddd547e9735ee344b6ffeba4514`, tree
`3081417ada645b33e4976b8ffa8c5269a5204f1a`. The existing #83 → #85 → #86 stack remains unmerged. The [A receipt](catalog-localization-65a.md)
records the preceding v2 migration; this checkpoint uses that contract unchanged.

## Presentation and search

The portable `getStoreEntryContent` selector returns presentation text with each
field's actual language. It never constructs a translated `StoreCatalog`, changes
canonical records or supplies replacement data to purchase validation. Cards,
detail pages, context notes, artwork alt/placeholder text, galleries, artist
entrances and artist collections consume the same resolver. Metadata effects use
the resolved title/description while canonical path helpers keep original slugs.
These are client metadata inputs; crawler-visible output and hreflang remain #22.

`useStoreContent` adapts the existing website locale registry. Content uses the
selected locale ID; number/date/currency formatting keeps the configured formatting
locale. A synthetic test deliberately uses different content and formatting locales
to catch accidental coupling. No second locale service, language inference or
feature preference state was added. The public registry still enables English only.

For each field, the resolver tries the selected language, declared registry
fallbacks in order, then the entry's authored source language. Duplicate locales
are removed stably; there is no automatic regional fallback. If the source language
appears earlier in the configured chain, its original text wins there. Only current
reviewed translation fields qualify; missing, draft and stale fields fall through.
Separate fields may therefore use different languages. Visible text and artwork
use those language tags where applicable; this is not a screen-reader qualification.

Search consumes resolved title/description text for the entry and its related
public designs/contexts, with original source titles retained as creative-name
aliases. It does not index unrelated translations, unpublished fields or hidden
entries. Query and text use Unicode NFKC normalization and explicit selected-language
casing, including Turkish case rules. Composed/decomposed and full-width forms
match consistently. Accents are retained; this is substring search, not accent
folding, transliteration, stemming or a search service. Existing filters, declared
order and canonical result identities remain unchanged.

## Prices and provider boundaries

The existing `Intl` path formats provider-declared amounts using the selected
formatting locale and original currency. The five supported catalog currencies
retain their two-decimal minor-unit policy; there is no conversion, currency/region
selector or new currency support. No dated catalog field exists, so no date data
or control was invented; the shared date/number formatter remains in use.

Unavailable reasons and canonical variant labels have localized presentation
fields. The existing real-product page has no variant chooser; this checkpoint
does not add one. The isolated Fourthwall preview uses the localized canonical
product heading, but provider-owned options, IDs and price/stock data remain owned
by its adapter. Language selection does not rewrite provider URLs or inert handoff
payloads, determine shipping eligibility, calculate tax or promise an external
checkout language. Recheck real provider behavior under #38 before activation.

## Evidence and limits

The delivery receipt records the exact source revision, commands and results in
[checks.json](reviews/catalog-localization-65b/checks.json). Focused tests exercise
per-field fallback, stale/draft rejection at presentation, stable canonical inputs,
Unicode search, registry/format-locale separation, original checkout destination,
translated artwork/gallery text and source-language creative-name fallback.
Final results: 116 catalog tests, 73 consumer/service tests in 14 files, three
type profiles, the 15-module boundary and 377 messages across 10 namespaces passed.
Normal and isolated preview builds passed; the [normal artifact inventory](reviews/catalog-localization-65b/artifacts.json)
has 16 files, 12 asset references and zero findings. The remote source tree exactly
matches the tested local source. Independent review found no remaining source blocker.
Synthetic translation/reviewer records exist in tests only. No real catalog text,
artwork, rights claim, provider configuration or public language was changed.

Per Alan's standing instruction, **Chromium, broad lint/testing, unrelated
refactoring and CI repairs remain deferred to final #37 with #29/#52/#49/#70**.
No browser run, screenshot, full qualification profile, manual CI dispatch,
deployment or order is claimed. Hosted failures remain visible and unresolved.

Next after sync: checkpoint C's reusable bilingual/pseudolocalized catalog fixture,
canonical metadata/link integration and exact intercepted synthetic handoff checks,
plus first-language authoring/review guidance. Actual browser execution remains
with final #37. Then follow #84: #38 plus relevant #9, #22, and final validation.
