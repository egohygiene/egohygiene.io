# Current handoff

## Four-digit decision-label migration — 2026-10-18 UTC

The maintainer authorized the bounded org numbering migration in [Hygiene #73](https://github.com/egohygiene/hygiene/issues/73). Default branch includes the independent #79 schema-audit merge at `988b3598c7acaa2cfbd60ecb225e557137c10713`. Its earlier open/draft checkpoint below is historical. Four inline labels and current links are padded; the per-record map is in root DECISIONS.md. The distinct implementation sequence already uses four-digit filenames. Decision content, lifecycle, storefront implementation and the pending selection below remain unchanged. Inverse decision-body comparison and documentation link/JSON/diff checks passed. Application tests were not rerun for this documentation change. No deployment or commerce activation is claimed.

## Historical schema-audit review checkpoint — 2026-10-18 UTC

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
