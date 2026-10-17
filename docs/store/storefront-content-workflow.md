# Add content to the storefront

Use this walkthrough for one approved addition at a time. The catalog stores the
content once; the curation manifest chooses where visitors discover it. The
[catalog authoring guide](catalog-authoring.md) contains the complete JSON
templates, and [extension contracts](../architecture/store-extension-contracts.md)
explain the code boundaries. These steps add public previews; provider activation
and deployment are separate work.

The current shop has no approved Ego Hygiene garment. Heartburst is an approved
Incompris artwork preview, with no artist or song association. `.play()` has an
artist page with empty selections. Keep those states until actual content and
associations are approved; the fictional catalog examples are not real inventory.

## Choose the record and its destination

| Record or selection | Purpose | Visitor destination |
| --- | --- | --- |
| Design | Artwork and its approved web derivative or placeholder | `/store/designs/<slug>` |
| Product | A particular item carrying one or more designs, such as a hoodie | `/store/products/<slug>` |
| Collection | A group of existing designs and products | `/store/collections/<slug>` |
| Artist context plus artist selection | An artist destination with standalone and song views | `/store/incompris/artists/<artist-slug>` |
| Song, realm, character or appearance context | Optional public background linked by ID | Shown with its associated entries; no separate context detail route |
| Primary and featured selections | Ordered references to existing public entries | `/store` and `/store/incompris` |

Keep one permanent ID and one canonical detail page per record. A design and its
hoodie have different IDs because they represent different things. Showing that
hoodie in two collections does not create two products. IDs and slugs must be
unique across the entire catalog. Keep published slugs stable: changing a title
does not require a new ID or URL, and automatic redirects are not implemented.

## Add an approved Ego Hygiene design or garment

1. Confirm what may be published: title, description, image derivative, alt text
   and any actual associations. Keep private source packs, print masters and
   unpublished music metadata in their authorized source. This repository is
   public, including files whose catalog visibility is `"draft"`.
2. Use the generator from the repository root with the approved name and a
   unique slug. The following name is an example to replace before running:

   ```sh
   node scripts/store-catalog.mts add-design --slug "ego-hygiene-example" --title "Ego Hygiene Example"
   ```

   The generator writes a draft design under
   `apps/egohygiene.io/src/content/store/entries/` and prints its file path. Keep
   its generated `id`. No import registration is needed. The command refuses
   overwrites and validates the proposed catalog before writing.
3. Fill in its approved copy. Keep the placeholder if artwork is not ready, or
   follow [approved artwork](catalog-authoring.md#approved-artwork) to use a web
   derivative under `apps/egohygiene.io/public/store/`. Inspect the actual image;
   validation checks the path and file, not print suitability. Increment
   `artworkRevision` when replacing artwork. Everything under `public/` is copied
   into builds regardless of catalog visibility.
4. If there is an approved garment concept, add a separate product using the
   [product template](catalog-authoring.md#attach-a-product-when-ready). Reference
   the design ID in `designIds` and start with `purchase.state: "preview"`.
   A design alone is an artwork preview; it does not become a hoodie, downloadable
   artwork sale or buyable item because it appears in the shop.
5. When the copy and references are approved for display, change the relevant
   entries to `visibility: "public"`. A public product cannot reference a draft
   design or context. Promote approved dependencies together, then validate.
6. Edit the existing
   [curation manifest](../../apps/egohygiene.io/src/content/store/storefront-curation.json)
   and append the canonical design, product or collection ID to
   `egoHygieneEntryIds`. Its position in the array determines its order on
   `/store`. Preserve the other selections. Selecting the product is the direct
   way to showcase the garment; selecting the design showcases the artwork.

Public entries also appear in `/store/catalog` independently of curation. If an
entry must not be visible to visitors yet, leave it draft and unselected. Draft
visibility controls the browser projection, not access to this Git repository.

## Feature an Incompris entry

Add an approved public design, product or collection ID to `incomprisEntryIds`.
To show it in the primary shop's featured row, also add the same ID to
`featuredIncomprisEntryIds`. Every featured ID must be in the Incompris list;
moving its position changes the display order without changing its detail URL.

The current manifest demonstrates this with `design-heartburst`. Its canonical
[design record](../../apps/egohygiene.io/src/content/store/entries/heartburst.design.json)
is shared by both views. Do not copy that record or add artist/song associations
just to feature it. Curation is editorial placement, not ownership, authorship
or purchase approval. Empty lists are valid; duplicates within one list are not.

## Add an artist and connect a song collection

For an existing artist, reuse its context and existing `artists` selection. For a
new artist, create a public artist context with approved copy, then append one
selection with its ID, `standaloneEntryIds: []` and `songCollectionIds: []`.
The existing [`.play()` context](../../apps/egohygiene.io/src/content/store/entries/play.context.json)
and manifest show the minimal shape. One artist ID can appear only once in
`artists`; an artist context alone does not create a selected artist destination.

To populate that artist's **Standalone & worlds** view, put approved public
design, product or collection IDs in `standaloneEntryIds`. This placement can
include character or realm work, with optional context associations where they
are known. No song record is required for standalone work.

For **Shop by song**:

1. Create or reuse a public `contextType: "song"` record containing only approved
   public copy. This is a storefront reference, not an import of the full private
   recording, credits, rights or generation history.
2. Create a public collection using the
   [collection template](catalog-authoring.md#add-optional-context-or-a-collection).
   List the existing design and product IDs in `designIds` and `productIds`, and
   put the song context ID directly in the collection's `contextIds`. A song
   context on a child design alone does not qualify the collection for this view.
3. Add that collection's ID to the artist's `songCollectionIds`. A collection may
   reference more than one song, and more than one artist may select it. A public
   song collection with no designs or products is valid and shows an empty state.
4. Review the collection at `/store/collections/<collection-slug>`. This is the
   stable destination to use for a SoundCloud song link once the site is deployed.
   The artist's `?view=songs` URL opens the whole song collection view instead.

Standalone and song selections may intentionally overlap. For example, the same
mug can appear in the standalone view and in a song collection, always pointing
to its original `/store/products/<product-slug>` page. Selection does not infer
authorship; add any direct `contextIds` associations only when they are accurate.
There is no need to duplicate a product or force every design to belong to a song.

For a populated example without assigning fictional work to `.play()`, inspect
the [isolated artist fixture](../../apps/egohygiene.io/src/features/artist-preview/fixture.ts).
It connects the existing Signal Heart hoodie and Static Bloom collection to
**Demo artist**, reusing the canonical Static Bloom mug across both views. The
[fixture checks](../../apps/egohygiene.io/src/features/artist-preview/fixture.test.ts)
verify those relationships and disabled purchases. This fixture does not alter
the shipped curation manifest.

## Keep the visible state truthful

| State | Authoring choice | Result |
| --- | --- | --- |
| No selected content yet | Empty curation arrays | Useful empty state; no invented merchandise |
| Work not approved for public display | `visibility: "draft"`, absent from curation | Excluded from the public catalog; source remains public in Git |
| Approved artwork only | Public design with placeholder or approved image | Artwork preview, no garment purchase |
| Garment concept | Public product with `purchase.state: "preview"` | Visible product with disabled purchase action |
| Item cannot currently be purchased | `purchase.state: "unavailable"` plus an accurate `reason` | Visible explanation and disabled purchase action |
| Qualified live item | Separate reviewed provider/product/variant/artwork mapping | Requires the live-product checkpoint; not enabled by this workflow |

Do not add dummy checkout URLs, prices or stock claims to complete a card.
`checkout-routes.json` remains empty in this checkpoint. Provider research and
preview adapters cannot grant purchase eligibility.

## Validate and review the addition

Use pinned Node 24.21.0 and pnpm 11.28.5; see
[local setup](local-preview.md#one-time-prerequisites). From the repository root:

```sh
node scripts/store-catalog.mts validate
pnpm build
pnpm --filter @egohygiene/egohygiene.io preview --host 127.0.0.1 --port 4173 --strictPort
```

The validator checks the complete catalog, artwork paths, provider configuration
and curation references, including drafts. Fix its filename/field diagnostics
before reviewing the build. The normal build goes to `apps/egohygiene.io/dist`.
Open `http://127.0.0.1:4173/store` and follow the actual placement to its canonical
detail page. For a song addition, also check the artist's two views, collection
link, search, reload and browser Back. At phone and desktop widths, inspect the
artwork, text, keyboard focus and displayed preview/unavailable state.

For the populated fictional example, stop the normal server and run:

```sh
task preview:store
```

Open `/store/incompris`, then **Try the fictional artist example**, or visit
`http://127.0.0.1:4173/store/preview/artists/demo-artist`. Its banner identifies
the fixture. The isolated output is `apps/egohygiene.io/dist-preview`; do not
deploy it. Normal builds exclude this additional artist and preview route.

For changes to schema, selectors or UI behavior, run the affected contract/unit
checks and browser journeys as well. Existing entry points are `pnpm catalog:test`,
`pnpm typecheck`, `pnpm test:store`, and, after an isolated preview build,
`pnpm test:store:preview`. A small content edit primarily needs validation, a
successful build and visual review of its actual destinations.

Review the diff for accurate public copy, assets, stable IDs, intended selections
and purchase state. Submit the content and any approved web derivatives together
through the normal PR process. Record what was reviewed and what remains pending
in the session's checkpoint. Passing validation or merging catalog content does
not deploy the website, qualify a manufacturer, activate checkout or place an order.
