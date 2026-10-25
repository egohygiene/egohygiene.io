# Visualizations

This private workspace package exposes React visuals and their own stylesheet.
An Orbit consumer needs both public imports:

```tsx
import { OrbitVisualization } from "@egohygiene/visualizations";
import "@egohygiene/visualizations/styles.css";

export function Example() {
  return <OrbitVisualization size={220} />;
}
```

The stylesheet imports `@egohygiene/themes/styles.css`, which supplies generated
primitive tokens, semantic variables, light/dark/high-contrast themes and the shared
reduced-motion preference. Orbit owns its scoped sizing and typography. It does
not import UI component styles, page resets or an application's stylesheet.

A host can set `data-theme="light"`, `data-theme="dark"` or
`data-theme="high-contrast"` on the document root. Without a theme attribute the
existing theme default is light. A React host that needs preference persistence
or system-theme selection should use the existing `ThemeProvider` from
`@egohygiene/themes`; Orbit itself needs no provider or browser storage.

Declare the packages you import in your consuming workspace manifest. React and
ReactDOM belong to the mounting host; React is this package's peer dependency.
Themes is this package's declared stylesheet dependency. This is a source-workspace
contract, not a claim that the package is published to npm.

Migration: code that previously relied on `@egohygiene/ui/styles.css` to style
Orbit must add the visualization stylesheet import. Storybook and the existing
playground do so explicitly. The main website currently renders no Orbit and does
not need this stylesheet. See [#53's receipt](../../docs/design/component-styles-53.md)
for the isolated consumer, commands and remaining browser acceptance.
