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
are not the organization mark. Browser files will be derived from the pinned
local source without runtime requests to GitHub.

The upstream avatar URL is mutable; the consumed Relay revision and checksum
are immutable. The original framing, geometry, colors and transparency are
preserved. A 512 × 512 browser export resamples the 460 × 460 source and must
not be described as a higher-detail master.

## Checkpoints

- A: approved source discovery and byte pin complete.
- B: browser derivatives and application head/manifest wiring pending.
- C: built-application and browser verification pending.

No deployment, service worker, offline-commerce behavior or installation claim
is part of this repair. Playground exposure policy remains owned by #25.
