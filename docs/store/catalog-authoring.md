# Store catalog authoring

The catalog is ready for placeholders. Real design ingestion can happen later, a few entries at a time. Adding a JSON file under `apps/egohygiene.io/src/content/store/entries/` makes it discoverable without maintaining an import list. Subdirectories work too.

The current examples are fictional: Signal Heart is a standalone design, Static Bloom demonstrates a song collection, and Unwritten Realm demonstrates a future comic. None has a purchase link or confirmed production details. Replace or remove these examples as real entries become ready.

## Add a design

From the repository root, using the repository's supported Node runtime:

```sh
node scripts/store-catalog.mts add-design --slug "my-new-design" --title "My New Design"
node scripts/store-catalog.mts validate
```

The first command creates `my-new-design.design.json` with a generated permanent ID, draft visibility, a placeholder image, and no song, artist, or character requirement. It checks the entire proposed catalog before writing and refuses to overwrite existing files. A duplicate slug or a broken existing entry blocks creation until it is fixed.

Edit the generated file to add the description and approved artwork. Keep the generated `id` even if the title or slug changes. Increment `artworkRevision` when replacing the artwork. A changed slug will need redirect handling when public URLs are introduced; keep published slugs stable until that exists.

Validation reports the filename and field path. For example, a missing design reference is reported at `my-product.product.json:designIds.0`. Fix the named entry and run validation again. Unsupported schema versions, unknown fields, duplicate IDs or slugs, invalid references, and public entries referring to drafts are rejected.

`visibility: "draft"` keeps an entry out of the storefront's public projection. Change it to `"public"` when its copy and all referenced entries are approved for display. This repository is public: **draft visibility does not make a file private**. Keep original artwork masters, private notes, credentials, and unapproved source material outside this repository.

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
  "schemaVersion": 1,
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

## Add optional context or a collection

For a song, realm, artist, character, or appearance, create a context entry. `contextType` selects one of those five kinds:

```json
{
  "schemaVersion": 1,
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
  "schemaVersion": 1,
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

## Schema changes

`packages/schemas/src/store.ts` is the authoritative contract, with TypeScript types derived from it. Both the authoring CLI and storefront adapter use it. Do not create a second hand-maintained model in a component.

This is the first version: `schemaVersion: 1`. Unknown versions fail validation. There is no earlier production catalog to migrate, and this checkpoint does not pretend otherwise.

For a compatible addition, add an optional field or a defined default, then prove existing version 1 fixtures still parse. A breaking change needs a new version, an explicit migration, and tests showing that permanent IDs, references, visibility, and purchase restrictions survive. Keep the old fixture as evidence. Rollbacks must restore compatible schema code and catalog data together. Avoid changing schema versions automatically just to make a validation error disappear.

The mock storefront consumes this catalog automatically at `/store`, with design, product, and collection detail pages. Follow [the next-design session](next-design-session.md) to preview one approved image. Provider onboarding, purchases, and publication remain separate steps.
