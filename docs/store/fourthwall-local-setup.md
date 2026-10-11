# Fourthwall local tryout

Status: local mock + optional read-only account diagnostic. Related: #61 (bootstrap), #38 (real provider activation), #62–#65 (experience and localization).

## Try the experience

With the [one-time Task and Node prerequisites](local-preview.md#one-time-prerequisites) installed, run from the repository root. This task installs the locked workspace dependencies before building and serving the preview:

```sh
task preview:store
```

Use the **Try the Fourthwall demo** link in the local preview, or open `http://127.0.0.1:4173/store/preview/fourthwall` with the default port. Choose S, M, or L, change the quantity, then select **Preview checkout handoff**. XL demonstrates an unavailable option. Changing a selection clears the previous summary. The summary stays on the page; no cart, payment, order, or external checkout is created.

The Signal Heart artwork and item name come from the existing canonical catalog. Provider IDs, sizes, availability, and prices in this isolated fixture are fictional. They are not approved manufacturing details or sale offers. The main catalog item remains `purchase.state: "preview"` and all provider channels remain disabled. No credentials are needed to explore this flow.

The tryout route is enabled only in the explicit local preview workflow. A normal production build must exclude its module and route. The current screen demonstrates the commerce interaction; the broader visual direction, galleries, internationalization, and localized catalog content are separate checkpoints.

## Optional: check your own Fourthwall shop

After you create a Fourthwall shop, use **Settings → For Developers** to obtain a **Storefront token**. This diagnostic does not create the shop or change any account settings.

1. Copy `apps/egohygiene.io/.env.example` to `apps/egohygiene.io/.env.local` if that local file does not already exist.
2. Edit `FOURTHWALL_STOREFRONT_TOKEN` locally. Use a `ptkn_` Storefront token, never a Platform API key, OAuth secret, or payment credential. Keep the token out of commands and screenshots.
3. Optionally set `FOURTHWALL_SHOP_URL` to your HTTPS shop origin, such as `https://your-shop.fourthwall.com`. The diagnostic compares it with Fourthwall’s shop response; it does not visit that URL.
4. Run:

```sh
task fourthwall:check
```

Equivalent command after the environment is installed:

```sh
node --env-file-if-exists=apps/egohygiene.io/.env.local scripts/check-fourthwall.mjs
```

The file is ignored by Git. Neither variable has a `VITE_` prefix, and neither is read by the browser app. Missing credentials produce setup guidance and zero requests. With a token, the diagnostic makes only GET requests to `storefront-api.fourthwall.com`: optionally `/v1/shop`, then page 0 of `/v1/collections` and `/v1/collections/all/products` (up to 50 results each). Requests reject redirects and time out after 10 seconds each. Messages contain counts and fixed error descriptions, not tokens, raw response bodies, or product names. More pages are reported, not silently treated as a full import. Bundles are counted but are outside the local product tryout.

Success confirms read access and the bounded response fields only. It does not confirm print quality, seller eligibility, shipping coverage, checkout behavior, cash-flow terms, or product readiness. No response is saved to Git or imported into the production catalog, and the browser continues showing the fictional fixture.

## Bootstrap decision

Keep the existing React/Vite site and canonical store schemas. Use Fourthwall’s documented Storefront API product, variant, and hosted-checkout contracts as the commerce boundary. This keeps the art and navigation fully customizable without introducing a second site or commerce backend.

The official [Fourthwall Vercel Commerce starter](https://github.com/FourthwallHQ/vercel-commerce/tree/e571fffe4ab7b51fa08b7441055ca0e3d92a3eeb) is a useful reference for a full storefront. We are not copying its Next.js app or dependency tree into this Vite monorepo. This checkpoint uses an original, small adapter over the documented API fields; it is a proof of the integration shape, not an installed or live Fourthwall starter.

The preview adapter validates the `PRODUCT` discriminator, public/available state, IDs, variant prices, and stock fields it consumes. Additional provider fields are stripped. This bounded fixture supports `LIMITED` stock only; unsupported stock types stay unavailable in the preview. A real importer must explicitly support the stock states, bundles, currencies, and product kinds it needs instead of treating every provider response as purchasable.

## Next checkpoint with a real design

- Map one approved public artwork derivative and one real Fourthwall product/variant into the canonical catalog.
- Confirm the product’s actual price, availability, provider terms, and customer-funded production suitability.
- Review the checkout route and artwork revisions under the existing live-purchase schema. A successful diagnostic cannot activate it.
- Add the real provider/cart integration with validated responses and error handling, then verify the hosted-checkout boundary. Shipping, tax, and binding totals stay with the provider.
- Test a deliberate purchase only after that product and route are ready; the local preview never places a test order.

## Official references checked 2026-10-11

- [Storefront overview](https://docs.fourthwall.com/storefront/overview)
- [Authentication and static frontend support](https://docs.fourthwall.com/storefront/getting-started)
- [Products through collections and pagination](https://docs.fourthwall.com/storefront/products)
- [Product and variant response fields](https://docs.fourthwall.com/api-reference/storefront/products/get-product)
- [Collection response fields](https://docs.fourthwall.com/api-reference/storefront/collections/list-collections)
- [Shop identity](https://docs.fourthwall.com/api-reference/storefront/shop/get-shop)
- [Cart items and hosted-checkout handoff](https://docs.fourthwall.com/storefront/cart-checkout-tutorial)
- [Checkout configuration](https://docs.fourthwall.com/storefront/checkout)
- [Custom frontend architecture](https://docs.fourthwall.com/storefront/architecture)
