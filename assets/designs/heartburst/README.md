# heartburst — first catalog artwork preview

The existing fuchsia ink-splatter heart is now a standalone design at `/store/designs/heartburst`. The working title and permanent ID `design-heartburst` come from the authoring pack; no song, collection or product is attached.

![heartburst display proof](../../../apps/egohygiene.io/public/store/heartburst/heartburst-light.webp)

## Files and ownership

| File | Purpose |
| --- | --- |
| `apps/egohygiene.io/src/content/store/entries/heartburst.design.json` | Version 1 catalog record; public display, artwork revision 1, empty `contextIds` |
| `apps/egohygiene.io/public/store/heartburst/heartburst-light.webp` | 1200 × 1200 web display proof, 141,978 bytes, opaque warm background |
| `assets/designs/heartburst/visual-dna.json` | Public summary of the design identity, palette, motifs, invariants and empty `songAssociations` |
| `assets/designs/heartburst/visual-dna.schema.json` | Snapshot of the authoring pack's version 1 JSON Schema |

The canonical layered PSD, transparent PNG/WebP masters, garment concept and private authoring notes remain in the private merch pack. The web image is a reduced light-background proof: its backdrop keeps black ink visible in every interface theme. It is not a transparent print export or a photograph of a manufactured product.

Visual DNA describes the **source composition**, including its transparent negative space. It remains `status: "review"` and `production.approved: false`; public display does not approve manufacturing. The public summary omits private Drive references and keeps the source revision for traceability. The schema's composition/provenance/production objects remain open-ended as in the source pack; this snapshot is not a new cross-repository schema authority.

Catalog JSON, artwork and visual DNA are framework-independent files. Visual DNA stays outside catalog discovery and is not imported into the client bundle. A future frontend can consume these files while replacing the React/Vite rendering adapter; see [#69](https://github.com/egohygiene/egohygiene.io/issues/69). Future localized text should keep this stable ID and follow #65.

## Provenance and export

Selected source: `previews/heartburst-light.jpg` from review pack v1, commit `cb06494d0fad80e5efc0aab3b1fc8cfcd9492b3c`. This is an AI-assisted raster remake, not an extraction of original working layers. No artwork was regenerated for this catalog addition.

| Check | Value |
| --- | --- |
| Source JPEG Git blob | `14695335d1a898994847ca27b33c7024366faf63` |
| Source JPEG SHA-256 | `0c4b65ffd77b1c14e31a4e56eb0d2c7642a325ea8df1db10a69f30ac3b4e9d9f` |
| Source JPEG dimensions | 1400 × 1400 |
| Source visual DNA Git blob | `4c897ec98169bd5e83f0136c6dae2b88fcdd3b51` |
| Source schema Git blob | `33f3761e8a96806b1e19ad1c381cd0452d29d563` |
| Display WebP SHA-256 | `a476be3c98db3a7ac9f1bbbe2c4ab4f0d23d603d8d569ccf6daa0a59e57e9550` |

After obtaining the source proof from the private authoring pack, run from the website repository root with ImageMagick 6.9.12-98:

```sh
convert "/path/to/heartburst-light.jpg" -colorspace sRGB -filter Lanczos -resize "1200x1200>" -strip -quality 86 -define webp:method=6 "apps/egohygiene.io/public/store/heartburst/heartburst-light.webp"
pnpm catalog:validate
pnpm build
```

The export resizes and encodes the existing proof without cropping or changing the artwork. Different WebP encoder versions can produce different bytes. Reuse the committed display file for builds; ImageMagick is not a runtime or build dependency.

## Review and next step

The maintainer requested this design for the first catalog previews on 2026-10-12. This addition exposes only the selected display derivative and public metadata through a reviewable branch. Existing fictional products remain labelled; no heartburst garment, price, provider offer or purchase route has been created.

Next choose the actual garment and placement, obtain its provider template, prepare the correctly sized production artwork and review the proof under #38. The 1400px source is review resolution, and adding pixels does not create production detail. Deployment remains separate.
