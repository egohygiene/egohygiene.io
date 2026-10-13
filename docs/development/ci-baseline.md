# Local and GitHub validation

Issue [#29](https://github.com/egohygiene/egohygiene.io/issues/29) owns this CI
repair. Hosting, deployment and live-domain qualification remain deferred.

## Run the same commands locally

Use Node `24.21.0` and pnpm `11.28.5`, as pinned by `.tool-versions` and
`package.json`. From the repository root:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm ci:check
pnpm exec playwright install --with-deps chromium
pnpm ci:browser
```

The browser installer may require administrator access to install Linux system
packages. On a machine with those prerequisites installed, `pnpm exec playwright
install chromium` installs just the browser. Neither command deploys the site or
activates purchasing. The Task/mise setup is documented in
[local preview](../store/local-preview.md).

| Command | Effective scope |
| --- | --- |
| `pnpm ci:check` | Repository formatting/lint under the existing Biome policy; website, catalog and portable-domain typechecks; catalog, unit and tooling tests; workspace/export/locale/cycle/store-boundary checks; production website and Storybook builds |
| `pnpm ci:browser` | Fresh production build; legacy site/docs/playground development journeys; production store/theme journeys; separate preview build and synthetic Fourthwall journeys |
| `pnpm test` | Catalog tests, all unit tests selected by `vitest.unit.config.ts`, and local setup/preview tooling tests |
| `pnpm build:store:preview` | Existing guarded store-environment builder, using `VITE_STORE_PREVIEW` and isolated `dist-preview` output |

GitHub CI calls these commands directly after a frozen install. A failed command
stops the job. Browser tests are not hidden behind a success fallback. Production
`dist` is built before its store suite; the synthetic suite uses `dist-preview`.
The legacy three-app suite starts its own development servers. Storybook writes
fresh output to `.cache/storybook`, leaving the historical tracked
`storybook-static` tree untouched. Removing that old tree remains #56.

These commands do not claim to check every workspace compiler profile, build
every application for production or complete an accessibility audit. #52 owns
those broader profile repairs; #50 owns the content package contract. #37/#70
own wider browser, layout and accessibility qualification. The current real
heartburst design does not supply approved artist content for a new artist route.

To inspect browser discovery without starting Chromium:

```sh
pnpm exec playwright test --config playwright.config.ts --list
pnpm exec playwright test --config playwright.store.config.ts --list
pnpm exec playwright test --config playwright.store-preview.config.ts --list
```

## What changed in this checkpoint

- Apply the existing formatter to 34 first-party files. Correct the generated
  file patterns for the two token outputs; their JSON sources and generator
  remain checked. Exclude only the upstream MSW worker, whose own header forbids
  manual changes and whose contents carry an integrity checksum. All three
  generated files retain their original bytes.
- Fix the first-party lint errors: static decorative motif keys, explicit hidden
  decorative SVG, a native named fieldset for artwork selection with reset styles,
  and a typed directory-entry array. No rule severity was reduced. Existing
  warnings and pre-existing scoped exceptions remain visible.
- Include the existing tooling tests in `pnpm test` and both store browser suites
  in CI. Add the local commands above so their scope can be reproduced.
- Replace the invalid CodeQL reusable-workflow call with checkout, CodeQL init
  and analyze actions for `javascript-typescript`, using `build-mode: none`.
  Keep its existing event triggers and security-event write permission.
- Limit CI to 20 minutes and cancel superseded runs on the same ref. No manual
  remote workflow run was requested for local validation.

## Security checks and remaining setup

The old CodeQL job called
`github/codeql-action/.github/workflows/codeql.yml@v4`. That file is the upstream
project's own test workflow, not a callable workflow: its `on` block has no
`workflow_call`. The source was inspected on 2026-10-13 at upstream commit
`24c54180a607b1449ed407dd24f251e4e9147c8d` (the observed `v4` target). The
[failed main run](https://github.com/egohygiene/egohygiene.io/actions/runs/38422339176)
created zero jobs. The repaired file uses the documented action entry points;
local YAML/action validation is not a completed security scan or SARIF upload.

Dependency review remains enabled and unchanged. Its
[latest inspected failure](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486278)
says dependency review is unsupported for this repository and requests Dependency
graph. This is a repository configuration prerequisite, not a package vulnerability
result. The maintainer reported enabling **Dependency graph** on 2026-10-13 at
11:54 America/New_York while this checkpoint was being prepared. The connected
GitHub tools cannot independently inspect or change that administration setting.
The next PR check must confirm dependency review works; enabling the setting alone
is not proof the review passed. If the same failure persists, inspect
[Advanced Security settings](https://github.com/egohygiene/egohygiene.io/settings/security_analysis)
and any organization policy that manages it. No paid product or other security
setting is required by this checkpoint.

Sources inspected 2026-10-13:

- [Upstream workflow at the observed revision](https://github.com/github/codeql-action/blob/24c54180a607b1449ed407dd24f251e4e9147c8d/.github/workflows/codeql.yml)
- [GitHub reusable-workflow requirements](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
- [CodeQL workflow configuration](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options)
- [Dependency graph setup](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/enable-dependency-graph)

## Verification receipt — 2026-10-13

Base: `db634b887ede348ce85d9c03af789467ab535dcf`. The implementation revision is
recorded in the [current handoff](../context/current-state.md) and PR. This receipt
records the code checkpoint, not a later documentation-only update.

| Check | Observed result |
| --- | --- |
| Baseline | 37 formatting errors; 8 lint errors; latest main validation stopped at formatting |
| `pnpm ci:check` | Completed with exit 0, with every component command present in its output |
| Formatting / lint | 0 errors; lint still reports 32 warnings and 20 informational diagnostics |
| Catalog / unit / tooling | 38 / 64 / 10 tests passed; 112 total |
| Types and boundaries | Website, catalog, portable-domain compilation and all existing `pnpm check` commands passed |
| Artifacts | Production website, fresh Storybook output and isolated store preview built successfully |
| Workflow syntax | actionlint `1.7.12` passed CI, CodeQL and dependency-review files; release archive SHA-256 verified before use |
| Browser discovery | 3 legacy + 18 production store/theme + 2 isolated preview journeys discovered; 23 total |
| Browser execution | Not rerun: the previously inspected environment denies Chromium's required local socket creation; no journey pass is inferred from discovery |
| Remote security / CI | No new remote execution result claimed in this receipt; maintainer reports Dependency graph enabled, with a successful dependency-review run and completed CodeQL scan still to verify |
| Source integrity | Generated tokens, upstream MSW worker, historical Storybook artifacts and dependency lockfile unchanged |

The earlier main [validation run](https://github.com/egohygiene/egohygiene.io/actions/runs/38422338943)
is the baseline failure, not evidence about this PR. Existing Storybook chunk-size
and missing-story-pattern warnings remain; build success is not visual approval.

Rollback is a code/configuration revert; there is no catalog migration, provider
activation or deployment to undo. Reverting also restores the known CI defects.
Keep #29 open for browser/remote verification and its
separately deferred hosting scope.
