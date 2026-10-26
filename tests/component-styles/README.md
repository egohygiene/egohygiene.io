# Declared component stylesheet consumer — #53

The fixture imports React, its DOM mounting adapter, and only the visualization
package's public component and stylesheet exports. It does not import UI, an
application, or a theme provider. The `theme` query selects an allowlisted root
attribute; the stylesheet's declared theme dependency supplies semantic values.

From the repository root with its pinned Node/pnpm and installed dependencies:

```sh
node --test tests/component-styles/consumer.test.mjs
```

This prepares a private consumer under `.cache/component-styles-53/consumer`,
declares the three dependencies at their installed versions, and links those
existing packages. Vite resolves their real exports without aliases. No install,
network fetch, package publication or application configuration is used. The
test rejects missing visualization layout, missing theme/token CSS, UI/application
modules and accidental UI styles. These are build contracts, not rendered proof.

To rebuild the retained browser artifact without rerunning the negative probes:

```sh
node tests/component-styles/build-consumer.mjs
```

Output remains in `.cache/component-styles-53/dist`; `report.json` records module
paths, declared versions, CSS hashes, source HEAD and whether the checkout was
dirty. It is an isolated test artifact, not a deployment output.

For the later local browser pass, first build Storybook into its ignored output:

```sh
pnpm exec storybook build --output-dir .cache/storybook --disable-telemetry
pnpm exec playwright test --config playwright.component-styles.config.ts --list
pnpm exec playwright test --config playwright.component-styles.config.ts
```

The last command starts two fresh loopback-only Vite previews and executes four
cases: standalone/representative story geometry and label contrast in each theme,
plus provider-versus-toolbar ownership. They reject external/mutating requests.
Discovery alone executes zero browsers. Chromium execution and visual review are
deferred to the final local pass; screen readers/native zoom are separate checks.
#52 owns incorporation into the permanent compiler/test/Taskfile profiles.
