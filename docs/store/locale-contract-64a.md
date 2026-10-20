# Interface locale contract — #64 checkpoint A

Date: 2026-10-20 UTC. Branch: `feat/locale-contract-64a`, stacked on draft #83's
`test/store-qualification-37` at `8a6258a1011569ac6e531fc124ccb0766f986389`.
The maintainer approved completing the native roadmap links and further bounded
progress while away. This checkpoint implements the next #64 foundation without
merging #83 or selecting a real additional public language.

## Delivered contract

[ADR 0009](../architecture/decisions/0009-single-locale-runtime.md) records the
runtime, fallback, plural/interpolation, URL and preference decisions. One shared
runtime remains authoritative; existing `t(key)`, `getMessage` and provider calls
remain compatible. The app supplies its source locale from a validated registry.

- Registry validates canonical IDs, declared directions/labels, formatting
  support, fallback references/cycles and deterministic source-last fallback.
- Translation fallback preserves empty strings and key-equal translations; safe
  own-property lookup still prevents namespace objects reaching React.
- Named plain-text parameters and finite-count cardinal plurals use the grammar
  of the dictionary supplying the actual message, including source fallback.
- Pure website helpers resolve `lang`, saved preference and source in order;
  ignore unsupported/ambiguous selections; preserve unrelated query filters;
  and survive denied storage reads/writes through injected callbacks.
- English remains the only public locale. No provider, catalog, artwork,
  dependency or lockfile change is needed.

## Authoring example

```tsx
const source = {
  results_one: "{{formattedCount}} result for {{query}}",
  results_other: "{{formattedCount}} results for {{query}}",
};

<I18nProvider locale="en" messages={source}>
  <Results />
</I18nProvider>

function Results() {
  const { t, formatNumber } = useI18n();
  const count = 2;
  return <p>{t("results", { count, formattedCount: formatNumber(count), query: "heart" })}</p>;
}
```

Production messages still come from `src/i18n/resources.ts`; the example is not
new catalog content. A missing parameter stays visible as `{{name}}`, and an
invalid count throws a configuration/caller error. No HTML or ICU messages are
parsed. Always render `t` as ordinary React text, never as HTML.

For a reviewed new language, register its ID, formatting locale, label, direction
and optional fallback references; supply its partial dictionary and the registry's
ordered fallback dictionaries to the same provider. Do not duplicate products or
implicitly change offer currency. Production registration requires reviewed copy;
pseudo/RTL examples stay in test fixtures.

## Verification

Results and exact implementation revision are recorded below after execution.
The focused profile covers shared lookup/registry/translation/provider behavior,
website preference policy, existing shell/store consumers, package/application
compilation and a fresh normal build. No broad lint run or remote CI dispatch.

## Remaining checkpoints and limits

A establishes executable contracts. It does not yet select language from browser
state or install an interactive language control. B owns that adapter, `lang`/`dir`,
Back/reload/navigation synchronization, remaining interface strings and accessible
selection. C owns browser locale/fallback/denied-storage journeys and the message
review/parity workflow. #65/#34 own localized catalog records and justified schema
migration; no public second language or complete end-to-end localization is claimed.

#37 remains open. Previous local browser evidence and failed hosted checks remain
historical; passing this checkpoint cannot turn them into hosted/production proof.
No deployment, account/product activation, provider contact or purchase occurred.
