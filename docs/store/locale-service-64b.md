# Interface locale service — #64 checkpoint B

Date: 2026-10-20 UTC. [Draft PR #85](https://github.com/egohygiene/egohygiene.io/pull/85).
Branch: `feat/locale-contract-64a`, stacked on unmerged draft #83's
`test/store-qualification-37` at `8a6258a1011569ac6e531fc124ccb0766f986389`.
Alan explicitly selected checkpoint B after reviewing A. No merge, checkpoint C,
deployment or new public language was selected.

## Delivered behavior

The app subscribes to its existing data router and supplies current search state
to one `LocaleProvider`, which composes the existing shared `I18nProvider`.
There is no second translation engine or feature-level locale store.

- Valid URL `lang` wins over a valid saved `egohygiene.locale` preference, then
  source English. Unknown, malformed and repeated values follow the fallback
  policy from [ADR 0009](../architecture/decisions/0009-single-locale-runtime.md).
- A labelled native language select uses the registry. Selection writes an
  explicit URL, keeps pathname/filter/hash, and requests no scroll reset. Storage
  getter/read/write failure is recoverable. Only an explicit user selection saves
  a preference; opening another person's URL does not overwrite the saved choice.
- `html lang` uses the selection ID; `dir` comes from its declared direction.
  Formatting uses the separate `formatLocale`. Attributes restore on unmount.
- `LocaleLink`/`LocaleNavLink` retain active explicit/non-source selection in
  internal URLs, including source English selected explicitly. An explicit valid
  locale on a destination is honored. Absolute/external destinations are unchanged.
  The implicit English baseline retains its existing clean canonical paths.
- Same-page language changes preserve selector focus and the mobile disclosure.
  Path changes still close the disclosure. Back/Forward derives selection from
  the current URL. **An old URL without valid `lang` resolves the current saved
  preference**, not a historical language snapshot. Explicit locale URLs restore
  deterministically. This is the selected precedence, not a hidden session store.
- Messages are bundled synchronously; there is no new remote loading request.
  Missing partial catalogs/messages use the declared source fallback. A missing
  source catalog is a configuration error, not a fabricated loading state.

English is still the only production registry entry. Expanded and Arabic-number/
RTL examples exist only in tests; neither is an approved public translation.
The production language control therefore currently has one English option.

## Interface and content scope

Shell, static/recovery pages, catalog/detail/gallery, artist views and the isolated
Fourthwall preview use messages for interface headings, controls, accessible names,
status/empty/error copy and client metadata. Complete result messages use cardinal
plurals and named parameters; displayed counts use the selected formatting locale.
The existing catalog, brand/artist/design/product titles, descriptions, artwork alt
text, unavailable reasons and provider payload values remain authored content.
Their translations belong to #65/#34, not an automatic rewrite of the catalog.

Prices follow the current formatting locale with their existing provider-declared
currency and amount. Locale does not select currency, country, offer, product,
provider or purchasing eligibility. Internal link decoration does not change
portable canonical path helpers. External checkout URLs remain byte-for-byte data.
Horizontal navigation arrows mirror intentionally; diagonal/external arrows and
artwork do not. Existing logical spacing is extended in the touched store styles.
Gallery grouping now uses a native fieldset without changing gallery order/state.

`PageMetadata` handles translated client titles/descriptions on static/recovery
pages; store metadata uses a complete title template. This is not crawler-visible
HTML, hreflang or #22 completion. English-only heading line breaks/emphasis were
removed where they divided one message; natural wrapping needs C's visual review.
The preview's message namespace shares the existing compile-time preview boundary.
No preview dictionaries/fixtures or synthetic languages are activated in production.

## Verification and exact revision

Tested source: `ec7bcc1629fd5261dddd2182597f10affadc9140`, tree
`665d4853f7b565b3584dbac48dd6f21ce862c17c`. Published tree equals the local source.
The final focused verification began clean at this commit. This receipt is in a
subsequent documentation/evidence-only commit.

| Check | Local result |
| --- | --- |
| Locale and existing shell/store/preview units | 143 passed across 22 files |
| Existing site semantic component checks | 3 passed |
| Application and shared i18n TypeScript profiles | Both passed |
| Portable store import boundary | 12 modules passed |
| Scoped Biome | 46 files passed; two existing warnings |
| Fresh normal and isolated preview builds | Both passed |
| Normal artifact guards | 16 files, 12 references, zero findings |
| Independent source review | No remaining blocking finding |
| Actual Chromium journeys | Blocked before browser startup |

[Exact commands/results](reviews/locale-service-64b/checks.json) and
[artifact inventory](reviews/locale-service-64b/artifacts.json) are retained.
Meaningful new tests cover URL/preference priority, translated/source fallback,
formatted counts, selector focus, filter/hash retention, simulated Back/Forward,
denied storage getter, URL remount, document attribute cleanup, actual app-router
binding, complete message interpolation, client metadata updates and price/handoff
preservation across locale changes. These use a simulated DOM/router, not a browser.
The review found one raw artist-preview return link; it was fixed and included in
the final pass. Intermediate agent runs encountered unwired imports/message catalogs
while parallel edits landed; final source verification passed without retries.

Node 24.21.0, pnpm 11.28.5, TypeScript 5.9.3, Vitest 4.1.11, Vite 8.2.0,
Playwright 1.62.1. Recovery used the existing frozen-lockfile/ignore-scripts setup.
No dependencies, lockfile, framework, schema or private artwork changed. Existing
Vite future-loader/Node module-type notices and the catalog complexity/CSS selector
specificity warnings remain. No broad lint run or manual remote workflow dispatch.

The normal output totals 942,164 raw / 577,788 level-9 gzip bytes. All existing
**provisional** review ceilings pass. The approved Heartburst image is byte-identical;
preview routes/fixtures and synthetic text markers remain excluded. These are local
artifact checks, not network performance or accepted launch budgets.

## Browser and hosted limits

Chrome for Testing 155.0.8059.84 was recovered, but a plain Playwright launch fails
because this execution environment denies `socket()` during process-singleton
initialization (`Operation not permitted`). No page can open. Normal/preview smoke,
actual keyboard/touch, reload/history, expanded-text and RTL visual journeys were
therefore **not run at this source**. No screenshot or browser-success claim is made.
Retained earlier browser evidence remains historical and cannot qualify this change.

At this source, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678218),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678217)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678404) failed.
CI installation passed; repository formatting failed and later validation was skipped.
Dependency-review/CodeQL causes were not re-diagnosed. No gate was disabled.
Local passes are not hosted CI, deployed-host or real-provider qualification.

## Resume / checkpoint C

When C is selected, reuse the current service and existing test-only qualification
host to exercise actual locale switching, URL reload/Back/Forward, missing/partial
messages, denied storage, long labels and RTL at the supported widths. Resolve the
browser environment first; do not replace those journeys with more simulated tests.
Add the repeatable key/placeholder/source-change review workflow. Update the fixture
host to use the same locale service; the older host tests only the shared runtime.

For a future reviewed language, add its registry definition and partial dictionary
mapping in app composition. Keep source fallback explicit; do not copy every source
message to conceal omissions. New interface messages belong in the English namespace
and use complete `t(key, parameters)` calls. Source review and translations must be
human-reviewed before public registry activation. C will make this workflow executable.

#64/#37 remain open; #65/#34 and release/provider qualification remain later owners.
#85 remains draft on #83 and needs reconciliation/retargeting after any authorized
#83 merge. No merge, deployment, account/product activation, checkout contact,
purchase or spending occurred.
