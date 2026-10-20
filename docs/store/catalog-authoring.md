# Store catalog authoring

The catalog accepts artwork previews and placeholders, a few entries at a time. Adding a JSON file under `apps/egohygiene.io/src/content/store/entries/` makes it discoverable without maintaining an import list. Subdirectories work too.

For the end-to-end path from an approved idea to shop, featured artist or song
placement, follow the [storefront content workflow](storefront-content-workflow.md).
This page remains the reference for individual JSON records and validation.
Catalog entries and their assembled envelope now use version 2, with an explicit
`sourceLocale`. Curation and provider manifests keep their separate version 1
contracts. See the [catalog localization checkpoint](catalog-localization-65a.md)
and [ADR 0010](../architecture/decisions/0010-versioned-catalog-localization.md).

The first artwork preview is **heartburst**, a standalone ink-splatter heart with no song or product association. Its [display asset and portable visual DNA](../../assets/designs/heartburst/README.md) are separate from the private source pack.

The public `.play()` artist context currently has no selected merchandise or songs. Signal Heart, Static Bloom and Unwritten Realm are fictional examples of a standalone design, song collection and future comic. None has a purchase link or confirmed production details. Replace or remove these examples as real entries become ready.

## Add a design

From the repository root, using the repository's supported Node runtime:

```sh
node scripts/store-catalog.mts add-design --slug "my-new-design" --title "My New Design"
node scripts/store-catalog.mts validate
```

The first command creates `my-new-design.design.json` with version 2, `sourceLocale: "en"`, no translations, unknown attribution, a generated permanent ID, draft visibility, a placeholder image, and no song, artist, or character requirement. It checks the entire proposed catalog before writing and refuses to overwrite existing files. A duplicate slug or a broken existing entry blocks creation until it is fixed.

Edit the generated file to add the description and approved artwork. Keep the generated `id` even if the title or slug changes. Increment `artworkRevision` when replacing the artwork. A changed slug will need redirect handling when public URLs are introduced; keep published slugs stable until that exists.

Validation reports the filename and field path. For example, a missing design reference is reported at `my-product.product.json:designIds.0`. Fix the named entry and run validation again. Unsupported schema versions, unknown fields, duplicate IDs or slugs, invalid references, and public entries referring to drafts are rejected.

`visibility: "draft"` keeps an entry out of the storefront's public projection and its generated browser module. Change it to `"public"` when its copy and all referenced entries are approved for display. This repository is public: **draft visibility does not make a file private**. Keep original artwork masters, private notes, credentials, and unapproved source material outside this repository.

## Public build and development boundary

The Vite adapter in `scripts/vite-store-catalog.mts` discovers and validates all authoring entries in Node, then applies the shared `toPublicStoreCatalog` projection. The app imports `virtual:store-catalog` through its existing `content/store/index.ts` entry point. Only public entries and reviewed checkout routes used by public live products become browser module data. For each public entry, the projection retains only translated fields whose review still matches the source and translated values; draft and stale translated fields are excluded. Public-safe review bindings remain in the projected records for revalidation. Raw entry files, unused routes, and provider research metadata are not imported into the browser graph. Use this adapter in any future browser entry point; do not import the authoring JSON directly.

This is the same path for normal builds, isolated local previews, live editing, and component tests. No generated catalog file needs committing or regenerating by hand. Records retain deterministic filename order. Invalid drafts still fail validation: filtering is not permission to bypass schema, reference, purchase-route, or artwork-file checks.

The development server watches nested entries, checkout routes, provider metadata, and public artwork. Edits, additions, and deletions trigger a full page reload and fresh validation. An invalid edit appears in Vite's error overlay; fixing it reloads the valid public view. This also refreshes module-level selections in the Fourthwall tryout.

The authoring CLI still validates the complete catalog. Draft filtering is a browser publication boundary, **not access control**: source files remain public in Git and may be accessible on a local development server. Everything placed under `apps/egohygiene.io/public/` is copied into the build independently of catalog visibility, so that directory must contain only approved public assets. The adapter does not turn it into private artwork storage.

Run `node --test tests/store/public-build.test.ts` for the focused boundary check. It builds synthetic public/draft records through the application's import entry, scans emitted HTML/JS/JSON/source maps, verifies repeatable output and live-route guards, and exercises a real local Vite server's file refresh and error recovery. Its synthetic checkout URLs are never visited.

## Approved artwork

To use an approved web image, place the derivative in `apps/egohygiene.io/public/store/` and replace the artwork object:

```json
{
  "kind": "image",
  "src": "/store/my-new-design.webp",
  "alt": "Describe the visible artwork"
}
```

Supported image extensions are PNG, JPG/JPEG, WebP, and AVIF, using lowercase filenames. The schema checks the local path format. The default CLI and build checks also require image-backed designs to reference existing regular files under `apps/egohygiene.io/public/`. This applies to draft designs too. Symlinks that resolve outside that public directory are rejected; internal symlinks to regular files are allowed. Missing files block validation and `add-design` before a new entry is written. Placeholder artwork remains valid without a file.

These checks inspect file paths and metadata, not image bytes. They do not establish that the file is a decodable image or review its dimensions, appearance, rights, or print quality. Inspect the rendered image locally before approving it.

## Attach a product when ready

A design is the artwork. A product is an item carrying one or more designs. A song, realm, artist, character, or appearance is optional context; it does not own the design or determine its fulfillment provider.

Copy this into a new `.product.json` file. Replace `design-replace-with-generated-id` with the permanent ID from your design entry, and choose a unique permanent product ID and slug:

```json
{
  "schemaVersion": 2,
  "sourceLocale": "en",
  "kind": "product",
  "id": "product-my-new-design-hoodie",
  "slug": "my-new-design-hoodie",
  "title": "My New Design Hoodie",
  "description": "A hoodie concept. Production details are not confirmed.",
  "visibility": "draft",
  "designIds": ["design-replace-with-generated-id"],
  "contextIds": [],
  "purchase": { "state": "preview" }
}
```

Preview products need no price, variant, provider, or purchase URL. Their purchase action is disabled. If the item should explain why it cannot be purchased, use:

```json
{
  "state": "unavailable",
  "reason": "Print files are still being prepared."
}
```

Do not add a placeholder checkout link. Live purchases require a reviewed Fourthwall route in `apps/egohygiene.io/src/content/store/checkout-routes.json`, a matching product, approved variant mappings, and image artwork at the route's explicitly reviewed revisions. Changing an artwork revision requires reviewing the route again. That list starts empty. The live-product checkpoint will verify the destination, product, fulfillment arrangement, and variants before adding one. The schema validates configuration consistency; it cannot confirm availability, ownership, image quality, or provider approval remotely.

## Cover and gallery order

Put a product's intended cover first in `designIds`; subsequent IDs set gallery
order. A collection starts with its own `designIds`, then adds designs from each
product in its declared `productIds` order and that product's `designIds` order.
Shared designs appear once, at their first occurrence. An empty collection
`designIds` list uses this product order as its cover/gallery fallback.

File names and catalog discovery order do not set the cover. References still
must pass the existing kind, duplicate, visibility and approval validation.
Changing presentation order does not change IDs, artwork revisions or permission
to sell. See the [#54 checkpoint](design-order-54.md) for delivery evidence.

## Add optional context or a collection

For a song, realm, artist, brand, character, or appearance, create a context entry. `contextType` selects one of those six kinds:

```json
{
  "schemaVersion": 2,
  "sourceLocale": "en",
  "kind": "context",
  "id": "song-my-new-song",
  "slug": "my-new-song",
  "title": "My New Song",
  "description": "Approved public description of this song.",
  "visibility": "draft",
  "contextType": "song"
}
```

Then add its ID to the relevant design or product's `contextIds`. Arrays allow several contexts; an empty array is valid for a standalone design. Use an appearance context to connect a design to a particular video appearance without claiming that the song originated the design.

A collection groups any approved combination of designs and products. Copy this into a new `.collection.json` file, replace the reference IDs with existing entries, and remove any associations that do not apply:

```json
{
  "schemaVersion": 2,
  "sourceLocale": "en",
  "kind": "collection",
  "id": "collection-my-new-song",
  "slug": "my-new-song-collection",
  "title": "My New Song Collection",
  "description": "A collection of artwork and product concepts.",
  "visibility": "draft",
  "designIds": ["design-replace-with-generated-id"],
  "productIds": ["product-my-new-design-hoodie"],
  "contextIds": ["song-my-new-song"]
}
```

All IDs and slugs must be unique across the entire catalog. IDs use lowercase letters, digits, and hyphens, with at least two hyphen-separated parts. Slugs use lowercase letters, digits, and separating hyphens. Each file contains exactly one entry. No registration file needs editing.

## Curate an artist and Shop by song

An artist page needs a public context with `kind: "context"`,
`contextType: "artist"`, a permanent ID, a stable slug and approved public copy.
The existing example is `artist-play`, slug `play`, title `.play()`. Selecting
that context in `apps/egohygiene.io/src/content/store/storefront-curation.json`
creates its destination at `/store/incompris/artists/play` and its link from
Incompris. Adding a context alone does not select merchandise automatically.

The version-1 curation manifest accepts an optional `artists` array. Preserve its
existing primary/featured lists and merge artist selections like this example:

```json
{
  "artists": [
    {
      "artistId": "artist-play",
      "standaloneEntryIds": [],
      "songCollectionIds": []
    }
  ]
}
```

Omitted `artists`, `standaloneEntryIds` and `songCollectionIds` default to empty
arrays. The current `.play()` selection intentionally stays empty; heartburst's
Incompris placement does not assign it to that artist. To add another artist,
create its public context and append a selection using its canonical ID.

- `standaloneEntryIds` selects public designs, products or collections in manual
  order for the standalone/world-inspired view.
- `songCollectionIds` selects public collections in manual order for Shop by
  song. Each collection must directly list at least one public song context in
  its own `contextIds`; a song on a child design does not qualify the collection.
- Artist IDs must be unique within `artists`; each selection list rejects
  duplicate, missing, draft and wrong-kind references. Promote approved entries
  and their referenced content before selecting them.

Membership can overlap: several artists can select one collection, a collection
can reference several songs, and the same product can appear in several
collections or both artist views. Reuse its original ID and detail page. These
lists express discovery placement, not authorship, ownership or purchase approval;
an artist context on every selected item is not required.

Share the collection's canonical `/store/collections/<slug>` link for a song.
For the earlier example, that is `/store/collections/my-new-song-collection`;
once deployed, the full site URL can be used in SoundCloud. Keep published slugs
stable. Artist browsing state uses `?view=songs` and optional `q`; it does not
change the collection or product URL.

Run `node scripts/store-catalog.mts validate` after editing. The normal site shows
the real empty `.play()` selection. The isolated local preview offers fictional
data at `/store/preview/artists/demo-artist`, using existing demo merchandise;
its synthetic artist is excluded from normal builds and never becomes `.play()`
content. See [local preview](local-preview.md) and the
[extension contract](../architecture/store-extension-contracts.md#artist-and-song-discovery).
Private song metadata stays in its source repository; this public catalog needs
only approved context and collection records. Curation does not activate a
provider or purchase link.

## Review a small addition

1. Generate the design, then edit its public-safe copy and artwork placeholder or derivative.
2. Add a product or context only when there is something concrete to represent.
3. Run `node scripts/store-catalog.mts validate` and inspect the diff.
4. Keep the entry draft until ready for public display. Promote its referenced entries together.
5. Review and merge through the normal PR process. A successful validation does not publish the store or enable purchases.

Use `--directory "/path/to/entries"` on either command to validate or author a separate test catalog. The directory must already exist. A separate directory uses an empty route list, so it cannot borrow production checkout approvals. It performs schema-only validation unless you also supply `--public-directory`; the CLI explicitly reports when artwork files were not checked:

```sh
node scripts/store-catalog.mts validate --directory "/path/to/entries" --public-directory "/path/to/public"
```

The public directory is the root that contains `store/`, not the `store/` directory itself. The same optional `--public-directory` flag works with `add-design`. Programmatic callers use `loadCatalog(directory, routes, publicDirectory)` to check a custom catalog's assets, or omit the third argument for schema-only validation of a custom catalog. Calling `loadCatalog()` checks the default catalog against the application's public directory, including during Vite builds. JSON entries are discovered recursively in deterministic path order; catalog-file symlinks are not followed. Every discovered JSON file is treated as a catalog entry.

## Catalog translations and attribution

Keep the existing title, description, artwork text and purchase copy as the source
content, and set `sourceLocale` to its actual canonical BCP 47 language ID. The
current catalog uses `"en"`. This field describes authored content; it neither
registers a public website language nor chooses formatting, currency or shipping.

Optional `translations` live on the same canonical entry and default to an empty
array. Each record names one different locale and supplies a nonempty `fields`
object. Supported fields are `title`, `description`, `artworkAlt`, `artworkLabel`,
`unavailableReason` and `variantLabels`. Artwork fields must match the design's
image or placeholder kind; unavailable copy must belong to an unavailable product;
variant labels identify existing live-product variants by their canonical
`variantId`. Duplicate locale or variant entries and fields without matching
source content fail validation. There is no translated ID, slug, asset path,
provider mapping or price field.

For example, this optional property adds one **synthetic draft** description to a
product or collection. It is a fixture, not an approved language or translation:

```json
{
  "translations": [
    {
      "locale": "en-XA",
      "fields": {
        "description": {
          "value": "[An expanded fictional description for layout review]",
          "review": { "status": "draft" }
        }
      }
    }
  ]
}
```

Omit `title` when a creative name should remain unchanged. Omitted, draft or stale
fields leave the source field available as fallback; do not copy source text into
every locale to conceal missing translations. Checkpoint A establishes the data
and publication contract. Selecting this content for display and multilingual
search belongs to #65 B; current pages still render source catalog fields.

A human-reviewed field uses `review.status: "reviewed"`, a canonical target
`locale`, a public-safe `reviewedBy` identifier, a valid `reviewedAt` calendar date,
and exact `source` and translated `value` snapshots. The source snapshot includes
its locale and text; artwork fields also bind `artworkRevision`, and variant labels
bind `variantId`. Editing either text, the source locale or the bound revision/ID
makes the record stale. `inspectStoreTranslations(entry)` reports the status of
present fields; `publicStoreTranslations(entry)` retains only current reviewed
fields. The schema checks shape and applicability even on drafts. Staleness is a
review result rather than a malformed-record error, so source edits can proceed
while the affected translation falls back. Update review bindings only after an
actual review, or remove the translated field until one is available. See the
[complete authoring/review example](catalog-localization-65a.md).

Review metadata is public catalog data. Use a public reviewer handle, not private
contact details, business records or rights evidence. Structurally valid review
metadata cannot prove reviewer identity, linguistic quality or publication approval.

Optional `attribution` defaults to `{ "status": "unknown" }`. A declared record
uses `status: "declared"` with `creatorIds` and/or `rightsHolderIds` referencing
existing artist or brand contexts. At least one list must be nonempty; references
must be unique, and public entries can reference only public contexts. Keep the
status unknown unless a supported public declaration exists. Song membership,
`contextIds`, artist curation and appearance associations do not imply creation or
ownership. Attribution does not grant sale permission or qualify a checkout route.
The migration does not infer any rights claim for Heartburst or other records.

## Schema changes

`packages/schemas/src/store.ts` composes the authoritative Zod catalog contract
with `store-localization.ts`; TypeScript types are derived from those schemas.
`store-migrations.ts` owns the explicit compatibility operation. Both the authoring
CLI and storefront adapter use this shared contract. Do not create a second model
in a component or a translation-specific product catalog.

Current runtime parsing accepts **version 2 only**. Version 1 is accepted solely
by the explicit migration input schema. Requiring an authored source language is
the justified breaking change; a parser must not silently assume a language for
old data. The v1 input contract is retained as compatibility evidence, not an
alternative current runtime. Other versions fail closed.

The assembled catalog has a strict envelope: `schemaVersion`, `entries`, and
`checkoutRoutes` are required. `storeCatalogSchema` validates its shape;
`parseStoreCatalog` checks entry references, translation applicability, attribution
and live purchase restrictions. Public projection and live purchase actions
revalidate these relationships before emitting content or a checkout URL.
Provider and storefront-curation manifests still use version 1, and checkout-route
records retain their existing shape. Do not bump those unrelated contracts.

To migrate a retained v1 **envelope** into a new review file:

```sh
node scripts/store-catalog.mts migrate \
  --input "/path/to/review/catalog-v1.json" \
  --output "/path/to/review/catalog-v2.json" \
  --source-locale "en"
```

The input is one object containing the v1 `schemaVersion`, `entries` and
`checkoutRoutes`; it is not an entries directory or an individual record. Supply
`--source-locale` only after reviewing the actual source language. The migration
uses that language for every entry, adds empty translations and unknown attribution,
and preserves IDs, slugs, ordered references, artwork revisions, visibility,
purchase states and provider mappings. It validates the migrated relationships
and purchase restrictions before writing. It does not approve a live product.

The output path must not already exist; the CLI refuses to overwrite either it or
the input. Keep both envelopes outside the discovered entries directory, where
every JSON file is interpreted as one entry. Review the output before replacing
the individual authoring records in a PR. The command does not replace those
files, split the envelope or migrate artwork. Run the ordinary catalog validation
after applying reviewed entries so artwork files and curation are checked too:

```sh
node scripts/store-catalog.mts validate
```

Retain the original v1 input and the code revision that consumes it. Rollback means
restoring compatible schema/consumer code and those original authoring inputs
together. There is no automatic v2-to-v1 downgrade: dropping localization or
attribution fields would discard new authored information. Preserve the v2 work in
Git when reviewing a rollback. The [checkpoint receipt](catalog-localization-65a.md)
records the implemented chain and limits; the [earlier audit](schema-audit-34.md)
remains historical v1 evidence.

Compatible optional/defaulted additions must keep existing **v2** fixtures valid.
A breaking change needs the next explicit version, a migration from its supported
predecessor and fixtures proving stable identity, references, visibility and
purchase restrictions. A future digital product or license offer must receive a
separate reviewed product/purchase contract and delivery/terms policy through this
same process. It cannot be represented by adding a download URL or license terms
to today's physical-product preview/live records. No digital delivery or licensing
behavior is implemented or authorized by version 2.

The generic preview browser consumes this catalog automatically at `/store/catalog`, with canonical design, product and collection detail pages. Curated shop and artist views use the separate curation manifest. Follow [the next-design session](next-design-session.md) to preview one approved image. Provider onboarding, purchases, and publication remain separate steps.
