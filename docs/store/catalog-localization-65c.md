# Catalog localization checkpoint C — #65

Recorded 2026-10-22 UTC after Alan selected C. Implementation is saved in
[draft #86](https://github.com/egohygiene/egohygiene.io/pull/86), source
`729513f2fef60cb7dd967cb7dfe2dde8d5330d24`, tree `84fe4c62da7170b0b505213163972000ac5afcd3`. The #83 → #85 → #86 stack remains
unmerged. This checkpoint reuses [A’s v2 contract](catalog-localization-65a.md),
[B’s presentation resolver](catalog-localization-65b.md), #64’s locale service,
and #37’s synthetic handoff boundary. It changes test/qualification inputs and
authoring guidance; production catalog, UI, locale registration and purchase
configuration remain unchanged.

## Reusable integration fixture

[Fixture inputs](../../tests/catalog-localization/fixture.ts) extend the existing
fictional handoff product and color swatch in a newly owned temporary directory.
The same public projection supplies Node contracts, simulated DOM integration and
an isolated browser artifact using the actual app router/providers/pages. There
is no production fixture switch or second catalog runtime.

Synthetic French and regional French cover reviewed text, missing fields, draft
copy, artwork-revision and source-text staleness. An untranslated creative collection
name contains accented and Japanese text. The expanded interface locale falls
back explicitly to French catalog text while using its separate formatting locale.
The test records are neither human translation approval nor real merchandise.
Real English-only registration and empty artist merchandise selections stay intact.

Checks follow catalog cards through canonical collection/product links, switch
language without changing paths, and verify field languages and client title/meta
inputs. Search covers decomposed accents, full-width letters, original creative
names and exclusion of rejected translation fields. Source changes demonstrate
review invalidation instead of manufacturing a new approval. Prices retain the
same declared USD amount and currency.

## Checkout scope

The fixture reuses the exact existing synthetic route, provider and canonical
variant mappings. Focused contracts exercise the retained request allowlist;
simulated DOM activation captures the unchanged link while preventing navigation.
The authored browser journeys use the existing deny-by-default interception boundary:
only local GETs may reach the local server, and the exact synthetic destination
is fulfilled locally. Mutating/other remote requests and WebSockets remain blocked.
No language parameter is appended to the approved destination.

**The product page has no variant chooser.** Unchanged variant mappings and an
exact external URL do not prove selected-variant arrival at a real provider. No
provider request, order, external checkout language or fulfillment is qualified.
Real provider capabilities and language limits must be rechecked under #38.

## Reproduction and deferred acceptance

Use the repository’s pinned Node/pnpm and installed dependencies:

```sh
node --test tests/store/catalog-localization-fixture.test.ts
pnpm exec vitest run --config vitest.unit.config.ts apps/egohygiene.io/src/features/store/CatalogLocalizationJourney.test.tsx
node tests/catalog-localization/run.mts --list
node tests/catalog-localization/run.mts --build-only --output-dir test-results/catalog-localization
```

The list command inventories authored cases only. Build-only validates the isolated
artifact/projection without launching Chromium. During final #37, run:

```sh
node tests/catalog-localization/run.mts --output-dir test-results/store-qualification/profile/catalog-localization
```

That browser step is also retained in the existing `scripts/qualify-store.mjs`.
It includes language navigation/fallback/search/metadata and exact synthetic handoff,
with long-text phone/tablet/desktop cases. Actual browser execution and capture
review remain deferred by Alan’s instruction, together with broad lint/testing,
unrelated refactoring and CI repair. No new browser or layout pass is claimed.
Client metadata checks do not establish crawler-visible output; #22 still owns it.
Mixed-language accessible names, keyboard/assistive technology and physical device
behavior require the later review.

## Evidence and next action

[Exact checks](reviews/catalog-localization-65c/checks.json) retain commands, log
hashes and corrected setup attempts. Final focused passes: **18 Node contracts +
9 simulated DOM cases**, five type profiles and runner syntax. Seven authored
browser definitions were listed, without executing them. The normal build passed;
[artifact guards](reviews/catalog-localization-65c/artifacts.json) found zero issues
across 16 files and 12 references, with Heartburst bytes unchanged. Total output
is 950,215 raw / 579,950 gzip bytes within existing provisional review ceilings.
The [isolated build-only report](reviews/catalog-localization-65c/build.json) records
nine files, two scanned text artifacts, five public fictional entries, excluded
draft/stale markers and **zero completed browser journeys**. Both builds ran at
the clean published source; the remote tree matches the tested staged tree.
Independent source review found no remaining blocker. Hosted outcomes are recorded
separately in the checks receipt and are not inferred from these local passes.
Automatic source CI `39804875457`, dependency review `39804875576` and CodeQL
`39804876445` failed. Status only was refreshed; causes/repairs remain deferred,
with no manual dispatch or disabled gate.

The necessary test-helper split separates pure catalog inputs from Node file IO,
retaining the existing handoff exports and regression checks. It does not refactor
production code. The authoring examples and diagnostic snippet were validated;
all real-language review checkboxes remain unchecked.

Read the [first-language authoring/review checklist](catalog-language-review.md).
Its real-language approvals are deliberately unchecked. No new schema, dependency,
framework, durable architectural decision or real content activation is needed.
ADR 0010’s existing contract stands.

C implementation is ready for review; browser acceptance remains open in #65/#37.
Next after sync is #38’s bounded readiness preparation with relevant #9 disclosures:
a reviewed activation record and synthetic eligibility guards before any real account,
artwork, product publishing or checkout activation. Then #22 and the final #37
validation/CI phase follow roadmap #84. Merging, hosting, spending and real provider
activation require their own authorization.
