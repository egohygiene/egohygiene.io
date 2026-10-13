# Website and store agents

Inherits [root instructions](../../AGENTS.md). Read the
[extension contracts](../../docs/architecture/store-extension-contracts.md)
for the actual module map and examples.

- `src/app/router.tsx` and `providers.tsx` own composition. Feature presentation
  owns React controls, router integration and browser effects.
- Store consumers use `src/features/store/domain/index.ts` for pure selectors,
  canonical paths and synthetic handoffs. Provider wire fields stop at their
  adapter; canonical identity and purchase eligibility stay in the domain.
- Browser catalog data comes through `src/content/store/index.ts` and the Node
  public projection. Never import authoring entry JSON directly into browser code.
- Normal builds use `dist`; the local Fourthwall tryout is isolated in
  `dist-preview`. Synthetic fixtures and the tryout route stay out of production.
- A design is artwork; products carry designs. Song/character context is optional.
  The heartburst display proof does not establish a garment or print-ready master.
- Keep transient controls local and shareable filters in the URL. Use the single
  app locale/theme providers; new shared controls receive message content and
  semantic props. Apply tokens, keyboard/focus, fluid layout, RTL and motion
  guidance from the extension contracts.
- For store behavior changes, use the relevant store/Fourthwall unit tests,
  catalog tests and type/boundary checks. For preview UI changes, run the existing
  desktop/mobile smoke when Chromium is available and record any execution limit.

Catalog additions follow [authoring](../../docs/store/catalog-authoring.md).
Read [current state](../../docs/context/current-state.md) before choosing the next
issue; this file intentionally does not duplicate changing PR status.
