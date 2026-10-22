# Catalog localization checkpoint A — #65 / #34

Recorded 2026-10-20 UTC. Delivered in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86),
source `879af7ebf9ffafe5467da892aef2c0eb78e87055`, tree `f5855f7f768c4863a5a6b3149e83802637a901af`. This checkpoint implements the data contract and explicit
v1-to-v2 migration. Selected-language rendering/search is checkpoint B; this does
not publish translations or qualify a browser/provider. Delivery and exact source
revision are recorded in [current state](../context/current-state.md) and the
[provenance ledger](../context/provenance.md).

## Delivered contract

- Catalog and entries use version 2 with required canonical `sourceLocale`.
  Inline `translations` default empty; attribution defaults explicitly unknown.
- Translation records cover presentation fields only. Per-field draft/reviewed
  records bind source/target language and values, artwork revision or variant ID
  where applicable. Stale fields are diagnosable and excluded from public output.
- Public projection validates malformed drafts before exclusion and retains only
  current reviewed fields. Public-safe review bindings remain for strict downstream
  revalidation; do not put private evidence or contacts into them.
- Declared creator/rights-holder references target artist or brand contexts and
  stay independent of song, collection and shop placement. All ten shipped entries
  remain unknown; no real rights or product claim has been invented.
- The explicit pure migration and non-overwriting CLI preserve identities, order,
  artwork revision, paths, purchase states, prices and provider variant mappings.
  Current loaders never auto-migrate. See [ADR 0010](../architecture/decisions/0010-versioned-catalog-localization.md).

## Authoring a partial translation

This is a **synthetic format example**, not approved French copy or a real human
review. On a collection whose source description is `Fictional collection.` and
`sourceLocale` is `en`, merge the following fields into the existing record:

```json
{
  "translations": [
    {
      "locale": "fr",
      "fields": {
        "description": {
          "value": "Collection fictive.",
          "review": {
            "status": "reviewed",
            "locale": "fr",
            "reviewedBy": "synthetic-reviewer",
            "reviewedAt": "2026-10-20",
            "source": { "locale": "en", "value": "Fictional collection." },
            "value": "Collection fictive."
          }
        }
      }
    }
  ]
}
```

The untranslated title stays the original creative name. Products use the same
title/description contract without copying products or translating their IDs.
Start real work with `review: { "status": "draft" }`; replace it only after an
actual human review with an authorized public reviewer ID and date. The public
locale registry remains English-only until separately reviewed and enabled.

For image designs, use `fields.artworkAlt`; its reviewed source additionally has
`artworkRevision` equal to the actual reviewed revision. Placeholder designs use
`artworkLabel`. Products currently unavailable may translate `unavailableReason`.
Live variants use `variantLabels: [{ variantId, value, review }]`; review source
also binds that `variantId`. These translate labels, never provider mappings.

After source edits, `inspectStoreTranslations(entry)` returns per-locale/field
`draft`, `reviewed` or `stale` status. Changed text, language, variant or artwork
revision must be reviewed again. Do not merely update the binding to make a check
pass. Missing, draft and stale fields use source-language content; B will wire the
selected-locale fallback resolver into UI/search/metadata inputs. A has no new
language selector or translation inventory command.

## Migration and rollback review

See [authoring: schema changes](catalog-authoring.md#schema-changes) for CLI and
supported-version policy. Run against a retained v1 envelope and write a new file.
The caller explicitly supplies `en` after reviewing the existing English source.
Check entry IDs/slugs/order, reference arrays, artwork paths/revisions, routes,
prices and variants before replacing the corresponding individual authoring files.
The shipped ten records were migrated through the exported API; originals are
recoverable from parent commit `9b308a88df4446d54e0558ed35d5dd0f0bbee37e`.
No provider routes or curation selections changed. Rollback restores that compatible
code/data pair; retain later v2 work separately rather than stripping its fields.

## Verification scope and remaining work

Focused contract tests cover strict locale/field/attribution validation, stale
reviews, immutable deterministic migration, preserved purchase identity and CLI
refusal to overwrite. Existing catalog/consumer tests and a real Vite emitted-file
check cover compatibility and exclusion of draft/stale translation sentinels from
HTML/JS/JSON/source maps. [Exact run results](reviews/catalog-localization-65a/checks.json): 104 catalog tests,
57 consumer tests, four type profiles, normal build and the 14-module boundary
passed. The published source tree matches the tested local source.

On 2026-10-20 Alan explicitly moved Chromium execution, unrelated refactoring,
repository-wide lint/testing and CI repair to the final **#37** qualification
phase, coordinated with #29/#52/#49/#70. #84 records the execution order. No browser
run, broad lint/qualification run, remote CI dispatch, hosting or provider change
is part of A. Historical blocked/failed checks remain open and are not passes.

Next: #65 B connects selected catalog language, deterministic source fallback and
Unicode search to the existing #64 service; format provider-declared prices without
converting currency. Then C adds bilingual/synthetic integration evidence and
first-language review guidance, retaining actual browser execution for final #37.
After #65/#34: #38 plus relevant #9 product-readiness/disclosure preparation, then
#22 public rendering/metadata, then the final validation/CI phase. Merge, deployment,
real commerce activation and spending still require their own authorization.
