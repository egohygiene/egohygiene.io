# Store verification

The mock-store journey suite uses the built website and the versioned fictional catalog. It never sends a request to a checkout provider or payment service. Adding a real product is a separate release step: update the fixture assumptions and qualify the selected provider before enabling its purchase link.

## Local commands

From the repository root, after the pinned workspace install:

```sh
pnpm exec playwright install chromium
pnpm build
pnpm exec playwright test --config playwright.store.config.ts
```

The suite starts the production preview on `http://127.0.0.1:4173` and requires that port to be free. It does not reuse a possibly stale development server. No GitHub Actions run is needed. Browser installation is a one-time setup on each machine.

## Current journey coverage

| Journey | Evidence |
| --- | --- |
| Preview storefront | Visible concept disclosure, seven browsable entries, preview/unavailable labels, page title, no browser exceptions |
| Browse and search | Combined text/type/story filtering, persisted URL state after reload, announced result count, invalid-story fallback, reset preserving unrelated query parameters |
| Connected catalog | Collection → product → shared design → collection → catalog |
| Discovery pathways | Entrance → collection → product and entrance → standalone design at desktop and mobile widths |
| Artwork viewer | Native modal state, inert background, Escape/close button, focus and scroll restoration, responsive artwork |
| Direct entry | Product, design, and collection URLs load and reload through the production SPA server |
| Scroll and history | Detail navigation begins at the top, Back restores the catalog position, and direct section links land on their target |
| Missing entry | Unknown or wrong-kind slugs show recovery links |
| Purchase safety | All three mock products have explicit non-purchasable states and no purchase action or external link |
| Keyboard and motion | Filters reachable by Tab, visible focus, Space activation, reduced-motion hover behavior |
| Mobile | Collapsible primary navigation, search/filter/product journey, no horizontal overflow |
| Themes and layout | Light, dark, and high-contrast modes; narrow product, design, and collection layouts |

Eighteen tests provide bounded regression coverage: thirteen catalog journeys plus five theme startup/resolution regressions. The suite attaches full-page desktop and mobile screenshots and artwork-viewer captures; failed tests retain a trace and screenshot under ignored `test-results/store/`. These are local debugging evidence, not pixel-baseline assertions.

Catalog contract and authoring tests remain separate (`pnpm catalog:test`). They exercise invalid data, references, visibility, provider boundaries, and the add-entry workflow before browser rendering.

Image rendering also has component coverage: an approved image, load-error fallback, recovery when the image source changes, the placeholder's accessible label, and consistent study selection across hero/card/gallery views. Gallery tests cover multiple-design selection, reordered/removed designs, modal selection, focus and scroll cleanup, and an empty gallery. Story-filter tests exercise inherited contexts, standalone entries, search/type composition, and draft exclusion. The current production catalog intentionally contains only placeholders.

## Verified checkpoint — 2026-10-10

The production build passed catalog validation (eight entries) and Vite compilation. All ten browser journeys passed in 26.7 seconds using Playwright 1.62.1 with Chromium **153.0.8010.0**, Node **24.21.0**, and pnpm **11.28.5**. The initial run exposed a reduced-motion CSS specificity defect; the final run verified its fix along with scroll restoration and direct section links.

Desktop and mobile full-page screenshots were captured and visually inspected. The header, hero, catalog controls, cards, collection feature, and footer fit their layouts without overlapping or horizontally clipped content. The two screenshot-producing journeys were rerun successfully after changing attachments to persist local PNG files. This inspection is not a contrast audit or pixel-baseline approval.

This constrained runner could not install Playwright's bundled Chromium 151 because the browser CDN returned an invalid archive. Verification instead used an independently installed Chromium 153 executable through the optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` environment variable, with system font configuration. The normal command still defaults to Playwright's managed browser when that variable is absent. A run against the bundled browser remains a compatibility check for an environment where that download works; the passing result above does not claim that exact browser build was tested.

## Local Fourthwall preview checks

The isolated demo has its own build and browser suite. After installing the browser as above:

```sh
task build:store
node scripts/store-environment.mjs run test:store:preview
task test:store:tooling
node scripts/store-environment.mjs run catalog:test
node scripts/store-environment.mjs run test:unit apps/egohygiene.io/src/features/fourthwall-preview
```

The preview suite serves `dist-preview` at **http://127.0.0.1:4174** and requires that port to be free. It verifies the entry link, direct-route reload, initial disabled action, unavailable size, variant/quantity selection, illustrative subtotal, clearing stale selections, and return to the canonical product. Desktop and mobile tests block external requests and assert that none occur; they also check page errors and horizontal overflow. Screenshots live under ignored `test-results/store-preview/`.

`task fourthwall:check` is an optional manual diagnostic, not part of browser testing. With no credentials it provides setup guidance and sends no request. CLI tests use injected responses, including authentication failures and unexpected response shapes. No live Fourthwall shop has been queried for this checkpoint.

## Verified preview checkpoint — 2026-10-11

- `task build:store` passed its frozen installation, eight-entry catalog validation, and isolated Vite build. The full `task preview:store` command served `/store` with HTTP 200 on an explicit alternate port and was stopped after verification. `task fourthwall:check` passed its no-credential path.
- All **15 production store/theme browser tests** and **2 local Fourthwall browser tests** passed with the same Chromium 153/Playwright 1.62.1 environment described above. Denied storage access/read/write, invalid values, manual themes, and system updates remain usable.
- **19 focused theme tests**, **6 Fourthwall component/contract tests**, **31 catalog/provider/CLI tests**, and **10 environment-helper tests** passed. Application/catalog typechecking and the theme package typecheck passed.
- The broader `tsconfig.vitest.json` check still reports existing test alias, throwing-component, and optional-property errors tracked by #50/#52. The new Fourthwall tests have no reported errors after correcting two Testing Library query options. This is not a claim that every repository gate is green.
- Production output contains no local route, fixture marker, or Fourthwall demo chunk. The preview adds a lazy-loaded demo (7.03 kB JS / 2.55 kB gzip and 4.51 kB CSS / 1.24 kB gzip); its main JS is 401.34 kB / 122.77 kB gzip versus 400.61 kB / 122.50 kB gzip for the normal build. No dependency or lockfile change was needed.
- Desktop/mobile screenshots were inspected for the demo's typography, art panel, size/quantity controls, and responsive layout. This uses fictional artwork and does not establish real garment appearance or broad accessibility compliance.

The [adoption decision](../architecture/decisions/0004-adapt-fourthwall-for-local-store-preview.md) and [Fourthwall setup guide](fourthwall-local-setup.md) describe the retained catalog, adapted commerce contracts, and remaining live integration work.

## Verified visual upgrade — 2026-10-11

- The normal build and isolated `task build:store` passed catalog validation and compilation. Application/catalog typechecking passed. The production bundle is 406.32 kB JS / 123.71 kB gzip; the isolated preview is 407.04 kB / 123.99 kB gzip plus its existing lazy Fourthwall demo. No dependencies or lockfile changes were required.
- All **18 production store/theme browser tests** passed in 47.1 seconds; both **Fourthwall preview browser tests** passed. These use the same Chromium 153 environment described above.
- All **16 focused store component/helper tests** passed: five artwork-renderer checks, six gallery checks, and five story-filter checks. Existing unrelated test-profile limitations remain as documented in the earlier checkpoint.
- Desktop/mobile screenshots were inspected for the refreshed entrance, discovery tiles, filters/cards, and enlarged artwork viewer. Inspection caught and removed a hero glow overlapping the art. A renderer regression now keeps the same design study when promoted to the hero.
- Modal verification checks native `:modal` state, blocked focus on the underlying page, return from browser-chrome keyboard traversal, Escape, close, and restored focus/scroll. It does not impose a custom focus trap on native dialog behavior.

This advances #62. Alan's visual feedback, first real artwork, expanded/localized text review, and broader assistive-technology/device qualification remain follow-up work.

## Public catalog build boundary — 2026-10-12

Issue #55 moves authoring discovery, validation, and public projection into `scripts/vite-store-catalog.mts`. Normal builds, isolated previews, and component tests import the same virtual public catalog. No raw authoring JSON enters that browser module.

Verified locally with Node **24.21.0**, pnpm **11.28.5**, Vite **8.2.0**, and Vitest **4.1.11**:

- The **4 focused build/dev integration tests** in `tests/store/public-build.test.ts` passed. Synthetic fixtures cover all four draft entry kinds, a public live product with its reviewed route, a draft live product, and an unused route for a public preview product. Emitted HTML/JS/JSON/source maps are scanned for draft and unused-route markers with positive public controls. Two builds produce identical files, and the emitted catalog retains valid public references and purchase guards.
- A real local Vite server was exercised over HTTP. Nested file additions, edits, removals, draft/public transitions, changed checkout URLs, malformed JSON, and recovery trigger fresh public output and page-reload notifications. No checkout URL or provider service is contacted.
- All **31 existing catalog/provider/CLI/artwork tests** and **22 affected store/Fourthwall component tests** passed. Application and catalog/tooling typechecks passed.
- The test TypeScript profile now includes the app's virtual-module declaration. Its remaining six diagnostics are in the existing error-boundary, test-alias, content optional-property, and accessibility-alias areas tracked by #50/#52; there are no diagnostics in the changed catalog/preview features. This is not an all-repository typecheck pass.
- `pnpm build` and `node scripts/store-environment.mjs build` both passed. The normal build remains at eight fictional public entries and excludes the Fourthwall demo. The isolated preview retains its separate demo chunk. No dependency or lockfile changes were needed.

Run the focused suite with `node --test tests/store/public-build.test.ts`; it also runs through `pnpm catalog:test`. Full browser journeys, image decoding/print review, broad lint, remote CI, live checkout, and deployment were not rerun or performed for this data-boundary change. The existing browser checkpoints above remain the visual/journey evidence.

Public Git sources remain public. Vite also copies the public asset directory independently of catalog visibility; only approved public derivatives belong there. This change does not provide private storage or remove already-published data from repository history.

## Remaining release checks

- Review the first real design and its product imagery at desktop and mobile sizes; the placeholder screenshot inspection does not establish print quality or contrast compliance for future artwork.
- Qualify approved-artwork rendering with the first real image in the browser. Component tests cover the image-error fallback; browser journeys do not yet exercise an actual image request failure.
- Run a broader accessibility review, including screen-reader behavior, zoom, and contrast. Keyboard/semantic checks here are a baseline, not an accessibility certification.
- Test one provider's real approved product URL, variants, pricing authority, shipping, returns, and customer-funded order flow before changing a product to `live`. Do not make purchases automatically as part of this suite.
- Verify deep links on the eventual deployment host; local Vite preview confirms the bundle and its local SPA fallback only.
- Broader browser/device qualification and screenshot baselines can follow the first design approval; this checkpoint targets Chromium desktop and mobile viewport behavior.
