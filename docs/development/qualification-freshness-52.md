# Qualification output ownership and production harness — #52

## A — Contract before changes, 2026-11-09

Input is [draft #129](https://github.com/egohygiene/egohygiene.io/pull/129),
`30c5d920dadb15357ee6092f5f0ae340e8cbaa1c`, on the existing storefront stack.
Alan authorized autonomous bounded issue progress with next-day review.

Two concrete reliability gaps:

1. `createSmokeReceipt` hashes all three app outputs after all builds. A website
   replaced during a later app build can therefore become the new recorded
   baseline. Existing meaningful-HTML and artifact guards catch some effects,
   but the receipt does not identify which build interval changed prior output.
2. Default application browser tests serve Vite development output while the
   shared site suite requires a production-only local-GET/no-WebSocket boundary.
   The actual Chromium baseline runs 31 tests: 21 site tests fail on denied Vite
   HMR sockets; two other playground cases reveal independent contrast failures.

Capture every completed app's artifact immediately after its own build. Before
and after each later build, compare previously completed artifacts to those
snapshots. Refuse added/deleted/changed files and symlinks, name the app/stage and
changed paths, and retain snapshots in the existing invocation report. Construct
the final source/invocation-bound smoke receipt from the original snapshots,
after verifying all three app identities and current bytes; never rebaseline an
intervening writer. Preserve existing source mutation and post-receipt guards.

The supported browser qualifier already creates fresh normal website/docs/
playground artifacts before browser execution. Serve those artifacts through
the existing preview adapters for the application browser profile, retaining
the strict request/WebSocket/error assertions. Document the build prerequisite
for direct low-level `test:e2e`, just as production-store/preview suites do.
Keep browser servers invocation-owned and `reuseExistingServer: false`.

Add deterministic negative cases in the existing real-runner fixture: a later
docs build replacing the website homepage or adding an old JavaScript file must
fail before playground/browser execution and before a successful receipt exists.
No automatic retry, ignored request, weaker contrast check, budget increase,
parallel orchestrator or new runtime dependency is introduced.

This change detects and localizes interference. It does not identify the writer
of the October incidents or claim their historical cause is fixed. Preserve
those receipts and the remaining budget/platform/hosted criteria in #52/#29/#37.
The independent actual contrast repairs and extended #70 checks follow in their
own focused draft. Keep manual/owner actions in #115 and creative pages in #116.

## B/C — Implemented and verified

Implementation `e0f9b9bcce1b6a58475874bc38fe4a887b234d5e` binds the receipt to
immediate per-app snapshots and records each capture in the existing report.
The real-runner fixture now rejects a replaced homepage or extra old JS during
the docs build before playground or browser work and before receipt creation.
The final receipt rejects missing/duplicate app identities and intervening output
changes. Existing source and post-receipt mutation guards remain.

The application browser profile serves normal preview artifacts on its existing
ports. No request, WebSocket, contrast or budget assertion was relaxed. Direct
application/browser commands now document their fresh-build prerequisite.

[Verification](reviews/qualification-freshness-52/verification.json): 24 tooling
cases pass, tooling/browser TypeScript and scoped Biome pass. The supported direct
smoke runner passes all three fresh app builds and three smoke tests, with
snapshots for each app. All 26 existing site/docs browser cases pass with the
strict production guard unchanged. One earlier named invocation returned an outer
exit 1 despite a passed internal report/all four successful steps; that observation
is retained separately from the independently confirmed direct exit 0.

No historical writer or universal reproducibility claim follows. Actual Docker
context probes now pass, but the image build's Corepack request attempts direct
network access in this managed proxy environment. A separate proxy-aware Node
container probe reaches the pinned registry metadata with verified TLS. #57
needs that explicit build trust/proxy path; #70/#49 still need the observed
theme-transition contrast repair and complete browser qualification. Budgets and
hosted dependency-review limitations stay open; no issue is auto-closed.
