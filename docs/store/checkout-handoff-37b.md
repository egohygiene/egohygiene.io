# Checkout handoff journeys — #37 checkpoint 2

Status: delivered for review in [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82),
on `test/checkout-handoff-37a`. Implementation: `e90e9b65b54a7365b6668802d8a984ee392be837`.
Alan authorized checkpoint 2 after the fixture/interception sync. #37 remains
open; checkpoint 3 is the following focused regression/artifact closeout.

## Behavior under test

The existing [checkpoint 1 fixture and request boundary](checkout-handoff-37a.md)
now supports two actual product-link journeys in the temporary build of the
website. Application code, normal catalog, provider configuration and dependencies
are unchanged. These tests do not call a provider or create an order.

| Scenario | Interaction and route checks |
| --- | --- |
| Desktop, 1280 × 800 CSS pixels | Reach the visible `Shop on Fourthwall` link with Tab and activate it with Enter |
| Mobile emulation, 390 × 844 CSS pixels | Scroll to the same link and activate it with a touch tap |
| Both | Load/reload the canonical live product, follow its exact reviewed URL in the same tab, reload the intercepted destination, go Back, reload the product and activate again |
| Non-purchasable states | Follow actual design/product links to preview and unavailable products; check their status and absent purchase links before and after reload |

Each scenario has its own browser context and installs interception before opening
a page. The destination is inert locally supplied HTML; no form can submit an
order. Exact destination counts, page count, decoded image, horizontal overflow,
unexpected requests, WebSockets and page errors are asserted. The direct negative
request probes from checkpoint 1 still run before these journeys.

## Reproduce and local evidence

Use the pinned Node 24.21.0/pnpm 11.28.5 setup and the browser documented in
checkpoint 1. From the repository root:

```sh
node tests/checkout-handoff/run.mts
node --test tests/store/checkout-handoff-fixture.test.ts tests/store/checkout-handoff-network.test.ts
node scripts/store-environment.mjs run catalog:typecheck
```

The existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override selects an installed
browser; otherwise Playwright uses its managed Chromium. The runner builds fresh
temporary inputs and writes baseline/journey JSON plus two captures under ignored
`test-results/checkout-handoff/`. `--output-dir` selects a report directory.

Both browser scenarios pass in Chrome for Testing **155.0.8059.84**, Playwright
**1.62.1** and Node **24.21.0**. Each makes exactly three intercepted document
requests: two genuine link activations and one destination reload. Both return
through Back twice and reload the product twice without restarting checkout.
Preview/unavailable guards pass through SPA navigation and reload, with zero
unexpected requests, WebSockets, extra pages or page errors. Desktop reaches the
purchase link in 11 Tab presses; both viewports have no horizontal overflow.

The fresh [boundary baseline](reviews/checkout-handoff-37b/baseline.json) also
passes its three states, decoded swatch, exact direct destination and four denied
probes. Six focused Node fixture/request tests, the catalog/tooling typecheck,
two changed source files' Biome checks and diff whitespace pass. The isolated
build compiles 177 modules; no runtime application change was necessary.

Manual review caught a missing shell logo in the first temporary-build captures.
The harness now copies only the existing approved public 192px logo into its
temporary asset directory and verifies its decoding alongside the 1px swatch.
Final captures were inspected: desktop focus is visible, and mobile action and
provider disclosure fit without clipping. This corrected test-fixture fidelity;
the source logo and application were unchanged. Independent review found no
remaining blocking issue.

Reviewed captures: [desktop keyboard focus](reviews/checkout-handoff-37b/desktop-keyboard-focused.png)
and [mobile product action](reviews/checkout-handoff-37b/mobile-touch-live.png).
Capture hashes and actual browser/input metadata are retained in the
[journey report](reviews/checkout-handoff-37b/journeys.json). They show fictional
swatch products and are not merchandise/print proofs or pixel baselines.

## Limits and next action

This proves the website's native link and return journey against an intercepted
page. It does not prove actual provider checkout, variants, pricing, shipping/tax,
returns, fulfillment or purchase readiness. Routing interception disables the
HTTP cache; no cache/BFCache behavior is qualified. Touch emulation is not a
physical-device or cross-browser test. No new screen-reader, zoom, contrast,
locale or reduced-motion audit is claimed; earlier #62 evidence stays historical.

Hosted CI is separate from the local evidence; no gate was disabled. The full
existing store/preview/layout suites and normal-build scan were not rerun for
this test-only checkpoint. Their earlier results remain in the checkpoint 1 and
#62 receipts. Checkpoint 3 will select the relevant regression and artifact
closeout checks. Sync with Alan before that work or merging #82. #38 remains a
later readiness proposal; no deployment or commerce activation occurred.
