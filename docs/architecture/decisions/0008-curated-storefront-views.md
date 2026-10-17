# ADR 0008 — Curated storefront views over one catalog

- Date: 2026-10-17
- Status: Proposed implementation for #62 checkpoints A and B; brand hierarchy
  approved in the maintainer discussion. Draft review precedes checkpoint C.
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
- Checkpoint B extends artist/song discovery as recorded below. Broader routing
  and content taxonomy changes should evolve this contract through review rather
  than infer membership.
- Unknown manifest versions and fields fail. Breaking changes need a migration;
  rollback restores compatible code/content together. Existing catalog entries,
  purchase approvals and asset provenance are unchanged.

## Checkpoint B extension — 2026-10-17

The maintainer authorized the next artist/song slice after reviewing checkpoint
A. Keep catalog schema version 1 unchanged. Add an optional `artists` array to
curation version 1, defaulting to empty for existing inputs. Each selection has
one public artist context ID, ordered `standaloneEntryIds` and ordered
`songCollectionIds`; both lists default to empty. Duplicate artist entries or
duplicates within a list fail validation. Explicit overlap between views and
between artists is allowed.

Standalone references accept public designs, products and collections. Song
references accept public collections with at least one **direct public song
context**. Membership is an editorial discovery relationship, not a claim about
authorship or rights. Artist attribution is not inferred from inherited product
contexts or from a collection's position. Existing optional catalog context IDs
retain their meaning and remain the content relationship mechanism.

`/store/incompris/artists/:artistSlug` presents standalone and song views with
search/view state in the URL. Song cards reuse `/store/collections/:slug`, so a
SoundCloud link can resolve directly to one canonical collection. No new song
record service, cross-repository fetch, duplicate product or custom return URL
protocol is needed. Canonical collections can link back to every explicitly
curated artist's song view; normal browser Back retains the prior filter.

The public `.play()` context starts with empty selections. A compile-time local
preview creates a fictional artist around existing demo records to prove shared
product identity across both views. Its route and fixture IDs are excluded from
the normal build. New garment approvals and real artist/song assignments remain
content decisions, independent from this functioning browse structure.

The contract is additive for old input manifests, but an older strict reader
will reject a new manifest containing `artists`. Rollback must therefore restore
code and content together, as with other strict contract changes.

## Evidence

[Issue #62](https://github.com/egohygiene/egohygiene.io/issues/62) records the agreed
A/B/C checkpoints. [Checkpoint A](../../design/storefront-62a.md),
[checkpoint B](../../design/storefront-62b.md) and the
[context ledger](../../context/provenance.md) record delivery and verification.
