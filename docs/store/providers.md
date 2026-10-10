# Store provider placeholders

Reviewed against official sources on **2026-10-10**. These are planning records, not connected accounts or working adapters. All nine channels in [`providers.json`](../../apps/egohygiene.io/src/content/store/providers.json) are disabled. No credentials, client libraries, background calls, checkout embeds, or bank connections are installed by this configuration.

## What each service would do

| Channel | Role | Ordinary order funding | Place in the roadmap |
| --- | --- | --- | --- |
| Fourthwall catalog | Hosted checkout and physical fulfillment | Catalog base cost deducted from a sale; processing fees apply | First apparel candidate |
| Printify Pop-Up Store | Hosted checkout and physical fulfillment | Customer pays Printify; costs deducted from earnings | Alternative for apparel and objects |
| Printify API / store integration | Physical fulfillment | Merchant billed separately for production and shipping | Deferred |
| Lulu Direct Buy Button / Checkout Link | Hosted checkout and book fulfillment | Printing, shipping, fulfillment, and processing deducted from customer payment | Future comic candidate |
| Lulu Direct connected store / Print API | Book fulfillment | Merchant pays fulfillment charges separately | Deferred |
| Stripe Payment Links | Hosted payment processing | Does not itself fund or perform manufacturing | Future payment option |
| Square Payment Links | Hosted payment processing | Does not itself fund or perform manufacturing | Future payment option |
| Plaid Auth | Bank account linking and authentication | Not a physical order funding service | Parked; no direct v1 requirement |
| Contrado dropshipping | Custom-product fulfillment | Exact channel funding not yet verified | Research for bags and complex garments |

There is no universal stack that needs every provider. The initial site can link to one provider-hosted product and let that provider complete payment and fulfillment. A second product may eventually use another supported channel without needing a shared cart or a custom payment backend.

**Channel matters as much as company.** Printify Pop-Up and its ordinary integrations have different cash flows. Lulu's newer Buy Button/Checkout Link and conventional Direct integrations do too. A free account, free app, or no inventory requirement does not by itself mean supplier costs are deducted from a customer payment.

## Evidence and limits

- **Fourthwall:** Its [pricing page](https://fourthwall.com/pricing) describes a free plan, catalog costs deducted from sales, and transaction processing charges. Fourthwall handles catalog product manufacturing and shipping. This evidence does not establish the cost or funding of a self-sourced purse or other custom manufacturing project.
- **Printify:** [How Printify charges merchants](https://help.printify.com/hc/en-us/articles/4483626302609-How-will-Printify-charge-me) explicitly separates ordinary integrations from Pop-Up Store. [Pop-Up payouts](https://help.printify.com/hc/en-us/articles/12051908094993-How-will-my-Pop-Up-Store-earnings-be-paid-out) describe deductions from customer payments. Seller eligibility and Stripe verification must be checked during onboarding.
- **Lulu:** The [Buy Button page](https://www.lulu.com/sell/sell-on-your-site/buy-button) describes free button/link creation, a published printable project, Stripe onboarding, and deductions from customer payment. [Payout guidance](https://help.luludirect.lulu.com/en/support/solutions/articles/64000311683-how-do-direct-buy-button-payouts-work-) covers payment delays and reserves; refunds exceeding reserves can be collected from the connected bank account. [Conventional Direct pricing](https://help.luludirect.lulu.com/en/support/solutions/articles/64000270795-how-are-lulu-direct-prices-calculated-and-what-will-i-pay-) instead describes charges to the merchant. These are separate integration choices.
- **Stripe and Square:** [Stripe Payment Links](https://stripe.com/payments/payment-links) and [Square Payment Links](https://squareup.com/us/en/payment-links) provide hosted payment pages. They do not make a product or arrange its manufacturing. Provider-managed Stripe onboarding, such as Lulu's, does not mean this website needs its own Stripe API integration.
- **Plaid:** [Auth documentation](https://plaid.com/docs/auth/) describes bank account authentication for payment services; Auth does not act as the payment processor. This entry is specifically for Auth, not a claim about every Plaid product. It has no role in v1 product fulfillment.
- **Contrado:** The [dropshipping page](https://www.contrado.com/drop-shipping) describes custom products, all-over printing, no minimum quantity, and a Shopify integration. The funding entry stays `unverified` until the exact payment arrangement is established. No inference of free manufacturing follows from a free app.

This research supports prioritizing customer-funded order channels. It is not a guarantee of zero financial exposure: samples, optional upgrades, refunds, disputes, payout delays, reserves, shipping configuration, and changing terms still need review for the selected real product. Do not order samples automatically.

## Configuration boundary

[`store-providers.ts`](../../packages/schemas/src/store-providers.ts) is the authoritative schema. TypeScript types derive from Zod. `parseStoreProviders` validates the manifest and reports the filename and field path. It rejects unknown fields and versions, duplicate channel IDs, inconsistent role/capability/funding combinations, activation attempts, and secret-bearing fields such as `apiKey`.

`status: "placeholder"` and `enabled: false` are currently the only valid activation values. Editing JSON cannot turn these records into integrations. Documentation URLs are research sources, not purchase destinations. This manifest is public repository content; put no account identifiers, tokens, banking data, or private supplier arrangements here.

The existing purchase contract remains separate in [`store.ts`](../../packages/schemas/src/store.ts). It currently supports reviewed Fourthwall product routes only. Adding Printify, Lulu, Square, or Stripe here does not expand that purchase contract or its URL policy. `checkout-routes.json` remains empty until a real product is configured and reviewed. Preview products cannot initiate payment.

## When one product is ready

1. Select a product and a particular channel. Recheck eligibility, current costs, customer support, returns, shipping destinations, and who pays fulfillment charges.
2. Complete account, payout, and product setup with the owner. Use approved artwork and real variants; keep production masters and account details private.
3. For the supported Fourthwall path, add the verified product route, artwork revision approvals, and variant mapping. For another provider, first implement and test its narrow hosted-link contract and destination policy.
4. Add an explicit provider activation contract when the first channel is actually ready. Keep unsupported channels disabled. Test the resulting purchase action before changing product state to `live`.
5. Check the actual hosted destination and shipping/price disclosure. Any paid proof order needs an agreed budget. Product publication and SoundCloud linkage are later launch steps.

Do not model these placeholders as automatic failover or fulfillment routing. Live providers can differ in product construction, sizing, price, artwork templates, shipping, and returns. Changing a product's channel requires review, not a silent retry through another manufacturer.
