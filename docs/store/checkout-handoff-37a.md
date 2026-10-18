# Checkout handoff fixture and interception — #37 checkpoint 1

Status: checkpoint 1 delivered for review in [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82), on
`test/checkout-handoff-37a`. Implementation: `2a91b2b02edb606fe594a65784ac7f5eb798173e`.
Alan selected this checkpoint after the #54 merge. #37 remains open; sync before
checkpoint 2's customer journeys. This receipt covers local test infrastructure.

## Fixture contract

The harness builds the actual website with its existing Vite configuration and
components, replacing only the public-catalog plugin's inputs. A newly owned
temporary directory holds the fictional catalog, reviewed-route fixture, public
image and build; cleanup removes that directory even if browser/server closure
fails. Shipped catalog, providers, routes and application code are unchanged.

| Fictional product | Expected rendered action |
| --- | --- |
| `test-handoff-37a-fictional-live` | Visible `Shop on Fourthwall` link with the exact fixture URL |
| `test-handoff-37a-fictional-preview` | No purchase or external link |
| `test-handoff-37a-fictional-unavailable` | No purchase or external link |

The existing route/product, artwork-revision and variant guards validate these
inputs; negative tests reject broken associations. The public projection excludes
a draft sentinel from the emitted artifact. Every product uses an authored 1×1
purple PNG swatch, decoded by the browser and labelled as fictional test imagery.
It contains no private artwork and establishes no merchandise or print approval.

## Request boundary

Before any page opens, the browser context blocks service workers and installs
request interception. Only `GET` requests to the exact HTTP `127.0.0.1` origin
and ephemeral port may reach the local server. Local responses use
`route.fetch({ maxRedirects: 0 })`; all 3xx responses are blocked, preventing a
local redirect from forwarding a request to an external service.

Only a top-level `GET` document navigation to this exact URL receives a locally
fulfilled, inert HTML page:

```text
https://test-handoff-37a.fourthwall.com/products/test-handoff-37a-fictional-live
```

No provider request is forwarded. Other destinations, methods, queries and
resource types are denied. WebSockets are closed and unexpected attempts fail
the check. The destination has a restrictive CSP and no form, input or button.
The browser proves denial of a POST, changed-query GET, image request and local
redirect, then directly probes the permitted destination. It does not activate
the product link yet; click/keyboard/mobile and Back/reload belong to checkpoint 2.

## Reproduce and evidence

Use the repository's Node **24.21.0** and pnpm **11.28.5** pins. From its root:

```sh
node scripts/store-environment.mjs setup
node scripts/store-environment.mjs run typecheck
node scripts/store-environment.mjs run catalog:test
node scripts/store-environment.mjs run build
node tests/checkout-handoff/run.mts
```

The last command uses Playwright's installed Chromium by default; the existing
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override can select a verified local binary.
It writes ignored `test-results/checkout-handoff/baseline.json`; `--output-dir`
selects another report directory. The reviewed [baseline](reviews/checkout-handoff-37a/baseline.json)
records the actual browser, states, intercepted destination and denied probes.

| Local check | Result |
| --- | --- |
| Catalog/Node suite | 73 pass, including six fixture/request-boundary cases |
| App, catalog/tooling and portable-domain types | Pass; harness included in the tooling profile |
| Normal build | Pass; fixture marker and swatch absent from normal output |
| Isolated actual-app build and browser baseline | Three product states, decoded swatch, exact destination and four denied probes pass; no page errors or WebSocket attempts |
| Six changed source/config files' Biome check and scoped tooling typecheck | Pass |

Playwright **1.62.1** ran Chrome for Testing headless shell **155.0.8059.84** on
Linux x64. This is an external verified executable, distinct from the previously
failed bundled Chromium 151 download; no dependency or lockfile changed.
The [official archive](https://storage.googleapis.com/chrome-for-testing-public/155.0.8059.84/linux64/chrome-headless-shell-linux64.zip)
is 125,033,980 bytes; SHA-256:
`a5d71b91aa996fef00517cd212b2dfb816b43055edefbe727e6fd562d4ae1f9c`.
Archive integrity, supplied MD5, executable version and project launch were checked.

Initial harness type errors were corrected. The deliberately denied redirect
initially raced Chrome's error-page navigation; isolating that probe on its own
page corrected the test lifecycle. No application workaround was needed.

These local passes are separate from hosted CI. Existing repository formatting
and dependency-review configuration failures remain tracked by #29/#73; no gate
was disabled. The current PR status belongs in the continuity handoff. Full
customer journeys, physical devices, browser matrix and actual provider checkout
remain unqualified. No cart/variant transfer, provider contact, purchase,
deployment or commerce activation occurred. #38 readiness preparation follows
only after selection; no new architectural decision is required for this harness.
