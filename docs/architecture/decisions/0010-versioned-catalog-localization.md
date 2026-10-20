# ADR 0010 — Versioned catalog localization and explicit attribution

- Date: 2026-10-20
- Status: Implemented for #65 A / #34 in a draft checkpoint; review pending.
- Scope: Portable catalog data, publication, and migration. Selected-language
  rendering/search follow in #65 B; browser qualification is deferred to #37.

## Context

The v1 catalog stores presentation text alongside canonical identities, artwork
references and purchase mappings. #65 requires reviewed translations without
forking merchandise. #34 still needs explicit attribution distinct from discovery
placement and an actual migration. #64 supplies one locale runtime; adding content
must not create a competing selection service or enable an unreviewed language.

## Decision

Use one catalog/entry version, now **2**, with required canonical `sourceLocale`
and optional/default-empty inline `translations`. Existing title, description,
artwork and availability fields remain the source-language content. Inline records
keep an entry's source, translations and review changes in one reviewable file;
referenced translation storage is unnecessary for the current catalog size.

A translation may contain only title, description, artwork alt/placeholder label,
unavailable reason, and labels keyed to existing canonical variants. Fields must
apply to the entry's kind and current purchase/artwork state. IDs, slugs, paths,
artwork assets, currency, purchase state, provider IDs and routes are not translated.
A creative name falls back unchanged unless its own localized form is reviewed.

Each translated field is draft or explicitly reviewed. Review records bind the
source and target locale, exact source and translated value, public reviewer ID
and calendar date. Artwork fields also bind `artworkRevision`; variant labels bind
canonical `variantId`. Editing a bound value makes that field stale, including
moving an approval between same-labelled variants. No generated check approves a
translation. `inspectStoreTranslations` exposes draft/reviewed/stale diagnostics.
Missing, draft and stale fields fall back to source content; #65 B will connect
this policy to selected-language rendering and the registry's fallback chain.

The public projection validates **all** records and relationships before filtering.
It removes draft entries and draft/stale translation fields, dropping empty locale
records. Current reviewed fields retain their explicitly public-safe review
bindings so the same strict catalog type can be revalidated by curation and live
purchase boundaries. This deliberately duplicates some public source text. It
avoids a second catalog contract or an unauditable manufactured approval status.
Review IDs/dates and source snapshots are public; private contacts, contracts,
business records and artwork masters do not belong in these records or public Git.

Every entry defaults to `attribution: { status: "unknown" }`. An explicit
`declared` record names creator and/or rights-holder IDs referencing artist or
new brand contexts. References must exist, have the correct kind, be unique per
role, and respect public/draft boundaries. Context/collection/artist placement is
never used to infer attribution. A declaration is public attribution, not rights
verification or permission to sell. No real ownership claims are added here.

## Migration and rollback

Current parsers accept v2 only; v1 is accepted only by the explicitly exported
migration input contract and `migrateStoreCatalogV1(input, { sourceLocale })`.
The caller supplies the reviewed source language. The pure deterministic migration
allocates a new validated catalog, preserves entry/reference order and canonical
fields, and adds empty translations/unknown attribution. It never silently repairs
broken references or creates purchase approvals. v1 does not accept v2 brand or
translation/attribution fields. Unchanged field definitions are shared to limit
contract drift; future changes must preserve the supported v1 migration fixture.

The CLI writes a new envelope with exclusive creation and retains the input. It
never rewrites individual source files automatically. Review the resulting entries
and replace their corresponding authoring files deliberately. The ten existing
records were migrated using this API; original data remains in the parent revision.
Rollback restores compatible code and retained v1 data together. There is no lossy
v2-to-v1 downgrade for later translations/attribution. Future breaking changes add
an explicit adjacent migration; additive fields require safe defaults/omission.

## Consequences and evidence

Schema types remain inferred from Zod in the portable package. No new dependency,
framework, provider capability, public language, digital delivery or hosting is
introduced. Provider and curation manifests keep their independent version 1.
Existing canonical paths, declared cover order, checkout/artwork guards and disabled
real purchasing remain intact. See the [checkpoint receipt](../../store/catalog-localization-65a.md)
and [authoring policy](../../store/catalog-authoring.md#schema-changes).
