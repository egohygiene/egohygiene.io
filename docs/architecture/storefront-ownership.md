# Storefront ownership comparison and preservation plan

Date: **2026-10-17 UTC**. Owner: [issue #75](https://github.com/egohygiene/egohygiene.io/issues/75).
Status: comparison complete; selected direction submitted for review in paired
documentation PRs. No application code, deployment, repository settings or
provider configuration changed. [ADR 0007](decisions/0007-canonical-storefront-owner.md)
records the rationale; [current state](../context/current-state.md) owns receipts.

## Selected owner

Use **`egohygiene/egohygiene.io`, inside `apps/egohygiene.io`**, for the V1
customer-facing storefront. Build the root site and `/store` as one composed
static application. The website owns the deployment coordinator. Preserve
`egohygiene/store` as the existing commerce implementation/reference and research
backlog; adapt individual capabilities only when the website needs them.

This keeps the public catalog and artwork approval boundary, stable URLs, and
shared site shell together. The separate store has useful cart code, but adopting
its entire application would require adding the website's catalog model and
rebuilding the integrated shell and publication safeguards. Neither application
has demonstrated a production-qualified sale. Cart maturity alone does not
justify replacing the catalog and route owner.

The remaining Netlify setup belongs to #29; production hosting remains undecided.
There is no independent store origin or `/store` proxy in the selected V1 shape.
Private `incomprisllc/merch` remains a separate creative source and
`incomprisllc/catalog` remains the song metadata source. No repository is moved,
archived or made public by this decision.

## Evidence and capability matrix

Source inspected at website **`db634b887ede348ce85d9c03af789467ab535dcf`**
([tree](https://github.com/egohygiene/egohygiene.io/tree/db634b887ede348ce85d9c03af789467ab535dcf))
and separate store **`599c90ca6a454c0f2e9aa95eab5f8395016474c5`**
([tree](https://github.com/egohygiene/store/tree/599c90ca6a454c0f2e9aa95eab5f8395016474c5)).
Planning merges #74 (`ee59e2f83c59c084c23a5f8bcc3311c2dc830859`) and
store #33 (`bfda1a7c6b0ce09258522be8d8fe4bf9cba8b5a3`) change documentation
only. Paths below are relative to the corresponding pinned repository.

| Concern | Website implementation | Separate store implementation | Disposition |
| --- | --- | --- | --- |
| Site and routes | `src/app/router.tsx` under `apps/egohygiene.io`: root plus store/product/design/collection routes in shared layout | `apps/storefront/src/app/App.tsx`: home/shop/product/about/checkout-return under `/store` basename | Retain website shell and canonical routes |
| Catalog and art | `packages/schemas/src/store.ts`, `scripts/store-catalog.mts`, `scripts/vite-store-catalog.mts`: versioned graph, validated artwork, safe public projection, stable IDs | `packages/commerce/src/types.ts`: normalized provider product/variant/cart; no design/song/publication model | Keep website catalog authoritative; provider models are offer/checkout inputs |
| Presentation | `features/store/StorePages.tsx`, artwork/gallery components: filters, context, collections, previews and unavailable states | Product grid/detail, variant selector, cart drawer, responsive styles | Preserve website journey; assess selected cart interaction patterns under #61/#37 |
| Domain boundary | `features/store/domain/index.ts`: portable selectors and synthetic offer/handoff rules; DOM-free compilation/import guard | `packages/commerce/src/types.ts`, `create-commerce-client.ts`: asynchronous commerce port with mock/Fourthwall selection | Adapt an explicit I/O seam when required; do not replace canonical IDs with provider IDs |
| Provider I/O | `features/fourthwall-preview/adapter.ts` normalizes synthetic fixtures; no live cart API | `packages/commerce/src/fourthwall/fourthwall-client.ts`: runtime parsing, product pagination, cart fetch/add/change, checkout URL builder | Valuable candidate, requiring contract and failure tests before adoption |
| Purchase state | Empty `src/content/store/checkout-routes.json`; schema can approve an external Fourthwall product URL at exact artwork/variant revisions | Cart ID persisted in browser; hosted checkout handoff implemented; mock cart in memory | Neither proves live eligibility or manufacturing. Keep purchases disabled until #38 |
| Local toolchain | Node 24.21.0, pnpm 11.28.5; normal `dist` and isolated synthetic `dist-preview` | Node 22 CI, pnpm 10.14.0; Vite `/store/` base and Vercel configuration | Retain website pins/build; do not copy competing manifests or deployment config |
| Licensing | Empty root `LICENSE`; package metadata declares Apache-2.0 | Complete MIT `LICENSE`, copyright Ego Hygiene 2026 | Website #59 remains unresolved; preserve MIT notice for substantial copied code |

Website feature paths above are under `apps/egohygiene.io/src/`. The existing
[private-source consolidation ledger](../migration/store-v1-consolidation.md)
compared `incomprisllc/merch`, not the public `egohygiene/store` application. Its
historical scaffold findings must not be generalized to this separate app.

## Test evidence and limits

The website contains catalog/reference/approval/public-projection tests, real
Vite output tests, artwork containment checks, a framework-neutral domain
consumer, component tests, and store/theme/preview browser journeys. See
`tests/store/`, `tests/e2e/store.spec.ts`, `tests/e2e/fourthwall-preview.spec.ts`,
and the [earlier implementation receipt](store-domain-checkpoint.md).
That receipt's local passes are historical, not freshly rerun results.

The separate store has five unit cases (mock cart, configuration and money
formatting) and one browser journey that stops after adding an item to the cart.
No Fourthwall adapter contract tests or checkout navigation assertions were
found in the pinned source. A visible cart is not proof of hosted checkout.

Refreshed pre-merge CI on 2026-10-17:

- Website [validation](https://github.com/egohygiene/egohygiene.io/actions/runs/38971335753)
  stops at 37 existing formatting diagnostics. [Dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/38971335710)
  still reports unsupported/Dependency graph. #29 / draft PR #73 own that repair.
- Store [CI](https://github.com/egohygiene/store/actions/runs/38971339738): Quality
  gates pass; E2E fails because `getByText("Black / Small")` matches an option
  and a cart label. Store #32 remains the failure/handoff owner.

No checks or protection settings were disabled for the planning merges. This
comparison performs source and documentation review, not new application,
browser, live API, deployment or transaction testing.

Before adapting separate-store commerce code, address the observed gaps:
cart persistence is not scoped to provider/configuration; mock cart contents
disappear after reload; quantity/remove actions lack visible failure and busy
handling; the drawer lacks focus trapping/restoration; numeric string parsing
does not reject non-finite values; availability mapping uses string heuristics.
These are integration requirements, not claims of an observed production incident.

## Preserve, adapt and defer

| Source at pinned store revision | Planned destination / owner | Condition |
| --- | --- | --- |
| `packages/commerce/src/types.ts`, `create-commerce-client.ts` | Website feature I/O boundary under #61/#69 if cart is selected | Map catalog identity to provider offers explicitly; do not import a second product source of truth |
| `packages/commerce/src/fourthwall/fourthwall-client.ts` | Website provider adapter under #61/#38 | Verify actual provider contract, errors, pagination, stock/prices and checkout destination with deterministic fixtures first |
| `packages/commerce/src/mock/` | Deterministic mock for the selected adapter under #61/#37 | Preserve inert behavior; define reload/session scope and stale-cart recovery |
| `apps/storefront/src/features/storefront/`, `components/CartDrawer.tsx`, product page | Selective state/interaction patterns under #61/#37 | Accessible focus, locale-ready strings, concurrency/error recovery, canonical variant mapping; no wholesale shell copy |
| Tests and `LICENSE` | Regression cases plus notices/provenance alongside each adopted slice | Add missing adapter/handoff cases; retain source repository, exact SHA/path, adaptation description and MIT notice |
| Vercel/base-path config, independent app shell | Retain in source as historical runnable reference | No second V1 deployment, build output overwrite or blind prefix stripping |
| Research/backlog, source history | Remain in `egohygiene/store` | Link relevant website owners; no silent closure, deletion or mass issue move |

No code has been copied. This ledger is a disposition plan, not a completed
migration. First checkout may remain a reviewed external product handoff under
#38 if sufficient; a full cart is not automatically a prerequisite. If a cart
is selected, stage it under #61 and validate it under #37. Do not invent new
abstractions or broaden the live schema merely to accommodate hypothetical vendors.

## Integration, cutover and rollback

1. **Review ownership (#75).** Merge reciprocal decisions and update active
   pointers. Keep all source repositories and historical ADRs intact. This
   resolves the owner; it does not close #61, #69 or provider qualification.
2. **Restore website checks and preview (#29).** Review the existing PR #73,
   repair the actual baseline, then add the reusable development workflow to
   this single app. Do not repoint DNS or activate the separate app's Vercel
   configuration. Existing unrelated documentation subdomains remain separate.
3. **Adopt only needed capability (#61/#38).** For each slice, record source SHA,
   paths, license/notice, catalog-to-provider ID mapping, test evidence and
   revert commit. Preserve schema compatibility and exact artwork/variant
   approval guards. Browser configuration must never contain Platform API keys.
4. **Qualify the composed output (#37/#29).** Direct load/reload `/`, `/store`,
   product/design/collection URLs, asset paths, unknown-route handling and
   keyboard/mobile navigation on the actual selected host. Normal builds must
   exclude synthetic preview fixtures. Hosted development stays mock/inert.
5. **Release only after actual gates (#38/#39).** Record approved product/price,
   checkout behavior, support responsibilities, host/cost decision and tested
   rollback. Retain the previous known-good artifact and source SHA. A build,
   handoff, paid order and received sample are separate evidence levels.

Preserve existing website paths verbatim. The separate app's `/store/shop`,
`/store/about` and `/store/checkout-return` have no established production
traffic evidence here. Inventory actual published links before cutover; map
needed shop/about links to appropriate website destinations and preserve any
configured checkout return URL explicitly. Product slugs require an explicit
mapping before redirects; do not guess equivalence from matching labels.

Rollback before deployment is reverting the adopted slice/decision and keeping
the last passing website catalog/build. After a hosted preview, redeploy its
recorded previous artifact and configuration. Production rollback, once a host
is selected, must separately cover routing and any provider return URLs. An
unsafe purchase route is disabled in the catalog first; reverting the website
cannot undo an order or provider-side state. Never use the unqualified second
store as an automatic failover.

Reconsider independent deployment only for a demonstrated capability, ownership
or release need that outweighs maintaining two shells/publication boundaries.
Keep the portable domain seam so such a future change is possible without
changing canonical product identities or incoming music links.
