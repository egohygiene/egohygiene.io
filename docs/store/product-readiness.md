# Preparing one real product

Owner: #38, with customer disclosures under #9. This is a preparation workflow,
not an approval to create an account, publish an offer, deploy, or place an order.
The current catalog still has no real live product or checkout route. All provider
research placeholders remain disabled. Heartburst is approved for artwork display,
not for a garment. The Glitched Heart black hoodie remains a candidate.

## What the software can establish

The catalog's live-product boundary requires a reviewed qualification attached to
the exact hosted route. It binds the canonical product, provider destination,
variant mapping, displayed price when present, artwork and customer policy links.
A changed binding requires review again. Missing, unreviewed, malformed or stale
qualification cannot publish a live product or produce its purchase link.

This validates a recorded human decision and its consistency. It cannot verify
reviewer identity, rights, account eligibility, live inventory, commercial terms,
physical quality or whether a remote page still says what was reviewed. Review
dates are provenance, not an automatic expiration policy. Reverify external facts
before activation and whenever the product, account, terms or support arrangements
change. Withdraw qualification when relevant facts become uncertain.

The reviewed record and its evidence references are public. Use public-safe IDs
for the review and evidence; keep private source files, contracts, identity,
addresses, account/payout details and business records in their authorized private
system. A reference identifies an assessment; it is not the private evidence itself.
Nothing in the schema generates an approval or moves private records into Git.
`getStoreReadinessSnapshot` copies current offer facts for review; it does not
create qualification. Never refresh that snapshot automatically in a loader or
renderer to make an old review pass.

## Decisions and evidence needed at actual onboarding

| Area | Establish for this exact product and channel |
| --- | --- |
| Product | Exact garment/model/material, print area, sizes/colours, canonical variants and matching provider variants; accurate public product copy |
| Artwork | Permission to sell physical goods, retained provenance, actual print master revision, provider template/placement review and approved public derivatives; attribution or a web preview alone is insufficient |
| Channel and funding | Exact hosted catalog channel, seller/account/region eligibility, no required paid subscription for the chosen setup, and ordinary production charges deducted from customer payments without a merchant advance |
| Costs and liabilities | Current production/processing/platform charges, shipping/tax handling, margin, payout timing, reserves, disputes, refunds and possible later merchant charges; customer-funded production is not a promise of zero financial exposure |
| Customer information | Verified shipping/delivery destinations and limitations, returns/refunds/cancellations, responsible order-support destination, provider terms/privacy and checkout language; website locale is not delivery eligibility |
| Product presentation | Official product mockups distinguished from artwork/concept/lifestyle imagery; record separately whether a physical sample has been received and inspected |
| Handoff | Exact published offer URL, advertised amount/currency policy, available options and provider totals before payment; document selected-variant behaviour rather than inferring it from IDs |

Revisit the official sources linked in [provider research](providers.md) when the
actual account and product are selected. That document is dated research, not a
current account-specific qualification. A conventional fulfillment API that bills
the merchant separately does not meet the selected customer-funded route constraint.
No new vendor terms or account eligibility were verified in this preparation slice.

## Activation sequence, when separately selected

1. Review the candidate, garment/template and artwork rights with the owner. Keep
   private masters and evidence private; author only approved public content.
2. Qualify the exact provider channel and account terms. Record dated evidence and
   unresolved limitations. Complete account/product configuration only when selected.
3. Inspect the published offer, variants, mockups and customer policy/support pages.
   Add the exact route and public disclosures. Review its qualification snapshot;
   do not copy a test fixture or turn a research placeholder into approval.
4. Make the reviewed product live in a dedicated change. Run the focused catalog,
   purchase, projection and component checks, then the release qualification plan.
   All other products retain their own purchase states.
5. Verify the actual hosted handoff and totals without submitting payment. The
   website currently links to a product page; it has no real variant chooser or
   cart transfer. Verify options at the destination. A paid sample/order requires
   its own concrete budget; record payment, delivery and physical inspection as
   distinct evidence. A mockup, working link or unpaid checkout proves none of them.

If a qualification becomes invalid, set the product to preview/unavailable and
withdraw the route review in the same change. Do not leave a live product pointing
at an unreviewed route: the build deliberately fails. Removing the website link
does not unpublish a provider-side offer; review that state separately.

## Customer surfaces and remaining #9 work

`/store/help` explains preview states, physical products, hosted options/totals,
delivery/returns/support information and the limits of mockup evidence. Product
pages expose the three product-specific policy/support links only after the shared
purchase guard succeeds. Website feedback uses the existing public repository;
it is not private order support. Privacy and terms remain visibly provisional.

This is the bounded store slice of #9. The wider canonical organizational content
and declared site profile, Holon/Relay integration, Help Center, Our Story,
Accessibility Statement and private feedback mechanism, applicable privacy controls,
approved donation disclosures, and deployed verification remain open. Page presence
does not establish legal, privacy, security or accessibility compliance.

See [ADR 0011](../architecture/decisions/0011-reviewed-product-readiness.md) for
the contract and migration decision. Final integrated lint/testing/Chromium/CI work
stays in #37 on Alan's machine, before actual product setup.
