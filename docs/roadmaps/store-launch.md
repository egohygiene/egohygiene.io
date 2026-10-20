# Store launch: proposed roadmaps, milestones, and sub-issues

## Current execution guide — 2026-10-20

Alan requested the remaining storefront sequence and notes as a durable issue.
[Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84) now records that
focused queue, existing issue owners, evidence, dependencies and deferred work.
The requested native hierarchy was installed on 2026-10-20: #31 and the twelve
other owners are direct children, while #31 retains #32–#39 and closed history.
Alan also selected further bounded progress: #64 checkpoint A is in draft #85,
stacked on unmerged #83. See the current handoff and locale contract receipt.
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
