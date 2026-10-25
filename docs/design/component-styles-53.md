# Component stylesheet ownership — #53

Recorded 2026-10-25 (America/New_York). Alan authorized the existing PR catch-up,
then #53. The [merge receipt](../context/merges-2026-10-25.json) records eight merged
PRs, including indirectly integrated #93. Main continuity base is
`b075e237fb5100b8962217b16e8378542841c51f`; its runtime tree matches reviewed #102.
Old CI draft #73 remains for #29/#52 due to 18 content conflicts. Existing hosted,
size and browser/manual gaps remain; no gate changed.

## A — Explicit style, theme and provider ownership

| Consumer/layer | Contract |
| --- | --- |
| Design tokens | Existing JSON/generated primitive values; no generator changes |
| Themes | Semantic roles, three CSS themes and shared reduced-motion policy |
| UI | Import `@egohygiene/ui/styles.css`; it imports themes and owns UI/global page primitives |
| Visualizations (B) | Import `@egohygiene/visualizations/styles.css`; it imports themes and owns only Orbit-scoped rules, independent of UI |
| Ordinary Storybook stories | Preview imports canonical CSS; toolbar owns root `data-theme` with light/dark/high-contrast |
| ThemeToggle story | Actual `ThemeProvider` owns root/preference/system behavior; `parameters.themes.disable` opts out of toolbar writes |
| Standalone Orbit consumer (B/C) | React + visualization public component/style exports only; no UI/app stylesheet or provider required for a fixed CSS theme |

A adds the missing canonical UI stylesheet to `.storybook/preview.ts`, registers
high-contrast and explicitly honors the provider story's ownership opt-out.
Installed addon-themes 10.5.9 hides its toolbar for `themes.disable` but its data-
attribute decorator still writes the root. The small preview adapter uses the
addon's public registration/selection helpers and a single always-called effect;
the disabled guard is inside the effect. Returning from a provider-owned story
clears the prior inline color-scheme so the selected semantic CSS owns it again.
No runtime provider API or application theme architecture changes.

The ThemeToggle story retains its real provider, disables preview ownership and
uses an explicit optional-prop story type. Existing strict UI Storybook types
pass. Two-file Biome passes with two informational bracket-key suggestions retained
for strict index-signature access. No Chromium or rendered-style pass is claimed.
Save this reviewable A draft before moving Orbit's rules in B.

## B — Bounded visualization contract

Move the existing `.eh-orbit*` rules from UI into the visualization stylesheet;
retain #49's semantic action colors and dimensions. Include scoped border-box
sizing that UI previously supplied globally. Declare the themes workspace
relationship and public stylesheet export; update the existing playground and
Storybook imports and add a representative Orbit story. Keep the website free
of visualization CSS when it does not render Orbit. No external dependency
upgrade, framework change, publication or application behavior change is needed.

## C — Verification and remaining acceptance

Use a small isolated Vite consumer built only from declared visualization imports
and React. Verify its emitted CSS and module ownership locally; retain actual
computed-style/theme browser definitions without executing Chromium. Build
Storybook into ignored `.cache/storybook`, preserving tracked historical output
for #56. Verify current story index and CSS assets, and run affected tests/types.
Record exact implementation SHA, commands, artifacts and limits.

Actual story/standalone computed dimensions, ring layout, theme colors, focus and
motion plus visual review remain for Alan's final Mac pass (#37/#52). Build success
alone is not rendered or accessibility proof. Existing hosted CI and size findings
remain explicit; no paid services, remote workflow dispatch or gate changes.
Next after delivery/sync: #56 tracked generated-artifact cleanup.

## Sources

Read installed addon/react-vite 10.5.9 exports, implementation and types; current
upstream docs show 10.6, so local compatibility is checked against installed code.
[Styling](https://storybook.js.org/docs/configure/styling-and-css),
[themes](https://storybook.js.org/docs/essentials/themes) and
[toolbars/globals](https://storybook.js.org/docs/essentials/toolbars-and-globals)
informed the integration; no upstream code or assets copied.
[ADR 0003](../architecture/decisions/0003-design-token-architecture.md) remains the
semantic-theme foundation; this issue makes package stylesheet ownership explicit.
