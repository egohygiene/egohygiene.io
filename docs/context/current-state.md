# Current handoff

## Active discussion checkpoint — 2026-10-16

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
