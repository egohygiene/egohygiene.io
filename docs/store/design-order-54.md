# Declared cover and gallery order — #54

## Checkpoint A: contract

Alan authorized #54 after accepting the schema audit. PR #79 merged at
`988b3598c7acaa2cfbd60ecb225e557137c10713`; branch `fix/design-order-54` starts there.
The existing selector collects IDs but emits designs in global catalog order,
so filenames can unexpectedly choose covers. This checkpoint fixes that behavior
in the existing portable selector and reuses the current cards and galleries.

1. A design displays itself.
2. A product resolves `designIds` in declared order.
3. A collection resolves its own `designIds` first, then each `productIds` entry
   in declared order, then that product's `designIds` in declared order.
4. Retain the first occurrence of each design; return canonical design objects.
5. Preserve public-design filtering and existing schema validation. A selector
   is not a validator or an artwork/purchase approval boundary.

The first resolved design is the cover; the complete list is the gallery.
Collection fallback adds product designs after explicit designs rather than
replacing them. Catalog discovery and file order are irrelevant to this list.
Empty and single-design behavior remains compatible. No new field, catalog
version, migration, dependency or real artwork is needed.

The durable rationale is in [ADR 0005](../architecture/decisions/0005-portable-store-domain.md#artwork-reference-order--54).
Authoring steps are in the [catalog guide](catalog-authoring.md#cover-and-gallery-order).

## Checkpoints B and C

Pending at this contract checkpoint: implement once in the portable selector;
prove explicit and fallback ordering, overlap deduplication, reordered source
files, unchanged single-design behavior and card/gallery consumption locally.
Publish each checkpoint to the same draft PR. No #54 merge, deployment, real
purchase, provider activation or next-issue work is authorized by this receipt.

The [continuity ledger](../context/provenance.md) records publication and exact
implementation revisions. Historical #79 local results do not verify #54.
