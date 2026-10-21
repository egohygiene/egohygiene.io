# Current handoff

## Current: #65 B implemented in draft #86 — 2026-10-21 UTC

Alan authorized continuing to B during the 2026-10-20 maintainer session. Recovered
the pruned checkout from GitHub and refreshed #65/#84, draft #86 at
`f7b7d7ec6d1b3a43e76e20afda6ed88dab9ddcfd`, draft #85 at
`9b308a88df4446d54e0558ed35d5dd0f0bbee37e`, draft #83 at
`8a6258a1011569ac6e531fc124ccb0766f986389`, and main at
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. None was merged. #86 remains on
`feat/catalog-localization-65a`, stacked on #85, which is stacked on #83.

Source `34a807ef173b2ddd547e9735ee344b6ffeba4514`, tree `3081417ada645b33e4976b8ffa8c5269a5204f1a`,
is published in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86).
The remote tree equals the tested staged source. Contract/consumer/type/message/
boundary checks ran before publication; builds/artifact checks ran at the published
source. This following docs commit records evidence. Read the
[B receipt](../store/catalog-localization-65b.md), [ADR 0010 refinement](../architecture/decisions/0010-versioned-catalog-localization.md)
and [authoring workflow](../store/catalog-authoring.md#catalog-translations-and-attribution).

The portable selector resolves current reviewed title/description/artwork/availability/
variant labels per field and returns actual languages. The existing site service
supplies selected content locale and explicit fallback chain, separately from
formatting locale. Canonical data stays unchanged for paths, relationships and
purchase validation. Cards/details/galleries/context/artist views and client metadata
use resolved presentation text. Unicode search covers displayed/fallback content
plus original creative-name aliases; unrelated translations and draft/stale copy
are excluded. Provider currency, amounts, variant IDs and exact destinations remain
unchanged; the isolated preview localizes its canonical heading only.

Focused local results: **116 catalog tests + 73 consumer/service tests**, three type
profiles, 15-module boundary, 377 messages/10 namespaces, normal/preview builds and
normal artifact checks passed (16 files, 12 references, zero findings). See
[checks](../store/reviews/catalog-localization-65b/checks.json) and
[artifacts](../store/reviews/catalog-localization-65b/artifacts.json). Independent
review found no remaining source blocker. Two early test-only expectations were
corrected (non-unique search sentinel and Intl nonbreaking whitespace); no weakened
gate or implementation workaround. Existing runtime/config-loader warnings remain.

**Deferred:** no Chromium, screenshots, broad lint/refactor, full qualification or
manual CI dispatch. Automatic source CI 39519493216, dependency review 39519493050
and CodeQL 39519493369 failed; status only was refreshed, with repairs deferred.
Hosted results are separately recorded in the receipt;
local passes are not hosted/browser/production qualification. Mixed-language
interpolated accessible names remain for actual accessibility review. English is
still the sole public locale; no real translation/product/rights claim, catalog
entry, provider route, dependency, deployment, order or spending changed.

**Next:** sync on B, then #65 C's reusable bilingual/pseudo catalog integration,
canonical metadata/link inputs, exact synthetic checkout handoff and first-language
review guidance. Actual Chromium execution stays deferred to final #37 with
#29/#52/#49/#70. Then #84 orders #38 plus relevant #9, #22, and the full final
validation/CI pass. Review and merge the #83 → #85 → #86 draft stack only when
explicitly instructed; reconcile downstream bases after each merge. #65/#34/#64/
#37 remain open. Hosting/provider activation and #39 are separate authorization.

## Historical: #65 A / #34 contract saved; final validation deferred — 2026-10-20 UTC

Alan explicitly moved Chromium execution/troubleshooting, unrelated refactoring,
repository-wide lint/testing and CI repair to the final phase and selected further
bounded implementation. [Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84)
records the new order. Existing [#37](https://github.com/egohygiene/egohygiene.io/issues/37)
coordinates that final pass with #29/#52/#49/#70; no duplicate owner or disabled
gate was introduced. #64 C's authored journeys remain unrun and acceptance open.

Implemented #65 checkpoint A coordinated with #34 in
[draft #86](https://github.com/egohygiene/egohygiene.io/pull/86), branch
`feat/catalog-localization-65a`, stacked on unmerged draft #85 at
`9b308a88df4446d54e0558ed35d5dd0f0bbee37e`. #85 remains stacked on draft #83 at
`8a6258a1011569ac6e531fc124ccb0766f986389`; main remains
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. No merge was authorized.

Tested source `879af7ebf9ffafe5467da892aef2c0eb78e87055`, tree `f5855f7f768c4863a5a6b3149e83802637a901af`,
was published with an exact local/staged-tree comparison. Final focused checks
ran on that source before publication; the following documentation commit records
evidence. Strict catalog/entry v2 adds source language, inline reviewed translation
fields, stale-review diagnostics and separate creator/rights-holder references.
Public output excludes draft/stale translations. The explicit v1 migration and
non-overwriting CLI retain originals; all ten shipped entries preserve their old
fields, IDs, order, art and purchase state. Attribution remains unknown and no
real translation was added. See [ADR 0010](../architecture/decisions/0010-versioned-catalog-localization.md),
[checkpoint receipt](../store/catalog-localization-65a.md) and
[authoring policy](../store/catalog-authoring.md#schema-changes).

Focused local results: 104 catalog tests (24 new localization/migration contracts),
57 store/preview consumer tests in 10 files, app/tooling/domain/schema types, normal
build and 14-module boundary passed. A Vite emitted-file test proves draft/stale
translation markers absent from HTML/JS/JSON/source maps. Independent review's
undefined-only translation-field finding was fixed with a regression. Initial
fixture-version/default failures were corrected; an incorrect schema tsconfig path
was corrected without code/gate changes. [Exact evidence](../store/reviews/catalog-localization-65a/checks.json)
retains those attempts and scope. No Chromium, full qualification, broad lint or
manual hosted CI run occurred. Automatic source CI 39471602329, dependency review 39471602298 and CodeQL
39471602591 failed; causes were not re-diagnosed. Hosted failures are unresolved,
not qualified by local passes. Only source-level/browser-module compatibility is shown.

**Next:** sync on A, then #65 B: selected-language catalog rendering and Unicode
search, deterministic source fallback, provider-declared price formatting and
canonical metadata inputs using the existing #64 service. C follows with bounded
synthetic integration/authoring proof; actual browser execution stays with final
#37. After #65/#34, continue #38 plus relevant #9 readiness/disclosures, then #22
public rendering/metadata, then final lint/test/browser/CI review. Hosting/provider
activation and #39 remain separately authorized work. Review/merge the draft stack
only when instructed, reconciling each base after its parent changes. English is
still the only public locale; real artist selections are empty, providers disabled,
and no deployment, account change, real order or spending occurred.

## Historical: #64 C implementation saved; browser acceptance blocked — 2026-10-20 UTC

Alan explicitly selected checkpoint C. Its message-review tooling and authored
browser journeys are in [draft #85](https://github.com/egohygiene/egohygiene.io/pull/85),
branch `feat/locale-contract-64a`, still stacked on unmerged #83 at
`8a6258a1011569ac6e531fc124ccb0766f986389`. Main remains
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. No merge was authorized.

Tested source `4ad0dcb90c8190b5b151eb29a6f7cc72f7895444`, tree
`1e789c79674e3c19719fe83afccb5428ac55023b`, equals the published/local source;
final verification began clean. The checker validates 376 English messages in
10 namespaces, placeholders/plural families and explicit fallback. Deterministic
source/translation hashes detect stale human reviews; inventories cannot approve
a language. The existing host and simulated service tests use real app composition.
Ten locale browser journeys join the existing 35 layout cases. Read the
[C receipt](../store/locale-review-64c.md), [message workflow](../store/interface-message-workflow.md)
and [ADR 0009](../architecture/decisions/0009-single-locale-runtime.md).

Local passes: 15 message-review tests, 79 catalog/artifact contracts, 162 consumer
unit/component tests across 23 files, 3 semantic checks, 6 type profiles, 12-module
boundary, 12-file Biome, four syntax checks, normal/preview builds and artifact
guards (16 files/12 references/zero findings). Browser discovery listed 70 normal
and 6 preview cases only. An incorrect artifact output-directory invocation was
corrected without source/gate changes; both attempts are recorded. Independent
review's empty unknown-group finding was fixed and tested; no source blocker remains.
Exact [checks](../store/reviews/locale-review-64c/checks.json) and
[artifacts](../store/reviews/locale-review-64c/artifacts.json) are retained.

**C remains open:** Vite starts, but Chromium aborts before any page on denied
process-singleton `socket()` (`Operation not permitted`). The cloud browser cannot
reach the loopback server either. Zero browser cases or screenshots completed.
Types, discovery and simulated DOM checks are not browser/layout evidence; earlier
captures remain historical. Hosted source CI, dependency review and CodeQL failed;
CI stopped at repository formatting after installation. No gate was disabled.

**Next:** refresh GitHub, run the retained 35 layout + 10 locale journeys in a usable
Chromium environment, inspect captures and resolve actual failures. Then rerun the
16-step fresh-build qualification profile for normal/preview/handoff evidence.
Sync before coordinated #65/#34. Keep #64/#37 open. Review #83/#85 separately; merge
only when instructed and reconcile/retarget #85 after #83. English remains the sole
public locale, real artist selections remain empty and providers disabled. No
deployment, product/account activation, real provider contact or spending occurred.

## Historical: #64 B implemented in draft #85 — 2026-10-20 UTC

Alan explicitly selected checkpoint B. Implemented on `feat/locale-contract-64a`
in [draft #85](https://github.com/egohygiene/egohygiene.io/pull/85), still stacked
on unmerged #83 (`test/store-qualification-37`,
`8a6258a1011569ac6e531fc124ccb0766f986389`). Main remains
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. No merge authority was added.

Tested source `ec7bcc1629fd5261dddd2182597f10affadc9140`, tree
`665d4853f7b565b3584dbac48dd6f21ce862c17c`, equals the published/local source;
final verification began clean. One service now connects router URL/preference
selection to the existing translation provider, native language selector and
`html lang`/`dir`. Internal links retain selection; filters/hash and same-page
selector focus are preserved. Shell/store/detail/gallery/preview/error messages,
plurals, client metadata and locale formatting are connected. Only English is
public; catalog translations remain #65/#34. Read the [B receipt](../store/locale-service-64b.md)
and [ADR 0009 refinement](../architecture/decisions/0009-single-locale-runtime.md).

Local results: 143 unit/component tests in 22 files, 3 semantic component checks,
2 type profiles, 12-module boundary, 46-file Biome, normal/preview builds and
normal artifact guards (16 files/12 references/zero findings) passed. Two existing
Biome warnings and module-loader notices remain. Independent review has no
remaining blocker. Exact [checks](../store/reviews/locale-service-64b/checks.json)
and [artifact inventory](../store/reviews/locale-service-64b/artifacts.json) are retained.

**Browser limitation:** Chromium startup is denied `socket()` / `Operation not
permitted` before any page opens. No actual browser smoke, language navigation,
expanded/RTL layout, keyboard/touch or physical-device/AT journey was run for B.
Simulated router/remount tests are not browser evidence. Hosted source CI, dependency
review and CodeQL failed; CI stopped at repository formatting after installation.
Local results do not qualify hosting or commerce.

**Next:** sync on B, then select C: actual browser switching/fallback/denied-storage/
reload/history and expanded/RTL review using a usable browser, plus repeatable
message key/placeholder and source-change review. Reuse the existing qualification
host and service. #65/#34 and remaining #37 qualification follow. Review #83/#85
separately; merge only when instructed and retarget/reconcile #85 after #83.
Provider/purchase activation remains disabled; no deployment or spending occurred.

## Historical: native roadmap complete; #64 A in draft #85 — 2026-10-20 UTC

Alan approved using the browser to finish native sub-issue links and requested
further bounded progress while away. [Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84)
now has direct children #31/#64/#65/#49/#70/#52/#9/#22/#29/#61/#69/#75/#51.
#31 retains its original eight native children #32–#39, including closed history.
The roadmap records the execution order separately from this hierarchy.

Implemented **#64 checkpoint A** in [draft #85](https://github.com/egohygiene/egohygiene.io/pull/85),
branch `feat/locale-contract-64a`, stacked on #83's `test/store-qualification-37`
at `8a6258a1011569ac6e531fc124ccb0766f986389`. Main remains
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`; #83 and #85 remain draft/unmerged.

Tested source `bd217fed480fbc6124ad4bf0e23865605c8ef0c7`, tree
`2bf0ba9db2b66da881bc4e61168083179c2d5070`, matches the published/local tree.
The final focused run began clean. Delivered: validated locale registry and
source-last fallback, safe translation fallback, named text interpolation,
cardinal plurals, cached Intl formatters, English-only app registration and pure
URL/preference helpers that tolerate storage denial. No second runtime or
catalog/schema/provider/dependency change. [ADR 0009](../architecture/decisions/0009-single-locale-runtime.md)
records the contract; [receipt](../store/locale-contract-64a.md) and
[commands/results](../store/reviews/locale-contract-64a/checks.json) retain evidence.

Fresh local passes: 128 tests across 19 locale/shell/store/preview files, app and
i18n package types, 12-module portable boundary, 11-file Biome, normal build and
artifact guards (16 files/12 references/zero findings). One informational bracket
key suggestion and existing module-loader notices remain. The artifact command's
initial output-path rejection was corrected without a source/gate change and is
recorded. Independent source review found no blocker. Browser/assistive-technology/
physical-device/provider journeys were not rerun for this contract checkpoint.

At the tested source, hosted CI, dependency review and CodeQL failed. CI passed
installation then failed formatting and skipped downstream validation. Local
passes are not hosted/production qualification. English remains the only public
locale; real artist selections are empty and provider/purchase activation stays
disabled. No deployment, account change, order or spending occurred.

**Next:** review #83 (including provisional budgets) and stacked #85. Merge only
when instructed; reconcile/retarget #85 after #83 if merging. Continue #64 B with
the accessible language control and the single provider's browser/router state,
`html lang`/`dir`, navigation preservation and remaining interface messages; C
adds actual locale/fallback/denied-storage browser journeys and message review
checks. #65/#34 catalog migration and final #37 qualification follow. No real
second public language is selected by engineering fixtures.

## Historical: remaining work saved in roadmap #84 — 2026-10-19 UTC

Alan requested one roadmap capturing the next issues, their order and discussion
notes. [Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84) now
records review of draft #83, then #64, coordinated #65/#34, remaining local #37
qualification with #49/#70/#52, #38 readiness with the applicable #9 disclosures,
#22/#29 release preparation, and final #37/#39 host/product/launch evidence.
It also records provisional size budgets, local/hosted evidence limits,
reconciliation of #36/#61/#69/#75/#51, deferred work and the product boundaries.

The linked checklist is saved. **Native hierarchy linking remains pending:**
the available GitHub connector lacks a sub-issue mutation. The intended structure
preserves #31's existing #32–#39 children and nests #31 under #84; the remaining
owners become direct children after refreshing their parent relationships.
Browser fallback requires approval under the browser tool's instructions.

Refreshed main remains `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`; draft #83 was
at `60ff62f060fe2fa4cb461bee21942f49aa59b1a2` before this documentation-only update
on `test/store-qualification-37`. No new implementation, merge, deployment,
provider activation or test run is part of this planning checkpoint. The
qualification evidence below remains pinned to its tested implementation.

**Next:** finish native hierarchy linking, then review #83 and select the first
bounded #64 checkpoint with Alan. Do not close #37 before its outstanding
acceptance is evidenced or explicitly rescoped. See the
[roadmap receipt](provenance.md#remaining-work-roadmap--2026-10-19-utc).

## Historical: #37 local qualification complete in draft #83 — 2026-10-19 UTC

Alan authorized merging #82 and continuing #37 toward completion. #82 merged at
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. The next local qualification pass is
complete in [draft PR #83](https://github.com/egohygiene/egohygiene.io/pull/83),
branch `test/store-qualification-37`, based on that merge. #83 is unmerged;
#37 remains open for explicit upstream and qualification dependencies.

Tested implementation: `5e148843998a44ce7c7923c0fd27cf944dce5187`, tree
`01bfbe2568bfab4470e7f967b0e4e5128107f373`, identical to local source. Its complete
13-step `node scripts/qualify-store.mjs` run began clean and passed. This following
commit records evidence/docs only. Read the [review receipt](../store/qualification-37.md),
[exact commands/results](../store/reviews/qualification-37/checks.json),
[browser cases/contrast samples](../store/reviews/qualification-37/browser.json)
and [artifact inventory](../store/reviews/qualification-37/production-artifact.json).

Delivered: required fresh builds, explicit selected browser types, shell/metadata
journeys, measured text/focus contrast, forced colors, #70 reference/breakpoint
widths, separate CSS text enlargement/reflow, regional synthetic interactions and
artifact/credential-pattern/reference/size checks. Shared CSS fixes foreground
focus outlines and badge text, plus reduced-motion buttons/spinners. The real
catalog, schemas, public art, providers, dependencies and canonical routes remain
unchanged. Existing #54/#55/#62, Fourthwall and intercepted handoff work is reused.

Fresh passes: 79 catalog/artifact contracts, 92 focused units, three semantic
component checks, four type profiles, the 12-module import boundary, 70 production
browser cases, six preview cases, handoff baseline/two journeys, and 35 synthetic
layout/interaction/motion cases. Artifact scan: 16 files, 12 local references,
zero findings. Selected captures were inspected. Environment: Node 24.21.0,
pnpm 11.28.5, Playwright 1.62.1, Chrome for Testing 155.0.8059.84. This is local
Chromium evidence, not native zoom, screen-reader or physical-device certification.

**Next:** review #83 and the concrete proposed bundle-size ceilings with Alan.
To finish #37 as written, the missing #64 locale/fallback contract and coordinated
#65/#34 catalog translation/version migration need implementation and resulting
journey fixtures. #37 also retains unsupported-environment and later deployed-host
checks; #22/#29 own crawler/host work. No arbitrary version bump or pretend
translation was introduced to close a checkbox. #38 real-provider readiness is
still unstarted and separate. Broader #49/#52/#70 issues remain open.

Hosted CI, dependency review and CodeQL failed at the tested source head. CI's
format step failed and later stages were skipped; local passes do not make these
hosted gates green. No gate change or manual dispatch. Nine provider placeholders
remain disabled, real checkout routes empty and real `.play()` selections empty.
No actual provider contact, order, deployment or commerce activation occurred.

## Historical: #37 bounded slice complete, review pending — 2026-10-19 UTC

Alan authorized checkpoint 3 and asked that the draft include everything.
All three checkpoints of the **bounded intercepted-checkout testing slice** are
complete in [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82),
branch `test/checkout-handoff-37a`. The PR is unmerged; #37 remains open because
its broader qualification scope is not complete. No merge or next-issue start
was included in this instruction.

Refreshed main: `1a0a3f9caa6bfb111ffff017dbb0155729a3a068`. Tested PR head:
`89d33e49eca49530645042930df92373daf33a84`, tree
`4083c3b8e5a462e145d78383c547f010e93a83f8`. No code fix was needed; this following
update adds evidence/docs only. Read the [closeout receipt](../store/checkout-handoff-37c.md),
[check inventory](../store/reviews/checkout-handoff-37c/checks.json) and
[production artifact manifest](../store/reviews/checkout-handoff-37c/production-artifact.json).
The [ledger](provenance.md#checkout-handoff-37-checkpoint-3--2026-10-19-utc)
records authority and exact scope. UTC date is October 19; Alan's local date was
October 18 in America/New_York.

Fresh local passes: 73 catalog tests, 55 focused units across 10 files, all three
typechecks, 12-module import boundary, 31 normal-browser cases, six isolated
preview cases, and the handoff baseline/two native keyboard-touch journeys.
Both builds pass. Normal output has no handoff fixtures or preview-only routes:
16 files hashed, eight text files scanned, 10 excluded markers absent and three
public controls present. Reviewed captures are linked in the receipt. Seven
source/config files pass scoped Biome. No new defect was found in these checks.

Chrome for Testing 155.0.8059.84/Playwright 1.62.1 is the actual browser environment.
The real catalog, runtime UI, public artwork, schemas, dependencies and provider
configuration remain unchanged. Nine providers are disabled and checkout routes
are empty. Local passes do not imply hosted success: CI, CodeQL and dependency
review all failed at the tested head; no gate was changed or manually dispatched.

**Next:** review/accept the complete draft with Alan, then merge if instructed.
After that, propose the bounded #38 readiness-preparation slice. #38 has not
started. Broader #37 gaps (host, performance budgets, wider accessibility/device/
locale coverage, migration cases when needed, actual provider qualification)
remain explicit. No deployment, actual provider contact or purchase activation.

## Historical: #37 checkpoint 2 review — 2026-10-18 UTC

Alan authorized continuing checkpoint 2 after the fixture/interception sync.
Delivered in the same [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82),
branch `test/checkout-handoff-37a`. Refreshed main remained
`1a0a3f9caa6bfb111ffff017dbb0155729a3a068`; the starting PR head was
`c9976ca548f629b012297346f00e73ac78a21dee`. Verified implementation:
`e90e9b65b54a7365b6668802d8a984ee392be837`, tree
`55f71d7a2e76ab29b7eb5a801eecd070287e8ce2`, matching the local staged tree.
Read the [journey receipt](../store/checkout-handoff-37b.md),
[report and captures](../store/reviews/checkout-handoff-37b/journeys.json), and
[continuity record](provenance.md#checkout-handoff-37-checkpoint-2--2026-10-18-utc).

Desktop Tab/Enter and mobile touch emulation activate the actual product link,
reload the locally intercepted destination, return with Back, reload the original
product and activate again. Each scenario makes exactly three intercepted
requests, stays in one tab, and preserves preview/unavailable guards through real
SPA links and reload. No unexpected requests, WebSockets or page errors occur.
Both viewports fit without horizontal overflow. Final captures show visible
desktop focus and a readable mobile action/disclosure. A missing-logo fixture
gap was corrected by copying the existing public logo into the temporary build.
No application, catalog, artwork, dependency or provider configuration changed.

Fresh checks: both browser journeys and the earlier boundary baseline pass,
plus six focused Node fixture/guard tests, catalog/tooling types, scoped Biome
and diff checks. The full 73-test catalog run, app/domain typechecks and normal
build exclusion evidence remain checkpoint 1 results, not fresh checkpoint 2
claims. All three hosted workflows at both the starting PR head and verified source
head failed; hosted results remain separate and no gate was disabled.

**Next:** sync with Alan before checkpoint 3's focused regression and production
artifact closeout. #82 stays draft/unmerged and #37 stays open; broader #37 and
real-provider qualification are not complete. #38 readiness preparation remains
proposed. No real provider, order, purchase activation or deployment occurred.

## Historical: #37 checkpoint 1 review — 2026-10-18 UTC

Alan selected the next checkpoint and requested a sync afterward. Delivered
**checkpoint 1 only** in [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82),
branch `test/checkout-handoff-37a`, based on refreshed main
`1a0a3f9caa6bfb111ffff017dbb0155729a3a068`. Verified source:
`2a91b2b02edb606fe594a65784ac7f5eb798173e`, tree
`58ac9598a1770e29d570cfe020feffd187219102`; the published tree matches local source.
Read the [fixture/boundary receipt](../store/checkout-handoff-37a.md) and
[machine-readable baseline](../store/reviews/checkout-handoff-37a/baseline.json).

A usable Chrome for Testing 155.0.8059.84 now runs through the existing executable
override. Temporary fictional live/preview/unavailable products reuse the actual
website and catalog adapter; a draft sentinel stays out of the public artifact.
The exact fictional destination is served locally. Other external requests,
non-GET requests, WebSockets and loopback redirects are blocked; service workers
are disabled in the isolated browser context. Normal catalog, artwork, provider
configuration, runtime application and dependencies are unchanged.

Local evidence: all 73 catalog tests, app/catalog/domain types, normal build,
normal-artifact fixture exclusion, scoped Biome and diff checks pass. The browser
baseline renders three states, decodes the test swatch, fulfills one exact direct
navigation and denies four probes, with no page errors or unexpected WebSockets.
Independent review found no remaining blocking issue. These are local results;
no hosted CI success or actual provider qualification is inferred. At source
head `2a91b2b`, hosted CodeQL and dependency review reported failure while CI
was running; see the linked ledger for run URLs.

**Next:** sync with Alan before checkpoint 2: activate the actual product link,
exercise desktop keyboard/mobile tap and Back/reload against this boundary.
Checkpoint 3 remains the focused regression/evidence closeout. #37 stays open;
this draft is unmerged. #38 readiness preparation remains proposed. Nothing was
deployed or activated for purchase; no real provider was contacted by the tests.
See the [continuity record](provenance.md#checkout-handoff-37-checkpoint-1--2026-10-18-utc).

## Historical: #54 merged; #37 scope discussion — 2026-10-18 UTC

Alan authorized merging [PR #81](https://github.com/egohygiene/egohygiene.io/pull/81)
and returning to explain the next issue. Normal merge:
`28a2ed2d712becf1513d1bd3d6190502db876a69`, from reconciled head
`ca833b227168a5e4bb5b748984be7ad4847d4b7f`. GitHub confirms #81 merged and
[#54](https://github.com/egohygiene/egohygiene.io/issues/54) closed as completed.
Main's concurrent #80 four-digit decision-label migration was preserved; only
the two continuity documents required conflict resolution. Application code is
unchanged from the verified #54 implementation. The 67 catalog/55 focused unit
passes remain the recorded local evidence; browser-download and hosted-CI limits
remain. No application checks were rerun for documentation reconciliation.

**Proposed next:** a bounded [#37](https://github.com/egohygiene/egohygiene.io/issues/37)
checkout-handoff browser slice. Existing coverage already includes browsing,
reload/history, keyboard/mobile, failed images and non-purchasable states. The
Fourthwall tryout remains an inert variant/quantity summary; live product UI is
a plain link to the reviewed provider product page. Its synthetic live link is
covered in JSDOM but has not been activated in the browser suite.

1. Establish a usable local browser and isolated synthetic live/preview/unavailable
   fixtures with strict external-request interception and exact URL expectations.
2. Exercise real product UI → intercepted provider destination → Back/reload with
   desktop keyboard and mobile tap coverage, preserving non-purchase guards.
3. Run focused regressions and normal-build fixture-exclusion checks; save exact
   evidence/limits and a draft PR, then sync. Reuse the existing #61/#62 work.

This would advance #37, not complete its broader qualification or validate actual
provider checkout, variants, shipping/tax, fulfillment or print quality. Provider
readiness preparation remains the following #38 proposal; no real product is
selected or activated by this plan. **No #37 implementation has started.** Return
to Alan for selection; each new checkpoint should retain a reviewable sync.
See the [merge receipt](provenance.md#accepted-54-merge-and-37-scope-discussion--2026-10-18-utc).

## Historical: #54 artwork ordering review — 2026-10-18 UTC

Alan authorized merging [PR #79](https://github.com/egohygiene/egohygiene.io/pull/79)
and starting [#54](https://github.com/egohygiene/egohygiene.io/issues/54). The normal
merge completed at `988b3598c7acaa2cfbd60ecb225e557137c10713`, from reviewed head
`5b87b2d2f741e93505623db10f1f71d00db9cabc`; GitHub main was read back at the merge.
All three hosted workflows at the reviewed head reported failure. The audit's
recorded local evidence remains local; no gate or provider setting changed.

Branch `fix/design-order-54` starts from that merge. Checkpoint A defines explicit
`designIds` order followed, for collections, by `productIds` order and each
product's design order, keeping the first occurrence of each design. No cover
field or schema migration is needed. Read the [#54 receipt](../store/design-order-54.md)
and [portable-domain decision](../architecture/decisions/0005-portable-store-domain.md#artwork-reference-order--54).

A/B/C are now delivered in [draft PR #81](https://github.com/egohygiene/egohygiene.io/pull/81).
Verified implementation: `24d27ee31a72414dc7168ef5e2acd60e37b62ceb`, tree
`d027e73fbc2e5d824cf9314337b6eb4b8aeef933`. The portable selector resolves references
in declared order; actual card/page/gallery consumers pass six original/reversed
catalog permutations without runtime UI changes. Real filename-renaming tests
prove cover order is independent of discovery. Existing IDs, catalog content,
visibility and purchase validation remain intact.

Local evidence: 67 catalog tests, 55 focused units, all three typechecks, normal
build and 12-module boundary guard pass. Independent review found no blocking
issue. Browser execution was blocked by an invalid/truncated Chromium download;
no fresh browser/layout evidence is claimed. At the source head, hosted CodeQL
and dependency review failed while CI was running; no hosted pass is inferred.
See the receipt for exact scope and limits.

**Next:** sync with Alan on #54; draft #81 remains unmerged and #54 remains open.
Merge and #37/#38 selection await instruction. No deployment or purchases.

## Historical: four-digit decision-label migration — 2026-10-18 UTC

The maintainer authorized the bounded org numbering migration in [Hygiene #73](https://github.com/egohygiene/hygiene/issues/73). Default branch includes the independent #79 schema-audit merge at `988b3598c7acaa2cfbd60ecb225e557137c10713`. Its earlier open/draft checkpoint below is historical. Four inline labels and current links are padded; the per-record map is in root DECISIONS.md. The distinct implementation sequence already uses four-digit filenames. Decision content, lifecycle, storefront implementation and the pending selection below remain unchanged. Inverse decision-body comparison and documentation link/JSON/diff checks passed. Application tests were not rerun for this documentation change. No deployment or commerce activation is claimed.

## Historical: bounded schema audit review — 2026-10-18 UTC

Alan requested a quick schema audit and appropriate robustness upgrades before
continuing the roadmap. This selects a bounded #34 slice, not #54 implementation
or live-product activation. Branch: `fix/catalog-schema-audit-34`, based on main
`d8cf7e8e1825de7241d5ccecb69685e17686a75d`. Verified implementation:
`57ffa8befabbce6f0f9dc51190a2dc1273380c26`; its Git tree matches tested local source.
Read the [audit receipt](../store/schema-audit-34.md) for scope and exact checks.
Review checkpoint: [draft PR #79](https://github.com/egohygiene/egohygiene.io/pull/79),
open and unmerged. Initial publication includes documentation commit
`ded87d26e2ce7f7182728f2d57c5123adbd6d3e4`; this receipt adds no runtime changes.

A strict runtime catalog envelope now rejects unknown/missing versions and
unexpected fields before public projection or live action creation. Its type
is inferred from that schema. Existing relationship/artwork/variant guards and
non-live disabled actions remain intact. One stale Fourthwall unit fixture now
includes the existing locale provider; runtime presentation did not change.
Optional metadata was deferred until a concrete consumer requires it. All current
version-1 content, empty artist selections, disabled providers and routes remain
unchanged. #34 still owns attribution and a justified migration; no version bump.

Local evidence: 62 catalog cases, 49 focused unit cases, app/catalog/domain
types, normal/isolated builds and the 12-module import guard pass. Browser suites
were not rerun for this schema-only runtime change. Hosted checks are separate
and no new hosted success is claimed; existing #29/#73 failures remain visible.

**Next:** review this draft checkpoint with Alan; do not merge or start #54 until
instructed. The proposed sequence remains #54 ordering, bounded #37 intercepted
handoff coverage, then #38 readiness preparation. Publication is recorded in
the [ledger](provenance.md#catalog-schema-audit--2026-10-18-utc).

## Historical #62 merge and next selection — 2026-10-17 UTC

Alan authorized merging [PR #78](https://github.com/egohygiene/egohygiene.io/pull/78)
and returning to plan the next issue. GitHub confirmed the normal merge at
13:34 UTC: `71449947a2ff67ac87a512dbd8c8a11dead941fc`, from reviewed head
`f4bc59c43e194d492ea32c7bd75dacb47cd51c02` on `feat/storefront-checkpoint-62a`.
Main was read back at that merge. [#62](https://github.com/egohygiene/egohygiene.io/issues/62)
is closed as completed; A/B/C are accepted. This documentation receipt follows
the merge and does not change application code. Refresh live refs before resuming.

The recorded C local build/type/unit/browser/layout checks below remain the
implementation evidence; they were not rerun for a status-only update. At the
final PR head, hosted `validate` stopped at 27 repository formatting errors,
before tests; `dependency-review` reported unsupported repository/dependency
graph configuration. No settings or protections changed. See the
[merge receipt](provenance.md#accepted-62-merge-and-next-work-proposal--2026-10-17-utc)
for exact logs and commits. Nothing was deployed or activated for purchase.

**Proposed next: [#54 — declared cover/artwork order](https://github.com/egohygiene/egohygiene.io/issues/54).**
The current portable selector collects reference IDs into a set, then returns
designs in global catalog order, which can silently change the first cover.
This is a bounded part of #36 and needs no real artwork or paid services.

1. Define precedence: explicit `designIds` order, then collection `productIds`
   order and each product's design order, with stable deduplication.
2. Implement once in the portable selector, preserving visibility, validation,
   canonical identities and existing single-design behavior.
3. Verify cards/galleries and collection fallbacks with reversed input and
   multiple-design fixtures; save local evidence and a draft PR checkpoint.

After that, propose #37's isolated hosted-handoff browser coverage using existing
route/artwork/variant guards, then #38's provider-readiness contract preparation.
The separate readiness record is still proposed, not an existing guard. Reuse
the delivered #61 preview and #62 journey/layout work. No next-issue code has
been started; return to Alan for selection before implementing this proposal.

The dated sections below preserve historical authority and evidence; their
draft/unmerged instructions are superseded by this accepted merge receipt.

## Historical #62 checkpoint C — 2026-10-17 UTC

The maintainer requested the last checkpoint after B. Complete C in
[draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78), keeping branch
`feat/storefront-checkpoint-62a`, then return for a sync. No merge, deployment,
new artwork or live-provider activation is part of this instruction. Starting
PR head: `2c047489a1a4b583d83a135d5de7f4241773bd6f`; refreshed main:
`e52e4654fa826c7d66f47e03bc17de07fc977c2c`. Verified implementation:
`1e784ee9a0afdc228457e63714becd69a94b97c7`; all 23 published file hashes match the
reviewed local source/captures. This following receipt changes documentation only.

Read the [final review](../design/storefront-62c.md) and
[content workflow](../store/storefront-content-workflow.md). The existing A/B
architecture and public content are preserved. C supplies the remaining bounded
journey tests, empty-collection/multi-artist return coverage, purchase UI checks,
failed-image recovery, forward history, touch paths, and repeatable long-copy/RTL
layout qualification. The synthetic host is under `tests/` and is not an app
entry point. No supported locale or real artist merchandise was invented.

The public `.play()` selections are still empty; heartburst remains Incompris
artwork with no artist/song assignment or garment. The normal public catalog has
10 records (8 browsable) and 3 fictional non-purchasable products. The isolated
Demo artist preview demonstrates populated standalone/song/overlap browsing.
The content workflow explains how approved real additions can replace these
empty states without duplicate identities, new pages or provider activation.

Local verification passes: normal/isolated builds, app/catalog/domain types,
55 catalog tests, 46 focused unit tests, 31 production and six preview browser
journeys, 32 synthetic layout cases (320/390/820/1440 widths, expanded/RTL copy),
eight featured-row keyboard checks and the 12-module portable boundary. Four
inspected capture hashes and actual Chromium 138 details are in the final review;
touch/layout emulation is not physical-device or supported-locale qualification.
Hosted CI at the
starting B head still reported failed `validate` and `dependency-review` checks;
no gate was disabled and no hosted success is inferred from local passes. No
package or lockfile changes were needed.

**Next action:** sync with Alan on the complete A/B/C result. PR #78 remains
unmerged and #62 remains open for acceptance/merge review. Refresh both before
resuming; do not automatically start another roadmap item. Broader browser/device,
accessibility and translation qualification, product options and real checkout
remain in their existing issues. The dated sections below preserve prior
checkpoint authority and evidence, not current instructions.

## Historical #62 checkpoint B — 2026-10-17 UTC

After the checkpoint A sync, the maintainer requested **checkpoint 2/B**. Extend
[draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78), on
`feat/storefront-checkpoint-62a`, and **pause before checkpoint C**. The PR remains
open, draft and unmerged. Verified implementation:
`983b8bd15ec35896acda04ff1cbad861b2748d94`; all 40 published file hashes match the
reviewed local source/screenshots. This following receipt changes documentation only.
Starting remote head: `9bec5be66a17e716c325b7940ff2cf66b103e792`; main remains
`e52e4654fa826c7d66f47e03bc17de07fc977c2c`. Refresh live GitHub state before resuming.

Read the [checkpoint B review](../design/storefront-62b.md) and
[ADR 0008 extension](../architecture/decisions/0008-curated-storefront-views.md).
Incompris now leads to `/store/incompris/artists/play`. Reusable artist views
separate **Standalone & worlds** from **Shop by song**, with URL-backed search,
view changes, direct links and return navigation. Song cards reuse canonical
`/store/collections/:slug` destinations; overlapping selections reuse the same
products. Curation v1 accepts optional/defaulted artist selections without
changing catalog v1 or inferring authorship from placement.

The public `.play()` context has empty selections. Heartburst remains unassigned
to an artist/song and has no garment. The isolated local preview has a clearly
fictional Demo artist and reuses existing public demo records to prove populated
standalone/song/overlap flows. No private source, artwork, song catalog import,
provider route or purchase state changed. Normal builds exclude the additional
preview fixture and route. There are 10 public catalog records, 8 browsable;
three fictional products retain disabled purchase states.

Local verification passes: normal/isolated builds, app/catalog/domain types,
55 catalog tests, 40 focused unit tests, 27 production and five preview browser
journeys, and the 12-module portable boundary. Three inspected captures and
bounded coverage are recorded in the review. Hosted CI, live routing and commerce
qualification are not claimed.
No dependency/lockfile, hosting, account or paid service changed. The broader
checkpoint C checklist remains open even where B includes useful focused tests
and authoring notes.

**Next action:** sync with Alan on checkpoint B using the normal empty `.play()`
page and the populated fictional preview. Await the next instruction before C,
merge, deployment or real content/provider activation. Do not restart the A/B
foundation or automatically resume unrelated hosted-CI work. The dated sections
below retain earlier instructions as historical evidence, not current authority.

## Historical #62 checkpoint A — 2026-10-17 UTC

The maintainer approved the Ego Hygiene → Incompris → artist hierarchy and the
three checkpoints in [#62](https://github.com/egohygiene/egohygiene.io/issues/62),
then requested **checkpoint A only**, a draft PR, and a sync **before B**.
Branch: `feat/storefront-checkpoint-62a`. [Draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78) is open and unmerged, based on
`main`. Verified implementation: `b320b7af555d2408ce0b75dff4d4b5bc4fa44e5e`. GitHub comparison
confirmed all 43 published file hashes match the reviewed source/screenshots.
Receipt-only follow-up changes documentation; it does not change application code.
Do not infer merge or hosted CI success from the local checks.

Local checks pass: production build, app/catalog/domain types, 47 catalog tests,
28 focused unit tests, all 23 store browser journeys, five new browser cases
rerun after the final UI rebuild, and the 11-module portable boundary. The review
contains four inspected production screenshots and bounded expanded/RTL fixture
evidence. No physical-device, Safari, screen-reader or live-provider qualification
is claimed.

The implementation adds a curated Ego Hygiene shop, selected Incompris feature
row, and `/store/incompris` collection. The existing generic browser remains at
`/store/catalog` with old filtered/anchor links preserved. A strict versioned
editorial manifest selects public canonical IDs without changing catalog schema,
artist/song attribution, products, checkout routes or providers. Heartburst is
an artwork preview with no garment attached; Ego Hygiene merchandise is upcoming.
Read the [review/authoring guide](../design/storefront-62a.md) and
[ADR 0008](../architecture/decisions/0008-curated-storefront-views.md).

Refreshed starting main: `e52e4654fa826c7d66f47e03bc17de07fc977c2c`, the confirmed
merge of landing PR #77. Ownership #76 and store #34 were already merged (receipts
below). The source checkout was exported from verified main tree
`a647d8fdff8b85c14cd02ed7b42e05d7a57d7c20` before edits.

**Next action:** review checkpoint A with Alan. Do not begin checkpoint B
(`/store/incompris/artists/play`, Shop by song, stable song links) or checkpoint C's
broader qualification until selected. No new artwork, real provider, purchase,
deployment, account, paid CI or repository consolidation is part of this slice.


## Historical pause before #62 — 2026-10-17 UTC

The maintainer authorized merging the ownership and landing PRs, then returning
for a discussion of #62 **before any implementation**. Functional setup is the
priority; visual polish can be revisited later. This is not authorization to
start the next roadmap slice or add designs.

Confirmed ownership merges:

- [Website #76](https://github.com/egohygiene/egohygiene.io/pull/76):
  `08174a9ce39dfd3f2be806181b20153e94642e6a`.
- [Store #34](https://github.com/egohygiene/store/pull/34):
  `13279f96491d3dad49d9d6ebf558404eccc8103f`.

[Landing PR #77](https://github.com/egohygiene/egohygiene.io/pull/77) has been
retargeted from the ownership branch to `main` and carries this handoff for its
authorized merge. Its live PR record supplies the final merge receipt; refresh
that status before resuming. Application implementation remains
`dae9ba8b0318b1975ca8969072821ebdf93d7e9d`; later commits update context and JSON
formatting only. Existing local checks and screenshots are recorded below and
in the [review document](../design/landing-shell-35.md). No deployment or real
product was activated. Hosted checks still report failures; no checks or
protection settings were disabled to merge.

**Next conversation:** define #62's functional scope using the existing routes
and catalog. Proposed entries are World showcase (standalone designs/characters)
and Shop by song (stable song destinations for SoundCloud links). Discuss entry
labels, where each page lives, and the first complete browse-to-product example.
Preserve optional song associations and shared design/product identities. The
existing browsing/gallery/preview foundation is already implemented; do not
restart it. No #62 source changes have been made. Do not close #35's remaining
visual/accessibility qualifications merely because its checkpoint was merged.

## Historical landing/shell review — 2026-10-17 UTC

The maintainer explicitly selected **#35** and prioritized local visual progress
before hosted CI/deployment work. [Draft PR #77](https://github.com/egohygiene/egohygiene.io/pull/77)
is the new review checkpoint on `feat/landing-shell-35`. Implementation:
`dae9ba8b0318b1975ca8969072821ebdf93d7e9d`. It is stacked on the still-open
ownership draft #76 (`docs/storefront-ownership-75`, head
`98cc8d8eee1e3446a0fe10bbffb1b7aaf6f7526c`); companion store #34 also remains
unmerged. This checkpoint does not merge either ownership proposal.

Read the [rendered review](../design/landing-shell-35.md) first. It contains
before/after desktop and phone views, tablet/high-contrast examples, expanded
copy and RTL stress views, with public-asset provenance links. The root explains
Ego Hygiene, leads into the community store, features the existing heartburst
design preview and presents `.play()` as a featured creative identity. Shared
navigation/footer, mobile disclosure, skip focus and new message-based copy are
implemented. No product, checkout route, provider, deployment or new artwork
was added. The small nested-translation lookup prerequisite is fixed; full-site
localization and supported locale selection remain separate work.

Local verification passes: production build/catalog validation, app/store/domain
typechecks, portable store import guard, 38 distinct focused unit cases across
runs, three accessibility role checks, four production site smoke cases and the
18 existing store/theme browser cases (two mobile locators were updated and
rerun). Scoped formatting and whitespace checks pass. The ledger records exact
scope and limitations. Chromium renders cover 320–1920 widths, short menus,
light/dark/high contrast and synthetic locale stress. Hosted CI and full
cross-browser/device/zoom/screen-reader qualification are not claimed.

**Next:** sync with Alan on the rendered look and feel. #35 remains open for his
visual approval and remaining broad qualification. Review/merge ownership #76
and store #34 only under the current maintainer instructions; after #76 merges,
retarget #77 to main before its eventual merge. Proposed next implementation is
#62 (curated standalone designs and a distinct song-merch discovery path), then
bounded product/mock-provider journey work. Additional designs come after the
store structure is ready. Do not resume #29/hosting automatically from the
older handoff: this selected local visual sequence supersedes that priority.

## Historical ownership checkpoint — 2026-10-17 UTC

Planning [website PR #74](https://github.com/egohygiene/egohygiene.io/pull/74)
merged as `ee59e2f83c59c084c23a5f8bcc3311c2dc830859`; companion
[store PR #33](https://github.com/egohygiene/store/pull/33) merged as
`bfda1a7c6b0ce09258522be8d8fe4bf9cba8b5a3`. GitHub read-back confirmed both.
The maintainer authorized those merges and the first bounded roadmap task;
[issue #75](https://github.com/egohygiene/egohygiene.io/issues/75) now tracks it
in the existing Store v1 milestone. No new roadmap parents or reparenting occurred.

Review receipts: [website draft PR #76](https://github.com/egohygiene/egohygiene.io/pull/76)
and [store draft PR #34](https://github.com/egohygiene/store/pull/34), both open
and unmerged at this checkpoint. Branch: `docs/storefront-ownership-75` in both
repositories. Read the
[comparison/preservation plan](../architecture/storefront-ownership.md) and
[ADR 0007](../architecture/decisions/0007-canonical-storefront-owner.md).
Selected direction, submitted for review: the website owns the V1 storefront
and one composed build; `egohygiene/store` retains its commerce source/research.
Private creative sources stay separate. No application code, dependency, host,
provider configuration or purchase state changed.

The comparison records actual source capabilities, license inconsistencies,
cart/adapter test gaps, path/ID preservation, staged integration and rollback.
Website #59 retains licensing reconciliation; #61/#37/#38 retain any needed
commerce adaptation, journey tests and real-provider qualification. The useful
separate-store cart is not a proven live checkout. See the ledger for evidence.

Verification: source audit and independent review; 174 relative links, eight
cross-repository draft links, ten available anchors, 14 manifest paths, JSON,
fences/newlines and changed-line whitespace checks passed. No application tests
were rerun. Refresh CI at the new PR heads; the following is pre-merge planning
CI evidence. Pre-merge
website CI still stops at 37 formatting diagnostics and unsupported dependency
review (#29 / draft PR #73); store Quality gates pass, E2E fails on ambiguous
`Black / Small` (#32 there). These are not new passing application tests. No
protection/settings changed. Unrelated website PR #73 and store dependency
PRs #26/#27 remain open and untouched.

Next: review the paired ownership PRs, then finish #29's existing CI slice and
specify the single-app Netlify development workflow. Remaining milestone/parent
creation, production hosting and live product setup still need their respective
next checkpoints. Do not start by creating a second storefront or migrating
private repositories. Refresh live GitHub state before resuming.

The dated sections below preserve earlier authority/status; this active section
supersedes their old next actions. They do not describe current PR states.

## Historical discussion checkpoint — 2026-10-16

Website main was refreshed at `db634b887ede348ce85d9c03af789467ab535dcf`.
Separate store main is `599c90ca6a454c0f2e9aa95eab5f8395016474c5`.
Read the [launch plan](../architecture/store-launch-plan.md),
[ADR 0006](../architecture/decisions/0006-store-launch-direction.md), and
[proposed milestone backlog](../roadmaps/store-launch.md) before resuming.

The maintainer requested this documentation checkpoint in both repositories,
then a sync with proposed milestone/roadmap parent issues and sub-issues.
**Do not create those issues/milestones before the proposal is approved.**
No deployment, purchase, repository transfer, or implementation migration is
authorized by this checkpoint. Branch: `docs/store-launch-direction-20261016`.

Review receipts: [website draft PR #74](https://github.com/egohygiene/egohygiene.io/pull/74)
and [store draft PR #33](https://github.com/egohygiene/store/pull/33).
Both are published for review and unmerged at this checkpoint. Documentation
checks passed (142 relative links, available anchors, context JSON and diff
scope); application/provider/deployment qualification was not rerun.

Agreed direction: Ego Hygiene root mission/future product, community `/store`,
featured `.play()` artist, separate music merchandise catalog, local development
and merge-triggered Netlify development preview through a reusable Actions
workflow. Production host and the core product's future path remain open.

Both website and separate store contain store implementations with conflicting
ownership records. Reconcile them first. Keep private merch sources separate as
a recommendation; no relocation has been approved. Existing website CI draft
[PR #73](https://github.com/egohygiene/egohygiene.io/pull/73) remains open on
`fix/ci-baseline`; this checkpoint does not replace or merge it.

Next action: review the linked documentation and proposed milestones with the
maintainer. After approval, reuse/link existing issues, create only missing
sub-issues and parent roadmap records, then sync again before execution.
The dated handoff below retains earlier implementation/test evidence.

## Historical implementation handoff — 2026-10-13

Snapshot: **2026-10-13**. Refresh GitHub and local changes before resuming. This
file is the current handoff; [provenance](provenance.md) retains dated evidence.

## Where work stands

| Item | Observed state / source |
| --- | --- |
| Canonical repository | `egohygiene/egohygiene.io`; website/store in `apps/egohygiene.io` |
| Main at this snapshot | [PR #72](https://github.com/egohygiene/egohygiene.io/pull/72) merged at `0b536b9f62c5921d70c515fdd102001dd39e7f37` on 2026-10-13; this documentation-only merge receipt follows |
| Remaining issue | [#69 — architecture and extension contracts](https://github.com/egohygiene/egohygiene.io/issues/69), open for acceptance review and browser verification |
| Active branch / review | `main`; PR #72 is merged. No next implementation issue has been selected |
| Implementation tested | `08a092b1b576abf9c4b7ea182ec423a586ed5b34`; context commit `e7cf8581e8ec7d80e221c42e18f034465d245ff3` changes documentation only |

#69's first checkpoint extracts an app-owned portable store domain, normalizes
Fourthwall fixture input behind an adapter, and exercises an alternate disabled
fixture through the same contract. It adds a DOM-free compilation/import guard
and architecture/extension/migration guidance. See the
[implementation receipt](../architecture/store-domain-checkpoint.md).

The architecture checkpoint and agent/context layer are now on `main`. The
maintainer authorized the merge on 2026-10-13. The acceptance checklist remains
open for review and browser proof; merging this checkpoint does not close #69.

## Product context to retain

- Prioritize a useful local store; hosting/deployment is deferred. A future host
  choice does not itself require a new frontend framework.
- Designs go onto garments and other products. Showing artwork is not selling
  its source file. One design can support multiple products.
- Song links are optional. Standalone designs and character/world concepts have
  a place without inventing a song association.
- Heartburst is the first real artwork preview at `/store/designs/heartburst`.
  It has empty associations and no product attached. Its display image is an
  opaque web proof; private masters and production approval remain separate.
- Current catalog: 9 records, including 8 fictional records; 3 fictional
  products (2 preview, 1 unavailable). The checkout route list is empty and all
  provider placeholders are disabled. Additional private artwork is not
  automatically ingested by work on this repository.

## Verification and unresolved checks

At the implementation commit above: 38 catalog/build-boundary tests and 23
focused store/Fourthwall unit tests passed, as did typechecks, existing workspace
checks plus the new boundary check, and normal/isolated-preview builds. The
receipt records exact bundle measurements and negative boundary probes. No
dependency or lockfile version changed.

Desktop/mobile browser smoke **did not run**: Playwright's browser download
failed; separately downloaded Chrome 155 then failed at startup because the
execution environment denied required local socket creation. This is an
execution limitation, not evidence of a passing visual review.

Pre-merge GitHub [validation](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486285)
stopped at repository formatting with 37 diagnostics; subsequent CI test steps
did not run. [Dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486278)
reported that the repository does not support it and requested Dependency graph.
Both logs were rechecked at PR head `e7cf8581e8ec7d80e221c42e18f034465d245ff3`
before the merge. No gate/settings were disabled or bypassed. Post-merge CI and
browser verification are not claimed by this documentation-only receipt; refresh
current checks before resuming. Earlier implementation evidence remains in the
provenance ledger.

## Next concrete actions

1. Refresh `main`, #69 and current CI. Preserve new user/contributor changes.
   The maintainer asked to return and choose the next issue after this merge;
   do not assume a new implementation sprint is already authorized.
2. Choose a bounded next issue. [#29](https://github.com/egohygiene/egohygiene.io/issues/29)
   owns the current CI/format baseline repair; its CI slice can proceed without
   choosing hosting or deploying. Other options are #34's attribution and
   migration contract, #54's cover-order fix, #64's interface localization and
   #70's responsive qualification. #65 owns catalog translations separately.
3. Run the existing preview smoke where Chromium can launch, recording the
   actual revision and results. Reconcile CI blockers in the agreed scope; do
   not repeatedly reinstall browsers after an environment permission denial.
4. Review #69's acceptance checklist against the delivered code and docs. Update
   it with evidence; do not equate a merged checkpoint with a completed issue.
   #36 still owns product presentation and #61/#38 provider decisions and
   real-product qualification. Refresh any selected issue before implementing.

No new artwork generation, Drive import, framework switch or live checkout is
required to finish this architecture checkpoint. Source asset intake resumes
from the authorized private source and the [design guide](../store/next-design-session.md).

## Local commands

Current pins: Node `24.21.0` (`>=24.21.0 <25`), pnpm `11.28.5`, Task v3. Confirm
`.tool-versions` and `package.json` if this snapshot is old.

```sh
mise install node@24.21.0
mise exec node@24.21.0 -- task preview:store
```

The preview opens `http://127.0.0.1:4173/store`; heartburst is under
`/store/designs/heartburst` and the local tryout under `/store/preview/fourthwall`.
For checks, activate the pinned runtime/package manager first:

```sh
pnpm typecheck
pnpm catalog:test
pnpm test:unit apps/egohygiene.io/src/features/store apps/egohygiene.io/src/features/fourthwall-preview
pnpm check
pnpm build
task build:store
pnpm test:store:preview
```

Normal `pnpm build` emits `dist`; `task build:store` emits `dist-preview`. See
[local setup](../store/local-preview.md) for prerequisites. These are repeatable
commands, not a claim they were all rerun for a documentation-only handoff.
