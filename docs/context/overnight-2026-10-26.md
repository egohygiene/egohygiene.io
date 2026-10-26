# Overnight review handoff — 2026-10-26

Alan authorized a few bounded issues while away, then licensing/review and merges
at the next sync. Main is still `89fc70440f9c3cf32d37a6da83c7a2b969efa97d`.
All work below is saved in GitHub drafts, with A/B/C receipts and exact sources.

| Review order | Draft and work | Tested implementation |
| --- | --- | --- |
| 1 | [#105](https://github.com/egohygiene/egohygiene.io/pull/105): #59 notices, provenance and inactive license alternatives | `e366e07b078070f805fd70d8036950ac81bd336e` |
| 2 | [#106](https://github.com/egohygiene/egohygiene.io/pull/106): #92 feature-local store cleanup, selector reuse, targeted Storybook update | `a5e99afb060da64928bcf38cc1901e3b34889bb7` |
| 3 | [#107](https://github.com/egohygiene/egohygiene.io/pull/107): #52 strict compiler scopes, fresh smoke, discovery and Taskfile commands | `47c25784b6853a415257a88150e2851d0b147e7a` |
| 4 | [#108](https://github.com/egohygiene/egohygiene.io/pull/108): #29 current formatting/lint, supported CodeQL and shared complete CI profiles | `bdc3565197f56c71f128488d7c39d74172dcfea7` |

The drafts are stacked in that order. Refresh live heads/checks before integration;
reviewing an earlier source is not qualification of a changed head. Old [#73](https://github.com/egohygiene/egohygiene.io/pull/73)
is still open. Its useful intent is ported in current form by #108; review proposed
supersession/closure rather than merging its stale conflicting runtime files.

## Decisions and gaps to reconcile

1. **Licensing (#59):** choose one [inactive software proposal](../legal/proposals/README.md),
   then apply it and record the durable decision/alignment. Neither is applied.
   The old-font full-license and private #32 merch obligations require separate
   evidence/disposition; public-store #100 preservation is distinct.
2. **Build output (#52/#29/#37):** two observed anomalies remain unresolved: a
   replaced homepage shell, and an old unreferenced JS bundle reappearing in fresh
   output. Unchanged-source controlled repeats pass smoke/raw checks. This is not
   a fix; retain [both investigations](../development/ci-baseline-29.md) and use a
   clean local run to investigate before declaring reproducibility.
3. **Budget policy (#52/#92/#37):** the first #108 full non-browser run failed six
   findings with that extra bundle. A controlled 45-file artifact retains the
   three existing document/total ceilings. Storage totals, per-page costs and actual
   browser transfers are different; ceilings were not raised.
4. **Native/browser/manual checks (#37/#70):** Storybook's native command hits this
   environment's OS interface restriction. No Chromium ran. Use the explicit
   [Taskfile/command matrix](../../tests/README.md) on Alan's machine; keep keyboard,
   theme/contrast/motion, zoom, screen reader and physical-device acceptance separate.
5. **Hosted CI (#29):** source #108 B CodeQL succeeds. CI and dependency review still
   fail; the latter's historical repository/Dependency graph diagnosis is not new
   confirmation of current configuration. No gate was disabled or job dispatched.

At #108 B, local format, zero-error lint, complete types/checks, 344 units, 152 catalog,
66 tooling, four semantic, one consumer and three fresh smoke checks pass. Discovery
remains 31/106/6/4 (overlapping profile counts, zero browser execution). No complete
local/hosted/production pass is claimed. The [#29 exact receipt](../development/reviews/ci-baseline-29/verification.json)
retains failed attempts, controlled repeats and protected-source evidence.

After reconciliation/review, the remaining setup path is **#57 → #70 → #37**,
with the acceptance gaps above carried by their owners. Then the existing
**#21 + #89 A → #96 → #97 → #89 B/C** sequence prepares and qualifies a public
construction preview. Actual products/providers and launch remain **#38 → #39**
under #31. Do not rebuild existing Fourthwall/catalog work. #90 contact/copy and
#100 repository-retirement dispositions remain in the roadmap.

No main merge, license choice, source-repository retirement, deployment, spending,
real product/provider activation or purchasing happened in this batch.
