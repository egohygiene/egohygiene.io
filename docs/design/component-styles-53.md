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
A was saved in draft #103 before B moved Orbit's rules.

## B — Implemented visualization contract

Moved `.eh-orbit*` rules from UI into the public visualization stylesheet, retaining
#49 semantic action colors/dimensions and explicitly scoping inherited font, color,
line-height and border-box rules. The package declares its themes dependency;
playground and Storybook import its stylesheet, with default/compact Orbit stories.
The website does not import visualization styles. Root Storybook now declares UI
and visualizations workspace dependencies: the first build exposed those missing
root links; the corrected build passes. Lock changes are nine added workspace-link
lines only, with no external version or dependency-policy change.

The standalone fixture uses only React, ReactDOM and public visualization exports,
with no app/UI imports or resolver aliases. A real Vite build and negative probes
reject absent Orbit CSS and leaked UI code/styles. Four retained browser cases
cover all three themes and provider ownership; discovery executes zero browsers.
See [consumer instructions](../../tests/component-styles/README.md) and
[ADR 0015](../architecture/decisions/0015-explicit-component-styles.md).

## C — Local evidence and remaining acceptance

A `d04eb0d83239dfc509bf0ff4747dc75c1508ca2b` was saved before B. Published B is
`67f1b3a1f693f69999e515fc52b93f43afbcd308`, tree
`3764e26158e59802172e99b211c3f4b7b71ec330`, in [draft #103](https://github.com/egohygiene/egohygiene.io/pull/103).
Published/staged trees match; fresh artifact checks used clean fetched B. This C
follow-up changes documentation/evidence only. [Exact verification](reviews/component-styles-53/verification.json).

| Local check | Result |
| --- | --- |
| UI/themes/visualization unit tests | 42 pass across seven files |
| Isolated declared consumer | One integration test/three negative probes pass; 16 modules, 4,202-byte CSS; no UI/app imports |
| Affected source/story/fixture types, workspace checks | Pass; existing module-type warnings retained |
| Scoped formatting | Pass; strict bracket-key informational diagnostics retained |
| Storybook | Fresh ignored build passes; 18 index entries and required Button/ThemeToggle/Orbit IDs/CSS verified |
| Docs/playground | Fresh builds pass |
| Website | Sequential retry passes: 26 pages/ten sitemap entries |
| Browser definitions | Four discovered/typechecked; zero executed |
| Normal artifact qualifier | 44 files/202 references; same three budget categories fail |

The first website build, concurrent with Storybook, failed on a `sitemap.xml`
output collision. Sequential retry on unchanged clean B passed. Cause is not
established; #52 retains fresh-output/concurrency investigation. Initial Storybook
resolution failure was fixed by declared root workspace links. Initial offline
install lacked registry policy metadata; regular frozen install passed existing
policy checks. No policy or gate was disabled.

[Artifact summary](reviews/component-styles-53/artifact-summary.json) records documents
317,615 raw /85,589 gzip and total1,287,246 raw against unchanged20,000/10,000/
1,140,000 limits. Website CSS is50,295 bytes (481 fewer than #49); size reduction
is not qualification. Source hosted CI40236889419, dependency40236889418 and
CodeQL40236889504 failed. Storybook retains missing-glob, config-module and large-
chunk warnings. No hosted pass, accessibility certification or production claim.

C actual computed dimensions/rings/theme colors/focus/motion and visual review
remain for Alan's final Mac pass (#37/#52). Retained provider coverage reloads the
iframe; same-document story switching must also be checked. The [consumer receipt](reviews/component-styles-53/consumer-build.json)
proves source-workspace imports/build output only, not npm packaging or rendering.

Issue #53 stays open; sync before **#56** tracked generated-artifact cleanup.
No new PR merge, deployment, real product/provider activation or purchasing.

## Sources

Read installed addon/react-vite 10.5.9 exports, implementation and types; current
upstream docs show 10.6, so local compatibility is checked against installed code.
[Styling](https://storybook.js.org/docs/configure/styling-and-css),
[themes](https://storybook.js.org/docs/essentials/themes) and
[toolbars/globals](https://storybook.js.org/docs/essentials/toolbars-and-globals)
informed the integration; no upstream code or assets copied.
[ADR 0003](../architecture/decisions/0003-design-token-architecture.md) remains the
semantic-theme foundation; this issue makes package stylesheet ownership explicit.
