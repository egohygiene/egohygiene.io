# Current handoff

Snapshot: **2026-10-13**. Refresh GitHub and local changes before resuming. This
file is the current handoff; [provenance](provenance.md) retains dated evidence.

## Where work stands

| Item | Observed state / source |
| --- | --- |
| Canonical repository | `egohygiene/egohygiene.io`; website/store in `apps/egohygiene.io` |
| Main at this snapshot | `1c635ea2af5b254c8cd1200f479585fd941b2c33`; heartburst [PR #71](https://github.com/egohygiene/egohygiene.io/pull/71) merged |
| Active issue | [#69 — architecture and extension contracts](https://github.com/egohygiene/egohygiene.io/issues/69), open |
| Active branch / review | `feat/store-architecture-contracts`; [draft PR #72](https://github.com/egohygiene/egohygiene.io/pull/72), not merged at this snapshot |
| Implementation tested | `08a092b1b576abf9c4b7ea182ec423a586ed5b34`; this handoff is a later documentation-only update |

#69's first checkpoint extracts an app-owned portable store domain, normalizes
Fourthwall fixture input behind an adapter, and exercises an alternate disabled
fixture through the same contract. It adds a DOM-free compilation/import guard
and architecture/extension/migration guidance. See the
[implementation receipt](../architecture/store-domain-checkpoint.md).

The acceptance checklist remains open for review and browser proof. Do not
reimplement this checkpoint from `main` without checking PR #72 first.

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

GitHub [validation](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659599)
stopped at repository formatting with 37 diagnostics; subsequent CI test steps
did not run. [Dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659412)
reported that the repository does not support it and requested Dependency graph.
These results apply to the named implementation; refresh current checks rather
than assuming either result persists. No gate/settings were disabled.

## Next concrete actions

1. Refresh #69, PR #72 and branch heads. Preserve new user/contributor changes.
2. Run the existing preview smoke where Chromium can launch, recording the
   actual revision and results. Reconcile CI blockers in the agreed scope; do
   not repeatedly reinstall browsers after an environment permission denial.
3. Review #69's acceptance checklist against the delivered code and docs. Update
   it with evidence; do not equate a draft checkpoint with a completed issue.
4. After that review, pick the next bounded issue with the current task's
   direction: #34/#36 own catalog/product expansion, #54 cover ordering,
   #65/#70 localization/RTL and screen-size coverage, #61/#38 provider decisions
   and real-product qualification. Refresh those issues before implementing.

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
