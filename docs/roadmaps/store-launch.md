# Store launch roadmap and milestone history

## Current #50 local A/B/C checkpoint — 2026-10-25

[Draft #99](https://github.com/egohygiene/egohygiene.io/pull/99) is stacked on
unmerged #98. Source `1a5fbdf67fe11fb865cee1f4f93046513b0df95c` implements one
constrained CommonMark tree for docs React/HTML output, omitted optional metadata
and accurate setup/dev/build guides. [Receipt and limitations](../design/content-markdown-50.md)
link 64 passing focused tests, strict types, docs build/12 local HTTP responses
and unchanged hashes for all 44 normal website files. Five docs browser cases
are retained/typechecked/discovered, not executed. #50 remains open for draft
review/integration; #37 owns actual browser acceptance, #52 permanent profiles.

Existing three website size findings and failed source hosted gates remain; no
gates/ceilings changed. Current #90/#91/#60/locale acceptance gaps remain with
their owners. Next is sync, then **#49**, reusing prior #37 focus/motion repairs.
Remaining setup order is #53 → #56 → #59 → #92 → #52 → #29 → #57 → #70 → #37.
Environment/construction-preview and actual-product phases below are unchanged.
No merge, deployment, provider/product activation, publication or spending.


## Historical ecosystem navigation checkpoint — 2026-10-24

[#60 / draft #98](https://github.com/egohygiene/egohygiene.io/pull/98) saves
[the contract, implementation and local receipt](../design/ecosystem-links-60.md),
stacked on unmerged #95. A/B add seven registry-derived native local links,
separately labelled repository anchors and honest visitor-facing status copy.
81 focused tests, types/checks, normal build and all 26 raw/HTTP pages pass.
Eight new browser cases are retained; C remains open for real keyboard/reload
acceptance. The same three budget categories and source hosted workflows fail;
no gates changed. #90/#91 gaps and the final Mac pass remain.

Next: #60 sync, then #50. Existing setup order, environment/public-preview and
real-product tracks are unchanged. No merge, deployment or activation occurred.

## Public rendering checkpoint C — 2026-10-24

[#91 C / draft #95](https://github.com/egohygiene/egohygiene.io/pull/95) now records
[local artifact/HTTP review](../design/public-rendering-91c.md), fixes clean-path
Vite preview serving, adds raw inspection and per-document size diagnostics, and
retains 13 browser cases for the Mac pass. All 26 pages and 52 known-path responses
pass; three aggregate size findings, hosted failures and browser acceptance remain.
#52/#92/#37 own budget/reduction/final review; #57/#89 own intended server behavior.
#91 stays open. Sync then #60; setup order and deployment planning are unchanged.
No merge, deployment or product activation occurred.

## Deployment environments and public construction preview — 2026-10-23

Alan requested issues for local, dev, staging and production deployments, considering
Pulumi or a simpler alternative, then a publicly viewable production site with an
under-construction banner. This is a planning addition; the finite #88 setup queue
and next #91 C checkpoint are unchanged.

After setup/local engineering, [#31](https://github.com/egohygiene/egohygiene.io/issues/31) coordinates:

| Order | Owner | Result |
| --- | --- | --- |
| 1 | [#21](https://github.com/egohygiene/egohygiene.io/issues/21) + [#89 A](https://github.com/egohygiene/egohygiene.io/issues/89) | Environment/tool decision and concrete no-paid-plan host selection |
| 2 | [#96](https://github.com/egohygiene/egohygiene.io/issues/96) | Repeatable local/dev/staging/production commands, artifact identity, promotion and rollback |
| 3 | [#97](https://github.com/egohygiene/egohygiene.io/issues/97) | Visible accessible construction mode with purchasing disabled; can overlap #96 after the contract |
| 4 | [#89 B/C](https://github.com/egohygiene/egohygiene.io/issues/89) | Authorized publication and actual production-preview route/asset/HTML/DNS/HTTPS/rollback proof |
| 5 | [#38](https://github.com/egohygiene/egohygiene.io/issues/38) then [#39](https://github.com/egohygiene/egohygiene.io/issues/39) | Actual product/provider qualification, then commercial/SoundCloud launch |

Production preview does not depend on actual merchandise approval. The real site
can be online while purchase readiness and providers remain disabled. Site stage,
deployment environment and product eligibility are separate; a banner cannot
approve products or enable checkout.

Reuse #52's Taskfile commands, #57's local static serving and applicable #17/Relay
contracts. Local needs no cloud account; dev/staging can be on demand. Pulumi is
conditional, not selected merely by naming it. Keep a no-paid-plan/manual path,
check current host limits during selection, and avoid unnecessary always-on
resources. Use the normal public artifact, never isolated `dist-preview` fixtures.
Keep private masters, records, credentials and state out of public Git.

#96/#97 are new linked milestone-2 tasks. #21 remains a broader linked owner
outside the milestones. Existing native parent links are unchanged; no new native
links are claimed. [#84](https://github.com/egohygiene/egohygiene.io/issues/84), #31, #88, #21, #89 and #39
were updated to distinguish production preview from commercial launch. Earlier
counts and hierarchy snapshots below are dated history, not a fresh full inventory.

No infrastructure, account/DNS change, application implementation, deployment,
merge, product activation or spending occurs in this planning update. Existing
artifact-size, hosted-CI and browser limits remain; #89 must record the actual
publication disposition/evidence. This plan does not qualify the current draft.

## Public rendering checkpoint B — 2026-10-23

[#91 B / draft #95](https://github.com/egohygiene/egohygiene.io/pull/95) implements
26 generated pages, ten sitemap entries, shared metadata and stable hydration.
[The receipt](../design/public-rendering-91b.md) records exact local passes and
remaining aggregate-size/hosted failures. Sync then C; #60 remains next after #91.
#90 contact/copy and final browser/manual acceptance remain open. The ordered queue
below is unchanged; no draft is merged or issue closed by this checkpoint.

## Approved two-phase arrangement — 2026-10-22

Alan approved this full arrangement, including a controlled refactor/dependency
upgrade sweep, and requested the planning update before implementation continues.
It supersedes earlier execution order and M1–M5 proposals below. Historical issues,
receipts and closed work remain available; reorganization does not complete work.

| Tracker | Ownership |
| --- | --- |
| [#84](https://github.com/egohygiene/egohygiene.io/issues/84) | Overall roadmap across both phases; outside either milestone |
| [#88](https://github.com/egohygiene/egohygiene.io/issues/88) | Setup parent in [milestone 1 — Website/store foundation — ready to onboard products](https://github.com/egohygiene/egohygiene.io/milestone/1) |
| [#31](https://github.com/egohygiene/egohygiene.io/issues/31) | Actual-product/launch parent in [milestone 2 — Real products and launch](https://github.com/egohygiene/egohygiene.io/milestone/2) |
| [#47](https://github.com/egohygiene/egohygiene.io/issues/47) | Audit index; outside either milestone |

Five issues are new: #88 setup parent, #89 hosting, #90 website essentials, #91
current-route rendering, and #92 cleanup/upgrades. The approved allocation covers
all **50 previously open issues plus these five**: 23 open setup issues including
#88, four open product/launch issues including #31, and 28 outside the milestones
(the two cross-phase indexes plus 26 broader backlog issues). Existing closed
milestone history is retained, not counted as newly completed work.

GitHub readback on 2026-10-22 verified all 55 open issue assignments and native
parent links. Milestone 1 also retains ten previously closed issues; milestone 2
has no closed issues. No issue was closed by this reorganization.

### Setup milestone: execution order

Progress 2026-10-22: [#90 checkpoint C](../design/website-essentials-90c.md)
records the six-route copy review, one narrowed privacy sentence and nine deferred
browser definitions in draft #94. Local focused checks passed; hosted source runs
failed; zero C browser journeys executed. Sync on the proposed interim public
feedback/private-channel disposition; #90 stays open for that review and final
browser/manual acceptance. #91 A is next in implementation order, not started here.

[Draft #87](https://github.com/egohygiene/egohygiene.io/pull/87)'s readiness code
is included in #94's working draft; both PRs and #93 remain unmerged into main.
The existing CI [draft #73](https://github.com/egohygiene/egohygiene.io/pull/73)
remains for reconciliation under #29. No merge is performed by this planning update.

| Order | Issue | Bounded deliverable |
| --- | --- | --- |
| 1 | [#90](https://github.com/egohygiene/egohygiene.io/issues/90) | Website help/contact, story, accessibility information and policy structure; bounded slice of broader #9 |
| 2 | [#91](https://github.com/egohygiene/egohygiene.io/issues/91) | Useful generated HTML, metadata, canonical URLs and sitemap for current routes; bounded slice of broader #22 |
| 3 | [#60](https://github.com/egohygiene/egohygiene.io/issues/60) | Ecosystem cards navigate to their actual local pages |
| 4 | [#50](https://github.com/egohygiene/egohygiene.io/issues/50) | Safe shared content contract and semantic Markdown/docs rendering |
| 5 | [#49](https://github.com/egohygiene/egohygiene.io/issues/49) | Shared focus, contrast and reduced-motion repair |
| 6 | [#53](https://github.com/egohygiene/egohygiene.io/issues/53) | Explicit styling contracts in Storybook and standalone components |
| 7 | [#56](https://github.com/egohygiene/egohygiene.io/issues/56) | Generated-output removal and intentional scaffold disposition |
| 8 | [#59](https://github.com/egohygiene/egohygiene.io/issues/59) | Licensing declarations and asset provenance based on reviewed decisions |
| 9 | [#92](https://github.com/egohygiene/egohygiene.io/issues/92) | Bounded code cleanup and justified compatible dependency upgrades |
| 10 | [#52](https://github.com/egohygiene/egohygiene.io/issues/52) | Explicit compiler/build/test profiles and convenient Taskfile commands |
| 11 | [#29](https://github.com/egohygiene/egohygiene.io/issues/29) | Local lint/format/CI/CodeQL baseline and reconciliation of draft #73 |
| 12 | [#57](https://github.com/egohygiene/egohygiene.io/issues/57) | Bounded Docker build context and local static-server qualification |
| 13 | [#70](https://github.com/egohygiene/egohygiene.io/issues/70) | Responsive, expanded-text, zoom and input-method qualification |
| 14 | [#37](https://github.com/egohygiene/egohygiene.io/issues/37) | Final integrated local contract/journey/accessibility/regression evidence on Alan's Mac |

Independent fixes can overlap when ownership does not conflict. Every implementation
still receives focused correctness checks; the full integrated run follows the
cleanup and tooling work. Use `Taskfile.yml`, `scripts/store-environment.mjs` and
`scripts/qualify-store.mjs` rather than adding a parallel test orchestrator.

#92's checkpoints are inventory/baseline, small reviewed refactors and compatible
updates, then before/after verification and documentation. It owns remaining
concrete duplication, cohesion, types, error handling, unused code and dependency
review. #50/#53/#56/#52/#29 retain their specific defects. Full lab isolation and
evaluation (#15/#16), framework migrations, package publication and organization
platform migrations remain separate programs. A necessary major change receives a
separate concrete proposal before expanding this sweep.

### Setup milestone: acceptance reconciliation

The following eight open issues join the same milestone and parent #88. Compare
acceptance with the delivered code/receipts and final checks. Preserve working
foundations, resolve genuine residual gaps, and close only with evidence.

| Issue | Existing work to reconcile |
| --- | --- |
| [#75](https://github.com/egohygiene/egohygiene.io/issues/75) | One authoritative website-owned storefront |
| [#61](https://github.com/egohygiene/egohygiene.io/issues/61) | Reusable commerce foundation and Fourthwall preview |
| [#69](https://github.com/egohygiene/egohygiene.io/issues/69) | Architecture boundaries and extension contracts |
| [#34](https://github.com/egohygiene/egohygiene.io/issues/34) | Catalog schemas, validation and explicit migrations |
| [#36](https://github.com/egohygiene/egohygiene.io/issues/36) | Catalog/product presentation and truthful purchase states |
| [#51](https://github.com/egohygiene/egohygiene.io/issues/51) | Safe translation lookup behavior |
| [#64](https://github.com/egohygiene/egohygiene.io/issues/64) | Interface localization and deferred browser acceptance |
| [#65](https://github.com/egohygiene/egohygiene.io/issues/65) | Catalog localization and deferred browser acceptance |

**Setup finish line:** the software is ready to onboard real products. Included
work has evidence-backed acceptance, repeatable local commands and an integrated
revision checked on Alan's machine. Actual hosted CI outcomes stay distinct from
local equivalents; unsupported service/configuration blockers remain explicit,
not passing results. No gates are disabled to close the milestone. Required
unfinished work stays open or receives an explicit reviewed disposition and owner.

### Real products and launch milestone

The 2026-10-23 deployment/preview sequence above now precedes actual product
activation. #96/#97 join milestone 2; #21 supplies its applicable decision. The
original owners below remain, with #89 able to complete the public-preview host
work before #38. Commercial release acceptance remains #39.

| Issue | Remaining work |
| --- | --- |
| [#31](https://github.com/egohygiene/egohygiene.io/issues/31) | Coordinate the actual product/provider/host/release phase and preserve Store v1 history |
| [#38](https://github.com/egohygiene/egohygiene.io/issues/38) | Approve one physical product/artwork combination, qualify the provider, configure variants/pricing/regions/customer policies, and verify actual checkout handoff |
| [#89](https://github.com/egohygiene/egohygiene.io/issues/89) | Select/configure the actual host, verify deployed routes/assets/canonicals and record rollback |
| [#39](https://github.com/egohygiene/egohygiene.io/issues/39) | Publish the qualified product/site and verify SoundCloud and the real visitor journey |

#89 receives #29's hosting/deployment obligations and #37's actual-host checks.
#29 retains CI/local baseline work; #37 retains final software qualification.
#38/#39 receive actual-provider and released customer-journey acceptance from #37;
commerce-specific policy facts from #9/#90 are finalized under #38. These are scope
transfers, not passing evidence. Synthetic handoff, actual provider verification,
product publishing, deployment, a paid order and physical sample quality remain
separate actions and evidence levels. No paid CI/hosting prerequisite is introduced.

### Broader backlog outside these milestones

| Issue | Program retained |
| --- | --- |
| [#3](https://github.com/egohygiene/egohygiene.io/issues/3) | Product-domain architecture migration |
| [#5](https://github.com/egohygiene/egohygiene.io/issues/5) | Reusable launch/directory-submission playbook |
| [#7](https://github.com/egohygiene/egohygiene.io/issues/7) | Federated Mind Garden |
| [#8](https://github.com/egohygiene/egohygiene.io/issues/8) | Eligible public llms.txt registrations |
| [#9](https://github.com/egohygiene/egohygiene.io/issues/9) | Organization-wide help/accessibility/story/trust program; #90 owns the bounded setup slice |
| [#10](https://github.com/egohygiene/egohygiene.io/issues/10) | Product presentation |
| [#11](https://github.com/egohygiene/egohygiene.io/issues/11) | Blog and RSS |
| [#12](https://github.com/egohygiene/egohygiene.io/issues/12) | Official social/community channels |
| [#13](https://github.com/egohygiene/egohygiene.io/issues/13) | Privacy-conscious analytics and sustainability information |
| [#14](https://github.com/egohygiene/egohygiene.io/issues/14) | Funding/donation/support model |
| [#15](https://github.com/egohygiene/egohygiene.io/issues/15) | Isolated frontend capability laboratory |
| [#16](https://github.com/egohygiene/egohygiene.io/issues/16) | Opt-in dependency exploration profile |
| [#17](https://github.com/egohygiene/egohygiene.io/issues/17) | Organization release-convention adoption |
| [#18](https://github.com/egohygiene/egohygiene.io/issues/18) | Reusable package stabilization/publication |
| [#19](https://github.com/egohygiene/egohygiene.io/issues/19) | Reusable consent package |
| [#20](https://github.com/egohygiene/egohygiene.io/issues/20) | Holon consumer migration |
| [#21](https://github.com/egohygiene/egohygiene.io/issues/21) | Infrastructure-as-code evaluation |
| [#22](https://github.com/egohygiene/egohygiene.io/issues/22) | Broader content-first rendering program; #91 owns current-route setup work |
| [#23](https://github.com/egohygiene/egohygiene.io/issues/23) | Framework-neutral knowledge package |
| [#24](https://github.com/egohygiene/egohygiene.io/issues/24) | Provenance-aware legacy-code extraction |
| [#25](https://github.com/egohygiene/egohygiene.io/issues/25) | Experiment lab and promotion lifecycle |
| [#26](https://github.com/egohygiene/egohygiene.io/issues/26) | Historical ADR backfill and continuous capture |
| [#27](https://github.com/egohygiene/egohygiene.io/issues/27) | Organization Intelligence control plane |
| [#28](https://github.com/egohygiene/egohygiene.io/issues/28) | Interactive ecosystem map |
| [#30](https://github.com/egohygiene/egohygiene.io/issues/30) | Hosted roadmap projections |
| [#63](https://github.com/egohygiene/egohygiene.io/issues/63) | Additional motion, galleries and immersive interaction |

### Hierarchy and continuity

Verified native hierarchy: #84 has setup #88 and product/launch #31 as its two
children. #88 has the 14 execution issues and eight reconciliation issues above
as 22 direct children. #34/#36/#37 moved from #31 to #88; #31 retains closed
#32/#33/#35 and the three open phase-two children #38/#89/#39. Broader #9/#22
are linked program owners, not setup blockers. #47 remains a linked audit index.
Keep one native parent per issue and preserve history when moving it.

Retain one canonical catalog and website-owned storefront, stable URLs/IDs, curated
artist/song browsing and disabled real purchase defaults. Real .play() selections
stay intentionally empty; Heartburst display approval is not garment approval.
Private masters, credentials and business/customer records stay out of public Git.

Next is a sync on the completed planning update, review of #87's integration state,
then #90 checkpoint A when selected. No application work, tests, dependency updates,
issue closures, merges, actual provider requests, deployment or spending occur in
this planning checkpoint. [Current state](../context/current-state.md) and
[provenance](../context/provenance.md) own the live handoff and verification receipt.

## Historical execution guide — earlier 2026-10-22

Alan authorized and completed the #83 → #85 → #86 merge sequence. Main now contains
qualification tooling, interface localization, catalog v2/migration and localized
presentation/integration fixtures. See [current state](../context/current-state.md)
for merge hashes and exact tree equality. Browser acceptance and failed hosted
checks remain open; the older draft snapshots below are historical.

After the requested sync, proceed through #38 readiness guards/records plus relevant
#9 disclosures, then #22's bounded public HTML/metadata/sitemap work. Stop at final
#37 so Alan can run the integrated site on his own machine. Diagnose local lint,
type/test/Chromium and hosted CI issues with #29/#52/#49/#70, adding convenient
Taskfile wrappers around existing commands/profile rather than rebuilding them.
Local passes do not establish hosted CI success. Real-product/provider setup,
hosting and #39 launch follow that engineering pass and their concrete approvals.
No implementation beyond the merges or new Taskfile wrappers were started here.

## Historical execution guide — 2026-10-20

Alan requested the remaining storefront sequence and notes as a durable issue.
[Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84) now records that
focused queue, existing issue owners, evidence, dependencies and deferred work.
The requested native hierarchy was installed on 2026-10-20: #31 and the twelve
other owners are direct children, while #31 retains #32–#39 and closed history.
Alan also selected further bounded progress: #64 checkpoint A is in draft #85,
stacked on unmerged #83. Alan subsequently selected B: the router-bound locale
service, language control and interface messages are now implemented in the same
draft. [B evidence](../store/locale-service-64b.md) records local passes and blocked
browser startup. Alan then selected C: [message-review tooling and browser journey
implementation](../store/locale-review-64c.md) are saved in #85. C acceptance remains
open. Alan then explicitly deferred Chromium, unrelated refactoring and broad
lint/testing/CI repair until the final #37 pass, coordinated with #29/#52/#49/#70.
#65 A / #34 is implemented in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86),
stacked on #85; see the [catalog receipt](../store/catalog-localization-65a.md).
Alan then selected #65 B: [selected-language rendering/search](../store/catalog-localization-65b.md)
is implemented in the same draft. Alan then selected C; [integration/review evidence](../store/catalog-localization-65c.md)
is saved with reusable fixtures and seven authored browser journeys. Actual browser
execution/acceptance remains deferred. Next is sync, then bounded #38 readiness.
The order afterward is #38 plus relevant #9 readiness/disclosures, #22 public
rendering/metadata, then final #37 validation and CI repair. Hosting/provider
activation and #39 require separate authorization. Focused correctness checks
continue during implementation; deferred work is not marked passed or waived.
See the current handoff for exact revisions and draft-stack status.
The wider M1–M5 proposals below remain historical; no broad rollout, merge or
deployment is authorized by the execution checkpoint.

## Historical wider proposal — 2026-10-17

Status: **remaining hierarchy proposed; first bounded task authorized 2026-10-17**.
Planning PRs #74 and store #33 are merged. [Issue #75](https://github.com/egohygiene/egohygiene.io/issues/75)
is the first M1 task, in existing Store v1 milestone 1. No new milestone/roadmap
parent or native sub-issue relationship has been created for this proposal.
See the [launch plan](../architecture/store-launch-plan.md) for product scope,
unresolved architecture, source revisions, provider boundaries, and authority.

## How to use this proposal

Use three roadmap themes with five delivery milestones. Each milestone has a
coordinating roadmap issue and bounded native sub-issues. The identifiers M1–M5
below are proposal labels, not GitHub issue numbers. Execution ownership follows
the storefront reconciliation; a cross-repository link does not transfer ownership.

GitHub milestones are repository-scoped. If work remains in both applications,
use coordinated milestone names in each repository and one coordinating parent
with linked/native sub-issues where supported. Do not assume one milestone object
can contain issues from both repositories. Inspect existing parent relationships
before moving anything; reuse existing issue IDs and preserve closed evidence.
Give each reused issue one owning parent and milestone; other milestones link
to it as a dependency. Repeated references below are not requests for duplicate
issues or simultaneous ownership by several milestone parents.

The live inventory found 51 open website issues and 16 open store issues. Most
delivery work already exists. Website [#31](https://github.com/egohygiene/egohygiene.io/issues/31)
is the existing Store v1 roadmap with milestone 1 and native children #32–#39.
Store [#20](https://github.com/egohygiene/store/issues/20) is broader commerce
research. Retain these as historical/program records, then approve any amended
scope or reparenting explicitly. Do not clone their backlogs into new parents.

## Roadmap A: one coherent site and development loop

### M1 — Resolve storefront ownership and public structure

Proposed parent: **[Roadmap] One authoritative storefront and Ego Hygiene site**.
Coordinate in the website repository; creation remains pending the next sync.
The first bounded task proceeds under existing Store v1 coordination (#31).

| Candidate sub-issue | Reuse or addition | Completion evidence |
| --- | --- | --- |
| Compare both stores and record canonical ownership | [#75](https://github.com/egohygiene/egohygiene.io/issues/75), created in existing milestone 1; related to #32/#69 | [Comparison and selected owner](../architecture/storefront-ownership.md), preservation/cutover/rollback plan and reciprocal ADRs submitted for review |
| Root mission and community-store navigation | Reuse website [#3](https://github.com/egohygiene/egohygiene.io/issues/3) and [#35](https://github.com/egohygiene/egohygiene.io/issues/35); narrow the relevant slice | Root introduces Ego Hygiene; store and artist are distinct destinations; existing URLs preserved |
| Public catalog and creative-source publication boundary | Reuse website [#34](https://github.com/egohygiene/egohygiene.io/issues/34) and store [#30](https://github.com/egohygiene/store/issues/30) after selecting one implementation owner | Brand/artist/design/song/product identities remain distinct; only approved public projection reaches the site |
| Comic and Alpal development pages | Proposed new content slice; coordinate store [#18](https://github.com/egohygiene/store/issues/18) | Approved cover/concept, honest development state, no unsupported buy/campaign action |

Checkpoint #75 selects the website application and one composed V1 build for
review. Exit: accepted owner and route contract; no competing deployment authority. Placeholder/content work can proceed alongside later
milestones and must not delay preview setup for missing artwork.

### M2 — Merge-to-phone development preview

Proposed parent: **[Roadmap] Merge-to-phone development preview**, coordinated
through existing website [#29](https://github.com/egohygiene/egohygiene.io/issues/29).
Prefer adding bounded sub-issues to that owner or an approved linked roadmap;
do not open a duplicate general hosting issue.

| Candidate sub-issue | Reuse or addition | Completion evidence |
| --- | --- | --- |
| Finish the CI/build baseline | Reuse #29 and draft [PR #73](https://github.com/egohygiene/egohygiene.io/pull/73); reconcile store [#32](https://github.com/egohygiene/store/issues/32) if that app is selected | Meaningful checks run on the chosen implementation; failures remain visible |
| Reusable build and Netlify deployment workflow | New bounded child | Pinned tools/actions, thin callers, host-specific uploader, source SHA/preview URL receipt |
| Development environment and merge-only trigger | New bounded child | `development` PR-only update rules, scoped configuration, no deploy on feature commits or PR updates, no duplicate Netlify Git build |
| Root/store integration preview and recovery | New bounded child related to #29 and website [#37](https://github.com/egohygiene/egohygiene.io/issues/37) | Root, deep links, assets, reloads and mobile navigation work; mock checkout; draft retention/manual recovery and rollback documented |

Dependency: M1 ownership decision and usable CI baseline. Exit: a merge updates a
remote preview accessible from a phone without a laptop or shared network.
Production is unaffected. Selected Netlify mode and actual credit/retention
behavior are recorded rather than inferred from the word "development".

## Roadmap B: a purchasable community store and repeatable catalog

### M3 — First real merchandise purchase path

Parent: **reuse website [#31 — Store v1](https://github.com/egohygiene/egohygiene.io/issues/31)**,
amending only the approved remaining scope and preserving its existing children.

| Candidate sub-issue | Reuse or addition | Completion evidence |
| --- | --- | --- |
| Select and qualify one physical product | Choose one pilot from store [#21](https://github.com/egohygiene/store/issues/21) or [#31](https://github.com/egohygiene/store/issues/31); do not require both | Approved motif/print revision, garment/template, variant mapping, honest mockups and remaining sample decision |
| Connect Fourthwall and hosted checkout | Reuse website [#38](https://github.com/egohygiene/egohygiene.io/issues/38) and the chosen store/cart owner | Qualified actual product, customer-payment/production flow, fees/price/shipping/support responsibilities, real handoff evidence |
| Verify customer journey and disclosures | Reuse website [#37](https://github.com/egohygiene/egohygiene.io/issues/37), [#9](https://github.com/egohygiene/egohygiene.io/issues/9), and store [#32](https://github.com/egohygiene/store/issues/32) where applicable | Mobile/keyboard flow, variants, unavailable/error states, totals, checkout/return, truthful policies |
| Select production host and release | Reuse website [#29](https://github.com/egohygiene/egohygiene.io/issues/29) and [#39](https://github.com/egohygiene/egohygiene.io/issues/39); split a host-decision child only if needed | Cloudflare/Google decision, cost limits, DNS/HTTPS, release/rollback record, live root/store URLs after approval |

Dependency: M2 plus qualified product/provider setup. Exit: one approved physical
item can be bought through the live storefront. A test checkout, paid order,
manufacturing result, and received physical sample are separate evidence levels;
place an order only after its concrete spend is authorized. No customer details
or order exports belong in the public repository.

### M4 — Featured artist and song merchandise catalog

Proposed parent: **[Roadmap] Featured artist and song merchandise catalog**.
Select the owning application after M1. Product modeling can overlap M3; this
milestone is not a prerequisite to the first standalone merchandise sale.

| Candidate sub-issue | Reuse or addition | Completion evidence |
| --- | --- | --- |
| Featured artist and collection presentation | Reuse store [#30](https://github.com/egohygiene/store/issues/30), website #34/#35, and optional store [#28](https://github.com/egohygiene/store/issues/28) | `.play()` is a featured artist; Ego Hygiene attribution and standalone designs remain valid |
| Dedicated music catalog browsing | New bounded child | `/store/music` handles a growing catalog through search/filter/pagination or another measured approach; main store stays curated |
| Stable song-to-design-to-product destinations | New bounded child coordinated with catalog owner | Optional/multiple associations, provider-independent IDs, stable per-song URLs and unavailable-product behavior |
| One full song merchandise pilot | Reuse website [#39](https://github.com/egohygiene/egohygiene.io/issues/39) for SoundCloud; coordinate existing private catalog work | One approved song/design/product chain and checked external link; further items added through records/assets |

Exit: one complete pilot works and its publication process is repeatable. The
oldest-release pilot, lyrics/metadata capture, and any optional Suno history stay
with the song catalog workflow; finishing all 400 songs is not a store launch gate.

## Roadmap C: comics and additional physical formats

### M5 — First comic in hand, then qualified campaigns

Proposed parent: **[Roadmap] Comic purchase and campaign products**. Future scope
after merchandise launch; split into two milestone parents if the maintainer
wants comic delivery tracked independently from campaign research.

| Candidate sub-issue | Reuse or addition | Completion evidence |
| --- | --- | --- |
| Qualify Lulu for the actual comic | Proposed new integration child, coordinated with existing comics publishing backlog | Current eligibility, supported edition, payment/production timing, fees and support responsibilities |
| Integrate an approved comic edition | Proposed new child; publishing files remain owned by comics | Approved print files, cover/edition metadata, truthful preview/price and supported hosted purchase route |
| Order and review the first copy | Proposed future child requiring concrete spending approval | Order submitted through the site, received copy checked, defects/next revision recorded privately as appropriate |
| Qualify Alpal/Makeship campaign route | Reuse store [#18](https://github.com/egohygiene/store/issues/18) | Provider acceptance/integration evidence, separate campaign checkout, clear go/defer decision |

Exit: the comic purchase-to-received-copy milestone is demonstrated. Alpal can
remain in development if campaign qualification is deferred; do not hold comic
completion hostage to a different manufacturer's acceptance. Other product
experiments remain backlog, not mandatory launch dependencies.

## Cross-cutting owners and deferred work

- Website [#69](https://github.com/egohygiene/egohygiene.io/issues/69): architecture
  and extension contracts. Resolve actual overlap without adding a global
  provider framework before a second implemented provider needs it.
- Website [#64](https://github.com/egohygiene/egohygiene.io/issues/64): interface
  localization; [#65](https://github.com/egohygiene/egohygiene.io/issues/65): catalog
  localization. Preserve translation-ready contracts; define launch languages.
- Website [#70](https://github.com/egohygiene/egohygiene.io/issues/70): responsive
  qualification; [#49](https://github.com/egohygiene/egohygiene.io/issues/49):
  accessibility. Apply bounded acceptance to each customer-facing slice.
- Website [#21](https://github.com/egohygiene/egohygiene.io/issues/21): later
  infrastructure-as-code work. Pulumi follows chosen resources. Kubernetes,
  customer accounts, shared order history, and a universal mixed-provider cart
  are deferred unless a concrete requirement changes the first-release scope.
- Store [#19](https://github.com/egohygiene/store/issues/19) DemonFrog,
  [#29](https://github.com/egohygiene/store/issues/29) tapestry, cards and packaging
  remain separate exploration. Their source assets are not implicitly public.

## Approval and next sync

1. Review #75's paired ownership PRs and the remaining hierarchy. The first
   bounded task was authorized; new roadmap parents/milestones and reparenting
   have not yet been approved. Confirm M5 split if desired.
2. Only after approval, refresh issue states and parent relationships, amend the
   existing roadmap scope with history intact, and create only missing issues.
3. Attach actual native sub-issues where supported, add dependency links and
   repository-scoped milestones, and record their URLs in this document.
4. Return to sync with the concrete issue map before beginning implementation.

Issue #75 is real; the remaining M1–M5 labels are still proposal identifiers.
No future deployment/spending approval is inferred from this checkpoint.
