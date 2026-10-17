# ADR 0008 — Curated storefront views over one catalog

- Date: 2026-10-17
- Status: Proposed implementation for #62 checkpoint A; brand hierarchy approved
  in the maintainer discussion. Draft review precedes checkpoint B.
- Scope: Website-owned storefront under ADR 0007.

## Context

Ego Hygiene is the primary store identity. Incompris is a featured creative
collection, with `.play()` planned as an artist within it. Automatically listing
all future song merchandise on the main store would overwhelm that identity.
The current catalog also includes fictional demonstration entries and one
approved public heartburst artwork proof; it contains no real approved garments.

## Decision

Use a separate, strict version-1 `storefront-curation.json` manifest with ordered
canonical entry IDs for Ego Hygiene, Incompris and the smaller featured Incompris
selection. Selection is editorial placement, not artist attribution, ownership,
new product identity or permission to sell. Featured IDs must belong to the
Incompris selection. IDs must resolve to public designs, products or collections;
missing, duplicate, context-only and draft references fail validation.

The Node authoring boundary validates catalog and curation together before the
Vite adapter exposes them through `src/content/store/index.ts`. The existing
catalog schema remains version 1 without new required fields. Custom catalog
fixtures have empty curation unless explicitly supplied. The portable selector
returns canonical entries in declared order; React owns presentation and routes.

`/store` shows the curated primary shop and a manual horizontal featured row.
`/store/incompris` shows the selected Incompris entries. `/store/catalog` retains
the complete, explicitly labelled preview browser, including fictional examples.
Old `/store` filter links (`q`, `view`, `story`) and catalog section hashes redirect
to that browser with their query/hash intact. Existing product, design and
collection URLs stay canonical. One entry can appear in multiple views without
copying it or changing its purchase state.

## Consequences and alternatives

- Empty selections produce useful upcoming states. Do not fill them with invented
  garments, fake artists or unreviewed private assets.
- The initial heartburst selection is an artwork preview. Its context list stays
  empty and it has no associated garment; placement does not assign it to `.play()`.
- Catalog collections alone cannot express a mixed manual feature order without
  another ordering contract. Separate lists keep this small editorial concern out
  of product/provider and attribution schemas.
- This deliberately does not add a generic page builder, artist directory, cart,
  runtime cross-repository fetch, provider service or independent store deploy.
- Checkpoint B owns artist/song discovery. Broader routing and content taxonomy
  changes should evolve this contract through review rather than infer membership.
- Unknown manifest versions and fields fail. Breaking changes need a migration;
  rollback restores compatible code/content together. Existing catalog entries,
  purchase approvals and asset provenance are unchanged.

## Evidence

[Issue #62](https://github.com/egohygiene/egohygiene.io/issues/62) records the agreed
A/B/C checkpoints. [Checkpoint review](../../design/storefront-62a.md) and the
[context ledger](../../context/provenance.md) record delivery and verification.
