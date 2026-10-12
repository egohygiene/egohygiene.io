# Add a design preview

**heartburst** is the first artwork preview at `/store/designs/heartburst`. Its [asset notes](../../assets/designs/heartburst/README.md) record the selected proof, visual DNA and production status.

Use this workflow for the next design. No catalog brain dump is needed, and the design does not need a song, collection, or character association.

1. **Choose one design and a display image.** Use a web-sized PNG, JPG/JPEG, WebP, or AVIF derivative you approve for public sharing. Keep original masters and private notes elsewhere: this repository is public, including files marked `draft`.

2. **Create its draft entry.** From the repository root:

   ```sh
   pnpm catalog:add-design --slug "my-first-design" --title "My First Design"
   ```

   Edit the generated `apps/egohygiene.io/src/content/store/entries/my-first-design.design.json`. Keep its generated permanent `id`, `schemaVersion: 1`, and `visibility: "draft"`. Add a short description. Leave `contextIds: []` for a standalone design.

3. **Attach the display image.** Put the approved derivative at `apps/egohygiene.io/public/store/my-first-design.webp` (create the directory if needed). Replace the entry's placeholder `artwork` and increment `artworkRevision` from `1` to `2`:

   ```json
   {
     "artworkRevision": 2,
     "artwork": {
       "kind": "image",
       "src": "/store/my-first-design.webp",
       "alt": "A concise description of the visible design"
     }
   }
   ```

   These are fields to update in the existing entry, not a replacement for the whole file. Match the actual filename and extension; use lowercase filenames. Run `pnpm catalog:validate`.

4. **Review, then show it locally.** Once you approve the image and copy for public display, change `visibility` to `"public"`, validate again, and run `pnpm dev`. Open `/store/designs/my-first-design` on the local address printed by Vite. Check the image, title, description, and mobile layout. Draft entries are intentionally absent from these pages; changing visibility does not itself deploy the website.

5. **Optionally add one mock product.** Use the [product template](catalog-authoring.md#attach-a-product-when-ready), reference the design's permanent ID, and keep `purchase: { "state": "preview" }`. Approve its copy before making it public. No price, provider, or checkout link is needed to see the concept alongside the design.

This session is complete when the design looks right locally and validation passes. Default validation checks image path format, file existence, regular-file type, and containment in the public directory. Visually confirm that the image decodes and looks right; these checks do not assess its dimensions or print quality. Commit only the approved derivative and catalog changes through the normal review process.

## Providers come later

[Provider notes](providers.md) explain the separate roles: Fourthwall and Printify Pop-Up are physical-product hosted-store candidates; Lulu's hosted checkout is a future comic candidate. Other Printify/Lulu integrations handle fulfillment with different funding arrangements. Stripe and Square process payments; Plaid links bank accounts; Contrado remains a custom-product research option. Their current records are disabled placeholders.

This first design preview requires no account onboarding or purchases. A working customer-funded product is [issue #38](https://github.com/egohygiene/egohygiene.io/issues/38); publication and the SoundCloud entry point are [issue #39](https://github.com/egohygiene/egohygiene.io/issues/39). Those live-launch checkpoints remain separate from seeing your artwork in the store.
