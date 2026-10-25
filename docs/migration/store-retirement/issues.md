# Original store issue records

Captured 2026-10-25. This is a readable export of historical issue bodies from the public
`egohygiene/store` repository, with original status and provenance. Bare issue numbers
and relative links inside them retain their original source-repository meaning.
Trailing line whitespace is normalized here; exact original bodies remain in
`github-records.json.gz`. Research claims and provider/legal references are unverified historical inputs, not
current recommendations or completed work. See [the disposition ledger](backlog.md).

## Store #9 — Explore AI-assisted custom fashion design and fulfillment integrations

Source: https://github.com/egohygiene/store/issues/9 · State: **open** · Author: szmyty

Created: 2026-08-19T16:42:08Z · Updated: 2026-08-19T16:42:08Z

### Original body

## Objective

Explore how the Ego Hygiene store could support an AI-assisted custom fashion experience: a person describes or iteratively designs clothing, previews and approves a manufacturable result, and then places an order fulfilled through Fourthwall, another print-on-demand provider, or a later-stage manufacturing partner.

This is a **research and architecture issue**, not a commitment to build the full feature.

## Context

The store currently has:

- a modular React + Vite storefront
- provider-neutral commerce contracts in `@egohygiene/commerce`
- mock commerce mode for credential-free development
- a Fourthwall Storefront API adapter
- Fourthwall-hosted checkout
- Fourthwall handling products, manufacturing, fulfillment, shipping, and order operations

The opportunity is to let people create meaningful, personal clothing without needing conventional designer access or pricing. The experience should feel like conversational co-design rather than a generic "put an AI image on a shirt" generator.

Possible inputs could include:

- a written prompt or conversation
- an uploaded sketch or reference image
- emotion, memory, identity, music, symbolism, or personal-growth themes
- garment, color, placement, fit, material, sensory, and accessibility preferences
- optional Ego Hygiene visual or philosophical design guidance

Designs should remain private by default, with clear customer control over saving, ordering, publishing, remixing, and any marketplace participation.

## Product capability levels

Research these as separate levels rather than treating them as one feature:

1. **Customization on curated blanks**
   Generate or upload artwork, validate it, place it on an existing garment, approve a proof, and fulfill on demand.

2. **Conversational co-design**
   Iterate on garment, artwork, typography, palette, placements, and variants through an AI-assisted workspace.

3. **Multi-provider fulfillment routing**
   Select among compatible providers based on product type, print method, quality, cost, location, lead time, and availability.

4. **True made-to-order fashion**
   Explore silhouettes, cut-and-sew construction, patterns, fabrics, measurements, tech packs, sampling, and manufacturer coordination.

The likely MVP is level 1, with enough architectural separation to support level 2. Levels 3 and 4 should remain later-stage research unless evidence changes that conclusion.

## Architectural constraints

Preserve the repository's existing boundaries:

- Keep provider-specific behavior behind commerce adapters.
- UI components consume normalized models and must not import provider response shapes.
- Preserve mock mode.
- Do not expose Fourthwall Platform API keys or other server credentials in browser code.
- Keep Fourthwall-hosted checkout for the existing commerce path unless research demonstrates a compelling reason to change it.
- Treat AI output as a creative concept, not manufacturing truth.
- Require production validation and explicit customer proof approval before an order can be submitted.
- Keep reusable provider and production concepts out of storefront components.
- Preserve accessible semantics, keyboard support, and reduced-motion behavior.

A possible conceptual boundary is:

```text
co-design workspace
  -> design project + customer-controlled assets
  -> production validation
  -> provider-neutral product/quote/order request
      -> Fourthwall adapter
      -> alternate POD adapter
      -> future manufacturing workflow
```

## Integration candidates to investigate

| Candidate | What to investigate | Likely role |
| --- | --- | --- |
| Fourthwall | Platform and customization APIs, dynamic products, variants, product media, checkout handoff, fulfillment limits, webhooks, authentication, and whether per-customer generated designs can be created safely | Preferred MVP path if capabilities and economics fit |
| Printful | Product Templates/API, Embedded Design Maker or equivalent tooling, mockups, order creation, personalization, print-file validation, webhooks, and direct fulfillment | Strong alternative or secondary POD adapter |
| FLYP | Product workflow, garment templates, production model, API or partnership availability, proofing, economics, and competitive UX | Benchmark and possible partner |
| The New Black | Concept generation, virtual try-on, 3D garment and tech-pack capabilities, export/API options | Benchmark or later-stage design/manufacturing aid |
| Manufacturing networks | Maker's Row, Sewport, FOURSOURCE, and comparable cut-and-sew/sourcing services; APIs, minimums, sampling, tech packs, quality control, and fulfillment | Level 4 research |
| AI design layer | Provider-neutral conversational orchestration, image generation/editing, structured design state, provenance, moderation, and asset export | Creative layer owned by the store experience |

Also use the broader commerce research captured in [egohygiene/akashic#44](https://github.com/egohygiene/akashic/pull/44) to identify additional storefront, print-on-demand, manufacturing, wholesale, payment, logistics, and open-source commerce candidates.

Initial references:

- [Fourthwall developer documentation](https://docs.fourthwall.com/)
- [Printful API](https://www.printful.com/api)
- [FLYP fashion design app](https://flyp.space/fashion-design-app)
- [The New Black](https://thenewblack.ai/)

## Research questions

### Provider and fulfillment

- Can Fourthwall support a unique customer-created design without manual catalog administration?
- Does the integration require a server-side Platform API proxy, and which operations can remain in the Storefront API?
- Can a design be attached to a temporary/private product or order without exposing it publicly?
- Which providers support all-over print, embroidery, multiple placements, cut-and-sew, custom labels, packaging, and accessible garment options?
- What are the real unit costs, platform fees, margins, minimums, shipping regions, delivery estimates, sample costs, and return constraints?
- Which providers offer usable sandboxes, mock APIs, webhooks, rate limits, order status, cancellation, and reprint flows?
- Who is responsible for customer support, damaged items, misprints, returns, tax, fraud, and chargebacks?

### Design and production validation

- Which structured data should a design project contain beyond flattened images?
- How should print dimensions, resolution, transparency, bleed, safe zones, color gamut, placement boundaries, and file formats be validated?
- How should embroidery designs be simplified and validated?
- How should incompatible requests be explained without losing the creative intent?
- When is a rendered mockup sufficient, and when is a physical sample or human production review required?
- How can the system communicate that visual mockups, colors, fit, and materials may differ from the final product?

### AI, rights, and safety

- What moderation is required for trademarks, copyrighted characters, public figures, hate content, sexual content, and impersonation?
- What rights does the customer retain over prompts, uploads, generated assets, and final designs?
- What licenses or restrictions do AI and fulfillment providers impose?
- How are consent and provenance represented for uploaded faces, art, logos, or collaborative work?
- What is the deletion and retention model for prompts, images, body measurements, addresses, and order artifacts?
- How can designs remain private by default while allowing explicit publishing, remixing, or creator royalties later?

### Experience and accessibility

- Can the workflow be fully used with keyboard navigation, screen readers, large text, sufficient contrast, and reduced motion?
- How should the experience support sensory preferences such as fabric feel, garment weight, tags, seams, compression, and mobility?
- How should fit uncertainty and inclusive sizing be communicated?
- Can users pause, resume, compare, undo, branch, and approve designs without losing state?
- What is the lowest-complexity path from idea to a confident purchase?

## Proposed research deliverables

- [ ] A provider comparison matrix covering capabilities, API maturity, authentication, webhooks, privacy, moderation, regions, cost, margins, fulfillment, returns, and support responsibilities.
- [ ] A verified capability map for Fourthwall, clearly separating Storefront API, Platform API, hosted checkout, and any manual operations.
- [ ] A verified Printful comparison and at least one additional viable provider or manufacturer path.
- [ ] A recommendation for the smallest responsible MVP, including what is deliberately excluded.
- [ ] A provider-neutral domain proposal for design projects, production constraints, proofs, quotes, and fulfillment requests.
- [ ] An adapter/interface proposal that fits `packages/commerce` without leaking provider details into the UI.
- [ ] A data-flow and trust-boundary review covering browser, server-side proxy, AI provider, commerce provider, asset storage, and customer data.
- [ ] A production-validation plan for print files, mockups, proofs, incompatible requests, and manual review.
- [ ] An accessibility and inclusive-design checklist for the end-to-end co-design workflow.
- [ ] A preliminary cost and margin model using representative garments, regions, and provider fees.
- [ ] A risk register covering quality, IP, privacy, security, refunds, fulfillment failures, vendor lock-in, and misleading previews.
- [ ] A narrow technical spike plan with success metrics and clean follow-up issue boundaries.

## Suggested spike

Prototype only the minimum end-to-end path:

1. Start from a curated blank garment.
2. Capture a prompt or user-supplied artwork.
3. Produce or import one editable design asset.
4. Validate it against provider-specific print constraints.
5. Render a proof on the real product template.
6. Require explicit customer approval.
7. Create or hand off the personalized product/order through a mock adapter first.
8. Verify the same domain flow against the preferred provider's sandbox or documented test path.
9. Record cost, latency, failure modes, privacy implications, and manual steps.

The spike should not collect real payments or place a real production order unless a separate, explicitly approved task defines safeguards and spending limits.

## Non-goals

- Implementing the complete customer-facing feature in this issue
- Replacing the current Fourthwall integration before comparison work is complete
- Building a full marketplace or royalty system
- Automating bespoke cut-and-sew manufacturing in the MVP
- Treating a generated image or virtual try-on as a production-ready specification
- Creating customer accounts, order-history UI, or general inventory administration as incidental scope
- Sending unapproved designs to fulfillment
- Storing sensitive customer data without an explicit retention, security, and deletion design

## Acceptance criteria

This discovery issue is complete when:

- the capability levels are evaluated independently
- Fourthwall's feasibility for private, per-customer customization is verified from current documentation or provider confirmation
- at least two practical fulfillment paths are compared
- the preferred MVP and fallback are documented with evidence
- the proposed architecture preserves provider neutrality, mock mode, credential safety, and hosted checkout constraints
- production validation, proof approval, accessibility, privacy, IP, returns, and support responsibilities have concrete recommendations
- cost, margin, latency, geographic coverage, and operational effort are estimated
- uncertainties and provider-confirmation questions are explicitly listed
- a scoped implementation sequence and follow-up issue breakdown are proposed for later review

## Status

Backlog exploration. No implementation is scheduled by creating this issue.


### Original conversation comments

No conversation comments at capture.

## Store #11 — Research agentic-commerce semantics and define a machine-readable commerce contract

Source: https://github.com/egohygiene/store/issues/11 · State: **open** · Author: szmyty

Created: 2026-08-22T19:28:38Z · Updated: 2026-08-22T19:28:38Z

### Original body

## Outcome

Define the Store-owned Commerce Layer for Agent-Ready Web experiences so generic site templates can expose trustworthy product/offer semantics without embedding payment-domain behavior directly into Holon.

## Scope

- Research the `CAP` terminology referenced in the React/Vite Agent-Ready Web notes before adopting it as canonical vocabulary.
- Define machine-readable commerce contracts for products, offers, pricing, currency, availability, inventory state, seller identity, policies, cart actions, checkout capabilities, and transactional constraints.
- Prefer established structured-data semantics (for example Schema.org/JSON-LD) where they accurately model the domain.
- Distinguish descriptive metadata from executable transactional capabilities.
- Define safe boundaries for agent-triggered cart/checkout actions: authentication, explicit user approval, amount/currency confirmation, inventory revalidation, idempotency, replay protection, and auditability.
- Do not expose secrets, payment credentials, or privileged server capabilities through client-side metadata.
- Define a versioned contract Holon storefront blueprints can consume once stable.
- Document unsupported states and how machine consumers discover that checkout is human-only or unavailable.

## Acceptance criteria

- [ ] CAP terminology is researched and either precisely adopted or replaced with clearer Store terminology.
- [ ] A versioned commerce metadata/action contract exists.
- [ ] Product, offer, pricing, availability, seller, and policy semantics are represented.
- [ ] Descriptive metadata and executable actions remain distinct.
- [ ] Agent-triggered transactional actions require explicit security and user-approval boundaries.
- [ ] Checkout semantics include revalidation, idempotency, and failure behavior.
- [ ] Payment secrets/credentials are never exposed by the public contract.
- [ ] Holon can consume the contract without owning commerce-domain rules.
- [ ] A reference fixture demonstrates machine-readable catalog data and a guarded action flow or explicit human-only fallback.

## Dependencies

- https://github.com/egohygiene/hygiene/issues/16

## Source

Approved August 22, 2026 React/Vite Agent-Ready Web specification, Commerce Layer.

### Original conversation comments

No conversation comments at capture.

## Store #12 — Define commerce legal-policy applicability for billing, AML, KYC, and regulated flows

Source: https://github.com/egohygiene/store/issues/12 · State: **open** · Author: szmyty

Created: 2026-08-22T20:23:27Z · Updated: 2026-08-22T20:23:27Z

### Original body

## Outcome

Define a Store-owned commerce/compliance applicability profile that tells the broader Ego Hygiene site-policy system when commercial terms, payment disclosures, AML controls, KYC/customer-identification flows, seller verification, or other regulated financial surfaces are actually required.

This issue must prevent generic site templates from publishing AML/KYC language merely because a product accepts money.

## Scope

Research and model the legal/operational triggers associated with commerce capabilities such as:

- paid subscriptions;
- one-time purchases;
- refunds/cancellations;
- recurring billing;
- marketplace transactions;
- seller/vendor onboarding;
- creator/contributor payouts;
- stored value, credits, or wallets;
- money transmission or payment facilitation;
- identity verification;
- beneficial-owner/customer due diligence;
- sanctions screening;
- regulated financial products/services.

## Required policy outputs

Define when a Store/product profile should request or provide reviewed source content for:

- Billing Terms;
- refund/cancellation terms;
- payment-method and renewal disclosures;
- marketplace/seller terms;
- AML program disclosures or references;
- KYC/customer-identification disclosures or processes;
- verification/privacy notices;
- prohibited/restricted transaction rules;
- financial-risk disclaimers where genuinely applicable.

These outputs integrate with `egohygiene/hygiene#17` and are rendered through Holon. Store owns the commerce-domain applicability facts, not the generic website renderer.

## Applicability and legal-review model

Distinguish at minimum:

- ordinary merchant selling its own products/services;
- SaaS/subscription merchant;
- marketplace connecting third-party sellers/buyers;
- payout platform;
- payment facilitator;
- regulated or potentially regulated financial activity;
- no commerce.

Do not equate ordinary billing with being a “covered financial institution.” For example, current FinCEN customer-due-diligence requirements are scoped to covered financial institutions and specified financial activities; applicability must be researched against the actual business model before KYC/AML controls are claimed or imposed.

Support states such as:

- not applicable;
- informational only;
- contractual terms required;
- provider-managed obligation;
- organization-operated control required;
- qualified legal/compliance review required;
- blocked pending decision.

## Payment-provider boundary

When payment, tax, seller verification, KYC, AML, or sanctions controls are performed by a third-party merchant-of-record/payment provider:

- record which party owns the obligation;
- link to provider terms/processes where appropriate;
- do not claim Ego Hygiene itself performs a control it delegates;
- document data sent to the provider;
- preserve an exit/migration path if providers change.

## Security and privacy

- Never expose identity documents, verification data, payment credentials, or sanctions-screening results through public site metadata.
- Define minimum data-retention and access boundaries for any Store-owned verification state.
- Keep public disclosures separate from sensitive operational records.
- Require explicit consent/notice where identity or financial data is collected.

## Acceptance criteria

- [ ] Store defines a versioned commerce legal/compliance applicability profile.
- [ ] Ordinary sales/subscriptions are distinguished from marketplace/payout/regulated financial activity.
- [ ] Billing terms and refund/renewal disclosures can be required without automatically enabling AML/KYC.
- [ ] AML/KYC states require an actual applicability rationale and legal/compliance review where appropriate.
- [ ] Provider-owned versus Ego-Hygiene-owned controls are explicit.
- [ ] Public policy metadata never exposes verification/payment secrets or sensitive customer records.
- [ ] The profile integrates with `hygiene#17` and Holon site surfaces without copying generic policy logic into Store.
- [ ] A no-commerce fixture, normal SaaS fixture, marketplace/payout fixture, and blocked/unknown fixture demonstrate the applicability model.

## Dependencies / related

- https://github.com/egohygiene/hygiene/issues/17
- https://github.com/egohygiene/store/issues/11
- https://github.com/egohygiene/empathy/issues/51

## Authoritative starting reference

- FinCEN CDD FAQs: https://www.fincen.gov/resources/statutes-and-regulations/cdd-rule-faqs

## Non-goals

- Implementing a production AML/KYC program before the business model requires one.
- Treating a static AML or KYC webpage as compliance.
- Building an in-house payment processor when an external provider is the approved architecture.

### Original conversation comments

No conversation comments at capture.

## Store #13 — Evaluate custom merchandise packaging and automated fulfillment architecture

Source: https://github.com/egohygiene/store/issues/13 · State: **open** · Author: szmyty

Created: 2026-08-22T21:00:12Z · Updated: 2026-08-22T21:00:12Z

### Original body

## Outcome

Evaluate how Ego Hygiene merchandise can support high-quality custom branded packaging while preserving an automated, low-inventory, made-to-order or drop-shipped fulfillment model wherever practical.

Use PackMojo as a packaging-supplier reference, but do not assume it is itself a per-order print-on-demand fulfillment provider.

## Context

Reference:
- https://packmojo.com/

Current PackMojo materials describe a custom-packaging production platform with configurable packaging, samples, artwork review, production tracking, split shipping, and minimum order quantities. Common mailer/folding cartons begin around 100 units, while many other packaging products begin at 300+ units.

This suggests PackMojo may fit best as a bulk branded-packaging supplier feeding a fulfillment partner/3PL rather than as the direct consumer-order dropship layer. Validate this during research.

## Architecture question

Determine whether Ego Hygiene can support a flow such as:

```text
Identity brand assets
      ↓
Store merchandise/product definition
      ↓
POD / made-to-order manufacturer
      ↓
custom packaging inventory / inserts
      ↓
3PL or fulfillment provider
      ↓
customer shipment
```

without requiring manual handling of individual orders.

## Research scope

Compare at least:
- PackMojo custom packaging;
- current Store fulfillment/POD candidates from #9;
- fulfillment providers that support merchant-supplied packaging/pack-ins;
- 3PLs capable of combining POD goods with branded packaging;
- packaging suppliers with APIs/webhooks or repeat-order automation;
- fully integrated private-label / white-label providers where relevant.

Evaluate MOQ, inventory/storage, samples/QA, freight, pick/pack cost, returns, international shipping, environmental options, lead times, break-even volume, API/webhook capability, automation boundaries, Identity artwork handoff, and vendor portability.

## Fulfillment modes

Model at least:
1. Pure POD / provider packaging.
2. POD + branded inserts/stickers.
3. POD + stocked custom mailers/boxes at fulfillment partner.
4. Bulk manufactured merchandise + custom packaging + 3PL.
5. Hybrid premium-packaging only for selected products.

## Automation contract

If viable, define a provider-neutral Store contract for order events, fulfillment routing, packaging SKU selection, packaging inventory thresholds, reorder signals, tracking, failures, returns, vendor provenance, and cost accounting.

Do not hard-code Store domain logic to PackMojo or one POD provider.

## Identity integration

Packaging artwork should consume approved Identity assets/tokens where possible. Preserve artwork version, dieline/template version, approvals, license/provenance, and product association.

## Acceptance criteria

- [ ] PackMojo's actual role/capabilities are documented accurately.
- [ ] At least three fulfillment architectures are compared, including a low-touch POD path.
- [ ] MOQ, storage, lead-time, freight, unit-cost, and operational trade-offs are quantified enough to make a decision.
- [ ] Merchant-supplied packaging/pack-in capabilities are verified for candidate fulfillment providers.
- [ ] An adopt/defer/reject decision is recorded for PackMojo.
- [ ] A provider-neutral automated fulfillment/packaging contract is proposed if warranted.
- [ ] Identity asset handoff and packaging provenance are defined.
- [ ] A pilot path can be tested without committing to large inventory.

## Dependencies / related

- https://github.com/egohygiene/store/issues/9
- https://github.com/egohygiene/identity/issues/5
- https://github.com/egohygiene/identity/issues/34

## Non-goals

- Buying packaging inventory in this issue.
- Assuming custom packaging is economical before order volume supports it.
- Building an in-house warehouse by default.

### Original conversation comments

No conversation comments at capture.

## Store #18 — Research Makeship for producing and selling an Alpal plushie

Source: https://github.com/egohygiene/store/issues/18 · State: **open** · Author: szmyty

Created: 2026-09-11T15:15:42Z · Updated: 2026-09-11T15:15:42Z

### Original body

## Outcome

Research whether Makeship is a viable low-overhead path to turn the **Alpal** character concept into a high-quality physical plush product, launch it, fulfill orders, and preserve the character/brand IP for future expansion.

This is a research issue only. Do not commit funds, sign agreements, or launch a campaign as part of this task.

## Concept

Alpal is a soft comfort-oriented alien companion with a distinct visual identity:

- pastel green plush body;
- oversized glossy eyes;
- antennae;
- purple heart detail;
- warm, reassuring emotional positioning;
- potential companion card, sticker, packaging, and future variants.

The product should feel like a real collectible character rather than generic logo merchandise.

## Research scope

### Makeship model

- [ ] Document Makeship's current creator application/approval process.
- [ ] Determine audience, sales-history, or community requirements.
- [ ] Understand campaign structure, preorder/funding thresholds, campaign duration, and what happens if a campaign does not fund.
- [ ] Verify creator revenue share, fees, payout timing, taxes, refunds, and chargebacks.
- [ ] Confirm who owns the character, artwork, prototype files, tooling, and other IP produced during the process.
- [ ] Identify exclusivity, licensing, approval, or reuse restrictions.

### Product development

- [ ] Determine what design inputs Makeship needs: reference art, turnarounds, color callouts, dimensions, materials, embroidery notes, etc.
- [ ] Document prototype/sample workflow and number of revision rounds.
- [ ] Verify typical concept → prototype → campaign → production → delivery timeline.
- [ ] Investigate custom tags, inserts, branded packaging, stickers, QR codes, and other extras.
- [ ] Determine how accurately colors, textures, eyes, heart patch, antennae, and character proportions can be controlled.
- [ ] Understand safety/compliance requirements for plush products and age labeling.

### Fulfillment and operations

- [ ] Identify shipping regions, duties/taxes behavior, tracking, lost/damaged-order handling, returns, replacements, and customer support responsibilities.
- [ ] Determine how much manual work remains for the creator after approval.
- [ ] Identify campaign reporting, analytics, buyer-data access, and post-campaign operations.
- [ ] Determine whether products can become evergreen/reordered or are campaign-only.

### Economics

- [ ] Estimate plausible retail price and creator margin.
- [ ] Model barely-funded, moderate, and breakout-success scenarios.
- [ ] Include sample costs, platform fees, taxes, creative costs, and any hidden operational costs.
- [ ] Compare capital risk with self-manufacturing / Kickstarter / POD-like alternatives.

### Alternatives

Compare Makeship with at least:

- Kickstarter + direct plush manufacturer;
- direct OEM plush manufacturer + 3PL;
- other creator-focused plush platforms;
- small-batch / handmade validation path.

Evaluate quality, MOQ, upfront cash, creator workload, customer experience, brand control, fulfillment, lead time, and margin.

## Deliverables

- [ ] Makeship capability and economics summary.
- [ ] Go / defer / reject recommendation for Alpal.
- [ ] Approximate launch timeline and creator workload.
- [ ] Required Alpal design/spec assets if proceeding.
- [ ] Rights/IP and platform-risk notes.
- [ ] Best fallback manufacturing path.
- [ ] Follow-up implementation/production issues if warranted.

## Related

- #9 — AI-assisted custom fashion design and fulfillment integrations
- #13 — custom merchandise packaging and automated fulfillment architecture

## Non-goals

- Launching a live Makeship campaign.
- Paying for samples or production.
- Treating the current concept render as a manufacturing-ready specification.
- Giving up Alpal IP ownership or agreeing to licensing terms without explicit review.

### Original conversation comments

No conversation comments at capture.

## Store #19 — Research production paths for the DemonFrog character purse

Source: https://github.com/egohygiene/store/issues/19 · State: **open** · Author: szmyty

Created: 2026-09-11T15:16:05Z · Updated: 2026-09-11T15:16:05Z

### Original body

## Outcome

Research a realistic path to turn the **DemonFrog** character purse concept into a manufacturable, sellable fashion accessory with as little ongoing operational overhead as practical.

This is a research issue only. Do not place orders, pay for samples, or engage a manufacturer contract as part of this task.

## Concept

DemonFrog is a character-driven statement bag / plush-fashion hybrid with a red-and-black demonic frog aesthetic, including possible:

- faux-fur exterior;
- sculpted or soft horns;
- expressive eyes and teeth;
- quilted or structured side panels;
- decorative gothic/floral/flame elements;
- custom handle and hardware;
- branded embroidery / character mark.

The current render is concept art, not a production specification. The research should determine what parts are manufacturable, what should be simplified, and which construction method best preserves the idea.

## Research scope

### Product classification and construction

- [ ] Determine whether this should be treated as a plush bag, structured handbag, novelty purse, backpack, or hybrid product.
- [ ] Break the concept into manufacturable components: shell, lining, closure, handle/strap, horns, eyes, face, decorative pieces, hardware, embroidery/printing, internal pockets, etc.
- [ ] Compare faux fur, plush fabrics, PU/vegan leather, embroidery, molded parts, applique, stuffing, and custom hardware.
- [ ] Identify durability, cleanability, weight, snagging, and safety concerns.
- [ ] Determine whether the detailed decorative flowers/flames should be dimensional, embroidered, printed, appliqued, or simplified.

### Manufacturing paths

Compare at least:

1. custom handbag OEM/ODM manufacturer;
2. plush/toy manufacturer capable of functional bags;
3. cut-and-sew accessories manufacturer;
4. small-batch maker / domestic prototyping path;
5. crowdfunding + manufacturer path;
6. any creator platform that can support unusually shaped bags.

For each, investigate:

- MOQ;
- sample/prototype costs;
- production lead time;
- tooling/setup fees;
- customization limits;
- quality-control process;
- private-label branding;
- packaging options;
- direct fulfillment / 3PL compatibility;
- API, automation, or reorder capabilities where relevant.

### Tech-pack requirements

- [ ] Determine the minimum information needed for a manufacturer-ready tech pack.
- [ ] Define required views: front, back, side, top, interior, hardware, strap/handle, detail callouts.
- [ ] Define dimensions, materials, color references, stitching, seam allowances, closure, lining, pockets, logo placement, and tolerance notes.
- [ ] Identify which aspects require a physical sample rather than render-only validation.
- [ ] Investigate whether Renderflow or another internal workflow could eventually help derive a structured product/visual-DNA artifact from concept art.

### Rights / originality review

- [ ] Review the concept for potentially infringing or overly derivative motifs, names, logos, character features, or trade dress before manufacturing.
- [ ] Separate generic genre elements (demonic/gothic/frog motifs) from protected brand-specific references.
- [ ] Ensure prompts, tech packs, product descriptions, and supplier communications use original descriptive language rather than third-party franchise/brand references.
- [ ] Capture provenance for the source design and any later revisions.

### Economics

- [ ] Estimate sample cost and likely per-unit cost at several MOQ tiers.
- [ ] Estimate landed cost including freight, duties, packaging, 3PL, payment fees, returns, and replacement allowance.
- [ ] Model plausible retail price and gross margin.
- [ ] Compare low-risk preorder/crowdfunding with inventory-funded production.
- [ ] Identify the smallest validation step before committing meaningful capital.

### Low-touch operations

- [ ] Determine whether the selected path can support factory → 3PL → customer fulfillment without manual handling.
- [ ] Research preorders, waitlists, limited drops, and made-to-order options where possible.
- [ ] Determine how returns, damaged units, customer support, restocks, and discontinued variants would work.

## Deliverables

- [ ] Recommended product classification and construction approach.
- [ ] Manufacturer/provider comparison matrix.
- [ ] Approximate sample, MOQ, landed-cost, retail-price, and margin ranges.
- [ ] Minimum viable tech-pack checklist.
- [ ] Rights/originality review checklist for this product class.
- [ ] Recommended low-risk prototype/validation path.
- [ ] Go / defer / reject recommendation.
- [ ] Follow-up issues for tech-pack creation, prototype sourcing, and fulfillment if warranted.

## Related

- #9 — AI-assisted custom fashion design and fulfillment integrations
- #13 — custom merchandise packaging and automated fulfillment architecture

## Non-goals

- Ordering inventory or samples.
- Treating AI concept art as dimensionally or materially accurate.
- Selecting a supplier purely on lowest unit price.
- Reproducing third-party protected character/brand elements.

### Original conversation comments

No conversation comments at capture.

## Store #20 — Research a low-touch, made-to-order merch operating system

Source: https://github.com/egohygiene/store/issues/20 · State: **open** · Author: szmyty

Created: 2026-09-11T15:16:46Z · Updated: 2026-09-25T04:53:09Z

### Original body

## Outcome

Research and define how the Ego Hygiene store can become a **full-featured, low-touch merch system** where product ideas can move from approved design → listing → sale → production → fulfillment with minimal recurring manual work.

The target is not simply "set up a shop." The target is an operating model that lets creative work remain the primary focus while commerce, fulfillment, mockups, catalog synchronization, order routing, and routine store operations are automated or delegated wherever practical.

This is a research/architecture issue only. Do not migrate providers, spend money, or publish new products as part of this task.

## Reference stores and benchmarks

Start with:

- https://lofigirlshop.com/

Then identify and compare additional high-quality creator/character/artist merch stores with similar goals.

For each reference, study:

- product mix and SKU depth;
- evergreen vs limited/drop-based products;
- visual merchandising and product photography/mockups;
- bundles, collections, upsells, and gifting;
- branding consistency across unrelated product types;
- product detail page quality;
- navigation and discovery;
- international shipping and customer expectations;
- policies, returns, preorder messaging, and fulfillment disclosures;
- whether fulfillment appears POD, made-to-order, stocked inventory, 3PL, or hybrid;
- which parts appear operationally automated versus manually curated.

Do not copy protected visual design, copy, trade dress, or store-specific creative assets. Extract patterns and operational ideas instead.

## Core research question

What architecture gives Ego Hygiene the broadest creative freedom while minimizing manual commerce work?

Desired flow:

```text
idea / approved source artwork
        ↓
structured product + visual DNA
        ↓
production-ready derivative assets
        ↓
provider/product compatibility validation
        ↓
mockups + listing metadata
        ↓
review / approval gate
        ↓
store publication
        ↓
made-to-order / POD / manufacturer routing
        ↓
payment + fulfillment + tracking
        ↓
customer delivery
```

Human review should remain explicit where quality, rights, pricing, physical manufacturing, or irreversible spending is involved. The goal is low-touch operation, not unsafe blind automation.

## Platform and provider research

Compare the current Fourthwall path with relevant alternatives and complements, including where useful:

- Fourthwall;
- Shopify;
- Bandzoogle as an artist-owned storefront/catalog surface;
- SoundCloud merch/product linking as an artist/music discovery surface;
- Printful;
- Printify;
- Gelato;
- Gooten;
- Makeship and other campaign-based creator manufacturing paths;
- creator-focused fulfillment platforms;
- custom-product manufacturers;
- 3PLs;
- hybrid setups that support both POD and premium custom products.

Treat storefront/discovery channels separately from fulfillment providers. A product should remain portable if Bandzoogle, SoundCloud, Fourthwall, Printful, or another provider changes later.

Evaluate:

- storefront/API quality;
- product catalog breadth;
- made-to-order support;
- custom product support;
- product/listing APIs;
- mockup APIs;
- webhooks;
- inventory abstraction;
- order routing;
- branding/packaging options;
- international fulfillment;
- returns/replacements;
- merchant-of-record responsibilities;
- customer support burden;
- pricing/margins;
- vendor lock-in;
- exportability and migration path;
- artist/music platform integration and stable product-link behavior where relevant.

## Product-class strategy

Model how the system should support different classes rather than forcing every idea through one vendor:

1. **Simple POD** — shirts, hoodies, posters, mugs, stickers.
2. **Premium POD/customization** — embroidery, all-over print, specialty garments.
3. **Creator campaign products** — e.g. Alpal plush via Makeship-like model.
4. **Custom manufactured products** — e.g. DemonFrog purse.
5. **Digital products / downloads** where appropriate.
6. **Stocked premium products + 3PL** when volume eventually justifies inventory.

Define whether the Store should expose a provider-neutral product/fulfillment contract that can route products to different backends without changing the customer-facing catalog model.

## Asset and product-source architecture

Research a canonical product-source structure that could support:

```text
drafts/
  raw brainstorms and AI concepts

sources/
  approved reference/source art

visual-dna/
  structured visual identity derived from approved sources

production/
  transparent print files, layered masters, tech packs, etc.

mockups/
  provider-generated and approved lifestyle/product mockups

products/
  structured product definitions and metadata
```

Determine how this should relate to existing Renderflow, Identity, and Store architecture rather than creating redundant pipelines.

Preserve the difference between:

- AI brainstorm/draft assets;
- approved reference/source images;
- structured visual-DNA artifacts;
- editable/layered production masters such as PSD where practical;
- transparent print masters;
- provider-specific upload derivatives;
- provider-generated mockups;
- portable listing metadata;
- platform-specific listing projections.

The initial manual workflow should keep source → transformation → derived output provenance clear enough that later automation can reproduce it without making any storefront or provider the source of truth.

Research a product manifest/schema containing at minimum:

- stable product ID;
- title/description;
- source design references;
- visual-DNA reference;
- product class;
- compatible providers;
- production asset versions;
- variants;
- pricing/margin rules;
- mockups;
- tags/collections;
- rights/provenance;
- publication status;
- fulfillment configuration;
- provider IDs;
- storefront/discovery URLs;
- QA/approval state.

## Manual-first canary

Use `#21` as the first concrete canary for this architecture: take the splatter-heart apparel design from AI draft/reference → visual DNA → layered/editable master → transparent print asset → product variant → POD provider → provider-generated mockups → Bandzoogle listing → SoundCloud linkage.

Do this manually before introducing agent or GitHub Actions automation. Record repeated friction, deterministic transformations, judgment gates, provider-specific constraints, and artifacts worth preserving. Generalize only the steps that prove reusable through the pilot.

## Automation opportunities

Research which steps can be safely automated:

- [ ] validate source asset dimensions, transparency, color profile, and file type;
- [ ] produce provider-specific derivatives;
- [ ] create or request provider mockups;
- [ ] draft titles, descriptions, tags, SEO/social metadata;
- [ ] create/sync product listings;
- [ ] synchronize provider IDs and variants;
- [ ] validate pricing/margins against configured floors;
- [ ] route orders automatically;
- [ ] ingest shipment/tracking webhooks;
- [ ] flag fulfillment failures or out-of-stock provider variants;
- [ ] archive storefront-generated product/mockup images back into the canonical product record;
- [ ] produce periodic catalog health reports;
- [ ] detect products whose provider configuration or production assets have drifted.

Explicitly identify what should **not** be fully automated, including final rights review, high-cost manufacturing commitments, physical sample approval, and publication of uncertain designs.

## Store operations

Research a model where routine operations require little or no daily attention:

- order fulfillment;
- tracking notifications;
- tax/payment responsibilities;
- refunds and replacement routing;
- customer-support escalation boundaries;
- provider outage/failure handling;
- product availability synchronization;
- automatic catalog disablement when a provider SKU disappears;
- pricing updates when provider costs change;
- reorder/stock thresholds for non-POD products;
- analytics and product-performance reporting.

Estimate the realistic residual human workload for each architecture.

## Catalog and creative-system design

Research how to support many ideas without creating a chaotic storefront.

Include:

- collections/sub-brands/characters;
- product families;
- limited editions vs evergreen catalog;
- archive/discontinued states;
- variants and colorways;
- recommendation/cross-sell strategy;
- keeping Alpal, DemonFrog, Ego Hygiene publications, apparel, and future concepts coherent without forcing them into identical aesthetics.

## Financial model

Compare candidate architectures using representative products and volumes.

Include:

- provider base cost;
- platform/payment fees;
- shipping;
- taxes/duties responsibility;
- packaging;
- returns/replacements;
- advertising/marketing assumptions where relevant;
- margin floor;
- break-even volume;
- costs introduced by third-party automation tools or SaaS.

Optimize for **low capital risk and low recurring operational attention**, not simply the highest theoretical margin.

## Deliverables

- [ ] Reference-store teardown beginning with LofiGirl Shop plus at least 3 additional creator/character stores.
- [ ] Current-state map of the Ego Hygiene Store and Fourthwall architecture.
- [ ] Provider/platform comparison matrix, including storefront/discovery versus fulfillment responsibilities.
- [ ] Recommended target operating model.
- [ ] Product-class → fulfillment-provider routing strategy.
- [ ] Proposed canonical product manifest/schema.
- [ ] Asset lifecycle from draft → approved source → visual DNA → production master → provider derivative → mockups → listing.
- [ ] Safe automation map with explicit human approval gates.
- [ ] Estimated recurring human workload for each candidate architecture.
- [ ] Financial/margin comparison using representative SKUs.
- [ ] Results and lessons from the `#21` manual splatter-heart canary.
- [ ] MVP sequence that increases automation incrementally rather than requiring a full rewrite.
- [ ] Follow-up issues split into small implementation slices.

## Related

- #9 — AI-assisted custom fashion design and fulfillment integrations
- #13 — custom merchandise packaging and automated fulfillment architecture
- #18 — Makeship / Alpal plush research
- #19 — DemonFrog purse production research
- #21 — splatter-heart canonical merch lifecycle pilot
- `egohygiene/renderflow#387` — modality-aware artifact/visual DNA
- `egohygiene/renderflow#363` — derivative profiles / artifact forest (completed)

## Acceptance criteria

- [ ] The recommendation is grounded in current provider capabilities rather than assumptions.
- [ ] LofiGirl Shop is analyzed as a benchmark without copying protected creative material.
- [ ] The architecture supports multiple fulfillment modes instead of assuming one provider fits every product.
- [ ] The design/asset/product source of truth is explicit.
- [ ] Draft, source, visual DNA, production master, provider derivative, mockup, and listing states are distinct.
- [ ] Product publishing has rights, quality, pricing, and approval gates.
- [ ] Routine order fulfillment can operate without manual per-order handling for the recommended MVP path.
- [ ] Provider lock-in and migration are addressed.
- [ ] Bandzoogle/SoundCloud-style distribution surfaces can change without redefining the canonical design/product record.
- [ ] The proposed system can support existing simple merch plus future products such as Alpal and DemonFrog.
- [ ] The result ends with a prioritized implementation roadmap.

## Non-goals

- Fully autonomous publication without human approval.
- Building an in-house warehouse.
- Replacing working Store architecture merely for novelty.
- Assuming all physical products can genuinely be made one-at-a-time.
- Copying another store's branding, product artwork, photography, or copy.
- Automating the first canary before the manual lifecycle is understood.

### Original conversation comments

szmyty · 2026-09-25T04:53:09Z · https://github.com/egohygiene/store/issues/20#issuecomment-5826959274

Bounded execution checkpoints added after the current code/issue audit: [artist collections #30](https://github.com/egohygiene/store/issues/30), [one distinct artist hoodie #31](https://github.com/egohygiene/store/issues/31), and [cart/hosted-checkout verification #32](https://github.com/egohygiene/store/issues/32). Reuse the implemented Fourthwall adapter and mock mode; the earlier Bandzoogle-first sequence is historical for this pilot, with an owned collection + selected provider as the current direction. #21 retains its separate splatter-heart design. No product was created or published.


## Store #21 — Pilot the canonical merch lifecycle with the splatter-heart design

Source: https://github.com/egohygiene/store/issues/21 · State: **open** · Author: szmyty

Created: 2026-09-11T15:19:44Z · Updated: 2026-09-25T04:53:10Z

### Original body

## Outcome

Use one concrete AI-assisted apparel concept — the **splatter-heart crewneck / hoodie design** — as the first end-to-end canary for the merch operating model.

The purpose is not to automate the whole pipeline yet. The purpose is to perform the lifecycle manually once, preserve every meaningful artifact/state, and learn what the eventual schemas, specs, Renderflow profiles, and provider adapters actually need.

This issue should produce a real publishable product candidate while keeping the underlying design source portable enough to move between storefronts and fulfillment providers later.

## Why this pilot

The concept already demonstrates several requirements that a generic merch system must support:

- AI-generated brainstorm/reference art;
- a reusable design identity that is not tied to one garment;
- colorway and garment variants;
- conversion from flattened concept art into production-ready source assets;
- provider-specific print constraints;
- platform-generated mockups;
- one storefront plus artist/music discovery links;
- eventual automation without making generated files the canonical creative source.

The design should be treated as a **design family**, not as a single fixed SKU. Example variants may include:

- pink/black heart on light garment;
- pink heart on black garment;
- red/black;
- monochrome;
- alternate garment types;
- print-method-specific adaptations such as embroidery-safe simplification if later explored.

## Canonical lifecycle to prove

```text
AI brainstorm / draft candidates
        ↓
approved reference image(s)
        ↓
versioned visual-DNA document
        ↓
editable/layered production master
        ↓
transparent print master + provider derivatives
        ↓
provider product configuration
        ↓
provider-generated mockups
        ↓
listing metadata + pricing
        ↓
storefront publication
        ↓
artist/music discovery linkage
```

Each state must remain distinguishable so a future provider change does not require reconstructing the creative source from a storefront download.

## Drafts and approved source

- [ ] Preserve the original AI-generated brainstorm image(s) as **draft evidence**, not production truth.
- [ ] Select one or more approved reference images that define the chosen concept.
- [ ] Record generation/source provenance that is safe and useful to retain.
- [ ] Keep discarded candidates available without forcing them into the published product record.
- [ ] Define stable IDs/slugs for the design family and this first product instance.

## Visual DNA

Use the emerging Renderflow artifact-DNA work rather than inventing a conflicting format.

Related: `egohygiene/renderflow#387`.

For this pilot, capture enough structured visual identity to regenerate or branch the design later, including where applicable:

- composition and focal object;
- palette/color roles;
- contrast;
- splatter/drip directionality and density;
- texture/material cues;
- shape/silhouette;
- symmetry/asymmetry;
- placement/scale intent;
- mood/emotional descriptors;
- compatible and intentionally incompatible variant directions;
- confidence/provenance notes.

The DNA must describe the design rather than name protected brands, franchises, or living artists as style shortcuts.

## Production master

Create a real editable production source rather than relying only on the flattened mockup.

Evaluate the lowest-friction manual path first, such as Photopea plus CLI/image tooling where useful.

- [ ] Separate garment/background/mockup content from the printable design.
- [ ] Create a layered/editable master (`.psd` initially acceptable if that is the practical authoring format).
- [ ] Preserve named logical layers/groups where useful rather than an opaque flattened file.
- [ ] Produce a transparent-background print master.
- [ ] Remove unintended mockup shadows, garment texture, lighting, seams, and other non-design pixels.
- [ ] Preserve sufficient resolution for the selected print area.
- [ ] Record color-profile and transparency behavior.
- [ ] Validate visual edges, alpha, crop, safe area, and unwanted halos.
- [ ] Record which transformations were manual, AI-assisted, or deterministic.

Do not assume AI layer decomposition is dimensionally or semantically correct without visual review.

## Derivatives

Generate derivatives according to actual downstream needs rather than creating format noise purely for completeness.

At minimum preserve:

- editable/layered master;
- lossless transparent print asset;
- provider-specific upload derivative(s);
- web/listing image(s) where needed;
- checksums/manifest or equivalent provenance where the current architecture supports it.

Renderflow's completed derivative-profile work (`#363`) should be considered for later automation rather than reimplemented in Store.

Optional exploratory outputs such as WebP, JPEG, PDF, SVG/vectorized approximations, or HTML catalog views should be generated only when a concrete consumer or quality comparison justifies them.

## Product and variant model

- [ ] Define the base design separately from garment/product selection.
- [ ] Define at least one colorway variation without duplicating the entire design record.
- [ ] Choose one first physical product such as crewneck or hoodie.
- [ ] Record garment color, sizes, print placement, print method, provider SKU/template, and fulfillment provider independently from the design identity.
- [ ] Keep room for the same design family to map later to shirts, posters, mugs, stickers, accessories, or different manufacturers.

## Provider / fulfillment pilot

Use one low-capital POD provider for the first pass, likely Printful or the currently preferred Store provider after current capability verification.

- [ ] Confirm exact current print-file requirements from the selected provider.
- [ ] Upload the production asset manually.
- [ ] Configure one product and its variants.
- [ ] Review the real provider preview/proof.
- [ ] Save provider IDs/template IDs needed to reproduce or update the product.
- [ ] Record cost, shipping behavior, expected margin, and any operational friction.
- [ ] Do not place inventory orders or incur significant cost merely to complete the pilot.

## Mockups and returned provider artifacts

The provider-generated product images are derived sales artifacts, not canonical design source.

- [ ] Download/retain the useful mockups generated by the fulfillment/store service when permitted.
- [ ] Associate each mockup with provider, product, variant, template/version, and generation date when practical.
- [ ] Keep lifestyle/product mockups separate from transparent print masters.
- [ ] Document which mockups are suitable for storefront, SoundCloud, social, or archival use.

## Storefront + artist distribution

Research and exercise the simplest current path for this product through the user's existing artist ecosystem.

### Bandzoogle

- [ ] Determine whether Bandzoogle should own checkout, embed/link to the fulfillment storefront, or act as the artist-facing catalog hub.
- [ ] Create or draft the product listing using the approved mockups and copy.
- [ ] Record product URL/ID and any integration/manual sync steps.

### SoundCloud

- [ ] Verify SoundCloud's current merch/product linking or showcase capabilities.
- [ ] Determine whether it can point to Bandzoogle, the fulfillment provider/storefront, or another stable product URL.
- [ ] Link the pilot product to the appropriate artist/track/profile surface if supported and desired.
- [ ] Record the exact maintenance burden and limitations.

Treat Bandzoogle and SoundCloud as replaceable distribution surfaces. Neither should become the canonical product source.

## Listing record

Capture a portable listing record containing at least:

- design/product ID;
- display title;
- concise and long description;
- variants/colorways;
- sizing/product notes;
- price and currency;
- cost/margin snapshot;
- mockup/media references;
- provider IDs;
- storefront/discovery URLs;
- publication status;
- rights/provenance review state;
- last verified date.

Do not duplicate platform-specific metadata into the canonical design source when it belongs in an adapter/listing projection.

## Manual-first rule

Perform the first lifecycle manually and document friction before creating GitHub Actions or agent automation.

For every repetitive step, record:

- input;
- output;
- deterministic vs judgment-based behavior;
- tool/provider used;
- failure modes;
- whether it is safe to automate;
- whether human approval should remain required.

This becomes evidence for later Renderflow, Store, Aether, Relay, or provider-adapter work.

## Deliverables

- [ ] Preserved AI draft(s).
- [ ] Approved reference image(s).
- [ ] Visual-DNA artifact aligned with Renderflow direction.
- [ ] Layered/editable production master.
- [ ] Transparent print-ready master.
- [ ] Provider-specific upload artifact and validation notes.
- [ ] At least one explicitly modeled variant/colorway.
- [ ] Configured POD product candidate.
- [ ] Archived provider-generated mockups.
- [ ] Portable listing metadata record.
- [ ] Bandzoogle publication/integration notes.
- [ ] SoundCloud merch-linking notes.
- [ ] Cost/margin and provider-ID snapshot.
- [ ] Manual workflow log identifying future automation opportunities.
- [ ] Follow-up issues only for repeated/generalizable gaps demonstrated by the pilot.

## Acceptance criteria

- [ ] The design can be recreated or branched without depending solely on a storefront mockup.
- [ ] Draft, approved source, DNA, production master, provider derivative, mockup, product, and listing are distinct states.
- [ ] The print asset has a transparent background and passes the chosen provider's relevant checks.
- [ ] At least one design variant is represented without cloning the entire creative source.
- [ ] Provider-specific identifiers and rules do not leak into the base design identity.
- [ ] Platform-generated mockups are archived as derived artifacts with basic provenance.
- [ ] Bandzoogle and SoundCloud are evaluated as replaceable distribution surfaces.
- [ ] The complete first pass is understandable without relying on this chat history.
- [ ] Future automation requirements are grounded in observed manual friction rather than speculation.

## Related

- #9 — AI-assisted custom fashion design and fulfillment integrations
- #20 — low-touch made-to-order merch operating system
- `egohygiene/renderflow#387` — artifact/visual DNA
- `egohygiene/renderflow#363` — derivative profiles / artifact forest (completed)

## Non-goals

- Automating the pipeline before the manual lifecycle is understood.
- Treating the initial AI mockup as a print-ready file.
- Generating every possible image/document format without a consumer.
- Locking the design to Bandzoogle, SoundCloud, Printful, Fourthwall, or another provider.
- Publishing without a rights/originality review.
- Building custom manufacturing infrastructure for this simple apparel pilot.

### Original conversation comments

szmyty · 2026-09-25T04:53:10Z · https://github.com/egohygiene/store/issues/21#issuecomment-5826959397

The new [artist hoodie pilot #31](https://github.com/egohygiene/store/issues/31) reuses this source → master → print output → mockup → listing lifecycle while retaining a separate design identity. This issue remains the splatter-heart pilot. For the new pilot, Bandzoogle is not a prerequisite; provider selection begins with the implemented Fourthwall path and the artist collection in #30.


## Store #22 — Research and prototype an original Ego Hygiene trading card game

Source: https://github.com/egohygiene/store/issues/22 · State: **open** · Author: szmyty

Created: 2026-09-11T16:09:35Z · Updated: 2026-09-11T16:09:35Z

### Original body

## Outcome

Design and validate an original trading card game that can become a future Ego Hygiene storefront product and provide a meaningful, clearly scoped creative workstream for a dedicated collaborator.

The first milestone is a playable, inexpensive prototype with a clear identity and sustainable content pipeline—not a complete commercial card set.

## Product goals

- Create a genuinely fun game with an understandable core loop and meaningful decisions.
- Develop original mechanics, terminology, characters, factions, and visual identity.
- Make contribution tasks concrete enough that another creator can design cards, propose mechanics, playtest, and document feedback without needing to understand the entire technical platform.
- Support future physical sets, starter decks, boosters or fixed expansions, accessories, and optional digital tools.
- Avoid exploitative monetization, artificial scarcity, or pay-to-win design.

## Discovery questions

- What is the game's fantasy, audience, complexity, player count, session length, and competitive/cooperative tone?
- How does the game connect to Ego Hygiene: directly through its pillars and inner dynamics, loosely through its universe, or as a separate original world?
- Is “trading card game” the correct product model, or would a fixed expandable card game, living card game, deck-builder, or boxed card game be more sustainable?
- What is the smallest card pool needed to prove the core loop?
- Should rarity be collectible, mechanical, cosmetic, or absent?
- How can physical cards remain playable without requiring a hosted service?
- Which work should be creative/manual, and which validation or asset generation can be automated?

## Game-system design

Define and test:

- win/loss or completion conditions;
- turn and phase structure;
- resources and action economy;
- card types and zones;
- deck construction or drafting rules;
- interaction and counterplay;
- variance, information, and comeback mechanics;
- timing and rules-resolution model;
- multiplayer behavior;
- card limits, copies, and rotation/expansion assumptions;
- accessibility, cognitive load, and onboarding;
- anti-stall, infinite-loop, and degenerate-combo safeguards.

Document the design in a concise rules reference and use examples for ambiguous interactions.

## Structured card model

Define a versioned, machine-readable card schema containing fields such as:

- stable card and printing identifiers;
- name, set, faction, type, subtype, and tags;
- cost, statistics, rules text, reminder text, and flavor text;
- rarity or distribution model;
- artist and contributor credits;
- illustration and layout references;
- accessibility description;
- balance status and playtest history;
- provenance, licensing, and approval state;
- edition, language, and print metadata.

Separate gameplay identity from individual printings so cards can be rebalanced, reprinted, translated, or visually reissued without losing lineage.

## Collaboration workflow

Create a contributor-friendly workflow with bounded tasks such as:

- pitch a card concept from a template;
- build a starter deck;
- write flavor text;
- propose a faction or mechanic;
- review rules wording;
- run a playtest;
- record a match and observations;
- flag an unclear interaction;
- suggest balance changes;
- approve or reject a candidate card.

Include:

- role definitions and decision ownership;
- contribution templates;
- examples of acceptable card proposals;
- status stages from idea to approved printing;
- lightweight review and feedback conventions;
- explicit credit and attribution;
- a process that works without requiring Git expertise where possible.

The workflow should allow the intended collaborator to own a visible creative area while preserving coherent final design authority.

## Prototype milestone

Target a paper prototype such as:

- two playable starter decks;
- one core rules document;
- a compact card pool sufficient to test the central mechanic;
- printable low-ink card layouts;
- tokens/counters only where necessary;
- scripted onboarding match;
- structured playtest form;
- balance and rules-ambiguity log.

Use placeholder art during mechanical validation. Do not make final artwork the critical path for proving the game is fun.

## Balance and validation

Define measurable playtest evidence:

- game duration;
- win rate by deck/faction and starting player;
- dead cards and dominant cards;
- resource failure/flooding;
- decision density;
- rules questions;
- stalled or non-interactive turns;
- successful and failed onboarding moments;
- player enjoyment and desire to replay.

Add deterministic linting for schema validity and obvious rules/data errors before attempting automated gameplay simulation.

## Originality, safety, and rights

- Compare mechanics and presentation against relevant games without copying protected names, characters, artwork, lore, card frames, icons, rules text, or distinctive trade dress.
- Record inspiration and design provenance.
- Establish contributor agreements or clear licensing before accepting externally created card text or artwork.
- Define age-appropriate content and product labeling.
- Avoid gambling-like positioning, manipulative randomized sales, misleading odds, and child-directed dark patterns.
- If randomized products are considered later, require legal, ethical, probability-disclosure, and operational review.

## Production and storefront research

Compare:

1. home-printable prototype;
2. card-game prototyping services;
3. print-on-demand;
4. fixed starter-set manufacturing;
5. randomized booster manufacturing;
6. crowdfunding/preorder validation;
7. direct fulfillment and 3PL options.

Evaluate MOQ, sampling, cardstock, finish, collation, packaging, tokens, rulebooks, replacement cards, fulfillment, landed cost, price, margin, inventory risk, and expansion cadence.

## Potential architecture

Explore a source-of-truth pipeline such as:

```text
card and rules data
        ↓
schema and wording validation
        ↓
playtest builds
        ↓
approved card layouts
        ↓
print sheets + digital catalog + storefront assets
```

Consider Renderflow integration for print sheets, card previews, web catalogs, accessibility derivatives, rulebook output, and promotional assets after the core data model is stable.

## Deliverables

- [ ] Product-model recommendation: TCG, fixed expandable game, deck-builder, or boxed game
- [ ] Game vision and audience brief
- [ ] Core-loop and rules prototype
- [ ] Versioned card-data schema
- [ ] Two prototype starter decks or equivalent test configuration
- [ ] Contributor workflow and card proposal template
- [ ] Rules wording/style guide
- [ ] Playtest plan, feedback form, and balance log
- [ ] Originality, licensing, and contributor-credit policy
- [ ] Manufacturing and monetization comparison
- [ ] Low-risk prototype budget and roadmap
- [ ] Follow-up issues for mechanics, data tooling, card content, artwork, testing, and production

## Acceptance criteria

- [ ] The game has a documented audience, fantasy, core loop, and product model
- [ ] A playable paper prototype exists before final art or inventory commitments
- [ ] Two players can complete a match using the written rules without designer intervention
- [ ] Cards are driven by validated structured data
- [ ] Gameplay concepts and individual printings have durable identifiers and provenance
- [ ] The intended collaborator has clear, bounded, creditable ways to contribute
- [ ] Playtest evidence can drive balance decisions
- [ ] Placeholder art can be used without blocking gameplay iteration
- [ ] The design is original and does not reproduce another game's protected expression
- [ ] Monetization avoids pay-to-win and receives additional review before randomized products
- [ ] Physical play does not depend on an always-online service
- [ ] Manufacturing economics and inventory risk are evaluated before production
- [ ] Final game direction, spending, and publication require explicit maintainer approval

## Non-goals

- Producing a complete commercial set immediately
- Ordering inventory during discovery
- Copying an existing game's rules text, visual frame, lore, or branding
- Building a full online game client before the tabletop prototype is proven
- Making speculative collectible value the primary product promise

### Original conversation comments

No conversation comments at capture.

## Store #23 — Research and design an Ego Hygiene tarot or reflection card deck

Source: https://github.com/egohygiene/store/issues/23 · State: **open** · Author: szmyty

Created: 2026-09-11T16:09:35Z · Updated: 2026-09-11T16:09:35Z

### Original body

## Outcome

Explore and define a physical card-deck product for the future Ego Hygiene storefront.

The first phase should determine whether the strongest format is:

1. a traditional tarot deck using the established 78-card structure;
2. an oracle/reflection deck built directly around Ego Hygiene concepts;
3. a hybrid system with an original structure and clearly documented inspirations;
4. or a smaller introductory practice deck that can be validated before a full release.

The output should be a coherent, original, manufacturable product concept—not merely a collection of attractive card images.

## Product goals

- Translate Ego Hygiene themes into a tactile reflection practice.
- Support self-inquiry, journaling, emotional vocabulary, perspective shifts, and gentle behavioral prompts.
- Feel artistically connected to the Ego Hygiene world without requiring prior knowledge of the project.
- Remain approachable to people who enjoy tarot as well as people who prefer a secular or non-divinatory framing.
- Create a product family that could later support editions, expansion cards, a guidebook, and digital companions.

## Discovery questions

- Should this be called tarot, oracle, reflection cards, archetype cards, or something else?
- If using tarot, how closely should it follow Major Arcana, Minor Arcana, suits, court cards, numbering, and traditional symbolism?
- What unique function does an Ego Hygiene deck provide?
- Is the primary experience divination, reflection, journaling, ritual, creative prompting, or a blend?
- What audience, reading complexity, card count, price point, and session length are appropriate?
- How should spiritual language coexist with psychological, philosophical, and secular interpretations?
- Which existing Ego Hygiene pillars, stories, practices, characters, and visual motifs translate naturally into cards?
- What must be included in a guidebook or companion experience?

## Content system

Define a repeatable card specification containing fields such as:

- stable card identifier;
- title and archetype;
- deck grouping or suit;
- number/order;
- upright meaning;
- optional reversed or shadow meaning;
- reflection question;
- practical action or ritual;
- journaling prompt;
- symbolism and visual direction;
- accessibility description;
- source, influence, and provenance notes;
- rights/review status;
- edition/version metadata.

Produce an initial taxonomy and a small representative sample before committing to a complete deck.

## Creative direction

Explore a visual system that can support:

- coherent composition and border/layout rules;
- recurring Ego Hygiene symbols and characters;
- readable titles and numbering;
- consistent color, typography, texture, and iconography;
- print-safe crops, bleed, safe zones, and card-back symmetry;
- accessibility and meaningful alt text for digital versions;
- multiple editions without destroying visual continuity.

Where useful, investigate how Renderflow or related workflows could generate validated print, web, storefront, guidebook, and promotional derivatives from canonical card assets and metadata.

## Cultural, ethical, and rights review

- Research the history and conventions of tarot before reusing established terminology or structures.
- Distinguish public-domain traditions and generic symbolism from protected contemporary artwork, deck names, guidebook language, and trade dress.
- Avoid copying visual compositions or interpretations from a particular modern deck.
- Credit meaningful philosophical, spiritual, literary, and artistic influences.
- Avoid presenting the deck as diagnosis, treatment, guaranteed prediction, or authoritative mental-health guidance.
- Define respectful handling of symbols or practices tied to living cultures or religions.

## Prototype and validation

Create a low-cost prototype plan:

1. concept and positioning brief;
2. taxonomy and card schema;
3. 6–12 representative cards;
4. draft card back and packaging direction;
5. lightweight guidebook sample;
6. printable paper prototype;
7. structured play/reflection feedback;
8. revision gate before completing the full deck.

Test clarity, emotional tone, diversity of readings, repetition, card handling, legibility, visual consistency, and usefulness without explanatory coaching.

## Manufacturing and storefront research

Compare practical paths for:

- prototype printing;
- print-on-demand;
- short-run manufacturing;
- offset/full production;
- tuck boxes, rigid boxes, guidebooks, inserts, and accessories;
- fulfillment and replacement cards;
- international shipping;
- age labeling and product claims;
- ISBN or other identifier relevance;
- digital/PDF companion products.

Estimate prototype cost, MOQ, landed cost, retail range, gross margin, production lead time, and the smallest viable validation run.

## Deliverables

- [ ] Product-positioning recommendation: tarot, oracle, hybrid, or introductory practice deck
- [ ] Audience and use-case definition
- [ ] Original deck taxonomy and versioned card schema
- [ ] Initial card-list outline
- [ ] 6–12 card prototype brief
- [ ] Visual-system and card-back brief
- [ ] Guidebook/companion outline
- [ ] Cultural, claims, provenance, and rights checklist
- [ ] Manufacturing/provider comparison
- [ ] Cost, pricing, and low-risk validation model
- [ ] Follow-up issues for content, artwork, prototype production, testing, and storefront integration

## Acceptance criteria

- [ ] The chosen format and use experience are explicit
- [ ] The concept has a distinct Ego Hygiene purpose rather than being a cosmetic reskin
- [ ] Card content can be represented as structured, versioned data
- [ ] A small prototype validates the system before full-deck production
- [ ] Traditional influences and original departures are documented
- [ ] No modern deck artwork, language, or trade dress is copied
- [ ] Mental-health and predictive claims are responsibly constrained
- [ ] Print, digital, accessibility, provenance, and derivative requirements are considered
- [ ] Manufacturing and storefront economics are understood before production
- [ ] Final creative direction and any spending remain subject to explicit maintainer approval

## Non-goals

- Generating all final card artwork in the research phase
- Ordering inventory or paying a manufacturer
- Treating spiritual practice as clinical treatment
- Publishing a deck before originality, rights, print, and usability review

### Original conversation comments

No conversation comments at capture.

## Store #25 — Backfill repository ADR history and enable continuous decision capture

Source: https://github.com/egohygiene/store/issues/25 · State: **open** · Author: szmyty

Created: 2026-09-12T17:04:49Z · Updated: 2026-09-12T17:04:49Z

### Original body

## Outcome

Bring **egohygiene/store** to the current architectural moment under the organization ADR contract by reconstructing only consequential, evidence-backed decisions from repository history, then keep the record current through the managed agent decision-impact workflow.

This is a bounded repository-local migration. It must not redefine organization policy or build a repository-specific validation or website framework.

## Scheduling gate

This issue is intentionally queued for **after the shared ADR system is operational**. Do not begin the backfill unless the maintainer explicitly overrides the gate and the following foundations are ready:

- [ ] [Hygiene #15](https://github.com/egohygiene/hygiene/issues/15) is human-ratified and the approved policy commit is available to pin.
- [ ] [Holon #6](https://github.com/egohygiene/holon/issues/6) provides migration-safe ADR scaffolding.
- [ ] [Relay #5](https://github.com/egohygiene/relay/issues/5) provides reusable conformance validation.
- [ ] [Relay #27](https://github.com/egohygiene/relay/issues/27) and [Relay #33](https://github.com/egohygiene/relay/issues/33) provide the shared Repository Intelligence shell and publication workflow; the **/decisions/** renderer from [Relay #30](https://github.com/egohygiene/relay/issues/30) is already delivered.
- [ ] [Pace #5](https://github.com/egohygiene/pace/issues/5) is ready to coordinate reviewed fleet adoption.

## Starting point from the 2026-09-12 fleet scan

Re-inventory the repository at implementation time. Preserve any existing decision files, indexes, conventions, and provenance before adding or moving records.

Recheck the default branch and open pull requests before implementation because this observation can become stale.

## Historical extraction workflow

1. Inspect the full reachable Git history, tags, merged pull requests, issues, release notes, roadmap, architecture documents, and existing decision logs.
2. Identify only durable choices that meet the Hygiene significance test: contracts/schemas, ownership, security/privacy/licensing/provenance, durable dependencies or frameworks, cross-repository direction, source authority, or expensive-to-reverse architecture.
3. Group evidence by decision rather than producing one ADR per commit or issue.
4. Prefer contemporaneous evidence. When the rationale or authority cannot be proven, record the gap in the migration map instead of inventing intent.
5. Preserve legacy IDs, prefixes, filenames, bodies, links, and blame context. Resolve collisions or ambiguous canonical records with a human before generation.
6. Draft new historical records as **proposed** unless durable human disposition evidence supports another policy-valid state. A merge, release, or agent conclusion is not acceptance.
7. Link implementation and validation evidence independently from decision status.
8. Submit small, reviewable pull requests and stop for maintainer review at ambiguous status, ownership, privacy, or supersession decisions.

The goal is useful synchronization with honest uncertainty—not a claim that the past has been reconstructed perfectly.

## Repository baseline and continuous capture

- [ ] Add or validate **docs/decisions/policy-reference.json** pinned to the approved Hygiene policy version and full commit.
- [ ] Establish **docs/decisions/README.md** as the canonical complete index.
- [ ] Create or migrate records at **docs/decisions/ADR-NNN-short-slug.md**, preserving documented legacy exceptions.
- [ ] Keep a pre-existing root **DECISIONS.md** only as a concise compatibility/navigation entrypoint.
- [ ] Consume the Aether-managed decision-impact guidance in repository agent instructions; do not copy and fork the global policy prose.
- [ ] Require the decision-impact check before an issue is declared complete and before PR handoff: create/update/supersede an ADR when the completed work changed a durable decision, or record **ADR not required** with one concise reason.
- [ ] Validate locally and in CI through the shared EgoLint/Relay contracts.
- [ ] Publish the validated repository decision ledger at GitHub Pages **/decisions/** through the shared Relay projection, with source revision, freshness, lineage, and evidence links.
- [ ] Keep generated indexes/site data derived and reproducible; Markdown ADRs remain repository-owned source.
- [ ] Apply public/private visibility rules and never leak protected issue text, identities, local paths, credentials, or private rationale into public output.

## Acceptance criteria

- [ ] A reviewed migration map inventories every pre-existing decision surface, ID, status claim, collision, and evidence gap.
- [ ] Material historical decisions are represented to the evidence limit; routine implementation noise is excluded.
- [ ] Every non-proposed disposition has resolvable human authority evidence, or remains explicitly blocked for human review.
- [ ] Decision status, implementation status, and verification evidence remain independent.
- [ ] The policy pin, ADR corpus, index, lineage, and legacy exceptions pass the shared validator.
- [ ] Repository agent guidance performs the decision-impact check on future issue/PR completion.
- [ ] The shared GitHub Pages build exposes a working, accessible **/decisions/** view without creating a second source of truth.
- [ ] The final migration PR documents omissions, uncertainty, privacy decisions, validation commands, and rollback.

## Non-goals

- Perfectly narrating every historical implementation choice.
- Retroactively accepting decisions based only on Git activity.
- Renumbering or silently rewriting legacy history for cosmetic consistency.
- Copying Hygiene policy, Aether guidance, Relay workflows, or visualization code into this repository.
- Completing this issue before the shared system milestone is ready.

### Original conversation comments

No conversation comments at capture.

## Store #28 — Design product-to-community pathways for the Ego Hygiene storefront

Source: https://github.com/egohygiene/store/issues/28 · State: **open** · Author: szmyty

Created: 2026-09-23T15:00:29Z · Updated: 2026-09-25T04:53:10Z

### Original body

## Outcome

Design a low-friction, non-manipulative way for physical and digital Ego Hygiene products to act as entry points into the broader ecosystem—community, open-source tools, knowledge, creative work, and relevant product experiences—without turning the store into a generic merch funnel.

The store should remain useful as commerce on its own, while an interested buyer can understand the idea behind a product and continue into the appropriate Ego Hygiene holon.

## Motivation

The low-touch commerce architecture in #20 focuses correctly on product creation, portability, storefronts, fulfillment, and operations. A separate experience question remains:

> After someone encounters or buys an Ego Hygiene product, how can they discover the relevant idea, tool, project, article, garden node, or community surface without requiring manual outreach or a forced signup?

The desired loop is closer to:

```text
original idea / project
        ↓
meaningful product
        ↓
storefront / physical artifact
        ↓
optional contextual pathway
        ↓
tool / article / garden / community / related project
```

## Scope

- Define provider-neutral product metadata for optional ecosystem/community destinations.
- Map product classes to appropriate destinations rather than giving every SKU the same CTA.
- Explore:
  - product-page context links;
  - collection-level story/idea pages;
  - packaging inserts or QR codes where fulfillment providers support them;
  - post-purchase links/pages;
  - links to open-source repositories or install pages;
  - links to relevant Mindgarden/public knowledge;
  - community/support/contribution surfaces;
  - related creative works.
- Keep destinations canonical and portable if Fourthwall or another storefront provider changes.
- Preserve accessibility and useful non-QR fallbacks for physical products.
- Make analytics/attribution optional and privacy-preserving.
- Avoid dark patterns, forced account creation, fake scarcity, manipulative engagement loops, or requiring community participation to receive the product.
- Coordinate with the main site/product routing rather than duplicating website navigation in Store.

## Acceptance criteria

- [ ] A small provider-neutral product-to-ecosystem metadata contract is defined or an existing Store product manifest is extended.
- [ ] Products can declare zero, one, or multiple relevant destinations without requiring a universal CTA.
- [ ] Storefront/product-page projections can render the pathways from canonical metadata.
- [ ] Physical-product pathways have accessible non-QR fallback text/URLs where applicable.
- [ ] Store/provider migration does not invalidate the canonical destination model.
- [ ] Community participation remains optional and clearly separated from checkout/fulfillment.
- [ ] Privacy-preserving analytics behavior is explicit and can be disabled.
- [ ] At least one existing product concept is used as a manual canary before broad automation.
- [ ] The result links cleanly to the egohygiene.io product-domain/navigation architecture.

## Related

- #20 — low-touch made-to-order merch operating system
- #21 — canonical merch lifecycle canary
- egohygiene/egohygiene.io#3 — product-domain architecture and navigation
- egohygiene/hygiene#17 — public-site community/commercial/trust surface policy


### Original conversation comments

szmyty · 2026-09-25T04:53:10Z · https://github.com/egohygiene/store/issues/28#issuecomment-5826959514

The concrete collection/destination slice is now [#30](https://github.com/egohygiene/store/issues/30), primarily owned by #20 and related here for artist/music/story links. It consumes approved public data, preserves provider-independent design identities, and keeps private source records outside Store.


## Store #29 — Research custom tapestry and wall-textile print-on-demand pipeline

Source: https://github.com/egohygiene/store/issues/29 · State: **open** · Author: szmyty

Created: 2026-09-23T16:57:18Z · Updated: 2026-09-23T16:57:18Z

### Original body

## Outcome

Research a low-friction path for turning approved high-resolution artwork — including AI-assisted artwork — into custom wall tapestries or other wall textiles that can be printed and shipped on demand.

This should fit the provider-neutral merch architecture rather than becoming a one-off vendor integration.

## Motivation

A useful creator workflow is:

```text
idea / generated artwork
        ↓
approved high-resolution source
        ↓
tapestry-specific production derivative
        ↓
provider proof / mockup
        ↓
order or storefront listing
        ↓
print + fulfillment + shipment
```

The immediate use case is personal: generate a high-quality image, upload it to a service, and receive a finished tapestry. The same path could later support Ego Hygiene physical art and limited merchandise without requiring inventory.

## Research scope

Compare representative custom-tapestry / textile-printing providers and relevant existing Store fulfillment candidates. Include providers such as Contrado, Bags of Love, Vograce, Zazzle, Gooten/Printify-style POD catalogs, and other current high-quality options discovered during research.

Evaluate:

- maximum and common sizes;
- print method (for example dye sublimation) versus genuinely woven construction;
- fabric/material options and drape;
- edge finishing, grommets, rod pockets, and hanging hardware;
- image-resolution and DPI guidance at final physical size;
- bleed, safe area, crop, and template requirements;
- color-space/profile guidance and expected color fidelity;
- gradients, dark tones, fine detail, and text reproduction;
- sample/proof availability;
- one-off ordering versus storefront/drop-shipping support;
- API/webhook/catalog integration where available;
- production and shipping regions;
- turnaround time;
- unit cost, shipping cost, platform fees, and margin;
- returns/reprints for defects;
- private artwork handling, retention, and licensing terms;
- provider lock-in and portability.

## Product / asset model

Keep these states distinct:

1. prompt / brainstorm;
2. generated or uploaded draft;
3. approved canonical artwork;
4. editable/layered master when available;
5. print-resolution master;
6. tapestry-provider derivative;
7. provider proof/mockup;
8. physical sample / received product;
9. portable listing metadata.

Do not treat a provider mockup as canonical artwork.

Define enough metadata to reproduce a tapestry derivative later, including physical dimensions, intended DPI, pixel dimensions, crop/bleed, material, finish, color profile, provider/template version, source-art hash/version, and QA state.

## Renderflow / Flow integration questions

- Can Renderflow own a reusable `tapestry` or general `wall-textile` derivative profile?
- Can preflight validate effective DPI for the requested physical size?
- Can it generate provider-specific crops/bleeds from one canonical source without destructive edits?
- Can Flow orchestrate source artwork → validation → derivative → proof/review → fulfillment handoff?
- Which steps require human approval because they affect physical cost, crop, material, or color?

## Suggested personal canary

Use one original high-resolution artwork as a manual first pass:

- [ ] generate or select the source artwork;
- [ ] choose a target physical size;
- [ ] upscale/re-render only if needed for effective resolution;
- [ ] prepare the provider-specific derivative;
- [ ] inspect at 100% and simulated wall-view scale;
- [ ] upload manually to one provider;
- [ ] inspect the provider proof;
- [ ] optionally order one personal sample with explicit spending approval;
- [ ] photograph/record the received result and compare it with the source;
- [ ] capture actual friction and quality observations before automating.

## Deliverables

- [ ] Provider comparison matrix.
- [ ] Printed-fabric vs woven-tapestry trade-off guide.
- [ ] Resolution / physical-size preflight rules.
- [ ] Provider-neutral wall-textile product/derivative schema.
- [ ] Recommended low-risk personal canary path.
- [ ] Renderflow derivative-profile proposal if warranted.
- [ ] Store adapter/fulfillment follow-ups only where generalizable.
- [ ] QA checklist for source → proof → received physical artifact.
- [ ] Optional Medium outline: **From AI Artwork to a Physical Tapestry Without Losing the Source of Truth**.
- [ ] Optional Pinterest brief: **Idea → Artwork → Print Preflight → Tapestry → Wall**.

## Related

- #20 — low-touch, made-to-order merch operating system
- #21 — canonical merch lifecycle canary
- #13 — custom merchandise packaging and automated fulfillment architecture
- egohygiene/renderflow#387 — artifact / visual DNA

## Guardrails

- Do not order products or incur costs during research without explicit approval.
- Verify current provider specifications before creating production files.
- Treat AI output as artwork, not proof of print quality or manufacturability.
- Preserve source provenance and rights review.
- Do not hard-code Store or Renderflow to one tapestry vendor.
- Do not claim a displayed mockup guarantees physical color, texture, scale, or detail.

## Status

Backlog research / future physical-art capability.

### Original conversation comments

No conversation comments at capture.

## Store #30 — Add artist collections backed by an approved public catalog projection

Source: https://github.com/egohygiene/store/issues/30 · State: **open** · Author: szmyty

Created: 2026-09-25T04:52:18Z · Updated: 2026-09-25T04:52:18Z

### Original body

Parent: [#20](https://github.com/egohygiene/store/issues/20) · Related: [#28](https://github.com/egohygiene/store/issues/28) · Related contract: [#11](https://github.com/egohygiene/store/issues/11)

## Problem
Current normalized commerce models and routes support products/cart, but do not represent artist collections or stable artist/design references. A provider's product ID should not be the identity of the artwork or artist.

## Scope
- Add a small provider-neutral collection contract and a stable artist-collection route, proposed /store/collections/<artist-slug>, with products and optional approved story/music links.
- Consume an approved public projection; use sanitized fixtures while source owners prepare real approved content. Private source registries and account administration never belong in the browser payload.
- Preserve mock mode and adapter isolation. Fourthwall remains the implemented commerce/hosted-checkout adapter; its operational price, stock, variants and cart remain authoritative for transactions.
- Keep artist branding visually distinct within the existing store without requiring a second storefront application.
- Handle empty collections, unavailable variants, removed products and drafts intentionally. Unready products have no purchase action.
- Preserve canonical links, mobile accessibility, reduced motion and direct-link behavior; coordinate with website routing.

## Acceptance
A representative artist collection works in mock mode and maps to real provider products when configured. Public JSON excludes private storage links, credentials and unpublished source material. Navigation connects product → collection → approved creative context.

This is the smallest collection capability, not a second catalog database or a new commerce provider implementation.

### Original conversation comments

No conversation comments at capture.

## Store #31 — Pilot one artist hoodie from approved design through a manufacturing-ready draft

Source: https://github.com/egohygiene/store/issues/31 · State: **open** · Author: szmyty

Created: 2026-09-25T04:52:19Z · Updated: 2026-09-25T04:52:19Z

### Original body

Parent: [#20](https://github.com/egohygiene/store/issues/20) · Shared lifecycle: [#21](https://github.com/egohygiene/store/issues/21) · Collection: [egohygiene/store#30](https://github.com/egohygiene/store/issues/30)

## Outcome
Prove the merch lifecycle with one distinct artist hoodie. Keep private source art, unreleased design details and supplier administration in the private creative registry. This is separate from #21's splatter-heart identity.

## Scope
- Select one approved motif, one black hoodie blank, one print placement and the provider's actual available size range. Confirm fit/fabric and print process against the current product.
- Produce an editable design master and provider-template-specific print output with dimensions, color profile, safe areas and version provenance. An illustrated character hoodie is concept evidence, not production artwork.
- Record portable design/product IDs and provider variant mappings; keep provider operational inventory/pricing authoritative.
- Verify Fourthwall's currently available garment/print route first because an adapter already exists; compare an alternative only if concrete requirements fail.
- Capture provider costs/shipping, proposed price/currency, size chart, care and fulfillment/support responsibilities before a sellable candidate.
- Produce honest mockups; record sample-review result or outstanding sample decision. Paid samples/orders require a concrete approved purchase.
- Prepare a draft listing and connect it to the artist collection. Publication follows review of the real design, fulfillment and checkout result.

## Acceptance
One traceable design → print file → blank/placement → variants → mockups → draft listing exists, with unanswered production questions explicit. No invented costs, SKU, inventory or pretend checkout readiness.

The prior Bandzoogle-first sequence in #20/#21 is historical for this pilot; use the owned collection and selected operational provider. Do not open a new subscription just to complete this checkpoint.

### Original conversation comments

No conversation comments at capture.

## Store #32 — Restore cart E2E confidence and verify the hosted checkout handoff for one product

Source: https://github.com/egohygiene/store/issues/32 · State: **open** · Author: szmyty

Created: 2026-09-25T04:52:19Z · Updated: 2026-09-25T04:52:19Z

### Original body

Parent: [#20](https://github.com/egohygiene/store/issues/20) · Product: [egohygiene/store#31](https://github.com/egohygiene/store/issues/31) · Collection: [egohygiene/store#30](https://github.com/egohygiene/store/issues/30) · Hosting: [egohygiene/egohygiene.io#29](https://github.com/egohygiene/egohygiene.io/issues/29)

## Evidence
At main `599c90ca6a454c0f2e9aa95eab5f8395016474c5`, [CI quality checks passed but E2E failed](https://github.com/egohygiene/store/actions/runs/32841068159). The cart test uses an unscoped variant-text locator. The code includes Fourthwall hosted checkout; no authenticated provider handoff was verified in the audit.

## Scope
- Reproduce the failure and correct the test/behavior based on evidence; scope duplicate text locators semantically instead of weakening assertions.
- Verify collection/product → size/variant → cart quantity/removal → hosted checkout redirect → return route in mock mode.
- The current Fourthwall adapter reads public products. Use a provider-supported preview/test product if available; otherwise live catalog proof requires a separately approved minimal publication. Record a blocked live gate instead of publishing to satisfy this issue. Any paid order requires a separate approved purchase.
- Preserve Fourthwall secrets/access boundaries and provider-neutral UI. No custom card collection or second payment stack.
- Verify mobile usability, price/currency consistency, out-of-stock/errors, deep-link reload and clear fulfillment/support links.
- Record the exact deployment/provider configuration used and evidence of what was and was not tested.

## Acceptance
E2E passes with meaningful behavior checks; a supported configured product reaches the correct hosted checkout, or the remaining live verification gate is explicitly blocked pending publication approval. Verify return-route configuration separately: visiting it does not prove payment or order success. No paid order or live publication is implied. A ready-to-launch review can identify the concrete remaining gate rather than infer production readiness from the existence of an adapter.

SoundCloud/store links should point to a verified live destination only after the appropriate site/product launch.

### Original conversation comments

No conversation comments at capture.
