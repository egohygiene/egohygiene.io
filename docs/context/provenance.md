# Context provenance ledger

Recorded 2026-10-13. This ledger routes to evidence without duplicating asset
masters, full test logs or private source inventories. Git history preserves
earlier versions; retain dated entries when the current handoff changes.

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
