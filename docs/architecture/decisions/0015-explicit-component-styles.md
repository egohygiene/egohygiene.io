# ADR 0015: Explicit component stylesheet ownership

- Status: selected for #53 local implementation; draft integration and browser acceptance remain
- Recorded: 2026-10-25
- Scope: Storybook, UI and visualization workspace consumers
- Foundation: [ADR 0003](0003-design-token-architecture.md), which remains in force

## Context

At merged main continuity `b075e237fb5100b8962217b16e8378542841c51f`, Storybook
loads no canonical component CSS. Orbit renders classes owned only by the UI
stylesheet despite no visualization-to-UI dependency. The playground hides this
coupling by importing UI styles. The Storybook theme decorator can also compete
with the ThemeToggle story's real provider for the document theme.

## Decision

Each visual package owns and exports its component CSS. Visualization consumers
explicitly import `@egohygiene/visualizations/styles.css`; that file imports the
declared themes dependency and owns Orbit-scoped rules. UI no longer owns Orbit
styles. Existing semantic roles, #49 action colors and reduced-motion policy are
reused. No automatic stylesheet side effect is added to the React module.

Storybook imports UI and visualization public styles and declares both workspace
dependencies at its root manifest. Its toolbar owns ordinary stories' root theme,
including high-contrast. Context-dependent stories can explicitly disable that
owner and supply their real provider; ThemeToggle does so. The adapter calls one
stable effect and guards ownership inside it. No runtime provider API is expanded.

A standalone fixture uses only React/ReactDOM and visualization public exports.
Its real Vite build must include semantic themes/tokens and Orbit CSS while rejecting
UI/application module/style dependencies. Its browser acceptance is retained for
the final local pass. This proves the source-workspace contract; packaging/publishing
is a different issue.

## Alternatives and consequences

Declaring UI as a visualization dependency would formalize an unnecessary coupling
and bring page/UI styles to an independent visual. Duplicating Orbit CSS would
create two owners. Implicit JS CSS imports would remove the host's choice to load
styles. An explicit own export and declared theme dependency is the smallest
supported contract.

Existing Orbit consumers need one additional stylesheet import; known Storybook
and playground consumers are updated together. Scoped box sizing/typography replaces
the accidental global UI inheritance. A host that imports both layers continues
to share one set of semantic theme values. Storybook output remains local/ignored;
tracked historical generated output is reserved for #56 cleanup.

Rollback the export, dependency/lock links, moved rules and all consumers together.
Reconsider if a published package requires a different build/distribution contract;
do not invent a separate framework or theme registry for this checkpoint.

## Evidence and provenance

[#53 receipt](../../design/component-styles-53.md) records exact source, checks and
remaining computed/browser/manual acceptance. Build and source checks alone do not
establish rendered styling or accessibility.

Read installed Storybook/addon-themes 10.5.9 public exports/types, and upstream
[CSS](https://storybook.js.org/docs/configure/styling-and-css),
[themes](https://storybook.js.org/docs/essentials/themes) and
[globals](https://storybook.js.org/docs/essentials/toolbars-and-globals) documentation
(current docs10.6). No external code/assets copied, dependency versions upgraded,
package published or provider/deployment activated.
