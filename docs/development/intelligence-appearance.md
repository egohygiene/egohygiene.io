# Intelligence appearance modes

[Issue #146](https://github.com/egohygiene/egohygiene.io/issues/146) adds a labeled
native Appearance selector to the portable Intelligence shell. System, Light and
Dark use the existing shared `ThemeProvider`, `egohygiene-theme` preference and
semantic CSS. The ordinary website retains its existing shared theme control.

An explicit choice survives navigation and reload when browser storage is
available. System follows live OS changes. Storage denial or a full quota keeps
the control usable in memory; invalid stored values fall back to System. A saved
high-contrast choice remains active and selectable until the visitor chooses one
of the three primary modes. JavaScript-disabled pages keep their evidence and an
honestly disabled control with explanatory text.

## Initial rendering and export

The export emits one synchronous, same-origin `assets/theme-preference.js` before
styles and visible content. The bootstrap derives allowed values and storage key
from the shared theme contract, resolves the palette before React, and leaves
React's first render identical to SSR. The selector enables after hydration.
There is no new dependency, inline script or CSP relaxation.

The closed route/alias inventory is unchanged. The normal export inventory seals
the new asset, increasing the actual producer output from 43 to **44 files** for
**39 routes**. Aliases and the fallback page also run the same bootstrap. Model
inputs, report clocks, source owners, rendering, publisher and commerce stay at
their existing boundaries.

## Focused source and actual-input qualification

Clean functional source: `cbe8b1ece8fe7ca1904963c6303310d5988a9fd0`.
Runtime: Node `24.21.0`, pnpm `11.28.5`, fresh frozen dependencies with lifecycle
scripts disabled. The existing shared theme matrix and new control tests pass
**35 cases** across two files; the themes build TypeScript check passes. Scoped
Biome has no errors, and whitespace checks pass.

```sh
pnpm exec vitest run --config vitest.unit.config.ts packages/themes/src/index.test.tsx apps/egohygiene.io/src/features/intelligence/export/AppearanceControl.test.tsx
pnpm exec tsc -p packages/themes/tsconfig.build.json --noEmit
```

The existing [actual organization selection](intelligence-organization-sweep-selection.md)
produces a clean sealed export with all 44 sizes/hashes verified. Manifest SHA256:
`4f252c5eaad92dc716d580b083a34250ae41634be5a5d0745ccfa9b131f1dbfd`.
Unchanged pinned Relay native intake accepts that exact directory; receipt SHA256:
`2cdbcb9d84edef44b6306f0357e78f92c9265789037090be8af4d5e93b0308c7`.
This is review-only directory transport with `deployment_authorized=false`.
Audit/Sanity retain their original `2026-11-13T03:23:31Z` model clock, one target
row and partial/unreviewed states; Core remains unavailable.

Chromium `151.0.7922.173` passes **10 focused browser groups** against those exact
sealed bytes through explicit declared-origin local routing (not live HTTPS):

- Actual Light/Dark computed palettes; explicit modes override OS changes and
  survive navigation/reload; System follows live OS changes.
- Twelve saved-preference/OS combinations resolve before hydration while the
  client scripts are deliberately held, using the real blocking startup asset.
- Denied storage getter, quota failure, invalid preference and existing saved
  high contrast remain safe.
- All 39 canonical/alias targets preserve the chosen mode; keyboard selection
  and visible 3px focus work; the 390px hub remains bounded with a 44px control.
- JavaScript-disabled evidence and explanatory copy remain visible. There are
  zero console/page errors; all 44 file hashes remain unchanged before/after.

Independent peer review clears the exact functional source, all 44 hashes, all
39 routes plus fallback bootstrap ordering, unchanged CSP and native intake.
Hosted export/intake, the consumer's replacement selection and actual live theme
verification follow source integration. This guide does not claim those steps,
whole-site CI, a full accessibility audit or human assessment ratification.

Decision-impact disposition: **ADR not required**. This applies the existing
[theme ownership decision](../architecture/decisions/0003-design-token-architecture.md)
within the existing [portable export](../architecture/decisions/0017-portable-intelligence-export.md)
and static rendering boundaries. It changes no model, owner, publisher or policy.
