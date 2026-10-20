# Interface locale contract — #64 checkpoint A

Date: 2026-10-20 UTC. [Draft PR #85](https://github.com/egohygiene/egohygiene.io/pull/85). Branch: `feat/locale-contract-64a`, stacked on draft #83's
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

Tested implementation: `bd217fed480fbc6124ad4bf0e23865605c8ef0c7`, tree
`2bf0ba9db2b66da881bc4e61168083179c2d5070`. The published tree equals the local
tree. The final run began clean. [Exact commands/results](reviews/locale-contract-64a/checks.json)
and [artifact inventory](reviews/locale-contract-64a/artifacts.json) are retained.

| Check | Local result |
| --- | --- |
| Locale contracts and existing shell/store/preview consumers | 128 tests across 19 files passed |
| Application and i18n package TypeScript profiles | Both passed |
| Portable store import boundary | 12 modules passed |
| Scoped Biome | 11 files passed; one informational bracket-key suggestion retained |
| Fresh normal Vite build | Passed |
| Existing artifact guards | 16 files, 12 references, zero findings |
| Independent source review | No blocking finding |

Node 24.21.0, pnpm 11.28.5, TypeScript 5.9.3, Vitest 4.1.11, Vite 8.2.0.
The pinned environment was recovered through the existing frozen-lockfile setup;
install hooks remained disabled. No dependency or lockfile change. Existing
Vite future-loader and Node module-type notices remain. Biome's informational
`parameters["count"]` suggestion conflicts with the current TypeScript
`noPropertyAccessFromIndexSignature` requirement, so the safe source remains.

The first artifact invocation stopped because its output directory was outside
the scanner's permitted `test-results/store-qualification/` tree. Correcting only
that output argument produced the passing scan; the report retains both attempts.
No scanner gate was changed. This was an invocation error, not an artifact defect.

Output totals are 929,781 raw / 575,609 level-9 gzip bytes, within the existing
**provisional** review ceilings. The approved Heartburst image is byte-identical;
preview fixture/route markers remain excluded. These measurements are not a
network-performance or launch-budget acceptance. No new browser journeys,
broad lint run or remote workflow dispatch was performed.

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

## Hosted readback at the tested source

[CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39369768853),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39369768913)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39369769095)
failed. CI installation passed, formatting failed, later validation steps were
skipped. Dependency-review/CodeQL causes were not re-diagnosed in this checkpoint.
No gate or setting was disabled and no workflow was manually dispatched.

## Roadmap hierarchy evidence

The authorized GitHub UI update completed all 13 native children on #84 while
preserving #31's eight children and closed history. The [captured native hierarchy](reviews/locale-contract-64a/roadmap-subissues.jpg)
comes from the actual issue page on 2026-10-20, without image editing. Final API
readback matches the exact intended child set; the issue links and roadmap notes
were also read back after updating. This is GitHub organization evidence, not an
application screenshot or browser qualification result.

Screenshot SHA-256: `0d3f5d25a1ba97876c6a3ee522ea07c531a81b0a534b3f320b0cb98de6ce4200`.
