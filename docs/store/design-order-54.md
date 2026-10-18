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

## Checkpoints B and C: implementation and evidence

[Draft PR #81](https://github.com/egohygiene/egohygiene.io/pull/81) contains A's
contract at `2d01f0ffccfc4b380fb899a87e1da22d652eaf40`, B's selector and Node
regressions at `df20d8626ffe96bcf1e3e87a30c68f29252bef05`, and C's component
regressions at `24d27ee31a72414dc7168ef5e2acd60e37b62ceb`. That C tree is
`d027e73fbc2e5d824cf9314337b6eb4b8aeef933` and matches the locally verified
implementation plus A's documentation. This later receipt changes docs only.

The selector indexes canonical entries by ID and walks the declared references.
The existing cards/pages already use its first result as the cover and its full
result as the gallery, so no runtime presentation change was required. Product
card ordering inside collections is outside this artwork-order contract.
The existing design fast path and visibility behavior remain unchanged; callers
still supply the validated public catalog. Defensive skipping in this selector
does not make invalid references valid at the authoring boundary.

Verified with Node 24.21.0 and pnpm 11.28.5; no dependencies or lockfile changed:

| Check | Result |
| --- | --- |
| New Node regressions against baseline selector | Four fail, one passes; reproduces product/fallback/filter ordering and filename-discovery defect |
| New Node regressions after fix | Five pass: declared order, multiple explicit and fallback designs, stable deduplication, identity/no mutation, visibility/validation, single/empty cases and actual source-file renames |
| `node --test tests/store/*.test.ts` (`catalog:test`) | 67 pass, including public-build and dev-server boundaries |
| Focused store/Fourthwall/artist unit suite | 55 pass across ten files, including six new real card/page/gallery permutations with original/reversed catalogs |
| `pnpm typecheck` | App, Node catalog and portable-domain types pass |
| `pnpm build` | Pass; 10 records, one image, 177 modules; JS 434.26 kB / gzip 130.03 kB |
| Portable import guard | All 12 source modules pass |
| New-test Biome checks and changed-line whitespace | Pass |
| Independent source/consumer review | No blocking findings |

The unit tests exercise canonical card navigation, matching initial gallery
cover, thumbnail order and selection/counter behavior, related-design links and
absence of a purchase link. JSDOM does not decode the fixture image URLs or prove
native modal/browser behavior.

A fresh browser run was attempted but blocked: no local Chromium was installed,
and Playwright's Chromium headless-shell download failed with an invalid/truncated
ZIP archive. No browser suite ran and no new screenshot, physical-device or
responsive-layout qualification is claimed. The earlier #62 evidence remains
historical. The isolated preview build was not repeated; its unchanged consumer
is included in the focused unit suite.

At source head `24d27ee`, hosted CodeQL and dependency review reported failure;
CI was still running when read. These are separate from the local passes and
were not investigated or bypassed here. Existing formatting/configuration work
remains separate. No workflow was manually dispatched and no gate was disabled.

All three #54 checkpoints are delivered for review, with the browser execution
limit recorded above. The PR is draft and unmerged, and #54 remains open pending
acceptance. Next: return to Alan before merging or choosing #37/#38. No catalog
content, real artist selections, artwork, purchases, provider settings or
deployment changed. The [continuity ledger](../context/provenance.md#54-declared-artwork-order-checkpoints-bc--2026-10-18-utc)
records this handoff.
