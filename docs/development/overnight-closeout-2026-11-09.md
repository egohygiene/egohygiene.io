# Overnight storefront closeout — 2026-11-09

## Morning review packet

The selected #51/#75/#52/#57/#70 batch is saved in focused drafts. Actual browser
execution found and repaired theme-switch contrast, enlarged footer overflow,
artwork failure before hydration and duplicate locale-host mounting. Smoke
qualification now captures each app immediately after its build and rejects a
later writer changing its bytes. No issue is closed: unmerged work and unmet
original criteria remain visible for review.

| Review order | Draft and branch | Published checkpoint | Result / closure disposition |
| --- | --- | --- | --- |
| Prerequisites | Website #105 → #106 → #107 → #108 → #109 → #117 | `2b9ebe5` → `c5935ae` → `3d44df6` → `4faaebe` → `8717b54` → `a7e15c7` | Existing licensing/reliability/static-serving/roadmap drafts preserved; still require disposition |
| 1 | [Website #129](https://github.com/egohygiene/egohygiene.io/pull/129), `fix/overnight-closeout-2026-11-09` | `30c5d920dadb15357ee6092f5f0ae340e8cbaa1c` | Eight provider/hook regressions; all 48 i18n cases pass. #51 is a closure candidate after draft review/integration and original-criterion reconciliation |
| Independent | [Store #36](https://github.com/egohygiene/store/pull/36), `docs/ownership-acceptance-75` | `cbcc9228248f9c71c61aa9f7b4709eb9d275ba43` | Correct four stale ownership/status pointers against both merged PRs; 15 links/ancestry pass. #75 is a closure candidate after reciprocal draft disposition; retirement stays #100 |
| 2 | [Website #130](https://github.com/egohygiene/egohygiene.io/pull/130), `fix/qualification-freshness-52` | `1720b9e50eef6cca4bd495b846d219c159d094e1` | Per-build hashes and real-runner corruption regressions; production browser host. #52 stays open for historical cause/budgets and remaining acceptance |
| 3 | [Website #131](https://github.com/egohygiene/egohygiene.io/pull/131), `fix/theme-transition-contrast-70` | `0f9de22cd772707c2077b61ac4291357afede121` | Actual browser repairs plus full passing profile/captures. #70/#49 and dependent issues retain manual/original criteria |
| 4 | [Website #132](https://github.com/egohygiene/egohygiene.io/pull/132), `fix/static-build-trust-57` | Receipt `24ad60a6c151ea91e15726c9044f52bf25f3b06f`; tested implementation `2f61616310b47658742694c7a3938705807a0b36` | Actual Task/Docker context/image/388 HTTP checks pass, strict overall qualifier still fails budgets; review Linux criteria separately from Mac/overall qualification |

All website drafts form one compatible storefront stack. Store #36 is independent.
Remote main was refreshed as `1605f32cfc225a473921c5c8d5be9a10743b62cb` and contains
separate Intelligence work. It was preserved, not incorporated into these test
results. Nothing is merged; qualification must be repeated after any later
integration that changes the tested tree. Stale #73 is still open, not silently
superseded by a new pass claim.

Final GitHub readback reports **#105 currently conflicts with newer main**;
all following website drafts are mergeable against their existing stacked bases.
Prepare that integration separately in an isolated branch, preserve both the
Intelligence and storefront changes, then qualify the combined tree before any
merge. Conflict resolution remains agent-owned work. The published draft heads
were preserved rather than rewritten during this bounded batch.

## Verification and the remaining engineering work

| Evidence | Exact tested source | Actual outcome |
| --- | --- | --- |
| [Complete browser profile](browser-closeout-70.md) | `4ddc3d37fccafde6bf8145426b5c1edf88f0f567` | `pnpm ci:browser`, exit 0; all 15 steps pass. Chromium 151.0.7922.34: 31 application/118 store/6 preview/4 component cases (overlapping), 99 layouts, 10 locale journeys, 7 catalog-localization journeys, 2 intercepted handoffs |
| [Complete non-browser profile](reviews/static-build-trust-57/non-browser.json) | `2f61616310b47658742694c7a3938705807a0b36` | `task ci:check`: 15 stages pass, then three strict size findings fail; Task 201/child 1. 152 catalog, 111 tooling, 354 unit, 4 semantic, 1 consumer and 3 smoke tests pass; all compiler/boundary profiles pass |
| [Actual Docker profile and HTTP](static-build-trust-57.md) | Same static B | Real context exports, no-cache locked image build, 26 raw pages, 388 HTTP checks and owned-container cleanup pass on Linux amd64. All 45 image/host hashes match. Overall task still fails the strict budgets (201/child 1) |
| [Hosted parent #131 snapshot](reviews/static-build-trust-57/hosted-parent-131.json) | Head `0f9de22`, synthetic merge `7bfe5bd` | CodeQL passes; CI reaches/fails artifact gate and skips browsers; dependency review reports unsupported repository/Dependency graph configuration. This is not the new #57 branch's hosted result |
| Supplemental Storybook manager | #131 source | Local theme/same-document assertions pass before a failed network assertion: three Chakra reference requests are blocked. Four supported local component cases pass; manager-offline/reference acceptance remains open under #53 |

Next agent-owned work remains concrete:

1. Resolve the three existing document/total budget findings under #52/#91/#29:
   document raw 319,972 > 20,000; document gzip 86,962 > 10,000; total raw
   1,290,004 > 1,140,000 bytes. Preserve rendering/content and strict limits;
   do not ask Alan to waive a red gate. Historical output interference is still
   unidentified; new detection is not proof of its old cause.
2. Finish #29's hosted dependency-review configuration disposition and review
   stale #73 against the current implementation. Keep actual hosted failures.
3. Complete #53's manager/reference scope without weakening the local network
   boundary. A component iframe pass does not settle that observed failure.
4. Continue #34's bounded synthetic ownership/identity/projection contracts, then
   prepare #116's website/provider page packet. This batch did not choose a pilot,
   import a private catalog, adopt a private ontology or create a provider page.
5. Reconcile #36/#49/#50/#60/#64/#65/#70/#91 against the shared browser receipt,
   preserve their untested original criteria, then update #37's closure packet.
   Firefox/WebKit automation was not attempted in this bounded batch; checking
   feasibility and adding that coverage remains agent-owned work, not an owner
   manual-check substitute. #61/#69 still need their broader comparison/extension
   evidence.

## One end-of-sprint owner session

[#115](https://github.com/egohygiene/egohygiene.io/issues/115) remains the single
review queue. Routine Linux browser/Docker/Task execution is now done; it should
not be reassigned to Alan as unavailable. At the eventual compatible reviewed
commit, record OS/architecture/browser/commit and perform only the remaining
checks relevant to that platform:

- Review #105's concrete software-license alternatives and historical font/source
  dispositions, plus #90's actual public copy/contact/accessibility-report choices.
- Check native 200% text resizing and 400% browser zoom/reflow on representative
  home/store/help/product/gallery routes; record clipping, focus and usable actions.
  CSS scaling/equivalent viewport probes already passed but are different evidence.
- On available physical devices, check portrait/landscape, short heights, touch
  navigation/gallery dismissal and restored scrolling. Check keyboard focus and
  relevant screen-reader announcements, including public-report warnings and
  unavailable purchasing explanations. Record unavailable platforms explicitly.
- If using Mac/Apple Silicon, follow the existing setup/static walkthrough and
  record the real architecture/image/HTTP result; Linux amd64 proof does not
  establish that platform. Existing budgets still cause the overall task to fail.
- Review the dependency-ordered draft diffs and closure proposals once. Any merge
  remains a later selected action; no license, publication or provider choice has
  been applied on Alan's behalf.

[#116](https://github.com/egohygiene/egohygiene.io/issues/116) still batches the
creative pilot and website/provider drafts at sprint end, after the agent prepares
its packet. Actual publication stays in [milestone 2](https://github.com/egohygiene/egohygiene.io/milestone/2)
under #31. No deployment, real checkout, spending or separate-store retirement
occurred. The A and intermediate failed observations below are retained history;
the source-bound receipts above identify the final outcomes.

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
