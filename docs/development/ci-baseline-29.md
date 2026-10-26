# Current local validation and CI repair — #29

Recorded 2026-10-26 (America/New_York). The authorized overnight batch reaches
#29 after draft #107 C `3d44df671069300e13324fb3f17e3762986e7892`; branch
`fix/ci-current-29` stacks on `fix/local-profiles-52`. Main remains
`89fc70440f9c3cf32d37a6da83c7a2b969efa97d`. All merges and license choices wait
for morning sync. #105/#106/#107 and historical #73 remain unmerged.

## A — Reconcile current source and old #73

[Audit and source-specific hosted observations](reviews/ci-baseline-29/audit.json)
retain exact revisions and limits. Current source has repository format/lint
failures; hosted validation stops at formatting. CodeQL calls an upstream workflow
that does not expose workflow_call; current runs fail before jobs. Use the official
init/analyze actions for JavaScript/TypeScript instead. Dependency-review fails
separately; the historical unsupported repository/Dependency graph error remains
historical until fresh diagnostics establish the exact current cause. Do not infer
a dependency vulnerability or disable the gate.

Old [draft #73](https://github.com/egohygiene/egohygiene.io/pull/73) at
`725e021336fe6675e53d0a3374caf0b102627019` has 18 recorded content conflicts with
newer work. Preserve its successful source-bound history and port useful intent:
exact generated-token/upstream-MSW exclusions, supported CodeQL actions and shared
local/hosted command names. Reformat current source instead of applying old files.
Gallery fixes and ignored Storybook output already exist in newer form. Old draft
closure/supersession and all merges wait for review.

## Selected implementation

- Keep existing formatter/linter rule severities. Exclude only exact canonical
  generated token files and the unchanged upstream MSW worker from direct analysis.
  Preserve creative assets, independent notices, inactive proposals and archive bytes.
- Remove four obsolete whole-file linter exemptions after the clean
  [probe](reviews/ci-baseline-29/obsolete-exemptions.json). Fix genuine authored
  diagnostics and apply current formatting without blind unsafe fixes.
- Extend the existing qualifier and #52 named profiles into shared `ci:check` and
  `ci:browser` commands with pinned Taskfile wrappers. No parallel orchestrator.
- Non-browser validation must include format/lint, complete types/checks and
  catalog/unit/tooling/semantic/consumer tests, fresh all-app smoke, raw rendering,
  artifact budgets and native Storybook build. Keep independent slices available.
- Browser validation must freshly prepare normal/preview and Storybook/consumer
  artifacts, include all four Playwright configurations and retain custom intercepted
  handoff/layout/catalog-localization journeys. Discovery is not execution.
- Wire CI to these same meaningful commands and supported CodeQL init/analyze;
  retain dependency review and disabled deployment. No workflow dispatch or paid
  service/configuration change.

## Verification and remaining acceptance

Save A before B. Verify format/lint and relevant code/test behavior after formatting;
check parsed historical JSON values, original asset/archive/notice identities and
inactive-patch applicability. Verify command/workflow selection and fail-stop
behavior, and record local versus actual automatic hosted outcomes separately.

Native Storybook remains blocked in this sandbox by OS network-interface
enumeration. Three existing artifact ceilings still fail; none may be raised merely
to make validation green. #52 also retains an initial replaced-homepage-shell smoke
failure with successful unchanged-source repeats and no established writer/cause.
Keep those observations visible; no retry workaround or inferred fix. Chromium,
manual accessibility and integrated Mac acceptance remain #37/#70; local static
serving remains #57 and deployed-host proof #89. No production qualification.

At the morning sync, reconcile #59 licensing/font/private-merch obligations, review
#105 → #106 → #107 → this draft, and decide #73 supersession. Follow remaining
setup/qualification owners before any environment, construction preview or real
product activation. No issue with unresolved acceptance is automatically closed.

## B — Current-source repair

A was saved in [draft #108](https://github.com/egohygiene/egohygiene.io/pull/108) at
`0a34ca245597f323c2e1bf3f06a9d947b5462a1d` before implementation. Current source
formatting is normalized; two metadata cleanup callbacks now use explicit block
bodies. Exact generated-token/MSW exclusions preserve original bytes, and four
obsolete full-file exemptions are removed. Existing warning severities remain.

The existing qualifier now provides `ci-check` and `ci-browser`; `full` composes
both. The former includes every non-browser gate and stops at the unchanged
artifact ceilings before native Storybook if they fail. The independent browser
profile rebuilds all prerequisites and includes default site/docs/playground,
production, preview, component and custom intercepted/layout/catalog journeys.
Taskfile and GitHub CI invoke those same commands. Catalog tests use two workers
for bounded resource use, matching prior complete receipts without losing cases.

CodeQL uses supported init/analyze actions with JavaScript/TypeScript build-mode
none. Dependency review remains unchanged. CI cancels superseded same-ref runs
and has a bounded timeout; it retains frozen, script-disabled dependency install.
Independent review found that the default Playwright output directory was the
whole `test-results` tree, which would erase the running qualifier report. Its
output is now isolated under `test-results/apps`; discovery rejects any project
output directory overlapping the qualifier receipt namespace. This is a distinct
pre-execution finding, not the cause of #52's earlier non-browser output anomaly.

Five mocked-command checks cover complete selection and strict prerequisite/gate
fail-stop behavior; they are not actual browser or hosted results. See the
[command matrix](../../tests/README.md). Exact published-source C follows.

Old #73's useful intent is incorporated in current form; its old successes remain
history. It stays open pending morning supersession/integration review. No license
patch, asset, deployment/provider or artifact-budget policy is changed.
