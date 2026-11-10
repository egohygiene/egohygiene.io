# Local website qualification

Use the repository's pinned Node/pnpm and run `task setup:store` once after checkout
or dependency changes. Each Task wrapper below selects that pnpm through the existing
environment helper; equivalent `pnpm` commands assume the correct runtime is active.

| Command | Scope and prerequisites |
| --- | --- |
| `task typecheck:all` / `pnpm typecheck:all` | Sequential fast site/catalog/domain, all 14 workspaces, tooling, unit/semantic/smoke, all browser, three Storybook and locale compiler profiles. All are strict and noEmit. `pnpm typecheck` retains the fast site scope. |
| `task test:unit` / `pnpm test:unit` | Implemented app and workspace unit tests. |
| `task test:store:tooling` / `pnpm test:tooling` | Native Node tooling and failure-path contracts. |
| `task test:semantic` / `pnpm test:semantic` | DOM semantic component assertions, without computed browser accessibility or assistive-technology proof. |
| `task test:smoke` / `pnpm test:smoke` | Clear owned app outputs, sequentially build website/docs/playground, then verify fresh HTML and assets. No skip-build mode. |
| `task test:components` / `pnpm test:components` | Rebuild and verify the independent stylesheet consumer; no browser. |
| `task test:browser:discover` / `pnpm test:browser:discover` | Discover all four Playwright configurations and reject omitted maintained specs. Starts no servers or browsers. |
| `task test:e2e` / `pnpm test:e2e` | Site, docs and playground journeys against new local development servers. Requires Chromium. |
| `task test:components:browser` / `pnpm test:components:browser` | Fresh native Storybook and independent consumer builds, followed by the component browser profile. Requires Chromium. |
| `task ci:check` / `pnpm ci:check` | Formatting/lint, all compiler/contract scopes, fresh all-app smoke, raw rendering, unchanged artifact budgets and native Storybook build. No browser execution. |
| `task ci:browser` / `pnpm ci:browser` | Independent fresh app/preview/Storybook/consumer prerequisites, all four Playwright profiles and custom intercepted/layout/catalog journeys. Requires Chromium. |
| `task qualify:local` / `pnpm qualify:local` | Complete sequential non-browser and browser qualification. Requires Chromium; stops at the first failed gate. Each profile owns fresh prerequisites. |

The smoke consumer is intentionally not a standalone `vitest` shortcut: its receipt
and invocation identity come from the successful fresh build prerequisites. Old
output or a previous receipt cannot satisfy a later direct invocation. All generated
reports remain under ignored `test-results/`; they describe their source and scope.

The complete qualifier uses `scripts/qualify-store.mjs`, also callable directly.
Its `ci-check` and `ci-browser` profiles are the same commands used by GitHub CI;
`full` composes both. Browser prerequisites are rebuilt independently even after a
non-browser pass, so neither command accepts an earlier successful build marker.
It builds normal and isolated-preview artifacts immediately before their consumers,
retains raw public-HTML/artifact checks, and never reuses an existing browser server.
Reports remain in `test-results/store-qualification/profile/`. The independent
low-level `pnpm test:store` and `pnpm test:store:preview` commands consume prepared
normal and preview builds respectively; use the complete qualifier when the fresh
prerequisites and unified report are required. Component browser output is separate. The four browser configurations are all
selected by `ci:browser` and `full`; the independently callable components command
also remains available. Reports for CI profiles use sibling `ci-check/` and
`ci-browser/` directories under `test-results/store-qualification/`.

Install Playwright Chromium separately on the machine used for browser acceptance;
an existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override remains supported by the
store qualification runners. Discovery and TypeScript checks do not execute those
journeys. Browser suites own separate output directories; discovery rejects output paths
that would erase the qualifier receipt namespace. Default app, production-store,
preview and component counts may overlap;
they are not additive unique-user-journey counts.

The [#52 receipt](../docs/development/local-profiles-52.md) records the current
implementation and exact evidence. Native Storybook currently encounters this
execution environment's OS interface-enumeration restriction; the normal command
keeps failing rather than accepting a previously generated artifact. No compatibility
shim is part of the supported profile. The three existing artifact-budget findings
also remain strict failures until their policy/disposition is reviewed. A failing
artifact gate stops `ci:check` before its native Storybook step and stops `full`
before browsers. `ci:browser` remains separately runnable without claiming those
non-browser gates passed. The [#29 receipt](../docs/development/ci-baseline-29.md)
records current local and hosted outcomes. #52 also retains its intermittent
replaced-homepage output finding; unchanged-source retries were not a fix.

The [store test plan](../docs/store/test-plan.md) records detailed scope and historical
evidence. Existing real-shell keyboard, theme, contrast and motion scenarios are
retained in the browser profiles. Synthetic fixtures and Chromium emulation do not
qualify physical devices, screen readers, native zoom, real checkout or an eventual
deployed host. Their manual/hosted acceptance remains explicit in #37/#70/#89.
