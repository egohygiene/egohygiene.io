# Overnight storefront closeout — 2026-11-09

## A — Selected work and baseline

Alan authorized a bounded issue batch while asleep, with a sync the following
day. Use this handoff with the [closeout roadmap](../roadmaps/sprint-closeout-2026-11-09.md).
The session date is America/New_York; command timestamps in retained receipts
are UTC. Save specifications, implementation and verification separately.

The batch starts from planning draft #117 at
`a7e15c7b1543dcba01647ec8ff358aab5126c817`, after #105→#106→#107→#108→#109.
Live main advanced independently to `1605f32` with Intelligence work; that work
and its branches remain separate. Results from this batch qualify the storefront
stack, not the newer combined main. No existing draft is merged or rewritten.

| Issue | Observed gap | Bounded next change / evidence |
| --- | --- | --- |
| #51 | Own-key/full-path lookup and plural/fallback tests exist; React rendering of invalid namespace/prototype/partial keys lacks a dedicated regression | Exercise those exact keys through the real provider/hook; preserve valid nested/empty strings and readable fallback |
| #75 | Website #76 and store #34 are both merged, but store main still calls ADR-0005 proposed and keeps obsolete unmerged handoff pointers | Reconcile the reciprocal documentation against immutable merge evidence; do not invent a new ownership choice or retire the source |
| #52 | Smoke receipt captures all outputs only after all three builds; an intervening writer can be recorded as the new baseline | Capture outputs at each successful build, check previously built outputs around later stages, and retain a useful failure window; unknown historical writer stays unknown |
| #57 | Earlier Docker acceptance was unavailable; the current local Docker engine is available | Exercise real context/image/container/HTTP verification; diagnose current build failures with certificate verification intact |
| #70 | Earlier actual browser acceptance was unavailable; a current Chromium installation is now possible | Execute existing suites, fix observed failures, extend only demonstrated viewport/interaction coverage gaps and record remaining manual checks |

Installed task-local Node 24.21.0 from the official archive after SHA-256
verification, and task-local pnpm 11.28.5. The unchanged frozen lockfile installs
with lifecycle scripts disabled. Baseline i18n command:

```sh
pnpm exec vitest run --config vitest.unit.config.ts packages/i18n/src
```

Result: 40 tests across three files passed before changes. The existing Vite
CommonJS/native-loader notice remains. Docker 28.4.0 answers on the managed local
socket with the vfs driver. Playwright's Chromium installation completes; actual
browser launch and page acceptance still need to run.

## Acceptance and owner boundaries

Close only criteria supported by current evidence and required integration.
Independent accepted historical work may be reconciled without a new merge;
new unmerged regression/repair work remains reviewable in drafts. Preserve the
original #52 contamination evidence and strict artifact budgets. A diagnostic
guard does not establish the historical root cause. Discovery is not execution,
native/container evidence is distinct, and this environment cannot establish
physical-device, Mac/Apple Silicon, native zoom or assistive-technology acceptance.

Collect remaining owner decisions/manual checks in #115. First-product creative
selection and website/provider page drafts remain #116; actual publication is
the later milestone under #31. No software-license choice, private creative
association, ontology adoption, merge, account/DNS change, source retirement,
deployment, real provider activation, purchase or spending is selected here.

## B/C — Lookup regression and ownership reconciliation

Source B `2b52ccc6d2207c84b595f68622039fc8c409533b` adds eight real-provider/hook
React regressions for #51. Invalid namespaces, missing/partial paths and inherited
prototype names render the complete requested key; valid nested and empty string
translations remain intact. No runtime or data contract changes. Focused i18n now
passes 48 tests in three files; `pnpm typecheck:tests` and the changed-file Biome
check pass. The active safe lookup was already integrated; this draft retains the
missing regression evidence for review rather than maintaining another runtime.

Both #75 ownership PR merge states were refreshed. Store's stale active pointers
are corrected in [store draft #36](https://github.com/egohygiene/store/pull/36),
based directly on store main `5786fd40bfe40b0d338eb96087355b98f7e16d42`.
Four documentation files change; 15 relative links, merge ancestry and whitespace
checks pass. #75 remains open for the reciprocal-pointer draft's disposition;
this is not a new ownership decision or source retirement.

Current Chromium 151.0.7922.34 launches and executes a real page/button action.
The first complete `pnpm ci:browser` attempt at source B passes fresh website,
docs, playground, isolated-preview, native Storybook and standalone-consumer
builds plus all-app smoke. It then runs 31 application cases: eight pass and
23 fail. Twenty-one site failures come from a production-only no-WebSocket
guard attached to a development server that injects Vite HMR. Two playground
cases expose real action-text contrast failures: Secondary in dark is 2.8633:1;
Primary in high contrast is 3.2458:1, below the retained 4.5:1 requirement.

These are actionable #52/#70/#49 findings. Preserve the failed baseline and
repair the harness/server mismatch plus actual token/style behavior; do not
relax network or contrast assertions. Later suite/profile steps did not run.
No full browser/CI qualification or issue closure is claimed by this checkpoint.
