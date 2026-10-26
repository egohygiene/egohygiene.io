# Context provenance ledger

Recorded 2026-10-13. This ledger routes to evidence without duplicating asset
masters, full test logs or private source inventories. Git history preserves
earlier versions; retain dated entries when the current handoff changes.


## Source hygiene #56 B — 2026-10-25

A `f7311c089b2197658851eff166ceb6486aa3cd9d` was published in draft #104 before
changes. B deletes exactly the66 inventoried outputs and26 obsolete zero-byte
paths, adds a root Storybook-output ignore and makes its command use the existing
ignored cache destination. Existing source exports/root test profiles remain;
35 required/future scaffolds and all retained provenance assets are untouched.
This does not implement their outstanding contracts or reconstruct ADR history.

C will bind fresh-checkout builds/tests/discovery and clean Git state to published
B. A fresh merged-main baseline built all three apps/Storybook sequentially, and
unit/default-browser/component-browser discovery was captured before removal.
No Chromium, broad lint/CI repair, provider call or deployment is included.

## #103 integration and source hygiene #56 A — 2026-10-25

Authority: Alan approved closing the prerequisite PR through integration and
continuing. Recovered the pruned checkout from GitHub, read instructions/context,
refreshed main/#103/#53/#56 and checks. #103 was ready/mergeable at reviewed
`b31b30551ef13766524178f364ea466e0e4f9f1f`; merge commit
`3a7527697fd9726279f809ca89235f2fbf5ac88e` has the identical tree
`68faf30731958a2ace4255068eff1db310b8df7f`. Validate40237198491 and dependency
40237198486 failed; no rule/gate changed. #53 C remains open.

Two independent read-only audits inventoried66 tracked generated outputs and61
zero-byte files, with hashes/consumers/owners in the [#56 contract](../development/source-hygiene-56.md).
Selected26 obsolete paths for removal, retaining35 required/future files. No
license, ADR history, implementation or passing test is inferred from emptiness.
Fresh merged-source website/docs/playground/Storybook baseline builds pass; their
artifacts are local comparison inputs, not hosted/browser acceptance. Save A in
its own draft before B/C. No external code/assets copied or real services activated.

## Component styles #53 local checkpoint C — 2026-10-25

B `67f1b3a1f693f69999e515fc52b93f43afbcd308`, tree
`3764e26158e59802172e99b211c3f4b7b71ec330`, was published through a lease-checked
update after saved A. Fetched source matched staging and was clean for fresh
consumer/Storybook/app builds, 42 units and four-case browser discovery. One
isolated consumer integration test includes three negative probes; its saved
receipt records no UI/app modules and declared CSS/theme output. Actual Chromium
remains unexecuted. Independent source/fixture review found no blocker; iframe
reload coverage does not establish same-document ownership transitions.

[Verification](../design/reviews/component-styles-53/verification.json) records exact
commands, versions, source, hashes, failures and limits. The first normal build
failed on a sitemap collision while Storybook also built; sequential retry passed
unchanged. Cause remains unestablished for #52. Artifact scan retains three budget
findings; B hosted CI/dependency/CodeQL failed. No policy/gate changed. C changes
only documentation/evidence; #103 remains draft, #53 actual acceptance open.

Live tracker reconciliation reopened #90/#100 after merge-linked automatic
closure; unresolved contact/copy/browser and retirement obligations are retained.
Roadmaps #84/#88 and #37/#52 receive current handoff; #29 retains stale #73 with
18 conflicts. Main remains the docs-only merge continuity commit `b075e237`.
Next sync then #56. No deployment, source deletion or real-service activation.

## Component styles #53 checkpoint B — 2026-10-25

A was published as `d04eb0d83239dfc509bf0ff4747dc75c1508ca2b` in draft #103 before
B. The moved Orbit rules preserve #49 semantics and add explicitly scoped inherited
layout/type defaults. The visualization export declares themes; consumers declare
its stylesheet. Actual Storybook build exposed missing root workspace links, now
fixed in package/lock declarations. No external versions changed. Offline frozen
install lacked registry policy metadata; normal frozen install passed the existing
policy checks. Nothing was disabled to work around it.

A separate consumer build uses real package exports and no app/UI styles; one
integration test includes three negative probes. Four browser definitions are
retained, typechecked/discovered, not executed. Corrected Storybook build, affected
types, 42 focused units and workspace checks pass. Final C evidence follows on
clean published B. ADR 0015 records ownership; no deployment or activation.

## Component styles #53 checkpoint A — 2026-10-25

Alan selected #53 after authorized integration. Main continuity input
`b075e237fb5100b8962217b16e8378542841c51f`; branch `fix/component-styles-53`.
Refreshed live issue and source; independent style/provider review confirmed no
canonical preview CSS and Orbit rules owned accidentally by UI. Installed
Storybook10.5.9 public addon helpers/types and upstream CSS/theme docs informed
[the contract](../design/component-styles-53.md), without upstream code/assets copied.

A adds canonical UI CSS, all three toolbar themes and a stable always-called
effect with an internal provider-story opt-out. ThemeToggle's real provider keeps
sole control in its story; stale inline color-scheme is removed on return to a
normal story. Strict UI Storybook types and scoped Biome pass (two informational
key suggestions). No browser/build pass is inferred. Save A before B/C; prior
browser/hosted/size limits remain, no runtime provider change or activation.

## Completed stack merge catch-up — 2026-10-25

Authority: Alan requested merging whatever PRs were needed to catch up, then #53.
Read root/current/context/provenance and refreshed open PR heads/bases, issue #53,
repository merge methods/rulesets and pre-merge checks. Independent local merge
review confirmed #94 already incorporates #93 through `9f88425`; #87/#94 merges
produce their exact reviewed trees. The #73 branch instead has 18 substantive
conflicts and is left for scheduled #29/#52 reconciliation.

Merged #87/#94/#95/#98/#99/#101/#102 in order with merge commits and expected head
SHAs; successors were retargeted to main. GitHub reports #93 indirectly merged
once its head became reachable. [Receipt](merges-2026-10-25.json) records every
head/merge. Final main `f9a687d8636a3e62b4fb103a9faf0d897b3d9319` has tree
`1150fd61778520cbdc7fa3371773af1b50b5e487`, exactly matching #102's reviewed tree.
This main continuity update changes docs only; no new app checks were necessary
for identical source. #53 starts next in its own branch.

Pre-merge validation/dependency checks remain failures; local evidence is still
source-bound. No ruleset/gate changed, workflow dispatched, Chromium run or full
qualification claim. #100 backup is integrated but source retirement/wiki/platform
work remains open. No private records, provider/product activation, deployment or
spending. Deferred issue acceptance is preserved, not silently completed by merges.

## Shared accessibility #49 local checkpoint C — 2026-10-25

B `de42f5ed5fbeeeb2456cfd380177898f7afb9048`, tree
`a29cd7707e62b0a08ca4ec73c169283fb1cf8cb3`, was published with a lease-checked
branch update after A. The published tree matched staging; fresh website/docs/
playground builds and artifact inspection ran on clean fetched source. This C
commit changes only documentation/evidence. Prior branches/main remain unchanged.

[Receipt](../design/shared-accessibility-49.md) and [verification](../design/reviews/shared-accessibility-49/verification.json)
retain 52 focused test passes, affected type/workspace/scoped checks and emitted
CSS hashes for all three apps. Source-color calculations explicitly exclude
browser/cascade proof. Six intentional important-style lint warnings remain;
no rule suppressed or unsafe fix applied. Ten browser definitions are added:
38 production accessibility and 5 playground cases discovered total, zero executed.
Independent CSS/token and browser-definition reviews found no blocker.

Normal artifact check covers44 files/202 references and preserves public artwork;
three existing budget categories fail:document raw 317,615>20,000, document
gzip 85,673>10,000 and total raw 1,287,727>1,140,000. CSS remains within its limits.
Source hosted CI 40227707743, dependency 40227707737 and CodeQL 40227708014 failed;
no new diagnosis, dispatch or gate change. The initial artifact-output path was
rejected by the script's directory guard; corrected invocation ran normally.

B implemented/local C evidence delivered in draft #102. A computed-browser and
C actual keyboard/rendering/native-zoom/screen-reader acceptance remain open for
#37/#70; #52 owns permanent playground/docs profile consolidation. Updated context,
ADR 0003 refinement and roadmap for AI resumption. Next sync, then #53. #100 C
retirement remains separate/open. No merge, deletion, deployment, product/provider
activation, private records or paid service.

## Shared accessibility #49 checkpoint B — 2026-10-25

A source inventory/contract was saved first at
`d463f3878aa58384823e4d1297313187622e869e` in draft #102, stacked on #101.
B repairs six production CSS files using ADR 0003's existing semantic layer.
Shared action pairs are explicit; focus uses its safe semantic role; docs selected
links use foreground/underline; reduced-motion duration/delay/scroll enforcement
wins later selectors without depending on the website. Existing #37 guards remain.
Ghost text and loading arcs now inherit the appropriate semantic foreground.
No tokens/generated files/dependencies/catalog/routes/provider settings changed.

Independent source review found no blocker. Source ratio tests are intentionally
limited to declared hex/token colors, not a CSS engine or browser measurement.
35 UI/theme/gallery tests, 13 ratio tests and 4 site/docs semantic tests pass.
Affected package/app types, browser definitions, workspace/exports/messages/domain
checks and scoped formatting pass. Six intentional `noImportantStyles` warnings
remain for the shared reduced-motion override, without suppression. Ten browser
definitions are retained (six information-page, four playground); zero executed.
C will pin B and fresh affected builds. Existing hosted/size/browser gaps remain;
no merge, deletion, deployment or activation.

## Shared accessibility #49 checkpoint A — 2026-10-25

Authority: Alan selected #49 after #100 preservation. Read root/context/scoped
instructions, owning themes/UI/app source, extension/dependency contracts and
ADR 0003; refreshed live issue/main/open drafts and #101 hosted workflows.
Input #101 `f85bee403f12f4400a68fc76294151fefadb00ba`; main unchanged at
`07d25941ceeefa53089afa025b612c6aa54f36c4`. Created `fix/shared-accessibility-49`.

Independent read-only source and test audits confirmed #37 already repaired the
original outline/badge/shared-button/spinner defects. [A contract](../design/shared-accessibility-49.md)
retains that work and narrows remaining action-gradient, docs-navigation and shared
motion/focus gaps. Source sRGB calculations are not fresh computed-browser values.
W3C contrast and MDN forced-color documentation informed the contract; no external
code/assets copied. No private records or purchasing state touched.

Save A in a draft before B/C. Chromium/manual/native-zoom acceptance stays deferred
to the final Mac pass. Base hosted CI/dependency/CodeQL failed; no dispatch, repair
or gate change. No previous draft merged/retargeted, deployment or activation.

## Standalone store migration/preservation #100 — 2026-10-25

Alan requested migration of useful `egohygiene/store` material before removing the
separate repository. Read both repos' instructions/continuity, refreshed source
main/branches/all 35 issue-or-PR records/all19 PR details/comments/reviews/releases,
website main/open drafts and the existing ownership decisions before editing.
Created #100 and `docs/store-retirement` from #99
`f901ed6e064f8045eea5d9e1633a43707b96e924`; prior branches/main remain unchanged.

Source main `5786fd40bfe40b0d338eb96087355b98f7e16d42`, tree
`65404b0dda75c001cc2192125c090c908c3572d4`, contains 111 files. Independent comparison
found runtime/tests/scripts unchanged since the earlier #75 source review.
Unique async/provider/cart code remains inactive recoverable reference, with
explicit existing defects/adoption owners. Original MIT notice stays intact;
website #59 licensing reconciliation remains open. No private Incompris source or
business/artwork masters were copied. No provider call or real-product change.

[Handoff](../migration/store-retirement/README.md), [manifest](../migration/store-retirement/manifest.json)
and [verification](../migration/store-retirement/verification.json) record the
self-contained Git bundle (35 commits,28 named refs), compressed normalized public
GitHub records (16 issues,19 PRs,11 comments and review activity), all 16original issue
bodies/comments and individual backlog dispositions. Historical source URLs are
retained as provenance; local records remain readable after URL retirement.
No native issue transfer/closure is claimed. Existing #38/#61/#37/etc owners are
reused; optional product research does not become a #88 setup blocker.

Offline restore, fsck, ref/commit/source-tree and 111 file/hash/license checks pass;
corruption/count/digest negative probes reject invalid copies. Six targeted
credential patterns found no matches in 192 reachable Git blobs or exported record
text; no LFS pointers/submodule files were found. This limited scan is not a full
secret/rights audit. No attachment URLs were found in captured conversation text;
no releases/tags were observed. Wiki endpoint access failed despite enabled wiki
metadata. Wiki/settings/projects/integrations/actions and other uncaptured service
state remain explicit retirement gaps. GitHub archive/delete is not exposed by
current tools; no source mutation/destructive operation was attempted.

ADR 0014 advances the prior preservation decision toward retirement, contingent on
integrated destination and complete final handoff. This checkpoint updates the
context/roadmap for resumption. #100 C remains open; #49 is next functional work.
No application tests/Chromium/hosted qualification are newly claimed. Prior #50
and broader size/CI/browser/product/deployment limitations remain unchanged.

## Shared content #50 checkpoint C and continuity — 2026-10-25

A `7f6a17b152fa4a57eea2ee88c2bb3a8cd05699af` was saved before B. Source
`1a5fbdf67fe11fb865cee1f4f93046513b0df95c`, tree
`ea944a6a56a292abaf1666a1d90cf06e2903db38`, was published to draft #99 by a
lease-checked update; GitHub and local staged trees matched. The fetched source
was clean. Main/prior drafts remain unchanged; #99 keeps #98 as its base.

[Receipt](../design/content-markdown-50.md) and
[verification](../design/reviews/content-markdown-50/verification.json) preserve
source-bound commands/results. 64 focused tests (50 content/14 docs DOM), existing
strict content/docs types, eight-file Biome and workspace checks pass. Temporary
docs browser types and five-case discovery pass; zero cases executed. Fresh docs
build emits 11 files; six app-shell routes and six directly linked assets return
expected local responses. HTTP is explicitly SPA-shell evidence, not initial
Markdown, navigation, layout or accessibility proof. The four actual source guides
and home command accuracy are covered by simulated DOM tests.

An independent read-only source/dependency/security/test review found no blocker.
A separate normal website build on clean B produces exactly the same 44 files as
#60 by path/bytes/SHA-256. The existing scanner checks 202 references/artwork and
fails exactly the same three raw/gzip document/total budgets. No ceiling/gate was
changed. Narrow lock delta: 89 additions/zero deletions; new serializer 9.0.5 and
html-void-elements 3.0.0, existing-version direct/peer contexts otherwise. No existing
version upgrade or lifecycle-script enablement. Upstream MIT packages are declared
at their consumers; no external implementation/artwork/private record was copied.

Source hosted CI 40207096653, dependency review 40207096571 and CodeQL 40207096735
were observed failed, without a manual dispatch or new diagnosis/repair. Final read-only evidence review narrowed a docs-test claim to shared-tree React
semantics: both consumers are tested separately, not by a direct parity assertion.
C updates ADR 0013, the context entry points, roadmap and review evidence. #50's local A/B/C
is ready for draft review/integration; Chromium remains with #37, permanent profile
consolidation with #52, hosted reconciliation with #29. Next is sync then #49,
reusing earlier shared focus/motion fixes. No merge, deployment, activation,
publication, purchase or spending. This follow-up changes docs/evidence only.

## Shared content #50 checkpoint B — 2026-10-25

A was durably saved at `7f6a17b152fa4a57eea2ee88c2bb3a8cd05699af` in draft #99
before shared-renderer edits. B implements the contract/ADR without changing
compiler strictness, package publication, routes, storefront or purchase state.
Content and docs work were delegated to disjoint owners; an independent read-only
review checked URL normalization, metadata, HTML/code escaping, docs examples,
lock scope and focused tests. No blocking finding remains. No upstream code copied.

50 content + 14 docs DOM tests pass together; strict content/docs types, docs build
and workspace checks pass. Lock additions are limited to direct consuming-package
dependencies, two new package versions and existing-version peer contexts. Frozen
install disables lifecycle scripts; existing warnings are retained. Browser source
has five discovered journeys, with zero executed. C must record the exact B SHA,
fresh artifact/HTTP results and current hosted failures before the final sync.
No prior draft was merged/retargeted, and no deployment or activation occurred.

## Shared content #50 checkpoint A — 2026-10-25

Alan selected #50 and reaffirmed durable notes with checkpoint pushes. Recovered
GitHub draft #98 `e4e3ec2ece527e707eda0366c2ccee9b8cc6dd92`, read root/context and
owning source, dependency rules, methodology and ADR practice. Refreshed live #50,
main and draft heads; main stays `07d25941ceeefa53089afa025b612c6aa54f36c4`.
No prior draft was merged or retargeted. Created `fix/content-markdown-50`.

Frozen script-disabled installation used pnpm 11.28.5 and checksum-verified official
Node 24.21.0 archive (SHA-256
`fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6`). No pin changed.
Package typecheck reproduced TS2375 for the undefined optional description; A
omits that property. Existing strict profile passes and four focused tests pass.
Source review confirms only docs/tests consume the content APIs; the unsafe HTML
helper is not an active docs sink. Current docs are React text, not executed MDX.

[Contract](../design/content-markdown-50.md) and [ADR 0013](../architecture/decisions/0013-shared-safe-markdown.md)
record a standard CommonMark-to-HAST parser with literal raw HTML, explicit URL
policy and shared React/HTML output. Upstream syntax-tree documentation informed
the design; no code/assets copied. Independent review identified leading-code
indentation and URL normalization edges to cover in B/C.

Save A before B/C. Existing #98 hosted CI 40112235842, dependency review 40112235847
and CodeQL 40112235969 all failed; no new diagnosis/dispatch. Prior website sizes
and deferred Chromium/contact acceptance remain source-bound. No merge, deployment,
provider/product activation, private data, package publication or spending.

## Ecosystem navigation #60 — 2026-10-24

Authority: Alan selected #60 after #91 C. Read root/context/scoped instructions,
registry/router/page sources, dependency/extension rules and relevant locale/static
rendering decisions; refreshed live #60, main, open drafts and hosted workflows
before editing. Input #95 `54e8dac7dcc3206dca05efd2951f1233daba9d99`; main remains
`07d25941ceeefa53089afa025b612c6aa54f36c4`. No existing draft was merged/retargeted.

Created `fix/ecosystem-links-60` and [draft #98](https://github.com/egohygiene/egohygiene.io/pull/98)
stacked on #95. A's [destination contract](../design/ecosystem-links-60.md) was
saved first at `a3f655f0af6142a353a900b6516fe6a5a2740bba`. B source
`b47e7e4165d83feba64ec7320f97943be9140b29`, tree
`e3da3c89b67ed39d2159b6dd1f73be95ed64b24e`, changes six code/message/test files.
GitHub-created trees matched local staging; lease-checked publication changed only
the new issue branch. Clean fetched source generated the fresh normal artifact
and raw/HTTP/artifact reports. This follow-up changes docs/evidence only.

Two production files implement the fix: existing registry paths feed native
LocaleLink headings; repository URLs remain native external anchors with distinct
project/GitHub/external text; source messages explain status pages and browsing.
Six planned/development gateway destinations remain informational; `/store` still
selects the explicit curated route. No duplicate registry, route changes, schema,
dependency, artwork, purchase-state or provider changes. Applies existing ADRs
0009/0012; no new durable architecture decision is needed. No external code/assets
were imported.

Ten new DOM/SSR/hydration cases protect seven destinations, locale, Back/return,
canonical/store route identity, repository separation and initial/native links.
Existing message tests now provide a router and exercise the repository name
placeholder. Eight new browser cases plus a strengthened existing recovery case
reuse the local-only site suite. Independent review found a skip-link fragment
history expectation, corrected before source publication; no application blocker.
Browser definitions are compiled/discovered only; zero Chromium journeys executed.

Pinned Node 24.21.0/pnpm 11.28.5; no install or lock/pin change. Local passes:
81 tests in eight files (33 + 48), app/Node/domain/browser types, workspace/exports,
433 English messages/ten namespaces, cycles, 16-module domain check and four-file
Biome. Fresh normal build emits 26 pages/ten sitemap URLs; raw parsing and 52
known-page HTTP bodies plus four discovery responses pass. No full test profile,
isolated preview rebuild or actual browser/host qualification is claimed.
[Verification](../design/reviews/ecosystem-links-60/verification.json) binds commands,
limits and hashes; [HTTP report](../design/reviews/ecosystem-links-60/raw-http-inspection.json)
and [artifact summary](../design/reviews/ecosystem-links-60/artifact-summary.json)
retain actual UTC capture times and exact source SHA.

The unchanged artifact qualifier exits 1 with three existing categories:
documents 317,615 > 20,000 bytes, document gzip 85,608 > 10,000, total
1,287,210 > 1,140,000. No other targeted findings across 44 files/202 references;
public artwork bytes match. Budget/reduction/final disposition remains #52/#92/#37;
no cap/gate change. Source hosted outcomes all failed:
[CI 40111860555](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860555),
[dependency 40111860579](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860579),
[CodeQL 40111860933](https://github.com/egohygiene/egohygiene.io/actions/runs/40111860933).
No new hosted diagnosis or manual dispatch; failures stay distinct from local checks.

Documentation checks passed: 288 relative links, 42 manifest paths, three evidence
JSON files, both evidence hashes and diff whitespace. Independent final source/
evidence review found no blocking inconsistency.

#60 A/B implemented in draft; C remains open for actual keyboard/reload acceptance
on Alan's Mac. #90 contact/copy and #91 browser acceptance remain; current serving
limits stay #57/#89. Next is #60 sync then #50. Existing finite setup/deployment
preview/product sequence is unchanged. No issue closure, merge, deployment,
provider/product activation, private data, purchase or spending.

## Public rendering #91 checkpoint C — 2026-10-24

Authority: Alan explicitly selected C. Recovered the pruned checkout from GitHub,
read root/context/scoped instructions, dependency/extension rules and ADR 0012,
and refreshed main, #91, draft stack and owning follow-ups before editing.
Input #95 head `29e24b646c494b9bb915a40d7a4098fa800e1627`; main remains
`07d25941ceeefa53089afa025b612c6aa54f36c4`. No prior draft was merged or retargeted.

Implementation `7d845bb447ccaaba8fe582a654e318e6e8315bf0`, tree
`276ea647aebc0f73887a4eb5ec2d3536d5411452`, changes eleven code/test/config files.
The GitHub-created tree matched local staging and compare-and-fast-forward updated
only #95's branch. Clean fetched source was used for fresh normal/preview builds,
final raw/HTTP/artifact reports and focused application tests. This later docs-only
receipt does not alter application output.

The [C review](../design/public-rendering-91c.md) links source-bound
[verification and evidence hashes](../design/reviews/public-rendering-91c/verification.json),
[raw/HTTP inspection](../design/reviews/public-rendering-91c/raw-http-inspection.json),
[artifact/size diagnostics](../design/reviews/public-rendering-91c/production-artifact.json)
and [before-fix reproduction](../design/reviews/public-rendering-91c/preview-regression.json).
A new parse-only verifier checks all generated documents/discovery and optional
loopback responses; existing final tooling includes it and rendering units.
Per-document static reachability was added to the existing artifact scanner
without altering budgets, findings or result semantics. Browser work added 13
retained Playwright cases and changed a guard's import to the same pure fixture
constant so discovery no longer loads Node catalog setup.

Actual local HTTP exposed a clean-path preview regression: `/about` returned the
homepage. The bounded Vite preview hook validates generated route files/hashes and
rewrites only exact known GET/HEAD lookups, retaining query strings and existing
dev/isolated/unknown behavior. Official Vite hook documentation and installed
8.2.0 implementation were reviewed; no external implementation copied. Independent
review confirmed the adapter and corrected raw-verifier symlink checking to occur
before reads. No remaining blocking source finding was identified.

Node 24.21.0 was restored from the checksum-verified official archive; pnpm 11.28.5
used the frozen lockfile with lifecycle scripts disabled. No pin/lockfile changed.
Local passes: type/boundary checks; 152 catalog/build/preview tests; 14 inspector
contracts; 158 focused unit/DOM cases in 20 files; 13-definition browser discovery.
Fresh builds preserve all 44 B normal-artifact hashes and isolated preview output.
All 26 pages/ten sitemap URLs pass parsing; 52 known-page responses and four
discovery responses match generated bytes. This is local HTTP, not Chromium;
zero browser journeys ran. Exact command scope and incomplete preliminary attempts
are recorded in verification, not promoted into full-pass claims.

Artifact qualification still exits 1 with the three prior aggregate size failures;
no other targeted findings across 44 files/202 references, and artwork bytes match.
Catalog HTML alone is 42,139 bytes; aggregate growth is not merely a page-count
artifact. #52/#92/#37 own the explicit budget/reduction/final-review disposition.
Unknown/missing-asset Vite fallbacks and 404.html remain HTTP 200; #57/#89/#39 retain
intended-server/deployment qualification. No cap raised or gate disabled. Documentation validation passed: 295 relative
links, 41 manifest paths, four evidence JSON documents, three evidence hashes and
diff whitespace. Independent evidence review found no blocking inconsistency.

Source hosted outcomes remain failures:
[CI 40107715178](https://github.com/egohygiene/egohygiene.io/actions/runs/40107715178),
[dependency 40107715175](https://github.com/egohygiene/egohygiene.io/actions/runs/40107715175),
[CodeQL 40107715276](https://github.com/egohygiene/egohygiene.io/actions/runs/40107715276).
No new hosted diagnosis or manual dispatch. #91 stays open for deferred browser
acceptance; #90 contact/copy and final manual review remain. Next is C sync, then
#60. The previously saved deployment planning remains after setup. No issue closure,
merge, deployment, provider/product activation, paid service or purchase.

## Deployment/production-preview planning — 2026-10-23

Authority: Alan asked to create issues for local/dev/staging/production deployments
using Pulumi or an alternative, followed by a visible under-construction production
site. This selected issue planning, not deployment or application implementation.
Read root/context/roadmap and ADR 0007/0012, refreshed GitHub main, draft #95 and
open issues, and performed an independent read-only scope review before changes.

Reused [#21](https://github.com/egohygiene/egohygiene.io/issues/21) for environment/IaC decisions and
[#89](https://github.com/egohygiene/egohygiene.io/issues/89) for actual host selection/publication. Created
[#96](https://github.com/egohygiene/egohygiene.io/issues/96) for repeatable environment deployment commands and
[#97](https://github.com/egohygiene/egohygiene.io/issues/97) for construction-mode behavior, both in milestone 2.
Updated #84/#31/#88/#39 and crosslinks to preserve setup order, distinguish early
public preview from #38/#39 commerce, and reuse #52/#57/#17. #21 remains outside
the milestones; existing native parent relationships were not changed. New tasks
are linked in roadmap bodies, without claiming native sub-issue creation.

The [roadmap](../roadmaps/store-launch.md) records the environment/cost/artifact
boundaries and exact order. Pulumi's [stacks](https://www.pulumi.com/docs/iac/concepts/stacks/)
and [state/backend documentation](https://www.pulumi.com/docs/iac/concepts/state-and-backends/)
informed issue references; no host/provider/cost choice was made. A future decision
belongs in #21's ADR, not a speculative architectural decision here.

Input draft head `61dd52d93c5a1b69e7eb2dea4de443a39737a48e`; main
`07d25941ceeefa53089afa025b612c6aa54f36c4`. The documentation follow-up stays
on draft #95 with its existing base and no application edits. Validation is issue
readback, documentation path/manifest checks and the documentation diff only;
prior #91 B tests remain source-bound. No fresh application, browser, HTTP,
hosted-CI or deployment result is claimed. The three artifact-size failures,
hosted failures and deferred browser/contact acceptance remain visible.

No apply/provisioning, account/DNS change, merge, deployment, product/provider
activation, paid service or transaction. Next implementation remains #91 C.

## Public rendering #91 checkpoint B — 2026-10-23

Authority: Alan asked to proceed after trying the local preview. Applied the
one-checkpoint agreement to B, retaining #90's contact/copy and browser limits.
Recovered the pruned checkout, read root/scoped context and relevant decisions,
and refreshed live main, draft heads, issue bodies and workflows before editing.
Main `07d25941ceeefa53089afa025b612c6aa54f36c4` and the existing draft stack stayed
unchanged; #95 still targets #94, which includes #87/#93. No merge was inferred.

Implementation source `3860d6062c8759a6bf522f6f50f74adff3266345`, tree
`c718864e270bacf0d1ea943e11face275f32de14`, parent
`487ae3b9fc7be10c81de26d3e2ec529418ea3fae`, changes 34 source/config/test files.
The GitHub-created tree matched local staging; compare-and-fast-forward publication
updated only `docs/public-rendering-91a`. The fetched implementation was clean.
This later documentation/evidence update does not alter application output.

[The B receipt](../design/public-rendering-91b.md) records implementation and
[exact verification](../design/reviews/public-rendering-91b/verification.json).
[Generated paths/hashes](../design/reviews/public-rendering-91b/public-routes.json),
[raw inspection](../design/reviews/public-rendering-91b/raw-inspection.json) and the
[unchanged artifact qualifier's report](../design/reviews/public-rendering-91b/production-artifact.json)
are source-bound evidence, not another catalog or committed deployable build.
The original architecture/inventory remains in A and ADR 0012.

Built shared React/Vite Data Mode routes and one immutable validated public
catalog/curation snapshot. Added build-only static rendering, route identity checks,
escaped shared metadata, explicit stable-ID indexing dispositions, deterministic
sitemap/basic llms and route receipts. All 26 current pages plus a noindex 404 are
rendered; ten enter the sitemap. Existing artwork supplies only the truthful
Heartburst image. No offer data, new artwork or dependency code was imported.
Theme/locale/query first hydration is stable, saved preferences restore afterward,
legacy forwarding waits, and mismatched artifacts use fresh client rendering.
The server bundle stays temporary and outside public output. Preview isolation,
canonical IDs, catalog v3 and disabled purchasing remain.

Parallel implementation ownership covered runtime, hydration, metadata and build;
independent review identified snapshot-failure cleanup and copied-discovery collision
edges, both fixed and tested. Root added outer-error metadata cleanup and expected
route-ID checks so future path changes cannot silently emit a missing page. Final
review found no outstanding implementation blocker; aggregate-size qualification
findings remain explicit. No unperformed browser/host review was inferred.

Pinned Node 24.21.0 was restored from the official checksum-verified archive;
pnpm 11.28.5 installed 3,770 packages with frozen lockfile and scripts disabled.
No source runtime pin/lockfile changed. Local results: types across app/Node/domain
and browser profiles; workspace/exports, 433 messages/ten namespaces, package cycles
and 16-module portable boundary; 144 catalog/build tests and 158 focused unit/DOM
tests in 20 files. Test/type evidence applies to the exact published source tree.
Two fresh normal builds at its clean commit produced 44 byte-identical files;
the isolated preview build retained Fourthwall/artist chunks with no normal route
output. Raw HTML/XML inspection checks 26 pages, ten URLs and 404 metadata without
executing scripts or requesting assets. Zero Chromium journeys executed.

The existing qualifier exits 1 with three size-budget findings: documents
317,310 > 20,000 bytes; document gzip 85,496 > 10,000; total 1,286,833 > 1,140,000.
Across 44 files and 202 asset references, there are no other targeted findings;
public artwork bytes match. No ceiling or gate was changed. These are complete
artifact aggregates, not per-page transfer or measured performance. C/final #37
with #52/#92 must explicitly reconcile them; full local qualification is not green.

Source hosted outcomes are failures:
[CI 39947201969](https://github.com/egohygiene/egohygiene.io/actions/runs/39947201969),
[dependency review 39947201941](https://github.com/egohygiene/egohygiene.io/actions/runs/39947201941),
[CodeQL 39947202162](https://github.com/egohygiene/egohygiene.io/actions/runs/39947202162).
No re-diagnosis, manual dispatch or disabled gate. They remain distinct from local
results and actual host/provider qualification.

Next: B sync then #91 C; after #91, #60 in the approved setup sequence. #90's
contact/copy disposition and final Mac browser/manual acceptance remain open.
Local static-server status/MIME belongs to #57; deployed origin/deep-link/redirect
proof to #89/#39. No issue closure, main merge, deployment, real product/provider
activation, paid order or spending. Issue #91/#88/#84 bodies and open states were read back exactly after updating
B progress; PR #95 remained draft on the same base with the expected source head.
Documentation validation passed: 316 relative links, 40 context targets, four
evidence JSON files, three evidence hashes, route/disposition counts and whitespace.
Independent evidence review found no blocker. Publication of this continuity update
is recorded in the draft PR and Git history.

## Public rendering #91 checkpoint A — 2026-10-23

Publication: [draft #95](https://github.com/egohygiene/egohygiene.io/pull/95),
source `f0342a0d52a52a11e3b4579124fa51b19d1a406d`, tree
`c2c024b7b6bcd017a4bfc3bfbf4baef1d4ed7880`. GitHub-created tree equals local
staging; fetched source reads clean. The subsequent continuity commit records the
publication, not another application change. No user work was overwritten.

Checks passed: JSON, 257 relative documentation links, 39 manifest targets, 42
source hashes against the pinned base, 26 unique routes and the proposed 10/16
split, plus diff whitespace. Independent review corrected the inventory field to
canonical contextType and required equal client/SSR public-input snapshots or
digests. No unresolved blocking A finding remained. Issue #91's A deliverables
are checked as prepared; B/C remain unchecked. #91/#88/#84 updates were read back
byte-for-byte, all open, with #90's outstanding disposition retained.

Automatic source workflows failed:
[CI 39926410428](https://github.com/egohygiene/egohygiene.io/actions/runs/39926410428),
[dependency review 39926410433](https://github.com/egohygiene/egohygiene.io/actions/runs/39926410433)
and [CodeQL 39926410517](https://github.com/egohygiene/egohygiene.io/actions/runs/39926410517).
These are hosted outcomes, not local documentation results; no new diagnosis,
manual dispatch or gate change. No merge or issue closure occurred.

Authority: Alan asked to proceed with the next issue after the discovery-file
research. Applied #91's existing one-checkpoint agreement: prepare A and sync
before B. Recovered the pruned GitHub checkout, read root/scoped context and ADRs,
and refreshed main, #91/#22/#57/#88/#90, open drafts and prerequisite checks.
No research artifact from the prior scratch workspace was assumed to survive.

Input main `07d25941ceeefa53089afa025b612c6aa54f36c4`; #94
`2096c75d381a3027d6b133f2a873f432fe2057a3`, #87
`ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6`, #93
`c7eb41f3966e93e015868f81de128c9414f4cafd`, #73
`725e021336fe6675e53d0a3374caf0b102627019` remain unmerged. New branch
`docs/public-rendering-91a` starts exactly at #94 and targets its branch; no
prior PR merge, retarget or source integration occurred.

[ADR 0012](../architecture/decisions/0012-static-public-route-rendering.md) records
selected build-time React/Vite Data Mode rendering, shared routes/public inputs,
metadata/canonical/indexing ownership, deterministic first hydration, known missing
states and local-versus-host acceptance. The
[A receipt](../design/public-rendering-91a.md) records the complete 26-path inventory
and proposed ten sitemap/16 noindex disposition. Its
[JSON evidence](../design/reviews/public-rendering-91a/inventory.json) hashes 42
inspected source files at the exact base. It is an audit snapshot, not a new route
configuration or a runtime schema-validation result. B must derive the real build
inventory through the existing validated public projection and canonical selectors.

Parallel read-only audits reviewed source routes/identities and rendering options.
The root inspected exact React Router 7.18.2 primary documentation plus React/Vite
and discovery format guidance; references are in the ADR. No third-party code,
private creative/business inputs or new assets were copied. The old framework
migration guide incorrectly called v1 current; corrected it to inherited catalog
v3/ADR 0011 without changing historical ADRs or any data contract.

The preceding discussion found Holon #7 generation, Hygiene #16 proposed policy,
Relay #16 validation and Pace #6 rollout. Their roles, experimental-file limits
and existing website files are captured in A. #91's bounded work reconciles current
llms.txt and emits the advertised sitemap; broader outputs remain #22/Holon.
Advancing #91 does not approve #90's pending contact/copy decision or close #90.

Only documentation/evidence checks apply to this checkpoint. No application suite,
build, catalog runtime, actual browser, Docker/host/provider or purchase test ran.
Recovered default Node 24.19.0 is below pinned 24.21.0; B must restore the required
runtime before application commands. Prerequisite #94 head CI 39876452521 and
dependency 39876452515 failed; C's prior source CodeQL 39875866901 remains dated
history. No hosted failure diagnosis, disabled gate or manual workflow dispatch.
Publication/validation readback is recorded at the start of this entry.

No issues closed, main merge, runtime/dependency/catalog/artwork changes, real
product/provider activation, order, deployment or spending. Next is A review then
B; broader engineering/Chromium acceptance remains in the approved final sequence.

## Website essentials #90 checkpoint C — 2026-10-22

Authority: Alan explicitly selected C. Refreshed main/open PRs and owning issues;
main remains `07d25941ceeefa53089afa025b612c6aa54f36c4`. #94 retains branch
`docs/website-essentials-90a`, based on #87's `feat/store-readiness-38`; all four
drafts #87/#93/#94/#73 remain unmerged. Existing draft ancestry is unchanged.

Source `4ff01a760399cf0bfc2dff6570ae250d71c2a879`, tree
`bff27721791af1fb39eacd7fc8dc3d880732f9e3`, parent B continuity
`b83583887bfdf0950fe83e575708909eed02a3d9`, changes three source/test files.
Independent copy review found an inherited all-browser-storage guarantee beyond
the available evidence. Narrowed it to preference persistence; all other page
copy retained. Expanded the actual-route DOM matrix to all six information pages
and added nine deferred browser definitions to the existing guarded site suite.
Independent source/test review found no remaining blocker after that correction.

The [C receipt](../design/website-essentials-90c.md) links the source-bound copy
review, authored check receipt, original generated artifacts and hosted snapshot.
Node 24.21.0 / pnpm 11.28.5; app/browser type profiles, locale validation
(433 messages / 10 namespaces), 54 focused tests / eight files and nine-definition
discovery passed. The browser follow-up clarified only a runner comment; no
behavior changed after checks. Published tree matched staging. Normal build and
scanner ran at clean source: 16 files / 12 references / zero findings, exact
approved Heartburst bytes, 966,210 raw / 583,455 level-9 gzip bytes. Original UTC
artifact capture is 2026-10-23T00:04:49.093Z (2026-10-22 in the client timezone).

Zero C browser executions; no screenshot, actual keyboard/layout/AT or full final
profile pass is claimed. Source CI 39875866505, dependency 39875866514 and CodeQL
39875866901 failed. No cause was re-diagnosed, workflow manually dispatched or gate
changed. Local evidence remains separate from hosted and production qualification.

D1 existing purpose copy retained; D2 interim public-feedback/private-channel
disposition awaits Alan; D3 browser/accessibility proof stays #49/#70/#37; D4
unknown policy facts retain #9/#59/#38/#89 ownership. C records explicit route
handoffs to #37/#49/#70/#91/#89 and commerce fact categories to #38, while #9
retains the private feedback gap. The proposed pre-launch contact arrangement is
not approved or a reason to close #90. No private material/contact was inferred or
published. No issue closure, main merge, deployment, activation, provider request,
order or spending. Next after sync is #91 A; it is not started here.

## Website essentials #90 checkpoint B — 2026-10-22

Authority: Alan selected continued work after A. Implemented the bounded pages
and navigation, retaining the separate factual/contact review and final browser
pass. Main was refreshed at `07d25941ceeefa53089afa025b612c6aa54f36c4`.

Draft integration `9f8842553908fb339fa6c43691027a3d98954bac`, tree
`37c22c29feef57b679e9435205bd12e1b6115ab8`, has ordered parents A
`a7d5e7062aa62cd09f5cf4299b8591ef04a4ffad` and #87
`ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6`. AGENTS, context README and
current-state conflicts were resolved preserving both dated histories; the
integration diff versus #87 contains seven documentation files only. #94 retains
branch `docs/website-essentials-90a` and now targets `feat/store-readiness-38`.
#87/#93/#94/#73 remain unmerged and main unchanged; this is not a PR merge.

Implementation `6f5208d7abcd9882a63f4f157b525f584ce207dd`, tree
`12d1e3b7312fa0f393cd78d533247632d02dfa88`, changes 13 source/test files for
Help/Accessibility routes, navigation, locale copy, shared warning/link and focused
tests. [B receipt](../design/website-essentials-90b.md) links authored check results,
the original generated artifact report and source-head hosted status. No copied
artwork, external policy text or private business/customer material was introduced.
About/privacy/terms copy, dependencies, schemas and real catalog remain unchanged.

Node 24.21.0 / pnpm 11.28.5; frozen offline scripts-disabled preparation reused
3,770 packages without downloads. One app type profile, 433 English messages /
10 namespaces, 25 focused tests / six files, normal build and normal-artifact
scan passed. The first three checks ran before publication on the exact tree
verified equal to the published source; build/scanner ran at clean source head.
Scan: 16 files / 12 references / zero findings; 966,182 raw / 583,438 gzip bytes;
approved Heartburst bytes match. Independent review found no remaining blocker.
These are local results with explicit simulated-DOM, scanner and provisional-size
limits, not actual browser, legal, provider or production qualification.

Source hosted failures: CI 39863154582, dependency 39863154652, CodeQL 39863154631.
Causes were not re-diagnosed; no manual dispatch or gate changes. Chromium,
responsive/keyboard/AT, broad lint/full-suite/CI repair remain deferred. C must
record factual/contact dispositions; private feedback remains #90/#9, actual
order/policy facts #38 and hosting #89. No issue closure, merge into main,
activation, provider request, paid order, deployment or spending occurred.

## Website essentials #90 checkpoint A — 2026-10-22

Authority: Alan requested forward progress after the approved issue/milestone
update. Applied #90's one-checkpoint workflow: source inventory, bounded route/
content contract and concrete copy for maintainer review. No B application work
or factual-policy approval was inferred from the request.

Exact sources: main `07d25941ceeefa53089afa025b612c6aa54f36c4`; readiness #87 head
`ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6` (implementation
`902be39761f00d73e82ea08d55ff98bc05d8e7c5`); roadmap #93 head/base for this draft
`c7eb41f3966e93e015868f81de128c9414f4cafd`. Both PRs remain unmerged. Live issues
#90/#9/#88/#38 and the three open PRs were refreshed; #73 also remains unmerged.

The [contract and review copy](../design/website-essentials-90a.md) records the
complete inventory, source links, proposed navigation, source-backed purpose,
privacy/terms boundaries, public feedback limitations and D1–D4 review items.
Read-only parallel audits covered main versus #87 and the upstream organization
dependencies. Root re-read the pinned Hygiene guide/ADR and Holon blueprint.
The Hygiene registry remains proposed; Holon's reusable policy source adapter
remains #11. Compatible meaning does not establish organization-profile adoption.
No external implementation, policy text, artwork or private material was copied.

Proposed B reuses existing About and #87 store help/disclosures, adding only
general Help and Accessibility routes plus bounded navigation/copy edits. Public
GitHub feedback is not private contact/order support; unavailable private feedback
stays a #90/#9 gap. Actual commerce evidence remains #38 and actual host evidence
#89/#39. Factual copy remains unapproved until maintainer review is recorded.

Verification passed: diff whitespace, 217 relative documentation links, ten pinned
website source paths, reference-link definitions and 32 context-manifest paths/JSON.
Independent application/source and organization-boundary reviews passed after a
pinned Terms-page link correction and more precise proposed-registry wording.
No app/browser test
run or deployed-route verification. Live failed #87 head runs:
[CI39824233656](https://github.com/egohygiene/egohygiene.io/actions/runs/39824233656),
[dependency39824233647](https://github.com/egohygiene/egohygiene.io/actions/runs/39824233647),
[CodeQL39824233914](https://github.com/egohygiene/egohygiene.io/actions/runs/39824233914).
Failed #93 head runs:
[CI39858002820](https://github.com/egohygiene/egohygiene.io/actions/runs/39858002820),
[dependency39858002819](https://github.com/egohygiene/egohygiene.io/actions/runs/39858002819),
[CodeQL39858002998](https://github.com/egohygiene/egohygiene.io/actions/runs/39858002998).
No fresh diagnosis, manual dispatch or gate change. These hosted failures and
unperformed checks are not converted into passes by this documentation checkpoint.

No app/source behavior, dependencies, assets, catalog identities, provider
configuration or ADR decision changed. No issues closed, PRs merged, provider
requests, real activation, deployment, orders or spending. Next is A copy/decision
review, then #90 B against the readiness foundation. Git history and the owning
draft PR record this checkpoint's documentation revision; issue #90 links it.

## Approved roadmap reorganization — 2026-10-22

Authority: Alan approved the complete issue arrangement after reviewing all 50 open
issues and requested that it be saved before implementation continues. The approved
split establishes a finite software-setup milestone, then actual product/provider
integration and launch, with a dedicated bounded refactor/dependency upgrade sweep.
This is issue/milestone planning and continuity work, not an architecture change.

Refreshed main: `07d25941ceeefa53089afa025b612c6aa54f36c4`. Readiness/disclosure draft
#87 remains unmerged at `ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6`; its source
`902be39761f00d73e82ea08d55ff98bc05d8e7c5` and
[pinned receipt](https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/docs/store/product-readiness-38.md)
retain implementation and test evidence. Older CI draft #73 remains unmerged at
`725e021336fe6675e53d0a3374caf0b102627019`. No new passing application/browser/hosted
result is claimed by this planning update.

Created #88 setup parent, #89 actual hosting/deployed-route qualification, #90
bounded website essentials, #91 current-route public rendering, and #92 bounded
code/dependency cleanup. Renamed milestone 1 to **Website/store foundation — ready
to onboard products** and created milestone 2 **Real products and launch**. The
[approved map](../roadmaps/store-launch.md) records exact execution order, all open
issue dispositions, narrow scope transfers and historical preservation.

Verified hierarchy: #84 coordinates #88 and #31; #88 owns 22 setup children;
#31 retains closed #32/#33/#35 and owns #38/#89/#39. #34/#36/#37 moved from #31 to
#88 with history intact. Broader #9/#22 remain linked programs outside the setup
milestone; #47 remains the audit index. #29's actual-host obligations transfer to
#89; #37's actual-provider/deployed acceptance transfers to #38/#89/#39. None of
those obligations is recorded complete merely because its owner changes.

Verification on 2026-10-22: refreshed the open-issue collection and native
sub-issue lists for #84/#88/#31/#34. All 55 open issues match the approved map:
23 setup, four product/launch, 28 outside. #88's 22 children match the documented
execution/reconciliation order. #34 has no children; #9/#22 are detached from the
roadmap parent, and #63/#84 have no milestone. The rendered milestone page confirms
23 open/ten historical closed in setup and four open/zero closed in product/launch.
No issues were closed. Existing issue bodies are retained beneath the active scope
where rewritten, and native transfers preserve their activity history.

Documentation checks: `git diff --check`, relative-link targets, context-manifest
paths/JSON and the complete 55-issue allocation passed. An independent read-only
review matched the final GitHub allocation and found no false implementation or CI
claims. This five-file continuity update is published as a docs-only draft; #84/#88
link its exact PR/commit receipt. Git history records this documentation revision.

No code, dependencies, assets, commerce configuration or architectural decisions
changed. No implementation tests, issue closures, merges, manual CI dispatch,
provider calls, deployment, activation, paid order or spending. Local checks and
hosted outcomes remain separate, with unresolved failures visible. Next is a sync,
review of #87 integration, then #90 checkpoint A when selected. Reuse existing
catalog/locale/provider boundaries and Taskfile/qualification tooling; keep private
masters and business records outside public Git.

## Authorized stack merge and local-machine final-pass plan — 2026-10-22

Alan explicitly requested #83 → #85 → #86 merges and a sync afterward. He chose
#38 readiness/relevant #9 and #22 next, then a final engineering pass run on his
own machine, with convenient Taskfile wrappers before real-product setup.
This checkpoint performs the merges and records that sequence; it starts no new
implementation or product/account work.

Refreshed all PRs and main. Reviewed heads were #83
`8a6258a1011569ac6e531fc124ccb0766f986389`, #85
`9b308a88df4446d54e0558ed35d5dd0f0bbee37e`, and #86
`49ab71e167aeecc8ad93388a0882dd4460ccac80`. Main began at
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. All heads were unchanged, mergeable,
and had failed CI/dependency-review/CodeQL outcomes. Read-only review confirmed
stack ancestry and the existing Taskfile/environment/profile entry points.

Marked each PR ready, used ordinary GitHub merges with its exact expected head,
and retargeted #85/#86 to main only after their predecessors merged. Results:

- #83 → `96243847f2e4a340081de880e4f288cc5c36339c`.
- #85 → `5ff82ca05d5fa96e199adf6f90f8abe615a4567d`.
- #86 → `bb367996a9ab36ffec29cc0fd5aee1b19d80268d`.

Readback confirmed all three merged/closed into main. Fetched main has tree
`16be01e2d757c0d34ff804f854cf5eb7d774b353`, byte-for-byte identical to #86's
reviewed head tree. No conflicts, source rewrites, forced updates, gate changes or
manual CI dispatch occurred. Existing PR-head runs remain failures:
#83 CI39227416698/dependency39227416469/CodeQL39227416865;
#85 CI39442495673/dependency39442496380/CodeQL39442495599;
#86 CI39805646227/dependency39805646399/CodeQL39805647069.
Integrated-main automatic CI39819588188 and CodeQL39819588752 also failed.
These are refreshed hosted states, not diagnoses or local-test results.

Continuity/roadmap and ADR delivery-status updates follow on main; decision
contracts and retained historical receipts are unchanged. Verification covers
ancestry/tree equality, GitHub readback, 224 relative documentation link targets,
context-manifest JSON/paths and whitespace.
No application/browser/full validation was rerun, and no fresh passing CI or
production qualification is claimed. #34/#64/#65/#37 remain open.

The final pass will reuse existing setup/build/preview/dev/tooling tasks and
wrap existing lint/type/test/browser/profile commands as useful. Optional
credential-backed Fourthwall checks remain outside default local validation.
Actual hosted CI outcomes need separate verification from checks on Alan's machine.
No private input, provider request, real translation/product activation, deployment,
order or spending occurred. Sync now, then #38 preparation, #22, local final pass,
and separately authorized real product/hosting/launch decisions.

## Catalog localization C — 2026-10-22 UTC

Authority: Alan selected the proposed C checkpoint after B, retaining the explicit
Chromium/broad-validation/CI deferral. Recovered the pruned checkout and pinned
runtime, read repository/scoped instructions and ADRs, and refreshed the unchanged
main/#83/#85/#86 stack and live #65/#84/#37. Frozen scripts-disabled installation
retained manifests/lockfile; official Node archive checksum matched the retained
runtime receipt. No new merge authority was inferred.

Implementation source `729513f2fef60cb7dd967cb7dfe2dde8d5330d24`, tree `84fe4c62da7170b0b505213163972000ac5afcd3`,
is in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86). The API tree
matched the local staged tree; source was fetched/adopted before clean normal and
isolated builds. This follow-up only records evidence and continuity. Inputs are
authored synthetic translations/review bindings plus the existing fictional #37
swatch/product/route. No private source, artwork master, business record, external
implementation or actual provider was used. Real catalog/locale/provider inputs
stay unchanged. No new architectural decision was needed beyond ADR 0010.

The [C receipt](../store/catalog-localization-65c.md) maps six fixture contracts,
four new simulated journeys, seven authored browser journeys and the
[first-language workflow](../store/catalog-language-review.md). Shared test inputs
were split from Node IO to support DOM reuse, with old exports preserved. Static
review corrected a collection selector, browser Intl expectations and marker
source paths. Initial fixture ordering/import/compiler setup errors are preserved
in [checks](../store/reviews/catalog-localization-65c/checks.json), not hidden as
successful first attempts. Final independent source review has no blocker.

Final focused evidence: 18 contracts, 9 simulated DOM cases across two files,
five type profiles, runner syntax, normal and isolated build-only checks passed.
[Normal artifacts](../store/reviews/catalog-localization-65c/artifacts.json): 16
files, 12 references, zero findings; 950,215 raw/579,950 gzip bytes and unchanged
approved Heartburst. [Isolated report](../store/reviews/catalog-localization-65c/build.json):
five public fictional entries, required translated controls, draft/stale exclusions,
seven definitions and zero browser executions. Existing module-loader warnings
remain. Authoring JSON examples/diagnostics were validated; no real human review.

Exact synthetic URL and unchanged variant mappings are tested locally; no chosen
variant transfer, browser interception, external checkout language or fulfillment
is claimed from this C run. No Chromium/screenshot/AT/layout qualification, full
suite, broad lint/refactor, CI repair/dispatch, merge, deployment, activation, order
or spending. Automatic source CI 39804875457, dependency review 39804875576 and CodeQL
39804876445 failed; status only was refreshed and retained separately in checks;
local passes do not replace hosted gates. #65 C/#64 C/#37 acceptance stays open.
Next after sync: #38 readiness/activation-record preparation with relevant #9,
then #22 and final #37 validation/CI. Existing draft stack stays unmerged.

## Catalog localization B — 2026-10-21 UTC

Alan selected B after A during the 2026-10-20 maintainer session. Restored the
pruned checkout from GitHub; refreshed #65/#84 and the unchanged main/#83/#85/#86
heads recorded in [current state](current-state.md). #86 parent
`f7b7d7ec6d1b3a43e76e20afda6ed88dab9ddcfd` hosted CI/dependency/CodeQL were failed
(39472059133 / 39472059144 / 39472059184); causes/repairs remained deferred.
Pinned Node 24.21.0 archive checksum and pnpm 11.28.5 were verified; frozen install
with scripts disabled retained manifest/lockfile hashes.

Implementation source `34a807ef173b2ddd547e9735ee344b6ffeba4514`, tree
`3081417ada645b33e4976b8ffa8c5269a5204f1a`, is in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86),
stacked on #85/#83. API-created Git tree matched the staged tested tree exactly;
local checkout adopted that exact commit before fresh builds and artifact inventory.
This docs commit adds evidence without changing source. Existing public catalog,
locale service and synthetic test records were the only inputs; no private data,
new art, real translations, external implementation or provider contact was used.

The [B receipt](../store/catalog-localization-65b.md) and [ADR 0010](../architecture/decisions/0010-versioned-catalog-localization.md)
record pure presentation data distinct from canonical purchase inputs, field-level
reviewed fallback/language, selected content vs formatting locale, and Unicode search
with original title aliases. Real source catalog/curation/provider records remain
unchanged. The brand context message closes the visible label for v2's existing
brand kind; source inventory now has 377 messages in 10 namespaces.

Final local evidence: 116 catalog tests, 73 consumer/service tests, three types,
15-module boundary, message checks, normal/preview builds and normal artifacts
(16 files, 12 asset references, zero findings). Exact commands/log hashes and corrected
attempts are in [checks](../store/reviews/catalog-localization-65b/checks.json);
[inventory](../store/reviews/catalog-localization-65b/artifacts.json) pins source and
public image bytes. Earlier test-only mistakes were a source sentinel also present
in a related context and whitespace normalization in a currency matcher; corrected
fixtures/assertions passed without changing implementation/gates. Independent review
found no remaining blocker; mixed-language accessible-name review remains deferred.

No Chromium retry, screenshots, broad lint/refactor/full qualification, CI dispatch,
merge, deployment, new public locale, live product, order or spending. Automatically
triggered source CI 39519493216, dependency review 39519493050 and CodeQL
39519493369 failed. Status only was refreshed; causes were not re-diagnosed, no
gate disabled, and local passes do not replace hosted results. Next is sync, then #65 C; #37/#29 own the final deferred validation.
#65/#34/#64/#37 remain open and all three drafts remain unmerged.

## Catalog localization A and validation deferral — 2026-10-20 UTC

Alan selected bounded progress and explicitly deferred Chromium, unrelated
refactoring and broad lint/test/CI repair until final #37. Refreshed #65/#34/#37/
#29/#84, main `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`, draft #83
`8a6258a1011569ac6e531fc124ccb0766f986389` and #85
`9b308a88df4446d54e0558ed35d5dd0f0bbee37e`; rechecked #85 unchanged immediately
before publishing. #84/#37/#64 retain the revised sequencing and open browser
acceptance. No issue hierarchy or CI gate changed.

Implementation [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86):
`879af7ebf9ffafe5467da892aef2c0eb78e87055`, tree `f5855f7f768c4863a5a6b3149e83802637a901af`. The remote
Git tree exactly matched the staged tested source. Inputs were existing public
v1 catalog records and synthetic tests; no external code, real translations,
private assets or business/rights evidence was retrieved. The ten records migrated
through the exported API, with original fields compared exactly to the parent
revision after removing only v2 additions. Empty translations and unknown attribution
make no inferred artist/rights claim. Source files and code can be restored together
from the retained parent for rollback.

[ADR 0010](../architecture/decisions/0010-versioned-catalog-localization.md) records
the inline contract, source/target/value/artwork/variant review bindings, public-safe
metadata tradeoff, independent attribution and strict one-version migration chain.
The [receipt](../store/catalog-localization-65a.md) and [authoring guide](../store/catalog-authoring.md)
record partial creative-name fallback, stale diagnostics and non-overwriting migration.
Independent review found one undefined-only field edge, fixed with regression.

Focused final results: 104 catalog contracts, 57 consumer tests, four type profiles,
normal build and 14-module boundary passed. See [checks](../store/reviews/catalog-localization-65a/checks.json)
for commands, log hashes, corrections and unrun work. An emitted-file test covers
translation sentinels; it is not a browser/layout review. Initial v1 expectation
and typed-default fixture errors were corrected for v2. A mistaken schema config
path failed, then the existing `tsconfig.build.json` passed; no validation gate
was removed. Publication's first local ref adoption used a missing remote-tracking
ref; adoption by the fetched exact commit succeeded without source changes.

No Chromium retry, broad lint/refactor, full qualification, CI dispatch, preview
deployment, provider contact, purchase or spending. Parent #85 hosted CI, dependency
review and CodeQL were failed on refresh (39442495673 / 39442496380 / 39442495599).
Source draft publication also triggered failed CI 39471602329, dependency review
39471602298 and CodeQL 39471602591. Status only was refreshed; causes were not
re-diagnosed. Those remain final-phase work, not hidden by local results. #65/#34/#64/#37 stay
open; #86/#85/#83 stay draft/unmerged. Next checkpoint is #65 B after sync.

## Locale review checkpoint C — 2026-10-20 UTC

Alan selected C after B. Refreshed draft #85 at
`10d70fe4ac84cb00b01a8416f59969f417ee406c`, unmerged draft #83 at
`8a6258a1011569ac6e531fc124ccb0766f986389`, main at
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`, and #64/#84 before editing.
Implementation is saved at `4ad0dcb90c8190b5b151eb29a6f7cc72f7895444`, tree
`1e789c79674e3c19719fe83afccb5428ac55023b`. Published and local source trees match;
final verification began clean. This following commit stores evidence and context.

Source inputs: existing public English dictionaries, shared locale runtime,
app composition, fictional catalog/artist/preview and qualification fixtures.
No external implementation or translation was copied; no private master/business
records or new assets were retrieved. English remains the only public language.

The [C receipt](../store/locale-review-64c.md) and
[workflow](../store/interface-message-workflow.md) document all-namespace checks,
key/placeholder/plural validation, partial fallback, deterministic inventories and
stale human-review detection. The source inventory contains 376 messages across
10 namespaces; hash and namespace counts are in the
[summary](../store/reviews/locale-review-64c/message-inventory.json).
Human approval is not generated by any check. An independent review found an empty
unknown-group acceptance gap; it was fixed with a regression before publication.

Final local verification: 15 message contracts, 79 catalog/artifact tests, 162 units
in 23 files, 3 semantic checks, 6 type profiles, 12-module boundary, 12-file Biome,
four syntax checks, normal/preview builds and artifact guards passed. See
[commands/results](../store/reviews/locale-review-64c/checks.json) and
[artifact inventory](../store/reviews/locale-review-64c/artifacts.json): 16 files,
12 references, zero findings; 942,190 raw / 577,797 level-9 gzip bytes under the
existing provisional limits. Heartburst bytes match. An initially invalid artifact
output path and its successful corrected invocation are both retained.

The authored 10 locale journeys reuse the same app router/provider binding; the
35 prior layout cases remain. **Neither ran at this source:** Chromium aborts
before its first page on denied process-singleton `socket()`; the cloud browser
also cannot reach the local server. See the sanitized
[blocker](../store/reviews/locale-review-64c/browser-blocker.json). No screenshots
were created. Discovery of 70 normal/6 preview tests and simulated DOM tests do not
replace browser execution. No permission bypass or public test hosting occurred.

Hosted source CI `39441196907`, dependency review `39441198023` and CodeQL
`39441197808` failed. CI installed, failed repository formatting and skipped later
validation; other causes were not re-diagnosed. No manual dispatch or disabled gate.
No full 16-step profile, actual host/provider or production qualification is claimed.

C acceptance and #64/#37 remain open. Next: usable-browser journeys/capture review,
then the fresh-build qualification profile and sync before #65/#34. #83/#85 remain
draft/unmerged; reconcile #85 after any authorized #83 merge. No merge, deployment,
real translation/product activation, account change, purchase or spending occurred.

## Historical starting ledger — 2026-10-13

| Claim / record | Evidence and revision | Limits |
| --- | --- | --- |
| Store ownership and consolidation direction | [High-level ADR-004](../../DECISIONS.md#adr-004-consolidate-the-store-v1-website-and-use-hosted-checkout), [original architecture](../architecture/store-v1.md), [migration ledger](../migration/store-v1-consolidation.md) | The original ledger is a 2026-10-10 snapshot at website `524aa4c139e926ca549f6bef067fc9ed40d15afb`; do not treat its PR states or proposed migration work as current completion. |
| Existing Fourthwall preview decision | [Implementation ADR 0004](../architecture/decisions/0004-adapt-fourthwall-for-local-store-preview.md), present on main `1c635ea2af5b254c8cd1200f479585fd941b2c33` | The ADR pins the inspected upstream starter at `e571fffe4ab7b51fa08b7441055ca0e3d92a3eeb` and states that no implementation was copied. Provider facts were researched then; reverify before live qualification. |
| Heartburst display derivative | [Asset provenance/export record](../../assets/designs/heartburst/README.md), [merged PR #71](https://github.com/egohygiene/egohygiene.io/pull/71), merge `1c635ea2af5b254c8cd1200f479585fd941b2c33` | Asset record pins the private pack revision, source blobs/SHA-256, derivative SHA-256 and conversion command. This context update uses that recorded lineage, not a new retrieval of private masters. Public proof is not print approval. |
| Portable store boundary and adapter | [Implementation ADR 0005](../architecture/decisions/0005-portable-store-domain.md), [draft PR #72](https://github.com/egohygiene/egohygiene.io/pull/72), implementation `08a092b1b576abf9c4b7ea182ec423a586ed5b34` | Decision recorded for the local checkpoint; delivery is still a draft PR. The alternate provider payload is fictional, not an external API contract. |
| Local verification, bundle and rollback evidence | [Checkpoint receipt](../architecture/store-domain-checkpoint.md) at implementation `08a092b1b576abf9c4b7ea182ec423a586ed5b34` | Reports 38 catalog tests + 23 focused unit tests, types/checks/builds, and exact byte/gzip methodology. Browser smoke was blocked before the journeys ran. Documentation updates do not turn these into new test runs. |
| GitHub CI failure evidence | [Validation run](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659599), [dependency-review run](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659412) for PR #72's implementation head | Validation stopped at 37 formatting diagnostics. Dependency review reported unsupported repository configuration. Not evidence that later CI tests ran or that dependencies were reviewed successfully. |
| Repository context layer | Maintainer request on 2026-10-13 to preserve agent instructions, ADRs, provenance and restart context; this documentation change in PR #72 | Task authorization is scoped to the requested update. No transcript, private Drive inventory or new operational authority is embedded here. |

## Merge receipt — 2026-10-13

The maintainer explicitly requested merging PR #72 and returning to choose the
next issue. GitHub confirmed [PR #72](https://github.com/egohygiene/egohygiene.io/pull/72)
merged at 15:25:52 UTC with merge commit
`0b536b9f62c5921d70c515fdd102001dd39e7f37`, preserving implementation
`08a092b1b576abf9c4b7ea182ec423a586ed5b34` and context commit
`e7cf8581e8ec7d80e221c42e18f034465d245ff3`. The earlier draft-state entries above
are historical observations. The local checkout was fast-forwarded to `main`.

At the approved PR head, GitHub reported no merge conflicts or submitted/inline
review comments. The [validation log](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486285)
again reported 37 formatting errors before subsequent CI tests, and
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486278)
again reported unsupported repository configuration and requested Dependency
graph. The normal merge API accepted the expected head; no checks or repository
settings were disabled or bypassed. This is a merge receipt, not a new runtime,
browser or post-merge CI pass. #69 remains open and no next issue is selected.

## Recording the next receipt

### Discussion checkpoint — 2026-10-16

The maintainer requested that the store/domain/hosting discussion be captured in
both application repositories, including agent hooks, continuity and ADRs, before
returning with a proposed milestone and sub-issue roadmap. Issue/milestone
creation is explicitly deferred until that proposal is approved.

Observed website main: `db634b887ede348ce85d9c03af789467ab535dcf`; store main:
`599c90ca6a454c0f2e9aa95eab5f8395016474c5`; private merch main:
`60e36d5a0cde95144920d4954cee3ed35b7bbd61`. Repository metadata, branch heads,
open PR listings, website routes/architecture/context, and store
README/AGENTS/DECISIONS/domain-routing were read. Website PR #73 and store
dependency PRs #26/#27 remain separate work. Their runtime/CI status was not
requalified by reading them.

The [launch plan](../architecture/store-launch-plan.md) records source URLs and
distinguishes accepted product direction, development preference, unresolved
implementation ownership, and future provider qualification. CLI draft previews
are not native branch deployments, and their retention is recorded explicitly.
No raw chat, private design files, credentials, or business records were copied.

Validation for the documentation capture is limited to Markdown/link checks,
context-manifest JSON, diff scope, and consistency review. App/browser/provider
tests are not claimed. No issue/milestone, infrastructure, DNS, credential,
purchase, repository transfer, or archival operation is part of this change.

### Receipt guidance

Publication receipt: [website draft PR #74](https://github.com/egohygiene/egohygiene.io/pull/74)
contains the capture at `06bf92fb2cfac9f7f00f1bf41077ad57669b7cb5`; companion
[store draft PR #33](https://github.com/egohygiene/store/pull/33) contains it at
`070d297f5b22f2a35c32bd9115860afe066f0134`. This follow-up adds review pointers.
Remote comparisons confirmed 13 website documentation/context files and nine
store Markdown files. The combined local check passed 142 relative file links,
five available local heading anchors, balanced fences and context-manifest JSON;
website diff whitespace checks and independent consistency review also passed.
Neither PR was merged and no proposed issue/milestone was created.

Record the source path or stable URL, observation date, exact implementation
commit and result. Distinguish observed facts, inherited historical evidence,
accepted decisions and proposals. State coverage gaps such as an unavailable
browser, unverified private master or skipped check. For asset bytes, preserve
source and derivative hashes and export method in the asset-local record.

Use live issue/PR links for current delivery status and commit links or dated
receipts for reproducible evidence. Neither a hash nor a merged PR establishes
copyright ownership, manufacturing quality, deployment or successful checkout.

## Planning merges and ownership audit — 2026-10-17 UTC

The maintainer requested merging the two planning PRs and beginning the first
roadmap task before the next sync. GitHub confirmed website #74 merged as
`ee59e2f83c59c084c23a5f8bcc3311c2dc830859`, store #33 as
`bfda1a7c6b0ce09258522be8d8fe4bf9cba8b5a3`. Expected heads were respectively
`8c9c0a6483b3116bc4b9d2886c98da9a7425d0a8` and
`39a478e1a395c98f61537e6b72b06df22616e34c`. Refreshed comparisons contained
13 documentation/context files and nine Markdown files; no implementation changed.

[Issue #75](https://github.com/egohygiene/egohygiene.io/issues/75) is the new bounded
ownership comparison, associated with existing Store v1 milestone 1. No full
roadmap creation or native sub-issue reparenting was performed. The
[comparison](../architecture/storefront-ownership.md) pins source trees and
paths, CI runs, license evidence, selected owner and import/cutover/rollback
conditions. [ADR 0007](../architecture/decisions/0007-canonical-storefront-owner.md)
and reciprocal store ADR-005 preserve earlier decisions and record the selected
website-owned V1 application/build for review.

Website validation at the planning head stopped at 37 existing formatting
errors; dependency review still reported unsupported/Dependency graph. Store
Quality gates passed and E2E failed on the existing duplicate Black / Small
locator. Logs were read before the normal merge API accepted each expected head;
no checks or settings were disabled. Existing CI repair and unrelated dependency
PRs were not merged. Source review found website LICENSE empty versus Apache-2.0
metadata and a complete store MIT notice; #59 retains the reconciliation.

No source code was imported or executed for this ownership checkpoint. New
validation covers documentation links, context JSON, whitespace and consistency;
prior application/browser evidence remains historical. There is no new provider,
deployment, transaction, license-repair or physical-product qualification claim.

Publication receipts: [website draft PR #76](https://github.com/egohygiene/egohygiene.io/pull/76)
and [store draft PR #34](https://github.com/egohygiene/store/pull/34). Initial
comparison commits are website `9c37849de420ce5434de39eff0272286d98a9a89` and
store `4531e46c383a94db3119dc7e6917bc2c32fc9d26`; the following context-only
commit adds these review links. Both PRs remain unmerged for the next sync.
Combined validation passed: 174 relative link targets, eight cross-repository
draft links resolved against the paired trees, ten available heading anchors,
14 manifest paths, JSON, fences/newlines and changed-line whitespace. Independent
review confirmed the comparison and fixed the reciprocal ADR-005 anchor.

## Landing/shared-shell rendered checkpoint — 2026-10-17 UTC

Authority: the maintainer selected #35 after prioritizing local visual progress
and deferring hosted CI/deployment. [Draft PR #77](https://github.com/egohygiene/egohygiene.io/pull/77)
contains implementation `dae9ba8b0318b1975ca8969072821ebdf93d7e9d`; this
following context-only commit records its receipt. Base: ownership #76 at
`98cc8d8eee1e3446a0fe10bbffb1b7aaf6f7526c`, tree
`6adc55396873085424f8bed272f65dc476bad9eb`. Website main was refreshed at
`ee59e2f83c59c084c23a5f8bcc3311c2dc830859`. Neither ownership PR was merged.

The [review document](../design/landing-shell-35.md) records visual choices,
small extension contracts and limits. The [capture manifest](../design/landing-shell-35/captures.json)
records dimensions, byte counts and SHA-256 hashes for eight browser JPEGs
(2,157,644 bytes total; no resizing). Before captures use application revision
`db634b887ede348ce85d9c03af789467ab535dcf` in a production build; intervening
planning/ownership commits did not change app source. Current screenshots use
real components and messages in a temporary local Vite review host. The host
was removed; only the reusable test dictionary generator remains. Expanded and
RTL copy are synthetic stress fixtures, not real translations. Final RTL proof
includes isolation of `.play()` punctuation. Approved identity and heartburst
source bytes were not modified; their asset-local receipts remain authoritative.

Verification used Node 24.21.0 (download checksum verified), pnpm 11.28.5 with a
frozen lockfile, and Chromium 153.0.8010.0. No package/lock version changed.

- `pnpm build`: catalog valid (9 entries, one verified image), 166 modules;
  final JS 414.01 kB / gzip 125.69 kB, CSS 42.49 kB / gzip 8.77 kB.
- `pnpm typecheck`: app, store and portable domain pass. The import guard passes
  for nine domain modules. Production output excludes locale-fixture markers.
- Focused unit run: 37 cases across 11 files passed; after adding outside-focus
  behavior, the six-case Header suite passed again (38 distinct cases in total).
  New tests cover safe lookup, public feature routing/fallback, metadata cleanup,
  nav focus/reset and message labels; existing UI primitive cases also ran.
- Accessibility role fixture: three cases pass. These are semantic/role checks,
  not a comprehensive axe or screen-reader audit.
- Production site smoke: four cases pass, including short-menu keyboard reach
  and skip link/menu closure. Existing store/theme suite: 16 initially pass;
  two mobile cases failed because they used the previous `Toggle navigation`
  label. After updating them to Open/Close, both passed. No assertion was removed.
- Rendered width samples: 320, 390, 820, 1024, 1440, 1920; light/dark/high
  contrast; expanded and RTL fixtures; short 390×300/844×300 menus. Visual
  inspection caught clipped expanded hero text, unreachable short-menu controls,
  a sticky-header skip offset and reversed artist punctuation. Each was fixed
  and the affected states rerendered. Decorative orbits extend geometrically
  but stay clipped within the art panel; no document horizontal overflow remains.
- Focused Biome check passed for 24 implementation/test files; changed-line
  whitespace passed. Existing Vite native-config/module-format warnings were
  reported and not suppressed. No full-repository formatting cleanup occurred.

No hosted CI, deployment, provider activation, purchase or manufacturing test
was used to claim completion. Physical devices, other browser engines, full
contrast/zoom/screen-reader review and Storybook parity remain explicit follow-up
work. The visual direction still needs Alan's review; #35 stays open. The next
proposed implementation is #62, subject to the sync. Existing CI #29/#73 and
separate store dependency PRs remain separate work.

## Authorized ownership merges and #62 pause — 2026-10-17 UTC

The maintainer requested closing the three pending PRs through merge and returning
to discuss #62 before starting it. Read-back confirmed the reviewed heads had
not moved: website #76 `98cc8d8eee1e3446a0fe10bbffb1b7aaf6f7526c`, store #34
`3c2a46ad74057b4ed4c7e9298bfc08193eff804f`, website #77
`127062af75e19f77e3c0a4e2a182618b195d519e`. Independent scope review found no
unexpected changes: 15 ownership documentation files, nine companion store
files and 40 landing/shell/evidence/context files respectively.

Normal expected-head merge calls succeeded for website #76 at
`08174a9ce39dfd3f2be806181b20153e94642e6a` and store #34 at
`13279f96491d3dad49d9d6ebf558404eccc8103f`. Website #77 was retargeted to main;
this documentation-only handoff accompanies its authorized merge. The live
[PR #77 record](https://github.com/egohygiene/egohygiene.io/pull/77) is the
canonical final merge receipt. ADR 0007's status now reflects acceptance.

Latest pre-merge workflow statuses were read at the exact reviewed heads:
website CI, dependency review and CodeQL fail; companion store CI fails. Known
format/dependency-review and store E2E limitations remain separate repair work;
this merge checkpoint does not claim green CI or rerun application validation.
No checks, protections or settings were disabled. Documentation links and
changed-line whitespace were checked for this handoff.

The next authorized activity is discussion, not implementation: settle #62's
World showcase / Shop by song structure and one connected product journey.
Functional setup precedes further visual polish. No #62 code, new artwork,
deployment, provider activation, purchase or unrelated PR merge occurred.


## #62 checkpoint A — 2026-10-17 UTC

The maintainer approved the three-checkpoint plan in
[issue #62](https://github.com/egohygiene/egohygiene.io/issues/62), then authorized
checkpoint A only, ending at a draft PR and sync before B. This supersedes the
prior pause-before-discussion instruction, without granting merge or deployment
authority. Branch: `feat/storefront-checkpoint-62a`.

Starting website main was refreshed at
`e52e4654fa826c7d66f47e03bc17de07fc977c2c` (confirmed #77 merge), tree
`a647d8fdff8b85c14cd02ed7b42e05d7a57d7c20`. The isolated source checkout was exported from that verified
tree; ignored generated files were not included in its local snapshot history.
Publication uses the real remote base tree and preserves those remote files. Existing unrelated checkouts and open CI work were preserved.

[ADR 0008](../architecture/decisions/0008-curated-storefront-views.md) records the
editorial manifest and route compatibility decision. The
[review/authoring guide](../design/storefront-62a.md) records the implementation,
commands, precise test scope and limitations. Heartburst was selected using its
existing canonical ID and approved public derivative; no asset, product, context,
checkout route or provider approval was added. The Ego Hygiene selection is empty.

Local validation passes: build (173 modules), app/catalog/domain typechecks,
47 catalog tests, 28 focused unit tests, 23 production store/theme journeys,
five new storefront journeys rerun against the last UI rebuild, and the portable
11-module import guard. Scope-limited format checks and diff whitespace pass;
pre-existing lint warnings remain. Independent source review found no substantive
issue. Hosted CI was not made a delivery gate and no workflow setting changed.

Four actual production route screenshots were inspected and preserved with
[SHA-256/dimension metadata](../design/storefront-62a/captures.json). Browser checks
cover 320/390/820/1440 widths. A temporary unshipped four-card QA host verified
expanded and synthetic RTL messages, native horizontal keyboard scrolling and
visible row focus at 320/390/1440 (six scenarios). It was removed before publishing.
These are bounded Chromium 153 checks, not physical-device, cross-browser,
screen-reader or provider qualification. No dependency or lockfile changed.

The publication receipt below pins the implementation revision after creating
its real GitHub commit. Documentation-only receipt changes do not imply another
application test run. Next: sync on A; do not begin artist/song checkpoint B.

### Publication receipt — checkpoint A

[Draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78) is open and unmerged on
`feat/storefront-checkpoint-62a`, targeting `main`. Implementation commit:
`b320b7af555d2408ce0b75dff4d4b5bc4fa44e5e`; tree:
`546e2f45c12251131a49d60da9b0618758c2332d`. GitHub comparison verified all 43
changed file hashes against the reviewed local source and screenshot bytes.
No ignored generated baseline file was changed remotely. This follow-up adds
only the publication receipt and capture revision metadata.

At the implementation head, hosted dependency review completed with failure
and validation was still in progress when inspected. This is not a hosted CI
pass; investigate those checks under the existing CI work rather than silently
changing gates. Local receipts above stand on their named commands and scope.
The PR stays draft for Alan's sync, and issue #62 stays open for B/C.

## Artist/song checkpoint B — 2026-10-17 UTC

Authority: after the A checkpoint, the maintainer explicitly requested checkpoint
2/B. Work extends [draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78)
on `feat/storefront-checkpoint-62a`; stop for a sync before C. Remote starting
head was `9bec5be66a17e716c325b7940ff2cf66b103e792`, tree
`bc31fd7a1814670578c48316b7eb951c6397e086`. Main was refreshed at
`e52e4654fa826c7d66f47e03bc17de07fc977c2c`. Implementation:
`983b8bd15ec35896acda04ff1cbad861b2748d94`. GitHub comparison confirmed all 40 changed
file hashes match the reviewed local source/captures, preserving untouched base
files. This following documentation-only commit records the receipt. PR #78
remains draft/open/unmerged; #62 marks A/B delivered and leaves C unchecked.

The [B review](../design/storefront-62b.md) describes artist routes, URL search,
canonical song collection links and the additive curation contract. The
[ADR extension](../architecture/decisions/0008-curated-storefront-views.md)
records why explicit artist placement does not infer attribution. `.play()` is
based on the maintainer's approved hierarchy and existing featured identity;
its public context introduces no verified release metadata or merch assignment.
Heartburst's existing asset-local provenance remains authoritative and unchanged.
The separate fictional preview uses only existing public demo catalog entries
plus a synthetic Demo artist, never assigning them to `.play()`.

Local verification includes the normal and isolated builds, types, 55 catalog
cases, 40 focused unit cases, a 12-module portable boundary check and independent
read-only source review without substantive findings. All 27 production and
five isolated-preview browser cases pass. The older Fourthwall test was updated
to traverse A's catalog entrance; no runtime workaround was needed. Three
inspected JPEGs total 387,029 bytes, with no page/image errors; capture hashes
are recorded in the review's manifest. The normal
artifact was checked for absence of the additional fictional artist IDs and both
local preview route prefixes. New interface messages use the existing provider;
full catalog translations and broad locale/device review remain separate.

No dependencies, lockfile, private artwork/master, provider wire contract or
purchase guards changed. All three fictional products remain non-purchasable.
No CI settings were changed or gates disabled; hosted CI and production/live
provider qualification are not claimed. This checkpoint is not a merge or a
completed checkpoint C.

## Final storefront checkpoint C — 2026-10-17 UTC

Authority: the maintainer requested the last of #62's three checkpoints after B.
Work extends [draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78)
on `feat/storefront-checkpoint-62a`, then returns for a sync. Starting remote
head `2c047489a1a4b583d83a135d5de7f4241773bd6f`, tree
`5d46fef71938f30e7fc3ada9ffa919c2653999db`; main remained
`e52e4654fa826c7d66f47e03bc17de07fc977c2c`. All 560 local tracked baseline hashes
matched the remote head before editing. Untouched generated remote files remain
preserved. Implementation: `1e784ee9a0afdc228457e63714becd69a94b97c7`. GitHub comparison
confirmed all 23 changed file hashes match reviewed source/docs/captures.
This following documentation-only commit records that receipt. PR #78 remains
open/draft/unmerged; #62 records all A/B/C checklists delivered and stays open for
final acceptance and merge review.

The [C review](../design/storefront-62c.md) records bounded journey/layout results
and the [content workflow](../store/storefront-content-workflow.md) gives the
repeatable approved-item/feature/artist/song steps. Six new detail-page unit
cases cover empty collections, two artist return paths, shared product identity
and purchase presentation. The live fixture is synthetic and inspected only in
JSDOM; its provider URL is never visited. Invalid route approval is rejected
before rendering a live action. No public purchase configuration changed.

The layout harness composes existing React components with the existing public
demo catalog, validated synthetic selections, longer descriptions/titles and the
existing test-only locale dictionary factory. It does not import private work,
assign demo work to `.play()`, add a production route or claim real translations.
Its labelled screenshots and capture hashes are evidence of fixture rendering,
not production catalog content. Existing asset provenance remains unchanged.

Final local runs pass: app/catalog/domain types, 55 catalog tests, 46 focused
unit tests, 31 production and six isolated-preview browser journeys, and the
12-module portable boundary. The 32-case layout matrix covers shop, Incompris,
artist standalone and artist song views at 320/390/820/1440 widths with expanded
and synthetic RTL copy; eight native featured-row keyboard/focus checks pass.
Four inspected JPEGs total 1,177,327 bytes with matching SHA-256 and no recorded
page/image errors. Normal and isolated builds pass; qualification-only markers
are absent from both, and the extra artist-preview route/ID is absent from normal
output. Independent source/docs review found no substantive issue. The content
generator example was checked in a temporary catalog; no public entry was added.
No application behavior changed in C. Existing Vite/module/config warnings were
retained, not suppressed as a repository-wide cleanup.

Workspace maintenance removed the earlier Chromium binary. The pinned
Playwright browser download returned an invalid archive; local verification uses
an external temporary `@sparticuz/chromium@138.0.2` binary reporting Chromium
138.0.7204.0. No repository dependency or lockfile changed. This is distinct from
B's Chromium 153 receipt and does not claim current cross-browser qualification.

Starting B-head hosted checks still reported failures:
[validation](https://github.com/egohygiene/egohygiene.io/actions/runs/39024327451/job/117372206930)
and [dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39024327659/job/117372207688).
Their causes were not re-diagnosed in C. No CI, branch protection, account,
provider or deployment setting was changed. The completed local evidence and
review limits belong to C's receipt; this is not a merge or launch.

## Accepted #62 merge and next-work proposal — 2026-10-17 UTC

Authority: Alan explicitly requested merging PR #78 and returning to plan the
next issue. Refreshed PR, main, reviews, comments and check runs before merging;
no new review requests or comments were present. Final reviewed PR head:
`f4bc59c43e194d492ea32c7bd75dacb47cd51c02`; main before merge:
`e52e4654fa826c7d66f47e03bc17de07fc977c2c`. Marked the PR ready and performed a
normal merge with the expected-head guard. GitHub returned and read-back confirmed
merge `71449947a2ff67ac87a512dbd8c8a11dead941fc` at 13:34 UTC, with both expected
parents and tree `31fe9e7e0cfc5041e0ad0dfed7dd1b0140405d35`. Main resolved to the
same merge. [PR #78](https://github.com/egohygiene/egohygiene.io/pull/78) is merged;
[#62](https://github.com/egohygiene/egohygiene.io/issues/62) is closed as completed,
with an acceptance receipt. Prior A/B/C entries retain their historical state.

Read final-head hosted logs:
[validate](https://github.com/egohygiene/egohygiene.io/actions/runs/39028652547/job/117384541632)
failed with 27 repository formatting errors before tests;
[dependency-review](https://github.com/egohygiene/egohygiene.io/actions/runs/39028652556/job/117384541655)
reported unsupported repository/dependency graph configuration. No gate,
protection, account, provider or deployment setting was changed. The C local
evidence remains attached to implementation `1e784ee9a0afdc228457e63714becd69a94b97c7`;
application checks were not rerun for this documentation-only merge receipt.

Refreshed open issues #36/#37/#38/#61/#29/#54 and reviewed the current portable
`getEntryDesigns` selector. It still returns references in global catalog order.
Recommend #54 next: define declared reference/collection fallback ordering, fix
the selector once, then prove card/gallery behavior with synthetic multi-design
fixtures and a local draft PR checkpoint. Follow with a bounded #37 intercepted
hosted-handoff test slice, then #38 provider-readiness preparation. Existing
route/artwork/variant guards already exist; the separate provider-readiness
record remains proposed. Reuse #61's accepted local preview and #62's delivered
navigation/layout tests. No implementation of these proposals has begun.

Updated the agent entry point, current handoff/context map and ADR 0008 status
to reflect acceptance and the next selection pause. Validated documentation
links, context manifest JSON/paths and the scoped diff. The receipt changes only
six Markdown files; it does not add artwork, products, provider activation,
deployment or a new dependency. Return to Alan to select the next issue.

## Catalog schema audit — 2026-10-18 UTC

Authority: Alan requested a quick schema audit and appropriate robustness
upgrades, then a return to chat before the next issue. Refreshed main and #34,
its comments, open PRs and main workflow status. Main remained
`d8cf7e8e1825de7241d5ccecb69685e17686a75d`; the only existing open PR was the
separate CI draft #73. Recovered a clean checkout from GitHub after maintenance.
Work belongs to #34; #54 was not started.

Implementation: `57ffa8befabbce6f0f9dc51190a2dc1273380c26`, tree
`8aea85a79b9e5ec2c48448b5df9d24680b8ae5e4`, on `fix/catalog-schema-audit-34`.
The GitHub tree equals the reviewed local implementation tree, including all
untouched baseline files. Publication used the connected GitHub API after local
Git push lacked authentication; no implementation differences were introduced.
The following documentation-only receipt does not imply a new application run.

The [audit](../store/schema-audit-34.md) records the reproduced ignored-envelope
version/metadata gap, strict shape schema, inferred type and reuse of existing
cross-record validation. Version-1 content requires no migration. Optional
attribution/readiness/image metadata was not invented; broader #34/#38 work stays
open. Shape validation alone does not approve references or purchases.

Pinned local checks pass: 62 catalog tests (seven new), 49 focused unit tests,
app/catalog/domain types, both builds and the 12-module portable guard. Initial
broader units had two existing failures from a missing locale provider in the
Fourthwall fixture. Confirmed against unchanged baseline files and repaired only
the test setup; all assertions remain. Independent review found no blocking
issue. New-test formatting/imports and changed-line whitespace pass; pre-existing
format/lint/module warnings remain in their owning CI work.

Current main [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39037276091)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39037276123)
still report failure. Their causes were not re-investigated here; the earlier
dependency-review configuration limitation is still recorded. No CI was manually
dispatched and no gate/settings were changed. Browser/device, real-provider,
production routing and print qualification were not rerun or claimed. No assets,
catalog entries, dependency/lockfile, account, checkout activation or deployment
changed. Return to Alan with a draft PR; merge and next-issue work await selection.

Publication receipt: [draft PR #79](https://github.com/egohygiene/egohygiene.io/pull/79)
was created open, draft and unmerged, with source commit `57ffa8befabbce6f0f9dc51190a2dc1273380c26`
and initial documentation commit `ded87d26e2ce7f7182728f2d57c5123adbd6d3e4`.
The latter's tree `8939d3ac70a2d3dbc4ecf2017c0a0685fba8a85f` matches the local
implementation plus reviewed documentation. This final receipt only adds links
and publication status; it does not broaden validation or close #34.


## Accepted schema audit merge and #54 checkpoint A — 2026-10-18 UTC

Authority: Alan authorized merging PR #79 and starting #54. Refreshed the PR,
main, #54 and its comments; the PR head remained
`5b87b2d2f741e93505623db10f1f71d00db9cabc`, main remained the expected base and
#54 was open with no comments. CI, dependency review and CodeQL at that PR head
all reported failure; earlier local passes were not treated as hosted success.

Marked #79 ready and merged normally with the exact expected head. GitHub
confirmed merge `988b3598c7acaa2cfbd60ecb225e557137c10713`; read back the merged
PR and main. No force merge, gate, account, provider or deployment setting changed.
The audit remains a bounded #34 contribution and does not close its broader work.

Created `fix/design-order-54` from the refreshed merge. Checkpoint A records
explicit design references first, then collection product references and their
designs in declared order, with first-occurrence deduplication. ADR 0005 records
the durable selector contract; the [#54 receipt](../store/design-order-54.md)
and catalog guide explain authoring. No new schema field or content migration.
This documentation checkpoint has no new application verification claim; B/C
implementation and local consumer evidence follow on the same draft branch.


## #54 declared artwork order checkpoints B/C — 2026-10-18 UTC

Continued the authorized #54 work in [draft PR #81](https://github.com/egohygiene/egohygiene.io/pull/81),
publishing small checkpoints: A contract `2d01f0ffccfc4b380fb899a87e1da22d652eaf40`,
B selector/Node cases `df20d8626ffe96bcf1e3e87a30c68f29252bef05`, C consumer cases
`24d27ee31a72414dc7168ef5e2acd60e37b62ceb`. The C tree
`d027e73fbc2e5d824cf9314337b6eb4b8aeef933` equals the verified local implementation
plus the A documentation. Publication used the connected GitHub API; subsequent
receipt edits are docs-only. Main was refreshed at the #79 merge, unchanged.

Baseline new tests produced four failures and one pass. The five cases pass after
replacing catalog-order assembly with declared-ID traversal and first-occurrence
deduplication. A temporary on-disk filename rename changes actual discovery order
without changing resulting covers/galleries. Canonical object identity and input
immutability, multiple explicit/fallback references, existing filtering and
validation, single-design and empty cases are covered. No schema/data migration.

Six component permutations follow actual cards to canonical product/collection
pages, checking matching covers, initial gallery image, exact thumbnail sequence,
selection counters, related-design links and no purchase link. Both source orders
are exercised. Existing components needed no runtime changes. The full focused
store/Fourthwall/artist run passed 55 cases; catalog suite passed 67. Pinned app,
catalog and DOM-free domain typechecks, normal build and 12-module import guard
pass. New-test Biome and diff whitespace pass; independent review found no
blocking issue. Exact commands and counts are in the [receipt](../store/design-order-54.md).

Browser limit: no local Chromium executable was present. Playwright's attempt to
install its Chromium headless shell failed with an invalid/truncated ZIP archive.
No fresh browser suite, screenshot or layout/device evidence was produced. Unit
image URLs are JSDOM fixtures, not decoded browser assets. The isolated-preview
build was not repeated. Existing #62 browser evidence remains historical.

At source head `24d27ee`, [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39167462290)
and [dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39167462061)
reported failure; [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39167462071)
was running at readback. No hosted success, workflow dispatch, gate override,
provider qualification or production readiness is claimed. No catalog/assets,
real artist selections, dependency/lockfile, provider setting, purchase or
deployment changed. PR #81 stays draft/unmerged and #54 stays open. Return to
Alan before merge or next-issue selection; #37 then #38 remain proposed.

## Four-digit inline numbering — 2026-10-18 UTC

Source: default branch `d8cf7e8e1825de7241d5ccecb69685e17686a75d`; maintainer naming authorization: [Hygiene #73](https://github.com/egohygiene/hygiene/issues/73). Four inline IDs and current references normalize with an explicit map in root DECISIONS.md. The distinct implementation record sequence, historical receipt text, rationale and disposition are preserved. Inverse mapping, documentation link/JSON and diff checks passed. Hosted outcomes remain separate; no new application or deployment evidence is asserted.


### #81 merge preparation — 2026-10-18 UTC

Alan authorized merging #81 and returning to explain the next issue. Main had
advanced to `443dacacf15057cc5d00822d63cf2d100da50938` through PR #80's four-digit
decision-label normalization. Merging that docs-only update into #81 conflicted
only in current-state and provenance. Preserved both histories and all numbering
changes. Application/source/test files are unchanged from reviewed #81 head
`8afe3b1d53ba29265498e92c2b74f56376885631`; no application tests were rerun for
this documentation reconciliation. Relative links, manifest JSON/paths and diff
whitespace were checked. All three hosted workflows at the reviewed #81 head
reported failure; no hosted pass or gate bypass is implied. #37 has not started.


## Accepted #54 merge and #37 scope discussion — 2026-10-18 UTC

Alan authorized merging #81, then returning to explain the next issue. Refreshed
PR head `8afe3b1d53ba29265498e92c2b74f56376885631` and main; main had advanced via
#80 to `443dacacf15057cc5d00822d63cf2d100da50938`. Reconciled the two conflicting
continuity docs, preserved all four-digit numbering changes and both histories,
and published merge commit `ca833b227168a5e4bb5b748984be7ad4847d4b7f` to #81.
Its tree matched the locally resolved tree exactly. Only Markdown changed from
the reviewed #81 head; the implementation and existing test evidence are intact.

Marked #81 ready, refreshed its exact head and clean mergeability, and merged
normally with an expected-head check. GitHub returned
`28a2ed2d712becf1513d1bd3d6190502db876a69`; read back #81 as merged, main at that
merge and #54 closed as completed. No force update, gate override, deployment,
provider activation or purchase occurred. All hosted workflows at the originally
reviewed head reported failure; no new hosted pass or browser run is claimed.

Read live #37/#38 and #37 comments, and reviewed existing tests. The useful next
slice is the real product-page external link activated in a local browser, with
an isolated synthetic catalog and an intercepted destination. Existing schema
approvals, inert Fourthwall variant/quantity preview, browse/navigation, image
failure and non-purchase coverage are reused. No cart/checkout API or transfer
of preview selections to the live link exists or is proposed by this test slice.

Suggested checkpoints: establish browser/fixture isolation and destination
expectations; exercise keyboard/mobile link navigation and Back/reload; verify
focused regressions and normal-build fixture exclusion with exact evidence. The
current browser-installation failure must be resolved for browser claims. This
advances #37 without claiming actual provider checkout, fulfillment, pricing,
shipping/tax, print quality or broader accessibility/hosting qualification.
#38 readiness preparation follows only after selection. No #37 code was started.

This follow-up updates current-state, agent/context entry points, ADR 0005 delivery
status and the #54 receipt. Documentation links, manifest JSON/paths and diff
whitespace were checked; no application rerun was needed for docs-only updates.
Return to Alan to discuss/select the next bounded checkpoint.


## Checkout-handoff #37 checkpoint 1 — 2026-10-18 UTC

Authority: Alan requested work through the proposed checkpoint and a sync after
it. The scope was stated as checkpoint 1 (usable browser, isolated fictional
inputs and intercepted destination), with a draft PR before customer journeys.
Recovered the repository after scratch pruning, read the context/scoped guidance,
and refreshed main at `1a0a3f9caa6bfb111ffff017dbb0155729a3a068`, #37/#38 and open
PRs before editing. Main was unchanged at publication. Existing draft #73 stays
separate. #54/#81 remain closed/merged; no earlier browser claim was rewritten.

Published [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82) on
`test/checkout-handoff-37a`. Verified implementation:
`2a91b2b02edb606fe594a65784ac7f5eb798173e`, Git tree
`58ac9598a1770e29d570cfe020feffd187219102`, equal to the local staged tree. This
following receipt adds documentation only. Read the
[checkpoint receipt](../store/checkout-handoff-37a.md) for exact commands,
browser acquisition, expected states and limits; its linked JSON records the
final baseline at 23:02:29 UTC.

The test-only catalog contains fresh mutable fixture inputs, a valid authored
1×1 PNG, synthetic approval metadata and a draft sentinel. Existing validation,
public projection and the actual app/catalog plugin are reused. Owned temporary
inputs/build output are cleaned in nested finally blocks. The browser allows
only the test loopback origin and locally fulfills the exact top-level GET
navigation to the fictional provider-shaped URL; no provider request continues.
Service workers are blocked, WebSockets closed, and loopback responses fetched
with no redirect following. Four negative probes include the local 302 edge case.
Normal catalog/assets/providers, application code, dependencies and lockfile are
unchanged. Public fixture approvals are test data, not real-product readiness.

All 73 catalog tests, app/catalog/domain typechecks, normal build and emitted
fixture-exclusion checks passed. Six source/config files passed scoped Biome;
diff whitespace passed. Final browser baseline on Chrome for Testing
155.0.8059.84/Playwright 1.62.1 renders all three states and decodes the swatch,
fulfills one direct destination, denies four probes and records no page errors
or unexpected WebSockets. The final tooling typecheck was repeated after the
redirect-probe change. Initial harness typing problems and an aborted-navigation
race were corrected; the redirect failure probe now uses its own disposable page.
Independent source review found no remaining blocking issue. Browser distribution
checksum and acquisition provenance are in the receipt; no binary was committed.

At source head `2a91b2b`, [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39174899850)
and [dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39174899451)
reported failure; [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39174899549)
was running at readback. Local checks do not imply hosted CI success; no gate, billing, hosting or provider setting changed. Full existing
browser/layout suites were not rerun. This baseline directly probes interception;
it does not activate the product link or cover keyboard/mobile/Back/reload yet.
No real provider checkout, variant transfer, price/shipping/tax, order, print or
fulfillment qualification occurred. #37 stays open, #82 stays draft/unmerged.
Sync with Alan before checkpoint 2; #38 is still a later readiness proposal.


## Checkout-handoff #37 checkpoint 2 — 2026-10-18 UTC

Authority: Alan approved continuing checkpoint 2 after reviewing the previous
fixture/interception checkpoint. Re-read repository/scoped context and relevant
ADRs; live GitHub confirmed main at `1a0a3f9caa6bfb111ffff017dbb0155729a3a068`,
#82 draft/open at `c9976ca548f629b012297346f00e73ac78a21dee`, and #37 open. All
three hosted workflows at that starting PR head reported failure. The current
instruction selects customer-link journeys, not checkpoint 3, merge or deployment.

Published source `e90e9b65b54a7365b6668802d8a984ee392be837` to the existing
`test/checkout-handoff-37a` branch and [draft #82](https://github.com/egohygiene/egohygiene.io/pull/82).
Its Git tree `55f71d7a2e76ab29b7eb5a801eecd070287e8ce2` equals the tested local
staged tree. This following receipt records docs/evidence only. Read the
[journey receipt](../store/checkout-handoff-37b.md) and linked machine reports for
actual timestamps, viewport/input settings, requests and screenshot hashes.

Two fresh browser contexts reuse the strict existing boundary and actual app.
Desktop reaches the purchase link with 11 native Tab presses and uses Enter;
mobile uses touch tap at 390×844 CSS pixels. Each activates the actual link twice,
reloads the local destination once, returns through Back twice and reloads the
canonical product twice. Exactly three destination requests per context are
fulfilled locally. Preview/unavailable products are reached through real
product/design SPA links, retain truthful statuses and expose no purchase action
before or after reload. No unexpected requests, WebSockets, extra pages or page
errors occur; both tested widths have no horizontal overflow.

The first run passed functionally, but manual screenshot review found the test
public directory omitted the shared shell logo. The runner now copies only the
existing `apps/egohygiene.io/public/icons/icon-192x192.png` into its owned temporary
directory. Final live-page checks decode both that 192px public logo and the
1px authored fixture swatch. Source assets and runtime UI were not modified.
Final desktop/mobile captures were inspected for focus, action/disclosure fit
and the corrected logo. Capture origins and SHA-256 hashes are in the report;
these are test evidence, not new artwork or merchandise approval.

Fresh local evidence: both journey scenarios, the earlier boundary baseline,
six focused Node fixture/request cases, catalog/tooling typecheck, scoped Biome
and diff whitespace pass. Chrome for Testing 155.0.8059.84, Playwright 1.62.1,
Node 24.21.0 and the existing pnpm 11.28.5 setup were reused; acquisition details
remain in checkpoint 1. Independent review found no blocking issue before or
after the logo correction. No package/lockfile, normal catalog, private creative
source or provider configuration changed. Full catalog/app-domain types/normal
build and existing store/preview/layout suites were not rerun; earlier passing
results remain historical rather than fresh evidence for this turn.

This proves a website link/return journey against inert local HTML. It does not
qualify provider checkout, variants, pricing/shipping/tax, returns, fulfillment,
physical devices, print quality or a full accessibility/browser matrix. Interception
disables HTTP caching, so no cache/BFCache behavior is claimed. No actual provider
request, purchase, deployment, remote CI dispatch or gate override occurred.
#37 stays open and #82 draft/unmerged. Sync with Alan before checkpoint 3's
regression/artifact closeout; #38 readiness remains proposed.


At checkpoint 2 implementation head `e90e9b6`, hosted
[CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39177365551),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39177365587)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39177365614)
all reported failure at readback. This does not alter the separately recorded
local passes. No workflow was manually dispatched or gate changed.


## Checkout-handoff #37 checkpoint 3 — 2026-10-19 UTC

Authority: after the checkpoint 2 sync and a brief explanation of regression/
smoke checks, Alan explicitly requested the next checkpoint and a complete draft
PR. Scope: focused regression and normal-artifact closeout of the existing local
handoff slice. No merge, #38 implementation, deployment or provider activation.
Refreshed main remained `1a0a3f9caa6bfb111ffff017dbb0155729a3a068`; #82 was draft,
open and unmerged at `89d33e49eca49530645042930df92373daf33a84`; #37 remained open.
Read root/scoped instructions and the current receipts before running checks.

All checks use tested commit `89d33e49eca49530645042930df92373daf33a84`, tree
`4083c3b8e5a462e145d78383c547f010e93a83f8`. Implementation remains
`e90e9b65b54a7365b6668802d8a984ee392be837`; no test/runtime code fix was required.
The following publication adds evidence/continuity only. Read the
[checkpoint 3 receipt](../store/checkout-handoff-37c.md),
[check inventory](../store/reviews/checkout-handoff-37c/checks.json), fresh
[handoff reports](../store/reviews/checkout-handoff-37c/journeys.json) and
[normal artifact manifest](../store/reviews/checkout-handoff-37c/production-artifact.json).
Capture/report timestamps are UTC; Alan's local date was October 18.

Fresh passes: 73 catalog/public-build tests; 53 store/Fourthwall units plus two
artist fixture units (55 across ten files); app/catalog/portable-domain types;
12-module import boundary; seven source/config files' Biome; normal build and
31 unchanged production-browser cases; isolated preview build and six unchanged
Fourthwall/artist browser cases; the handoff baseline and two actual native
keyboard/touch return journeys. Browser suites used no configured retry and
passed without a code change. Pinned Node 24.21.0, pnpm 11.28.5, Playwright 1.62.1
and the existing verified Chrome for Testing 155.0.8059.84 executable were reused.
No package or lockfile changed; the acquisition record remains checkpoint 1.

Normal artifact verification hashes all 16 emitted files, scans eight text
files plus every emitted path for ten explicit fixture/route/qualification
markers, and checks three public catalog controls. No excluded marker appears;
Heartburst's emitted derivative equals its approved public source byte-for-byte.
The manifest and receipt preserve the exact reproduction code and raw/gzip
sizes. These are targeted isolation checks and measurements, not a general
secret audit or an invented performance budget. Nine provider records remain
disabled; real routes stay empty. Runtime application/schema/catalog/public
artwork/provider files are unchanged from main.

Desktop/mobile catalog and artwork-viewer captures plus both Fourthwall preview
captures were inspected. Selected Heartburst and Fourthwall mobile captures are
retained in this receipt with hashes; other inspected raw captures are ignored
local outputs with hashes/commands recorded in the manifest and check inventory.
Fresh handoff
captures exactly match checkpoint 2's retained PNG bytes, which the fresh report
references. Labels, artwork/modal presentation, focus and the reviewed mobile
action/disclosure fit remain usable. No new defect was found in the selected
checks. Independent source/evidence review found no blocker.

At the tested head, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489271),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489275)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489490)
all reported failure. Those outcomes are separate from the local passes; no
gate was disabled, workflow manually dispatched or paid service enabled.
No new locale/expanded-text/RTL matrix, broad screen-reader/zoom/contrast audit,
physical-device/browser matrix, deployed-host behavior, migration or real-provider
qualification is claimed. No cache/BFCache claim follows from interception.
No actual provider, order, purchase activation, print/fulfillment proof or
deployment occurred. Existing #62 work was reused rather than rebuilt.

The three checkpoints of this bounded slice are complete in the same draft #82.
Keep #37 open for its wider scope and keep #82 unmerged for Alan's acceptance.
Next action: sync on the complete review; merge only if instructed, then discuss
#38 readiness preparation. The proposed separate readiness record is not an
implemented eligibility guard. No new ADR is needed for this test/evidence work.

## Checkout-handoff #82 merge and continued #37 authority — 2026-10-19 UTC

Alan explicitly instructed: merge the completed PR and continue #37 for completion.
Refreshed #82 was draft/open, mergeable, with unchanged head
`7b5433971acf671db812ec6b20dcd7569e4635a8` and base
`1a0a3f9caa6bfb111ffff017dbb0155729a3a068`. Marked ready and merged normally
with that expected head; merge commit is
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`. Fetched the merge and created
`test/store-qualification-37` from it. No unrelated branch or gate changed.

At the merged head, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39182109806),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39182109840)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39182109970)
reported failure. Previously recorded local checks are not hosted passes.

The new selection is broader #37 qualification; #38 preparation remains unstarted.
The audit reuses existing #54/#55/#62 and intercepted-handoff evidence, identifies
remaining local accessibility/artifact/profile work, and keeps absent migration/
locale contracts and external verification explicit. No paid service, deployment,
real provider contact, order or commerce activation is included.

## Broader #37 local qualification — 2026-10-19 UTC

Authority continues Alan's instruction to merge #82 and work toward #37
completion. Refreshed main stayed at `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`.
Source published to [draft #83](https://github.com/egohygiene/egohygiene.io/pull/83)
as `5e148843998a44ce7c7923c0fd27cf944dce5187`, tree
`01bfbe2568bfab4470e7f967b0e4e5128107f373`; the API tree equals the staged local
tree. Fetched/read back the branch and ran the complete profile with a clean
checkout. This subsequent publication contains review evidence and continuity only.

The [receipt](../store/qualification-37.md) maps exact requirements and remaining
dependencies. [Commands/timings](../store/reviews/qualification-37/checks.json),
[browser cases/contrast/captures](../store/reviews/qualification-37/browser.json),
[normal output inventory](../store/reviews/qualification-37/production-artifact.json)
and [all retained evidence hashes](../store/reviews/qualification-37/manifest.json)
are durable. Images originate from actual local browser captures of existing
public artwork/fictional fixtures, without manipulation or private sources.
The root reviewed the two enlargement/reflow captures, expanded tablet collection
and synthetic RTL artist capture; the final profile retains all associated raw
files and explicit limits. No screenshot baseline or print approval is inferred.

All 13 profile steps passed: 79 catalog/artifact Node cases; 92 store/preview/
theme/locale units across 13 files; three semantic component cases; app/catalog/
portable-domain/browser type profiles; 12-module import boundary; fresh normal
and isolated preview builds; 70 normal browser and six isolated preview cases
with zero retries; intercepted baseline plus keyboard/touch journeys; 35 synthetic
layout/regional/motion cases. Scanner: 16 files, 12 local references, zero findings.
Selected text/focus sample minima are 5.934/7.533, with raw computed values retained.
The Node 24.21.0/pnpm 11.28.5/Playwright 1.62.1/Chrome for Testing 155.0.8059.84
setup was reused. No dependency, lockfile, provider or catalog change.

Implementation adds a fail-fast fresh-build profile, selected browser compiler
profile, active shell/metadata cases, computed contrast/focus and reference/
breakpoint layouts, and a repeatable artifact checker with six negative/positive
fixtures. Shared CSS replaces shadow-only focus, improves badge-label contrast
and explicitly respects reduced motion on shared buttons/spinners. Test-only
regional numbering uses `ar-u-nu-arab`: a preflight bare-`ar` digit assumption was
invalid in this browser and was corrected without changing production locales.
A test logo locator was also scoped to the header during preflight. Final source
passed the combined run without a runtime fix or retry. Independent source review
found no blocker; suggested request guards and required contrast sample presence
were incorporated before publication.

#37 remains open: an actual justified migration belongs to #34 and true locale/
fallback/catalog translation contracts belong to #64/#65; no invented version or
translation is called delivered. Size ceilings are concrete provisional local
regression limits for review, not an already-agreed launch budget. CSS root-text
and short-viewport reflow probes do not establish native browser zoom. Wider
engines, assistive technology, physical devices, deployed-host/crawler behavior
and real-provider/print/fulfillment evidence remain explicit. #38 remains unstarted.
Existing #49/#52/#70 scopes are not closed incidentally. Next: sync on draft #83,
its proposed budgets and the exact upstream completion sequence.

At the tested source, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917425),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917449)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917918)
failed. Job readback establishes installation passed, format checking failed and
later CI stages were skipped. Detailed dependency/CodeQL causes were not newly
diagnosed. No gate change or manual workflow dispatch occurred. Local results
remain local; no deployment, real provider request, purchase or activation.

Final review: 13 source/config files passed scoped Biome with two environment
warnings and two bracket-key suggestions in the browser config; no gate was
disabled to silence them. Evidence hashes, JSON, context paths, 145 relative links
and whitespace passed validation. Independent source/evidence review found no
blocker. The old test-plan heading was marked historical to avoid confusing its
18-case baseline with the current 70-case profile. Issue #37 now checks delivered
B/fixture/adapter work and records the precise open migration, locale, performance
and environment dependencies. #83 remains draft; no follow-up merge occurred.

## Remaining work roadmap — 2026-10-19 UTC

Alan requested one roadmap issue containing the remaining order, existing
sub-issues and discussion notes. Live issue/PR/main snapshots and #31's native
children were refreshed. Main was `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`;
draft #83 was `60ff62f060fe2fa4cb461bee21942f49aa59b1a2`. #31 retains native
children #32–#39, including closed #32/#33/#35; #47 and #3 had no native children.

Created [roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84) in the
existing Store v1 milestone. It captures #83/budget review, #64, coordinated
#65/#34, remaining local #37 work with #49/#70/#52, #38 readiness and applicable
#9 disclosures, #22/#29 release preparation, and final #37/#39 acceptance.
It preserves prior delivered work, identifies #36/#61/#69/#75/#51 reconciliation,
and records cost/privacy/product boundaries, evidence limits and later work.
An independent read-only review caught the need to retain #37's final host
acceptance until release and to include the bounded #9 customer disclosure work.

Issue creation was read back with identical body and milestone 1. Native
hierarchy mutation is not exposed by the connected GitHub tools; only the ordered
links/checklists are saved. The intended hierarchy nests #31 under #84 without
moving its children, then attaches the other owners after refreshing their
parents. Browser fallback requires approval under the browser tool's instructions.
No native relationship was changed or represented as completed. #31 links to
the new execution guide while retaining its original body/history.

This follow-up changes continuity documents only on `test/store-qualification-37`
in draft #83. Validation is relative-file links, context-manifest JSON/paths,
diff whitespace and remote readback; no runtime/browser/provider checks were
rerun. Prior local qualification and failed hosted runs remain dated evidence,
not fresh results for this planning update. No ADR is needed for issue
coordination. No merge, next implementation checkpoint, deployment, account,
product activation or purchase was performed.

## Native roadmap and locale contract A — 2026-10-20 UTC

Authority: Alan explicitly approved browser fallback for native roadmap links and
asked for more progress while away. Recovered the pruned scratch checkout from
GitHub; re-read root/scoped context, relevant ADRs and live issue/PR/main states.
Main was `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`; #83 remained draft/open at
`8a6258a1011569ac6e531fc124ccb0766f986389`. No prior unmerged PR was merged.

Completed [#84](https://github.com/egohygiene/egohygiene.io/issues/84)'s native
hierarchy through the authorized GitHub browser UI: direct children
#31/#64/#65/#49/#70/#52/#9/#22/#29/#61/#69/#75/#51. Readback confirmed #31 still
has #32–#39. Other targets had no native parent before attaching. A transient UI
result-list change attached #5 accidentally; that relationship was removed and
the final exact set verified. #5 itself, its body and state were unchanged.
#31's old program body/history and existing milestone assignments were retained.

Selected the next bounded #64 checkpoint A rather than starting product activation.
[Draft #85](https://github.com/egohygiene/egohygiene.io/pull/85), branch
`feat/locale-contract-64a`, is stacked on #83's branch. Source
`bd217fed480fbc6124ad4bf0e23865605c8ef0c7`, tree
`2bf0ba9db2b66da881bc4e61168083179c2d5070`, equals the local staged tree.
Fetched the source commit and ran the final focused checks from a clean checkout;
this follow-up adds evidence and continuity only.

[ADR 0009](../architecture/decisions/0009-single-locale-runtime.md) records the
single-runtime/registry/fallback/URL contract. Existing safe lookup remains; new
translation calls add source fallback, finite-count cardinal plurals and plain-text
named interpolation. Registry validation covers canonical IDs, direction, Intl
support and deterministic source-last fallback graphs. The app keeps English-only
registration; pure helpers handle validated URL/preference precedence and denied
storage without browser side effects. No language picker, DOM direction update or
real translation is claimed. Existing catalog/providers/artwork/dependencies stay
unchanged; no schema bump or extra runtime was introduced.

[Receipt](../store/locale-contract-64a.md), [exact checks](../store/reviews/locale-contract-64a/checks.json)
and [normal artifact inventory](../store/reviews/locale-contract-64a/artifacts.json)
retain the commands, timestamps, source and limits. Final local result: 128 tests
across 19 files, two type profiles, 12 portable modules, 11-file scoped Biome,
fresh normal build and artifact checks pass. Artifact output: 16 files, 12
references, zero findings; 929,781 raw/575,609 level-9 gzip bytes. Existing budgets
remain provisional. An initial scanner output-path argument was rejected before
scanning; only the argument was corrected and the failed invocation is retained.
One informational Biome bracket-key suggestion and existing module notices remain.
Independent source review found no blocker. No browser/device/AT/provider or
full #37 suite was rerun for this contract-only scope.

Node 24.21.0/pnpm 11.28.5 were recovered through official sources and the existing
frozen-lockfile, ignore-scripts setup. Node archive SHA-256
`fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6`
matched the vendor checksum. Actual TypeScript 5.9.3, Vitest 4.1.11 and Vite 8.2.0
came from the unchanged lockfile. No runtime binary or private source was committed.

At source head, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39369768853),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39369768913)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39369769095)
failed. CI installed successfully then failed formatting and skipped later stages.
No hosted success is inferred from local checks; no gate change/manual dispatch.

Next: review #83 and #85; #64 B/C are the next implementation checkpoints, followed
by coordinated #65/#34 and remaining #37 evidence. Retarget #85 after #83 only
when merge is selected. No deployment, real provider/product activation, account
change, purchase or spending occurred. This receipt does not grant future merge
authority or mark wider issue acceptance complete.

The [native hierarchy capture](../store/reviews/locale-contract-64a/roadmap-subissues.jpg)
is an unedited GitHub UI screenshot taken after the final roadmap prose update;
the root inspected it. SHA-256 `0d3f5d25a1ba97876c6a3ee522ea07c531a81b0a534b3f320b0cb98de6ce4200`.
The capture shows all 13 children and #31's existing partial completion badge.
The source page is public issue #84; no account menu, credentials or private
records are included. #31/#64/#84 body updates and #83's stacked-PR pointer were
read back; issue states remain open.

## Locale service checkpoint B — 2026-10-20 UTC

Authority: Alan explicitly instructed continuation with #64 B. Recovered the
pruned scratch repository from GitHub and read root/scoped instructions, current
state/context/provenance and relevant ADRs. Live #83/#85 remained drafts at
`8a6258a1011569ac6e531fc124ccb0766f986389` and
`c71c8c4edd2b39337a2ffc812969e66cfe7be175`; main remained
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`.

[Draft #85](https://github.com/egohygiene/egohygiene.io/pull/85) now includes source
`ec7bcc1629fd5261dddd2182597f10affadc9140`, tree
`665d4853f7b565b3584dbac48dd6f21ce862c17c`. The GitHub-created tree exactly matched
the local staged tree; fetched source was checked clean before final verification.
The following documentation/evidence commit does not change tested source.

[Receipt](../store/locale-service-64b.md), [commands/results](../store/reviews/locale-service-64b/checks.json)
and [artifacts](../store/reviews/locale-service-64b/artifacts.json) record the delivery.
App composition subscribes to the existing router; one browser locale service feeds
the same shared runtime. Native selection, recoverable preference access, document
language/direction, locale-preserving internal links, complete interface messages,
client metadata and counts/prices are connected. [ADR 0009](../architecture/decisions/0009-single-locale-runtime.md)
records the refinement. Explicit choices persist; shared URLs do not overwrite a
preference. Unqualified historical URLs resolve the current preference. English
alone remains public. Test-only partial/expanded/RTL dictionaries prove component
behavior; catalog text, IDs, schemas, public artwork and provider destinations
remain unchanged. Preview copy follows the existing compile-time boundary.

Final local pass: 143 tests/22 files, 3 semantic component checks, both type profiles,
12 portable modules, 46-file Biome, fresh normal/isolated builds and normal artifact
guards. Two pre-existing Biome warnings and module-loader notices remain. Artifact
inventory: 16 files/12 references/no findings; 942,164 raw/577,788 level-9 gzip bytes,
within provisional ceilings; Heartburst bytes unchanged. Independent review found
one raw artist-preview link; it was fixed before final verification. No remaining
blocking source finding. Intermediate parallel-edit import/catalog wiring failures
were superseded by the clean final pass; no gate was weakened.

Node 24.21.0 and pnpm 11.28.5 recovered using official tooling and the existing
frozen-lockfile/ignore-scripts setup (3770 packages). TypeScript 5.9.3, Vitest 4.1.11,
Vite 8.2.0, Playwright 1.62.1; unchanged lockfile. Node archive SHA-256
`fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6`
matched the official checksum. Runtime binaries and local logs were not committed.

Chrome for Testing 155.0.8059.84 was recovered but its launch was blocked by the
execution environment denying process-singleton `socket()` with `Operation not
permitted`. No browser page opened; no actual smoke/reload/keyboard/touch/expanded/
RTL or physical-device/AT test is claimed. Earlier browser receipts remain dated
history. C must resolve usable browser execution and perform those journeys plus
message key/placeholder/source-change review; this checkpoint does not complete C.

Source hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678218),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678217)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39427678404)
failed. CI installed successfully, failed formatting and skipped downstream checks.
Other failure causes were not re-diagnosed; no manual dispatch or disabled gates.

#64/#37 remain open; #85 remains draft stacked on #83. Next is B sync then C when
selected, followed by #65/#34 and remaining #37 evidence. No merge, deployment,
real public translation, account/product activation, provider contact, purchase
or spending occurred. This checkpoint does not authorize later merges.


## Product readiness and customer disclosures — 2026-10-22 UTC

Authority: Alan selected #38 and #9 after the ordered merges; roadmap #84 limits
this phase to readiness/customer-disclosure preparation before local-machine final
engineering and actual product setup. Refreshed live main
`07d25941ceeefa53089afa025b612c6aa54f36c4`, #38/#9/#84 and the remaining open CI draft
#73 before editing. Existing instructions, continuity and ADRs were read.

[Draft #87](https://github.com/egohygiene/egohygiene.io/pull/87), branch
`feat/store-readiness-38`, contains source `902be39761f00d73e82ea08d55ff98bc05d8e7c5`,
tree `64a3b39b231e66b4ea427be4a720e09fc573de9d`. GitHub-created tree equalled staged
local source; fetched source was clean before build evidence. This follow-up
records evidence/continuity only. No merge was authorized or performed.

[Receipt](../store/product-readiness-38.md),
[checks](../store/reviews/product-readiness-38/checks.json),
[artifacts](../store/reviews/product-readiness-38/artifacts.json) and
[isolated build-only report](../store/reviews/product-readiness-38/catalog-build.json)
retain exact commands/results. [ADR 0011](../architecture/decisions/0011-reviewed-product-readiness.md)
records the breaking live-readiness boundary and explicit v3 migration. The new
qualification is inline on the existing route, with public-safe assessment/review
and exact offer/artwork/price/disclosure bindings. The historical v1→v2 step stays
available; v2→v3 refuses live offers needing manual requalification. Ten production
records exactly match the migration from retained main inputs. No real routes,
provider placeholders, artwork assets, curation selections, dependencies or lockfile
changed; no real artist association or product/rights approval was added.

Customer work adds `/store/help`, footer/product links and reviewed customer
shipping/returns/support links through the successful purchase action. Privacy and
terms remain provisional. Website feedback is public GitHub feedback, distinct from
order support. No business/contact/provider fact or compliance claim was invented;
no new provider research was represented as current account qualification.

Final local checks: 138 catalog contracts, 74 focused component tests, five type
profiles, 406 English messages/10 namespaces, 16 portable modules, normal build,
existing Fourthwall/artist preview build, isolated catalog build-only and artifact
scan all passed. Normal output: 16 files/12 references/zero findings; 959,716 raw /
582,378 level-9 gzip bytes within existing provisional ceilings. Public Heartburst
bytes match. Node 24.21.0 / pnpm 11.28.5 and lockfile unchanged. Existing Node module
and Vite native-loader notices remain. Independent review found a helper identity
gap and deferred-browser selector fallout; both resolved before source publication.
An intermediate localization route-snapshot mismatch was fixed; final recorded
checks supersede that failed development run.

Actual Chromium and broad lint/test/refactor/CI work remain deferred to final #37.
The isolated report explicitly contains zero completed browser journeys. No actual
provider request, payment, shipment, physical quality, supported-device or deployed
host evidence is claimed. Automatic source dependency review 39823530314 and
CodeQL 39823530310 failed; CI 39823529875 also failed at receipt refresh. No
failure cause re-diagnosis, disabled gate, setting change or manual workflow dispatch.

#38/#9 remain open for real activation and the wider organization program. Next:
sync on #87, then select bounded #22, then Alan's local-machine engineering pass
with existing Taskfile/environment/qualification tooling, then actual product/setup.
No next issue, real account/product/language activation, paid sample, deployment
or spending occurred. Metadata is not proof of rights, identity or remote facts.
