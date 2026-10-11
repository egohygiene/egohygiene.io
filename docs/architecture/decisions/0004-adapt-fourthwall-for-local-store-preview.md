# Adapt Fourthwall commerce contracts into the existing storefront

Status: accepted for the local preview; live-provider qualification remains open.

Date: 2026-10-10 (America/New_York). Owners: #31, #48, #61; related #38.

## Context

The website already has a React/Vite shell, a validated catalog, stable product/design/collection routes, and provider-specific purchase guards. Alan wants a reusable commerce foundation and a personal visual experience, with a simple `task preview:store` command to try it locally. Catalog production funded from customer sales and no required paid subscription remain first-provider constraints.

## Options considered

| Option | Useful starting point | Consequence |
| --- | --- | --- |
| Fourthwall Storefront API and official commerce starter | Product/variant contracts and a hosted-checkout flow | Compatible with our existing frontend; real provider setup still needs qualification |
| Medusa DTC starter | A storefront plus a full commerce backend | Adds server/database operation and payment/fulfillment integration beyond this preview |
| Next.js Commerce / Shopify | Established Shopify-centered commerce presentation | Introduces the applicable Shopify selling plan and a different integration commitment |
| Existing site plus selected commerce/UI patterns | Preserves catalog, routes, themes, and authoring | Lets us qualify one provider boundary before expanding the experience |

## Decision

Keep the existing React/Vite application and canonical catalog. Use Fourthwall's documented product/variant and hosted-handoff concepts for a bounded local proof. The local demo references the existing fictional Signal Heart product and artwork, with synthetic provider variants. It demonstrates selection and a handoff summary without creating a cart, navigating to payment, or activating a catalog product.

An optional Node-only command checks a real storefront token with read-only API requests. It remains separate from browser bundles and the demo. Real inventory, pricing, variant mapping, account eligibility, and fulfillment terms must be reviewed under #38 before activation.

`task preview:store` prepares pinned pnpm/workspace dependencies, validates the catalog, and builds an isolated `dist-preview` with the local demo enabled. Normal `pnpm build` targets `dist` and omits the demo. The task binds to loopback and opens `/store`. The preview artifact is development material and is not a deployment artifact.

## Reuse and provenance

The [official Fourthwall starter](https://github.com/FourthwallHQ/vercel-commerce) was inspected at revision `e571fffe4ab7b51fa08b7441055ca0e3d92a3eeb`. Its MIT license retains Vercel's notice, but its manifest pins a Next.js canary and a React release candidate. We do not transplant that dependency manifest or copy its implementation. This checkpoint implements a small adapter from public API documentation; adopting any starter source later requires preserving its notices.

The [Fourthwall architecture guide](https://docs.fourthwall.com/storefront/architecture) supports a separate static frontend. Its [Storefront API overview](https://docs.fourthwall.com/storefront/overview) separates browsing/cart operations from hosted checkout. The [pricing page](https://fourthwall.com/pricing), checked 2026-10-10, offers a free plan and deducts catalog production cost from sales, with payment-processing fees. That model does not establish financing for arbitrary self-sourced manufacturing or free custom-site hosting.

Comparison sources: [Medusa current starter guide](https://docs.medusajs.com/resources/nextjs-starter), [Medusa DTC starter](https://github.com/medusajs/dtc-starter), [Next.js Commerce](https://github.com/vercel/commerce), and [Shopify Hydrogen fundamentals](https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals).

## Consequences and follow-up

- The local flow works before a Fourthwall account or real artwork exists. Synthetic behavior is not evidence of a real checkout or fulfilled order.
- A single store catalog can retain other disabled provider routes. A shared multi-provider cart and custom payment backend remain outside v1.
- #62/#63 own the distinctive world-to-product design and selected motion. This proof establishes integration boundaries, not the final art direction.
- #64/#65 own interface and catalog localization. Provider checkout/email language support remains separately documented and verified.
- #61 remains open for comparison evidence and the remaining integration decisions; #38 owns real activation.

## Verification and rollback

Focused checks cover theme storage failure, setup command failures, provider contract validation, variant selection, and absence of live purchase behavior. Browser evidence and exact commands belong in `docs/store/test-plan.md`. Check that the default production build excludes the demo chunk and fixture markers, while the isolated preview includes them.

Revert the preview checkpoint to remove the local route, Task helper, and optional diagnostic. The canonical catalog and existing provider purchase states remain unchanged, so no catalog migration or order-data rollback is necessary.
