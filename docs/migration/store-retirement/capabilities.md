# Preserved commerce capabilities and adoption conditions

Source: `egohygiene/store` main `5786fd40bfe40b0d338eb96087355b98f7e16d42`.
Runtime, tests and scripts match the earlier audited source
`599c90ca6a454c0f2e9aa95eab5f8395016474c5`; later commits changed documentation.
All paths below are relative to the source restored from [the bundle](store-source.bundle).
The entire source/history is preserved, including files not selected for reuse.

| Source material | Website disposition |
| --- | --- |
| `packages/commerce/src/types.ts`, `errors.ts`, `create-commerce-client.ts` | Useful async commerce-port/error reference. #61/#38 decide whether a cart/API is actually needed; map website canonical identity to provider offers explicitly. |
| `packages/commerce/src/fourthwall/fourthwall-client.ts` | Preserve product pagination, cart read/create/add/change, injected fetch, error wrapping and hosted-checkout URL building. Keep I/O outside the portable website domain and reverify the provider contract before adopting. |
| `packages/commerce/src/mock/` | Preserve credential-free cart examples and failure/regression ideas. Do not replace the existing website catalog or isolated preview fixtures. |
| Storefront provider/context, cart drawer and product controls | Preserve interaction/state reference. Existing website shell, routing, gallery, themes and locales stay authoritative. |
| `packages/store-config/src/index.ts` | Historical configuration/token boundaries only. Do not import its activation environment variables or independent app deployment setup. |
| Five unit cases and one E2E | Historical tests and regression ideas; no new execution or provider qualification. #37/#52 own adopted behavior checks. |
| Four mock-product SVGs, old app/UI and Vercel/base-path config | Recoverable historical source; no production catalog/asset approval or competing deployment. |
| Research, ADRs and handoff documents | Full source snapshot plus readable backlog/issue export. Independent hosting and old setup instructions remain historical. |

## Concrete conditions before code adoption

- Reject non-finite money values and avoid permissive stock-string heuristics.
- Validate cart quantity integrality/positivity and currency consistency.
- Scope persisted cart IDs to provider/shop; define mock reload/session behavior.
- Handle storage failures and cart request races/cancellation explicitly.
- Add usable busy/error feedback to quantity/remove actions.
- Provide drawer focus trapping/restoration and appropriate keyboard semantics.
- Add adapter-specific normalization/error tests. Replace the historical ambiguous
  `Black / Small` locator with observable scoped assertions; cover quantity,
  removal and checkout, not merely add-to-cart.
- Reverify current provider APIs and actual approved product/variant arrival under
  #38. A generated checkout URL or return route is not order/payment evidence.
- Retain this source SHA/path and original MIT notice with every substantial
  adapted slice. #59's website licensing issue remains open.

There is no current need to activate these capabilities to complete the repository
handoff. Adoption is conditional work under existing owners, not a new prerequisite
for the finite setup sprint. The archived implementation can be retired as an
independent repository while remaining recoverable for those later decisions.
