# Website essentials: content and route contract — #90 A

Date: 2026-10-22. Status: checkpoint A prepared for maintainer review.
Owner: [#90](https://github.com/egohygiene/egohygiene.io/issues/90), under
[setup #88](https://github.com/egohygiene/egohygiene.io/issues/88).
This is an inventory, bounded implementation contract and copy proposal. It adds
no application routes, publishes no policy and records no new factual approval.

## Source and integration state

- Main: `07d25941ceeefa53089afa025b612c6aa54f36c4`.
- Roadmap [draft #93](https://github.com/egohygiene/egohygiene.io/pull/93):
  `c7eb41f3966e93e015868f81de128c9414f4cafd`; this checkpoint builds on its docs.
- Readiness [draft #87](https://github.com/egohygiene/egohygiene.io/pull/87):
  `ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6`, source
  `902be39761f00d73e82ea08d55ff98bc05d8e7c5`. It remains unmerged and supplies
  `/store/help`, reviewed product links and narrower privacy/terms wording.
  Read its [receipt][readiness] and [ADR 0011][readiness-adr] before integration.
- Older CI draft #73 remains open. All refreshed CI, dependency-review and CodeQL
  runs at the #87 and #93 heads failed. No cause was re-diagnosed or gate changed.

The content below distinguishes existing main behavior from #87 and proposed B
work. B must include the reviewed #87 changes in its working tree, either after
an authorized merge or in a clearly based draft. Do not reimplement store help
against main and lose the readiness boundaries. Reconcile overlapping continuity
files from #87/#93/this checkpoint while preserving dated history. This checkpoint
does not itself authorize or perform those merges.

## Bounded route/content matrix

Paths below preserve the website's existing no-trailing-slash spelling. Source
checks establish what the repository says, not deployment or legal applicability.
Alan is the factual-copy reviewer; the website owns presentation. Product/provider
facts remain #38. No private contact or personal history was inferred from account
metadata, commits or unrelated records.

| Route | Visitor purpose and source | Current evidence and proposed disposition | Missing decision / feedback |
| --- | --- | --- | --- |
| `/help` | Find website guidance, feedback, store help and policy drafts; website-owned | Absent on main and #87. B adds one hub using the draft copy below. | Public GitHub defect feedback only; private/general contact choice remains review item D2. |
| `/about` | Understand Ego Hygiene's purpose; existing [AboutPage][about-page], [English purpose copy][main-pages] and [landing copy][landing-copy] | Present on main and unchanged in #87. Retain as the one purpose/story destination; no duplicate `/story`. | D1 reviews a concise rewrite; biography, dates, operating entity and personal history are omitted until evidenced. Website feedback goes through `/help`. |
| `/accessibility` | Learn current review limits and report a barrier; website-owned evidence from #49/#70/#37 | Absent on main and #87. B adds a factual page using existing controls and explicit unperformed checks. | D2 records the GitHub account/private-feedback limitation; D3 owns actual accessibility evidence. |
| `/store/help` | Distinguish physical products, artwork previews, purchase states and order support; [#87 page][store-help] and [messages][draft-pages] | Only in #87. Reuse it; B adds links to general help/accessibility without replacing store responsibilities. | Actual shipping, returns, regions, fees and private order support remain #38. Public GitHub is never order support. |
| `/privacy` | Explain observed website behavior and pending privacy facts; [PrivacyPage][privacy-page], #87 messages and runtime sources below | Main has a provisional page; #87 removes the overly broad backend/data claim. Preserve the draft title and the narrower wording. | D4: operator/host/service/data-processing facts remain #9/#89; commerce facts remain #38. No privacy-compliance or zero-data claim. |
| `/terms` | Explain website/preview versus actual-purchase boundaries; [TermsPage][terms-page] and #87 messages | Existing provisional page; #87 adds artwork and hosted-purchase boundaries. Preserve its draft status and links. | D4: applicable terms, rights/licensing and product facts stay #9/#59/#38; no invented jurisdiction, guarantees or commercial terms. |
| `/legal`, `/contact`, `/story`, `/support`, `/privacy/choices`, `/trust`, `/donate` | Broader organization surfaces | No dedicated routes in inspected app source. `/help` contains the bounded policy-link index and contact guidance; `/about` owns purpose. No empty duplicate pages or implied services in B. | Broader applicability/adoption remains #9. Funding, privacy choices, Trust Center and full Holon/Relay integration are separate work. |

The [router][router] currently falls back through `:product` and then the missing
page for unknown single-segment paths. Register `/help` and `/accessibility`
explicitly before that fallback. Preserve all store/catalog/artist/product paths.

## Navigation and implementation contract for B

- Keep primary navigation **Home, Store, About, Ecosystem**. Add **Help** and
  **Accessibility** to the existing footer, retaining Store help, About, source,
  Privacy and Terms links. A visitor can reach these essentials from every page.
- `/help` links to `/about`, `/accessibility`, `/store/help`, `/privacy` and
  `/terms`. Its policy section is labelled **Website policy drafts**. Privacy and
  Terms remain directly reachable from the footer; no new legal-index route is
  needed to find the two existing documents.
- `/accessibility` links back to `/help` and the same public GitHub feedback
  destination. `/store/help` retains its order-specific guidance and gains the
  general-help/accessibility links. Keep warnings beside external feedback links.
- Reuse `article.site-prose`, headings/sections, `PageMetadata`, `LocaleLink`,
  `LocaleNavLink`, the root layout and `useI18n`. Keep copy in existing English
  page/shell namespaces; English remains the only public locale. No CMS, new
  content schema, contact backend, translation runtime or dependency is needed.
- Client titles/descriptions should describe each page. `PageMetadata` updates
  the DOM after load; crawler-visible HTML, canonical URLs, sitemap inclusion and
  route spelling/redirect qualification belong to #91 and the actual host #89.

## Concrete copy for review

These are proposed strings for B, not text already implemented or approved by
Alan. Preserve the meaning when splitting into locale messages. The generic
purpose draft derives from existing website copy, not an inferred biography.

### Help — proposed `/help`

Title: **Help**

Description: **Find website help, accessibility feedback, store guidance and
policy information for Ego Hygiene.**

> Find your way around the website, report a problem, or learn how the store works.

**Explore Ego Hygiene**

> Read About Ego Hygiene for the ideas behind the project. Visit the store to
> explore designs and clearly labelled product previews. Store help explains
> product availability, checkout and where to find order support.

Link labels: **About Ego Hygiene**, **Store help**, **Accessibility information**.

**Website feedback**

> To report a website problem, share the page address, what you were trying to do
> and what happened. Remove any private information from links or screenshots.
> Browser or assistive-technology details are optional; share them only if you
> are comfortable doing so.

Adjacent warning and link, preserving #87's supported destination:

> GitHub issues are public and require a GitHub account. Do not include order
> details, payment information, addresses or other private information. A private
> website-feedback channel is not published here yet.

**Report a website problem on GitHub** →
`https://github.com/egohygiene/egohygiene.io/issues/new`.
Associate the warning with the link as #87 already does. This is a public defect
report, not a general/private contact service or a promise of a response time.

**Help with an order**

> Public website feedback is not an order-support channel. For an available
> product, use its order-support link and any instructions in your order
> confirmation. Send private order details only through the appropriate private
> support channel. This website has no order-support form.

Link label: **Read store help**. Do not create a generic order address or route a
customer to the website issue tracker for a private support request.

**Website policy drafts**

> The privacy and terms pages describe the current website and remain
> provisional. They are not a claim that legal, privacy, security or accessibility
> review is complete. Product-specific policies belong with the actual offer.

Link labels: **Privacy draft**, **Terms draft**.

### About — proposed refinement at existing `/about`

Retain title **About Ego Hygiene** and the existing balance/identity paragraphs.
Optional replacement introduction for Alan's review:

> Ego Hygiene is an evolving independent project exploring self-awareness,
> creative expression and thoughtful tools. Balance, awareness, empathy and
> growth guide the work. This website brings those ideas together with a store
> for physical products bearing designs.

No founding date, legal entity, founder biography, clinical benefit, community
size or institutional affiliation is added. A longer personal story can follow
reviewed facts under #9; it is not needed for this setup slice.

### Accessibility — proposed `/accessibility`

Title: **Accessibility**

Description: **Current accessibility information, review limitations and ways to
report a problem using the Ego Hygiene website.**

> We are working to make this website easier to use. Accessibility review is
> ongoing. We have not completed an assessment of every page, browser or
> assistive technology.

**Using this website**

> The website includes a Skip to content link and theme controls. These can help
> with navigation and appearance, but they do not establish that every page or
> control is accessible.

**Review in progress**

> Keyboard and focus behavior, contrast, reduced motion, zoom and smaller-screen
> layouts still need a complete review. Testing with assistive technologies is
> also incomplete. We will update this information as those checks are completed.

**Report a barrier**

> If a page or control is difficult to use, tell us which page you visited, what
> you were trying to do and what happened. You can include browser or
> assistive-technology details if you choose. Do not include private information.

Use the exact public/account/private-channel warning above, followed by
**Report an accessibility problem on GitHub**, with the same destination.
Add **More website help** → `/help`. Do not claim WCAG conformance, completed
screen-reader review or an accessible private alternative that does not exist.

### Privacy and terms — preserve the #87 boundaries

Use #87's precise sentence: **This website does not require sign-in and has no
form for submitting order or payment details.** Keep its theme/language preference
explanation, external-service notice and public-GitHub warning. Do not broaden
this into “no personal data,” “no cookies,” “no tracking” or a statement about
unknown host logs. The artist search is a form even though it does not submit an
order; “the site has no forms” would be incorrect.

For Terms, retain the physical-product/artwork-preview and separate checkout
distinctions. This checkpoint proposes no additional agreement, legal warranty,
retention period, effective-policy date or refund promise. B can add reciprocal
Help links while preserving visibly provisional titles and copy.

## Facts, decisions and remaining owners

| ID | What is known | Concrete maintainer review / remaining owner |
| --- | --- | --- |
| D1 — Purpose/story | Existing approved-direction landing/About copy expresses self-awareness, balance, empathy, growth and creative expression. | Alan reviews the proposed condensed introduction or keeps current copy. Additional personal/organizational history remains #9. No biography is required to proceed with B. |
| D2 — Feedback/contact | #87 supports public GitHub reports with an account requirement and private-data warning. No private website/accessibility contact is published in the inspected source. | Alan reviews keeping that interim path and warning, or supplies an explicitly public contact destination and its purpose. Record the choice in C. Private feedback is still a #90/#9 gap; transferring the wider channel work to #9 needs an explicit reviewed disposition before #90 closes. Private order support remains #38. |
| D3 — Accessibility | Skip link, theme controls and prior focused checks exist; final browser/assistive-technology qualification is incomplete. | Use limited status copy. #49 repairs focus/contrast/motion; #70 qualifies layout/input; #37 records final Mac/browser/assistive-technology coverage and remaining limits. Do not turn a source observation into a pass. |
| D4 — Policies and applicability | Privacy/terms are provisional; #87 provides narrower website/purchase boundaries. No operator/provider/host-policy facts are approved here. | #9 owns organization/privacy applicability and contacts; #59 rights/licensing; #38 actual commerce/policy/support facts; #89 actual hosting and deployed behavior. C must name outstanding owners and obtain disposition, not mark unknowns complete. |

Observed runtime sources support only narrow descriptions:
`packages/themes/src/components/ThemeProvider.tsx` uses `egohygiene-theme` with
storage errors caught; `apps/egohygiene.io/src/i18n/LocaleProvider.tsx` uses
`egohygiene.locale` and guarded app selection. The root layout also uses router
scroll restoration, so do not call theme/language the only browser state.
No active analytics/cookie writer or remote order/payment call was found in the
inspected app source. This is not a browser-network audit or a claim about a
deployed host, third-party services or future versions.

## Organization compatibility without a migration

The linked [Hygiene #17](https://github.com/egohygiene/hygiene/issues/17),
[Holon #11](https://github.com/egohygiene/holon/issues/11),
[Relay #21](https://github.com/egohygiene/relay/issues/21),
[Relay #22](https://github.com/egohygiene/relay/issues/22) and
[Pace #7](https://github.com/egohygiene/pace/issues/7) remain open. Reuse their
source/owner/review distinctions; none supplies approved contact or policy facts.

Hygiene's [route-registry guide][hygiene-guide] and [ADR-0013][hygiene-adr] at
`aa6a5e25ea3ef80e4dcc15570a1ea166b9f4af3d` explicitly label version
`1.0.0-alpha.1` **proposed**. `/help/` and `/accessibility/` are compatible names;
its directory-slash convention is not adopted by this checkpoint. Reconcile
spelling/aliases in #91/#89 when the site's canonical output is selected.
Its registered `/legal/` route defaults to recommended and becomes required for
applicable commerce profiles. This site has not adopted that proposed profile;
the registry does not justify an empty page or a claim of adoption here. Broader
#9 owns applicability and the requirements of any later adoption.

Holon's [site-suite blueprint][holon-guide] at
`a7734dba83305276b12932fcd4ce348044d9a2e9` can compose supplied reviewed legal
content, but explicitly leaves the reusable policy source adapter to #11.
Keep the website's existing React/Vite composition. No framework migration,
speculative organization schema, consent service or copied policy text is needed.
Relay/Pace issue refreshes were against main
`b4a88db20bc26f9ddefbee174baa8162cbe94ff2` and
`76a28ee10fdf73e556beacda1893383e3d31cc36`, respectively. No upstream code or
artwork was copied. This bounded content plan does not change an existing ADR.

## B/C handoff and checkpoint evidence

Successor: [checkpoint B](website-essentials-90b.md) implements the two pages and
navigation using #87. It retains existing About/policy text and records actual
local evidence. C's factual/contact disposition and browser acceptance remain
open. The A preparation/review state below is preserved as historical evidence.

A has inventoried the routes and sources, prepared the content/owner matrix and
written concrete review copy. The copy and D1–D4 choices remain unapproved.

B implements the two new pages and bounded existing-page/navigation edits against
the #87 foundation. C reconciles the actual strings and review decisions, checks
links/headings/metadata and records residual owners. Use focused page/footer and
locale/type checks appropriate to B; retain the established test infrastructure.
Include `/help`, `/about`, `/accessibility`, `/store/help`, `/privacy` and `/terms`
in #91's generated-route work and #37's final integrated qualification.

Actual keyboard/focus traversal, zoom, responsive/expanded-text/RTL behavior,
screen-reader use and deployed deep links need their respective later checks.
Retain a denied-browser-storage journey in B/C or final #37 to qualify the
inherited privacy sentence that blocking storage does not prevent browsing.
Do not run Chromium or broad lint/CI repair early to satisfy a documentation
checkpoint, and do not describe authored tests or source review as browser passes.

Validation for A passed: diff whitespace, 217 relative documentation links, ten
pinned website source paths, all reference-link definitions and 32 context-manifest
paths plus JSON parsing. Independent reviews checked application/source facts and
upstream organization boundaries; their two wording/link corrections were resolved.
The current copy also retains denied-storage browsing as a later behavior check.
There is
no application change or fresh application-test result. #90/#9/#38 remain open;
no policy approval, merge, provider request, product/language activation,
deployment, order or spending is part of this checkpoint.

[about-page]: https://github.com/egohygiene/egohygiene.io/blob/07d25941ceeefa53089afa025b612c6aa54f36c4/apps/egohygiene.io/src/pages/AboutPage.tsx
[main-pages]: https://github.com/egohygiene/egohygiene.io/blob/07d25941ceeefa53089afa025b612c6aa54f36c4/apps/egohygiene.io/src/i18n/locales/en/pages.json
[landing-copy]: https://github.com/egohygiene/egohygiene.io/blob/07d25941ceeefa53089afa025b612c6aa54f36c4/apps/egohygiene.io/src/i18n/locales/en/landing.json
[router]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/apps/egohygiene.io/src/app/router.tsx
[store-help]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/apps/egohygiene.io/src/pages/StoreHelpPage.tsx
[draft-pages]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/apps/egohygiene.io/src/i18n/locales/en/pages.json
[privacy-page]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/apps/egohygiene.io/src/pages/PrivacyPage.tsx
[terms-page]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/apps/egohygiene.io/src/pages/TermsPage.tsx
[readiness]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/docs/store/product-readiness-38.md
[readiness-adr]: https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/docs/architecture/decisions/0011-reviewed-product-readiness.md
[hygiene-guide]: https://github.com/egohygiene/hygiene/blob/aa6a5e25ea3ef80e4dcc15570a1ea166b9f4af3d/docs/ecosystem/PUBLIC_SITE_SURFACES.md
[hygiene-adr]: https://github.com/egohygiene/hygiene/blob/aa6a5e25ea3ef80e4dcc15570a1ea166b9f4af3d/docs/decisions/ADR-0013-public-site-surface-route-registry.md
[holon-guide]: https://github.com/egohygiene/holon/blob/a7734dba83305276b12932fcd4ce348044d9a2e9/docs/site-suite-blueprint.md
