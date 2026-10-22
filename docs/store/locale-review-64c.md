# Interface message review and browser journeys — #64 checkpoint C

Date: 2026-10-20 UTC. [Draft PR #85](https://github.com/egohygiene/egohygiene.io/pull/85).
Alan selected C after B. Implementation and available local checks are saved;
**C acceptance remains open because actual browser execution is blocked.**
Branch `feat/locale-contract-64a` is still stacked on unmerged draft #83 at
`8a6258a1011569ac6e531fc124ccb0766f986389`. Main remains
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. No merge authority was added.

## Delivered

The existing message check now discovers every English namespace, including the
isolated preview: **376 messages across 10 namespaces**. It validates nested string
leaves, key shape, named placeholders, supported plural categories and `_other`
fallback. Partial dictionaries report source and category fallbacks explicitly;
unknown namespaces, keys and empty unknown groups fail. Intentional empty strings
and key-equal translations remain valid.

Deterministic source/translation hashes support a human review record for each
translated message. Changing either text invalidates its review; changing any
source plural form invalidates reviews of the whole family. Future dictionaries
in the production locale tree require current review records. Candidate checks
outside that tree can report unreviewed work, but never manufacture approvals.
The [authoring workflow](interface-message-workflow.md) covers adding/changing
messages, partial translations, stale reviews and separate public activation.
[ADR 0009](../architecture/decisions/0009-single-locale-runtime.md) records the boundary.

The existing qualification host now uses the actual `AppProviders` router binding,
with injected test-only English, expanded and RTL catalogs. Production defaults
remain English-only. Existing simulated locale component tests also use that
binding instead of duplicating it. The retained 35 layout cases now follow the
real service and locale-preserving URLs. Ten additional browser journeys cover:

- Native select keyboard/pointer use, filters/hash, canonical product navigation,
  direct reload and Back/Forward; saved preference and invalid/ambiguous URLs.
- Mobile selector focus/disclosure at 320/390 px; expanded and RTL content.
- Missing keys/catalogs, source grammar fallback, interpolation escaping, visible
  missing parameters, non-string lookup safety and all Arabic plural categories.
- Denied storage getter, read and write; gallery dialog focus, recovery and empty
  states; inert preview selection, amount, currency and product identity.

The host permits local GET requests only, rejects redirects and blocks every
WebSocket. Fictional preview actions never contact a provider. These are authored,
statically reviewed journeys, **not executed browser evidence at this revision**.
The existing qualification profile now includes message tool types, review tests,
catalog validation and app locale/shell/page units, then the extended browser step.
It has 16 steps; no complete profile pass is claimed here.

## Exact source and local verification

Source `4ad0dcb90c8190b5b151eb29a6f7cc72f7895444`, tree
`1e789c79674e3c19719fe83afccb5428ac55023b`, matches the published/local source.
The final verification began clean; this subsequent commit records evidence/docs.

| Check | Result |
| --- | --- |
| Message validator/review regressions | 15 passed |
| Catalog/artifact contracts | 79 passed |
| Locale and existing consumer units | 162 passed across 23 files |
| Site semantic component checks | 3 passed |
| App/catalog/domain/browser/message-tool/i18n types | Six profiles passed |
| Portable boundary and scoped Biome | 12 modules / 12 files passed |
| Four runner syntax checks | Passed |
| Fresh normal and isolated preview builds | Both passed |
| Normal artifacts | 16 files, 12 references, zero findings |
| Browser test discovery | 70 normal + 6 preview definitions listed; not run |
| 35 layout + 10 locale browser journeys | Blocked before first page |

[Exact commands/results](reviews/locale-review-64c/checks.json),
[message inventory summary](reviews/locale-review-64c/message-inventory.json),
[artifact inventory](reviews/locale-review-64c/artifacts.json) and
[browser blocker](reviews/locale-review-64c/browser-blocker.json) are retained.
The source message hash is
`050792a0940ca18104362a54059dc99bbed56fad47efe2d45c8a3c9fe0acbf4a`.
Inventories contain no translation approvals. Independent review found one empty
unknown-group validation gap, fixed with a regression; no source blocker remains.

The first artifact invocation supplied an output path outside its required
`test-results/store-qualification/` directory. Correcting the command passed;
no source or guard changed. Both invocations are recorded. Existing Node/Vite
module-loader notices remain. Scoped Biome has no diagnostics. Total artifacts are
942,190 raw / 577,797 level-9 gzip bytes, within the existing **provisional** ceilings.
Heartburst bytes match; no catalog, schema, artwork, dependency or provider change.

## Browser and hosted limits

The local Vite server starts, but Chrome for Testing 155.0.8059.84 aborts during
process-singleton initialization: `socket() failed: Operation not permitted (1)`.
No page opens and no case or screenshot completes. The supported cloud browser
also cannot reach this loopback server (`ERR_CONNECTION_REFUSED`). No permission
bypass, deployment or tunnel was introduced. Simulated DOM tests, source review
and historical screenshots cannot establish current keyboard/touch, reload/history,
denied-storage or expanded/RTL layout behavior. Normal/preview browser smoke and
the full qualification profile were not executed successfully at this source.

Hosted source [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39441196907),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39441198023)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39441197808) failed.
CI installed successfully, failed repository formatting, then skipped downstream
validation. Other failure causes were not re-diagnosed. No gate was disabled or
workflow manually dispatched. Local passes are not hosted or production qualification.

## Resume

Refresh GitHub and use a supported Chromium environment with the pinned runtime.
Run `node tests/storefront-qualification/run.mjs --output-dir test-results/locale-review`
for the 35 layout and 10 locale journeys; inspect the resulting captures and fix
any actual failures. Then run `node scripts/qualify-store.mjs` with fresh builds
for the normal/preview/checkout regression evidence. Retain native zoom, assistive
technology, physical-device, other-engine and deployed/provider limits separately.

Keep C and #64/#37 open until the missing evidence is available. Sync before
starting the coordinated #65/#34 slice. Review #83/#85 separately; merge only when
instructed and reconcile/retarget #85 after #83. English remains the sole public
language, real artist selections remain empty, providers remain disabled. No merge,
deployment, account/product activation, purchase or spending occurred.
