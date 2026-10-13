# ADR 0003: Design tokens and semantic theme variables

- Status: accepted; records the existing implementation
- Recorded: 2026-10-13
- Scope: workspace UI and website extension contracts (#69)

## Context

Three applications share UI primitives and themes. Components need consistent
colors, spacing, typography and motion while retaining application-specific
composition. A framework change should not require recreating the visual values.

## Decision

`packages/design-tokens/src/tokens/*.json` is the source of primitive values.
`packages/design-tokens/scripts/build-tokens.ts` produces `src/generated.ts` and
`src/generated.css`. Consumers use the package exports; generated files are not
an independent authoring source.

`@egohygiene/themes/styles.css` loads those variables and exposes semantic names
such as `--color-surface`, `--color-foreground`, `--color-focus` and `--radius-md`.
Dark and high-contrast styles override semantic values. `ThemeProvider` owns the
preference, system-color observation and optional browser persistence. Components
consume variables and `useTheme` rather than maintaining another theme state.

Shared UI uses semantic props, such as `Button`'s `tone`, and caller-supplied
content. App-specific composition remains in the app. New layout rules should
use fluid dimensions and logical properties, preserve keyboard focus and honor
reduced motion. Full existing-store responsive/RTL work remains #70; this record
does not certify that all current CSS already meets that contract.

## Consequences and verification

- Token JSON and CSS can transfer to another renderer. React components and the
  preference adapter need porting; CSS class names alone are not a component API.
- Run `pnpm --filter @egohygiene/design-tokens build` after editing token sources
  and review both generated outputs. Do not introduce another token generator.
- Exercise affected components under light, dark and high-contrast themes,
  keyboard navigation and reduced motion; use existing theme tests and stories.
- Roll back source token changes and their generated files together. No catalog
  schema migration is required for a visual token change.
