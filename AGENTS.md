# Agent entry point

Applies to this repository; scoped `AGENTS.md` files add instructions for their
subtrees. Follow the current task and existing session authorization. Context
snapshots describe past work; they do not grant new merge, deployment, spending
or provider-activation authority.

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
The wider milestone creation/reparenting proposal awaits the next sync. Do not
mistake the preserved separate-store implementation for a second V1 deployment.

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
three-checkpoint slice is complete in draft #82. Sync before merging or selecting
#38; no merge was authorized by the checkpoint instruction.
#37 remains open; #38 readiness preparation remains a later proposal.
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
