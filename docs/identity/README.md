# Browser identity assets

Issue [#58](https://github.com/egohygiene/egohygiene.io/issues/58) consumes the
existing Ego Hygiene organization mark. The cyan-to-magenta yin-yang artwork
is already used for organization navigation and favicons through merged
[Relay #142](https://github.com/egohygiene/relay/pull/142).

## Source and permitted use

The exact 460 × 460 transparent PNG is vendored at
[`assets/identity/source/egohygiene.png`](../../assets/identity/source/egohygiene.png).
[Provenance](../../assets/identity/source/provenance.json) pins Relay commit
`f19b65b3f8bd8466884dee5529fa77f2430440b6`, the Git blob and SHA-256 digest,
the dated organization-avatar capture, and the existing approval evidence.
The upstream notice is retained in
[`assets/identity/NOTICE.txt`](../../assets/identity/NOTICE.txt).

This is bounded first-party reuse on the website, docs and playground. It does
not approve a redesign, merchandise application, new brand system or third-party
trademark use. The Identity product's own emblem and generated Storybook assets
are not the organization mark. Browser files are derived from the pinned
local source without runtime requests to GitHub.

The upstream avatar URL is mutable; the consumed Relay revision and checksum
are immutable. The original framing, geometry, colors and transparency are
preserved. A 512 × 512 browser export resamples the 460 × 460 source and must
not be described as a higher-detail master.

## Browser exports

All three applications carry identical, self-contained copies. The notice
ships with each set at `icons/NOTICE.txt`.

| Public file | Size | Use |
| --- | --- | --- |
| `favicon.ico` | 16, 32 and 48 px | Multi-size browser fallback |
| `favicon.png` | 32 px | Explicit PNG tab icon |
| `icons/apple-touch-icon.png` | 180 px | Touch/bookmark icon |
| `icons/icon-192x192.png` | 192 px | Web manifest icon |
| `icons/icon-512x512.png` | 512 px | Web manifest icon |

The empty website/docs SVGs and playground placeholder are removed. A raster
source is not disguised as a new vector master. Each HTML head uses Vite's
`%BASE_URL%`, so a nested page still requests the app-root icons. Each manifest
uses relative icon paths, `id`, `start_url` and `scope`; names distinguish the
website, docs and playground. `display: browser` and `purpose: any` avoid
asserting standalone-app or maskable-artwork behavior.

## Regeneration

Normal builds require no renderer or network access for these assets. To
deliberately regenerate the committed exports from the pinned local source:

```bash
node scripts/generate-identity-icons.mjs
git diff --check
```

The authoring utility requires ImageMagick (`magick` or `convert`), verifies
the source digest before any write, renders into a temporary directory, then
copies the complete set into all three apps. It retains transparency and the
original framing, uses Lanczos resampling, and strips export metadata.
[`assets/identity/exports.json`](../../assets/identity/exports.json) records
the renderer version, file dimensions/types and SHA-256 digests. The current
exports use ImageMagick 6.9.12-98 Q16. Different renderer versions may produce
different encoded bytes; review those changes and their visual output before
committing them. Normal application builds never regenerate icons.

To change the source, review its identity, revision, permitted use and exact
bytes together. Update the source, provenance, notice and exports as one
reviewed change. Do not fetch the mutable avatar URL during a build.

## Checkpoints

- A: approved source discovery and byte pin complete.
- B: browser derivatives and application head/manifest wiring complete.
- C: built-application and browser verification pending.

No deployment, service worker, offline-commerce behavior or installation claim
is part of this repair. Playground exposure policy remains owned by #25.
