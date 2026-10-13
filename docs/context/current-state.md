# Current handoff

Snapshot: **2026-10-13**. Refresh GitHub and local changes before resuming. This
file is the current handoff; [provenance](provenance.md) retains dated evidence.

## Where work stands

| Item | Observed state / source |
| --- | --- |
| Canonical repository | `egohygiene/egohygiene.io`; website/store in `apps/egohygiene.io` |
| Main at this snapshot | `db634b887ede348ce85d9c03af789467ab535dcf`, including merged [PR #72](https://github.com/egohygiene/egohygiene.io/pull/72) and its handoff |
| Active issue | [#29 — CI and hosting baseline](https://github.com/egohygiene/egohygiene.io/issues/29); only its CI repair portion is active, with hosting/deployment deferred |
| Active branch / review | `fix/ci-baseline`; [draft PR #73](https://github.com/egohygiene/egohygiene.io/pull/73), not merged |
| Implementation tested | `48223775dde607c2116d0e78f9c5bed5f487ef7c`; this handoff is a later documentation-only update |
| Related open issue | [#69 — architecture and extension contracts](https://github.com/egohygiene/egohygiene.io/issues/69); architecture is merged and browser smoke now passes in PR #73; acceptance review remains open |

#29 repairs repository formatting/lint errors, replaces the invalid CodeQL
workflow call, and gives CI/local use the same named validation commands. Tooling
tests and both store browser suites are now selected. Storybook builds into
ignored `.cache/storybook` rather than rewriting tracked historical output. See
the [CI guide and receipt](../development/ci-baseline.md).

#69's portable domain, provider adapter, DOM-free guard and agent/context layer
are already on `main`; do not reimplement them. Its earlier
[implementation receipt](../architecture/store-domain-checkpoint.md) remains a
dated record of the original checkpoint.

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

At implementation `48223775dde607c2116d0e78f9c5bed5f487ef7c`, complete
`pnpm ci:check` passed: formatting/lint, current type profiles, 38 catalog + 64
unit + 10 tooling tests, boundary checks, production website and Storybook builds.
The isolated preview build also passed. actionlint 1.7.12 validated CI, CodeQL
and dependency-review workflows. Lint retains 32 warnings and 20 informational
diagnostics; no rule severity was lowered. Dependencies and lockfile are unchanged.

GitHub CI executed all 23 browser journeys successfully (3 legacy, 18 production
store/theme, 2 isolated preview) at the named implementation. The logs also
confirm the same 112 non-browser tests and build gates passed remotely. Local
browser execution was not retried after the previously observed Chromium
socket-permission denial; this new evidence comes from GitHub's runner.
Broader all-workspace compilation and accessibility qualification remain #52 and
#37/#70; this checkpoint does not claim those profiles passed.

The maintainer reported enabling Dependency graph at 11:54 America/New_York.
The [first new dependency-review run](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467658)
at 11:57 still reported unsupported repository configuration and requested that
setting. This is not a vulnerability finding or proof of the setting's state.
No security gate was disabled. [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467586)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467708)
completed successfully; CodeQL's log confirms analysis upload and processing
completed. This does not claim the repository is vulnerability-free. Results
apply to implementation `48223775dde607c2116d0e78f9c5bed5f487ef7c`; refresh
checks for any later documentation head rather than assuming they ran again.

## Next concrete actions

1. Refresh PR #73, branch heads and CI. Review this bounded CI checkpoint and
   retain any newer user/contributor changes. Do not infer merge authority from
   the earlier approval for PR #72.
2. Resolve dependency review's remaining repository configuration error after
   the reported admin setting change. Keep it distinct from vulnerability
   findings; do not disable the check or replace failure with success.
3. Reconcile #69 acceptance with the new browser evidence. Keep
   #29 open for any outstanding CI evidence and its deferred hosting scope.
4. After this checkpoint, choose the next implementation issue with the
   maintainer: #34 attribution/migration, #54 cover order, #64 interface i18n,
   #65 catalog localization or #70 responsive qualification. #36 owns product
   presentation and #61/#38 provider decisions/real-product qualification.

No new artwork intake, framework switch, live checkout or deployment is part of
this CI repair. Future asset intake uses the authorized private source and
[design guide](../store/next-design-session.md).

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
pnpm ci:check
pnpm exec playwright install --with-deps chromium
pnpm ci:browser
```

Normal `pnpm build` emits `dist`; `pnpm build:store:preview` or `task build:store`
emits `dist-preview`. See the [CI guide](../development/ci-baseline.md) for command
scope and browser prerequisites. Runtime/browser results above are pinned to the
implementation; this documentation-only handoff did not rerun the application.
