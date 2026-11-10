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
