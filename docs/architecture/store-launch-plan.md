# Ego Hygiene website and community store launch plan

Version: **0.2.0**. Conversation checkpoint: **2026-10-16**, America/New_York.
Ownership checkpoint: **2026-10-17 UTC**, issue #75.
Status: accepted product direction and development preference; delivery plan
proposed for review, with first ownership task authorized and delivered for review.
This file records the plan, not a deployed system.

Start with [current state](../context/current-state.md), then this plan,
[ADR 0006](decisions/0006-store-launch-direction.md), and the
[proposed milestone backlog](../roadmaps/store-launch.md).

## Scope and authority

The maintainer requested repository documentation, agent/continuity hooks, ADRs,
and a proposed milestone/parent-issue/sub-issue roadmap, followed by a sync.
On 2026-10-17 the maintainer authorized merging the two planning PRs and starting
the first bounded issue. Those merges are complete; [#75](https://github.com/egohygiene/egohygiene.io/issues/75)
now holds the ownership comparison. Remaining new roadmap parents/milestones and
reparenting await the next sync. Deployment, purchases, account activation,
repository transfer and archival are outside this checkpoint.

## Product direction

- Ego Hygiene is the primary public identity and future core product. The root
  explains its mission and product direction. The community store is one feature.
- Feature `.play()` as an artist within this site initially. Ego Hygiene designs
  are first-class alongside standalone designs and character/world collections.
- Keep roughly 400 songs' potential merchandise in a dedicated music catalog.
  Main-store selection is curated; a song association does not automatically
  feature every item on the main store page.
- A design is artwork used on physical products, not an automatic download for
  sale. One design can support multiple products and optional song associations.
- Launch purchasable merchandise first. Show a comic cover/development page and
  an Alpal development page before their purchasing integrations are ready.
- A later comic milestone is a real copy bought through the store and received
  physically. Makeship campaigns remain a separate, later provider investigation.

### Public address contract

These are intended destinations, not a claim that all routes exist today.
Preserve current working product/design/collection links when adding them.

| Address | Purpose | Current qualification |
| --- | --- | --- |
| `/` | Mission, project introduction, eventual core-product entry | Website route exists; content refinement proposed |
| `/store` | Curated community storefront | Website selected under #75 for review; separate source preserved |
| `/store/products/:slug` | Stable merchandise destination | Existing website route; preserve compatibility |
| `/store/designs/:slug` | Design context and associated products | Existing website route; preserve compatibility |
| `/store/collections/:slug` | Curated artist, brand, character, or theme | Existing website route; preserve compatibility |
| `/store/music` | Searchable/filterable song merchandise collection | Proposed |
| `/store/music/:songSlug` | Song context and products; SoundCloud link target | Proposed; IDs must not depend on supplier URLs |
| `/artists/play-function` | Featured artist, music, characters, and merchandise | Proposed |
| `/comics` | Cover/development status, then purchasing | Proposed |
| `/characters/alpal` | Concept/development status, then qualified campaign | Proposed |
| Existing documentation subdomains | Separately hosted developer documentation | Preserve; DNS/availability not audited here |

The core product's future `/app` versus app subdomain remains open. Music may
later move to its own destination; stable IDs and redirects should preserve
incoming song/product links. Featuring an artist does not require a marketplace.

## Repository ownership checkpoint

Live source inspected on 2026-10-16:

| Repository | Source revision | Observed responsibility |
| --- | --- | --- |
| `egohygiene/egohygiene.io` | `db634b887ede348ce85d9c03af789467ab535dcf` | Website, actual store routes, public catalog, portable store domain, synthetic Fourthwall preview |
| `egohygiene/store` | `599c90ca6a454c0f2e9aa95eab5f8395016474c5` | Separate React/Vite storefront with commerce port, mock/Fourthwall adapter, cart code, and `/store/` hosting design |
| `incomprisllc/merch` | `60e36d5a0cde95144920d4954cee3ed35b7bbd61` | Private creative source and design packs; not the same repository as `egohygiene/store` |

The [pinned implementation comparison](storefront-ownership.md) and
[ADR 0007](decisions/0007-canonical-storefront-owner.md) select the website's
`apps/egohygiene.io` as the V1 storefront owner, with one composed static build.
The website already owns catalog/publication safeguards, artwork approvals,
canonical URLs and shared shell. The separate store's cart/provider code remains
valuable reference for bounded adaptation, with its MIT notice and source history.
The selection is submitted in paired documentation PRs for maintainer review.

On acceptance this reaffirms website high-level ADR-0004 and resolves store
ADR-0003's conflicting independent V1 deployment direction through reciprocal
store ADR-005. Historical decisions and the original private-merch migration
ledger remain intact. No code is copied or repository retired by this checkpoint.

The selected V1 delivery is one website build/deployment coordinator for `/` and
`/store`. Do not combine competing application outputs or create an independent
Vercel store origin. Future products/documentation may still deploy independently.
DNS selects hosts, not URL paths; no `/store` reverse proxy is needed for the
composed V1 application. The comparison preserves routing/asset verification
and rollback requirements for the actual host, which is still unconfigured.

## Creative and commerce boundaries

Recommendation pending review: **retain `incomprisllc/merch` as a separate private
creative source**. Do not merge its files into a public website or transfer the
repository simply because Ego Hygiene displays its products. An organization
transfer changes GitHub ownership; it is distinct from copying repository
contents, changing visibility, or changing the legal owner of artwork. None is
requested or performed here.

Merch can serve Ego Hygiene, artist projects, character work, and future stores.
Catalog remains the song-metadata source. Publish reviewed, versioned public
records and display derivatives through explicit review. Preserve source IDs,
revisions, rights/attribution, and export provenance. Private masters, raw capture
data, credentials, and customer records stay outside public Git and web bundles.

Keep these concepts separate in contracts: brand/attribution, artist, collection,
design, song, product, variant/offer, fulfillment provider, and checkout mode.
Provider IDs must not replace canonical catalog identity. An empty song list is
valid for a standalone design. A character design can reference a character
sheet; abstract artwork does not require one.

Provider selection is behind a commerce boundary. Hosted checkout, campaign
handoff, and direct fulfillment are distinct capabilities. Do not imply every
provider supports one cart, shared login, real-time stock, or universal order
history. Start with separate provider purchasing flows; a mixed-provider cart is
deferred. Fourthwall is the initial merchandise candidate, subject to real shop,
product, artwork, payment, and fulfillment qualification. Lulu is a later comic
candidate; Makeship eligibility and integration remain research items.

## Development and release workflow

The agreed preference is local development plus a hosted Netlify development
environment, with production chosen later between Cloudflare and Google.

- Use `development` as the intended integration branch. Work freely on feature
  branches; successful merges update the hosted development view. PR updates do
  not themselves trigger deployments. Ordinary validation CI is separate.
- A small caller workflow selects the branch, environment, and application
  settings. Prefer a reusable GitHub Actions workflow using `workflow_call` for
  validation, reproducible build, deployment, and URL/report output.
- A `push` trigger limited to `development`, combined with PR-only branch rules,
  implements merge-only delivery, including squash/rebase merges. It is not a
  check for two-parent Git commits. Branch protection is not configured here.
- Build with pinned tools and the repository's commands. Keep build/validation
  portable; isolate the host-specific upload step. Shared workflow location and
  versioning are open until existing organization tooling is checked.
- If GitHub Actions uploads with Netlify CLI, disable Netlify's automatic Git
  builds/PR deployments to avoid duplicate pipelines. A CLI `--alias` creates a
  named draft deployment, **not** a native branch deployment. Use an alias that
  differs from repository branch names and choose the exact mode during setup.
- For the selected V1 shape, deploy one composed website artifact. Record its
  source SHA and configuration; preview checkout remains mock or disabled. A
  future independent application needs a new integration decision and must not
  overwrite this deployment.
- Preview configuration uses mock commerce or explicitly disabled purchases.
  Draft visibility flags are not privacy controls. Development credentials and
  production credentials are separate; secrets do not enter browser bundles.
- Production publication is a separate release action after host selection and
  approval. Include a smoke check, rollback instructions, failure behavior, and
  deployment provenance. Do not equate a passing build with a completed order.

### Budget and lifecycle notes

Provider facts below were checked on 2026-10-16; recheck at implementation.
Netlify's current Free allowance is 300 credits/month. Native branch/PR preview
deployments have no production-deployment charge; successful primary-site
production deployments cost 15 credits even if that site is informally called
development. Serving traffic and runtime features still consume usage.

Named CLI drafts also need a retention/recovery plan: default Free retention is
30 days and the documented latest-branch/production exceptions do not promise
indefinite draft retention. Verify the selected mode and billing during the first
preview. Do not add a recurring redeployment schedule implicitly. A manual
redeploy of a recorded revision is an option to evaluate.

Standard GitHub-hosted runners are free for public repositories; larger runners,
private-repository quotas, and artifact/cache retention require separate review.
The goal is no new recurring infrastructure charge within the chosen limits,
not a promise of unlimited resources or free physical samples.

## Incremental delivery boundaries

Resolve ownership and existing CI work, then establish phone-accessible preview,
then qualify one physical merchandise product and its real checkout. Add the
public shell, music collections, comic/Alpal development pages in bounded slices.
Choose and qualify production hosting before public launch. Later qualify comic
printing and a received copy, then consider campaigns and other providers.

Keep responsive/mobile behavior, accessibility, translation-ready UI, and
catalog-localization ownership visible in the backlog. Prefer guest shopping
initially. Accounts, shared order history, Kubernetes, a new framework, a unified
cart, and a large multi-cloud infrastructure layer are not first-sale gates.
Docker is an existing option; Pulumi can follow actual chosen resources rather
than requiring an infrastructure rewrite before a preview works.

See the [proposed roadmap](../roadmaps/store-launch.md) for candidate parent
issues, sub-issues, dependencies, existing work to reuse, and exit criteria.
The first ownership issue #75 is underway; next is review of its paired PRs,
then #29's existing CI slice and development-preview implementation. Remaining
roadmap creation/reparenting still awaits sync.

## Sources and provenance

This is a decision-oriented summary of the 2026-10-16 conversation, not a raw
transcript. Source repository revisions are pinned above. External sources:

- [Netlify CLI: external CI, draft aliases, authentication](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/).
- [Netlify automatic build controls](https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/).
- [Netlify path rewrites/proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).
- [Netlify credit accounting](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).
- [Netlify deployment retention](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/).
- [GitHub reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows).
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- [Fourthwall custom storefront boundary](https://help.fourthwall.com/manage-my-shop/apps-features-and-integrations/storefront-api-for-custom-storefronts).
- [Lulu Direct Buy Button candidate](https://help.luludirect.lulu.com/en/support/solutions/articles/64000311603-how-to-create-and-manage-a-lulu-direct-buy-button).

Planning receipts: [website #74](https://github.com/egohygiene/egohygiene.io/pull/74)
and [store #33](https://github.com/egohygiene/store/pull/33), both merged.
The current companion [ownership checkpoint](https://github.com/egohygiene/store/blob/docs/storefront-ownership-75/docs/context/current-state.md)
is submitted for review; refresh its PR state before resuming.
