# Agent entry point

Applies to this repository; scoped `AGENTS.md` files add instructions for their
subtrees. Follow the current task and existing session authorization. Context
snapshots describe past work; they do not grant new merge, deployment, spending
or provider-activation authority.

## Current roadmap checkpoint — 2026-10-22

Alan approved the two-phase issue/milestone arrangement and requested this planning
update before implementation continues. Use [roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84)
and the [approved issue map](docs/roadmaps/store-launch.md): setup is coordinated
by [#88](https://github.com/egohygiene/egohygiene.io/issues/88), followed by actual
products and launch under [#31](https://github.com/egohygiene/egohygiene.io/issues/31).
The setup queue starts with bounded website essentials #90 and current-route public
rendering #91, includes the controlled refactor/dependency sweep #92, and ends with
final #37 qualification on Alan's Mac using existing Taskfile/profile commands.
#89 owns actual hosting/deployed-route verification; #38/#39 own actual product,
provider and launch evidence. Broader #9/#22 programs remain outside this sprint.

Read [current state](docs/context/current-state.md) and the
[provenance ledger](docs/context/provenance.md) before resuming. Readiness/disclosure
work is in unmerged [draft #87](https://github.com/egohygiene/egohygiene.io/pull/87);
its catalog v3 contract is not yet on main. Older CI draft #73 also remains open.
Sync after this reorganization; review #87's integration status before selecting
#90 checkpoint A. Planning changes do not complete acceptance, merge either draft,
activate products/providers, deploy or authorize spending. Hosted failures and
unperformed browser checks remain explicit.

## Historical merge checkpoint — 2026-10-22

Alan authorized merging #83, #85 and #86 in order. All three are now merged on
main, ending at `bb367996a9ab36ffec29cc0fd5aee1b19d80268d`; the integrated tree
matches reviewed #86 exactly. This supersedes historical draft/stack notes below.
Read [current state](docs/context/current-state.md) for exact merge provenance.
Sync before the next implementation: #38 readiness plus relevant #9, then #22,
then Alan's local-machine final #37 validation/CI work with Taskfile conveniences.
Real-product setup follows that pass. Browser acceptance and hosted failures stay
open; merging does not qualify deployment or activate purchases.

## Start or resume

1. Read [current state](docs/context/current-state.md) and the
   [context map](docs/context/README.md). Check `git status --short --branch`
   before editing; preserve unrelated changes.
2. Recheck the linked issue, PR, branch heads and CI using GitHub when available.
   A stored snapshot is not live status. If unavailable, report what could not
   be refreshed instead of assuming a PR is merged or a gate has passed.
3. Read the owning code and applicable scoped instructions. For architecture,
   use [dependency rules](docs/architecture/dependency-rules.md), the
   [ADR index](docs/architecture/decisions/README.md),
   [AI constitution](AI_CONSTITUTION.md) and [methodology](METHODOLOGY.md).
   Load other conceptual documents through [META](META.md) as needed.

For the website/store launch discussion, follow the
[launch plan](docs/architecture/store-launch-plan.md) and
[milestone backlog](docs/roadmaps/store-launch.md). On 2026-10-17 the maintainer
authorized merging the planning PRs and beginning the first issue, #75. Read its
[ownership comparison](docs/architecture/storefront-ownership.md) and
[ADR 0007](docs/architecture/decisions/0007-canonical-storefront-owner.md): the
accepted direction is one website-owned storefront/build; ownership PRs #76
and store #34 were merged on 2026-10-17.
The earlier wider M1–M5 proposal is historical; the approved two-phase arrangement
above now owns scheduling. Do not mistake the preserved separate-store
implementation for a second V1 deployment.

## Historical implementation chronology — through 2026-10-22

The #35 landing/shell checkpoint merged in #77. The subsequent #62 discussion
approved Ego Hygiene as the primary shop, Incompris as its featured collection,
and `.play()` as an artist destination. The maintainer accepted all three
checkpoints and authorized merging **PR #78**, completed on 2026-10-17 at
`71449947a2ff67ac87a512dbd8c8a11dead941fc`; #62 is closed. On 2026-10-18 the
maintainer selected a bounded schema audit under #34 before returning to the
next issue. Read its [audit receipt](docs/store/schema-audit-34.md) and current
handoff for delivery status. The maintainer authorized merging PR #79 and starting
#54 on 2026-10-18; the schema audit merged at
`988b3598c7acaa2cfbd60ecb225e557137c10713`. Read the
[final checkpoint](docs/design/storefront-62c.md),
[content workflow](docs/store/storefront-content-workflow.md),
[artist/song checkpoint](docs/design/storefront-62b.md),
[earlier curated shop review](docs/design/storefront-62a.md) and
[current state](docs/context/current-state.md). Preserve the existing canonical
catalog and truthful purchase states. Real artist selections remain empty until
approved associations are supplied; populated examples are isolated preview
fixtures. #54's declared cover/gallery ordering merged in PR #81 on 2026-10-18
at `28a2ed2d712becf1513d1bd3d6190502db876a69`; #54 is closed. Its
[checkpoint receipt](docs/store/design-order-54.md) preserves verification and
browser limits. Alan selected checkpoint 1 of #37's intercepted checkout-handoff
slice on 2026-10-18. The [fixture and boundary receipt](docs/store/checkout-handoff-37a.md)
records the usable browser, isolated inputs and local verification in draft PR #82.
Alan subsequently authorized checkpoint 2. Its [journey receipt](docs/store/checkout-handoff-37b.md)
records passing actual keyboard/touch link activation and Back/reload checks in
that same draft. Alan then authorized checkpoint 3; the [regression closeout](docs/store/checkout-handoff-37c.md)
records fresh passing local checks and normal-artifact isolation. The bounded
three-checkpoint slice merged in #82 on 2026-10-19 at
`6841b3a9ab20d3be68162da69500bdd7f2ba1ef7` after Alan's explicit instruction.
Alan selected continued work toward completion of #37, rather than starting #38.
The [local qualification review](docs/store/qualification-37.md) records the
complete fresh-build pass in draft #83 and explicit dependency limits. Review
that draft before merge; its instruction did not authorize merging subsequent PRs.
#37 remains open; #38 readiness preparation remains a later proposal.
Alan requested the remaining sequence be saved on 2026-10-19. Use
[roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84) for the current
ordered queue and notes. On 2026-10-20 Alan approved browser hierarchy linking
and further bounded progress while away. #84 now has its 13 intended native
children, preserving #31's eight existing children. The next #64 checkpoint A
is implemented in [draft #85](https://github.com/egohygiene/egohygiene.io/pull/85),
stacked on unmerged #83. Read [ADR 0009](docs/architecture/decisions/0009-single-locale-runtime.md)
and the [locale contract receipt](docs/store/locale-contract-64a.md). Alan then
authorized #64 B, implemented in the same draft; its [service receipt](docs/store/locale-service-64b.md)
records the local passes and blocked Chromium startup. Alan then selected C; its
[review receipt](docs/store/locale-review-64c.md) records message-review tooling and
authored browser journeys in #85. Browser startup remains blocked, so C acceptance
stays open. Use the [message workflow](docs/store/interface-message-workflow.md) for
source edits and human translation review. Alan subsequently deferred Chromium,
unrelated refactoring and broad lint/test/CI work to final #37 and selected further
implementation. #65 A / #34 is now in [draft #86](https://github.com/egohygiene/egohygiene.io/pull/86),
stacked on #85: read [ADR 0010](docs/architecture/decisions/0010-versioned-catalog-localization.md).
#65 A is recorded in the [catalog receipt](docs/store/catalog-localization-65a.md).
Alan then selected B, now implemented in that same draft; read its
[presentation/search receipt](docs/store/catalog-localization-65b.md). Alan then selected C;
its [integration/review receipt](docs/store/catalog-localization-65c.md) records reusable
fixtures, passing focused local checks and seven authored browser journeys. Chromium
execution remains deferred, so C browser acceptance stays open. Next after sync is
#38 readiness preparation plus relevant #9 disclosures, then #22 and final #37 with
#29/#52/#49/#70 under roadmap #84. Keep focused correctness checks while
implementing; the deferred browser/hosted failures remain open. No new merge authority
is inferred from continued implementation.
Deployment and commerce activation remain separate instructions.

## Working boundaries

- Keep changes bounded to the owning issue. Preserve URLs, stable catalog IDs,
  public projection and disabled purchase states unless the task changes them.
- This is a public repository. Keep private artwork masters, raw private Drive
  inventories, credentials and business records in their authorized private
  source. `visibility: "draft"` is not access control.
- Use existing package exports and feature entry points. Portable store code
  cannot depend on React, Vite, a router, DOM or Node APIs. See scoped guidance.
- Use the pinned runtime in `.tool-versions` and `package.json`; current setup
  is documented in [local preview](docs/store/local-preview.md). Avoid dependency
  upgrades merely to work around an agent's execution environment.
- Run focused checks appropriate to the change. A passing unit test is not a
  completed browser review, CI run, deployment or real provider qualification.
  Keep unrelated existing failures visible; do not disable gates to hide them.
- Prefer double-quoted strings and long CLI flags when portable.

## Leave a resumable checkpoint

Update [current state](docs/context/current-state.md) when branch/PR status,
completed work, blockers or next actions change. Preserve historical evidence
with dates and exact implementation commits in the
[provenance ledger](docs/context/provenance.md). Record new durable decisions in
the ADR system and link them; do not copy their full text into this file.

Before handing off, name the branch, PR/issue, checks actually run, checks not
run or blocked, and the next concrete action. Keep source provenance with assets
and reference it from the ledger. Context changes alone need link/JSON/diff
validation, not a new full application test run.
