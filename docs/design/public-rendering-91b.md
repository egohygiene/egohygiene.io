# Current-route public rendering — #91 checkpoint B

Implemented for review on 2026-10-23. [Draft #95](https://github.com/egohygiene/egohygiene.io/pull/95)
remains on `docs/public-rendering-91a`, targeting unmerged #94's
`docs/website-essentials-90a`. Source `3860d6062c8759a6bf522f6f50f74adff3266345`,
tree `c718864e270bacf0d1ea943e11face275f32de14`, parent
`487ae3b9fc7be10c81de26d3e2ec529418ea3fae`. The GitHub tree matched local staging;
the fetched source was clean. This receipt is a subsequent documentation checkpoint.

Alan asked to proceed after trying the local preview. That selects B under the
existing one-checkpoint agreement. Positive local visual feedback is not blanket
contact/copy approval or final accessibility/browser acceptance. #90 remains open.
Main stays `07d25941ceeefa53089afa025b612c6aa54f36c4`; no drafts were merged,
retargeted or newly integrated. #94 already includes #87/#93 ancestry; #73 remains
an independent draft. No deployment or commerce activation occurred.

## Delivered behavior

[ADR 0012](../architecture/decisions/0012-static-public-route-rendering.md) is now
implemented using the existing React/Vite Data Mode dependencies. The shared
route table imports no browser singleton. Fixed paths and their publication
metadata are declared together; catalog/artist paths reuse existing selectors.
The build cross-checks every published path against its expected route identity.
Known paths cannot silently fall through to missing-page UI.

The Node adapter captures one frozen, validated public catalog/curation module and
supplies that exact snapshot to both Vite builds. It builds the client assets and
a temporary bundled static renderer outside the output, then writes content into
the transformed client template. Temporary server files are removed. Failed normal
app-adapter rendering removes its incomplete `dist`; root `pnpm build` has an earlier
catalog preflight that can fail before this adapter starts, so failure is never
permission to reuse an older artifact.

Current output is **26 meaningful route documents, a noindex 404, ten sitemap
entries, updated basic llms.txt and a deterministic public-routes.json receipt**.
The [A inventory](public-rendering-91a.md) supplies the reviewed scope; the actual
[generated route receipt](reviews/public-rendering-91b/public-routes.json) derives
from code and the validated catalog, not from the A evidence file. Sixteen usable
pages are noindex,follow: provisional policies, reserved ecosystem gateways, the
generic preview catalog and fictional details. Explicit stable-ID dispositions
reject unknown/stale public catalog entries until reviewed. Purchase eligibility
and curated placement do not grant indexing approval.

Initial HTML and client navigation share title, description, canonical, robots and
Open Graph/social text. Query/hash state is excluded from canonical identity but
preserved in browser navigation. Only Heartburst's existing approved artwork image
is used; this is not a garment approval or a complete custom social-card rollout.
There is no invented Product/Offer structured data. Missing and error pages remove
misleading canonical/image identity, including the outer application error boundary.

Matching marked HTML hydrates with the same IDs and provider tree. The initial
snapshot is English, default controls and no filters; saved theme/language and URL
filters restore afterward. The pre-paint theme script remains. Saved preference
values are not overwritten by defaults. Legacy catalog forwarding waits until
hydration. Empty dev/preview shells and mismatched host fallback documents use a
fresh client render. No generic hydration-warning suppression was introduced.

Build failures cover malformed/colliding routes, missing metadata, copied discovery
collisions, render exceptions and unresolved Suspense. Async route/loader additions
require a deliberate contract revision. No dependency, schema, catalog, artwork,
readiness, provider or public-language activation changed. The isolated Fourthwall
and artist preview stays a separate `dist-preview` SPA and retains its fixtures.

## Local evidence

Exact commands, scope and result are in
[verification.json](reviews/public-rendering-91b/verification.json). Runtime:
Node 24.21.0 / pnpm 11.28.5, recovered with the official Node checksum and a frozen,
ignore-scripts install. No dependency upgrade or lockfile change was needed.

| Check | Result |
| --- | --- |
| App, Node tooling, portable-domain and browser type profiles | Pass |
| Workspace/exports, locale inventory, cycles and portable boundary | Pass; 433 English messages, ten namespaces, 16 portable modules |
| Catalog/public-projection/build-output suite | 144 tests pass |
| Focused app/store/metadata/theme/locale suite | 158 tests in 20 files pass; includes 20 real app SSR/DOM cases |
| Clean published-source normal build, repeated | Pass twice; all 44 files byte-identical |
| Isolated preview build | Pass; preview chunks retained, normal generation outputs absent |
| Raw HTML/sitemap inspection | All 26 page hashes, main/H1/title, canonical/social/robots/path marker agree; ten sitemap URLs; noindex 404 has no canonical |
| Existing production artifact qualification | **Fails with three size-budget findings**, detailed below |
| Independent source review and diff whitespace | Pass after fixes; no remaining implementation blocker identified |

[Raw inspection](reviews/public-rendering-91b/raw-inspection.json) parses HTML and
XML without executing JavaScript or loading resources. It is not an HTTP response,
Chromium, visual/layout or assistive-technology test. Unit hydration uses a simulated
DOM. No Chromium journeys ran. Browser/direct-reload and host status/MIME/redirect
acceptance remain explicit C/#57/#37/#89 work.

The [existing artifact report](reviews/public-rendering-91b/production-artifact.json)
scanned 44 files and resolved 202 asset references. All three findings concern the
old aggregate size ceilings; targeted private/fixture/credential and asset-reference
checks found no additional findings, and the public artwork bytes match source.
These targeted checks are not a comprehensive secret or binary-metadata audit.

| Aggregate measurement | Measured | Existing ceiling |
| --- | ---: | ---: |
| All documents, uncompressed | 317,310 bytes | 20,000 bytes |
| All documents, separately gzipped | 85,496 bytes | 10,000 bytes |
| All artifact files, uncompressed | 1,286,833 bytes | 1,140,000 bytes |

JavaScript, CSS, images, fonts and total gzip measurements remain within their
provisional ceilings. These are sums across the complete artifact, including all
27 HTML documents, not one page's transfer size or measured user performance.
No budget was raised or gate disabled. Reconcile the multi-document model and
measured per-route cost in C/final #37 with #52/#92 as needed; the full qualification
profile is not green while these findings remain.

Source hosted runs all failed:
[CI 39947201969](https://github.com/egohygiene/egohygiene.io/actions/runs/39947201969),
[dependency review 39947201941](https://github.com/egohygiene/egohygiene.io/actions/runs/39947201941),
[CodeQL 39947202162](https://github.com/egohygiene/egohygiene.io/actions/runs/39947202162).
No new hosted failure diagnosis, manual dispatch or gate change. Local passes do
not qualify hosted CI, deployment, real checkout or production accessibility.

## Next checkpoint

Sync on B, then select **#91 C**: review the fresh output/journeys and explicit
publication/size disposition, retaining browser journeys for Alan's final Mac pass.
The necessary B raw-output checks do not automatically complete C. Local Caddy
status/MIME/fallback work stays #57; actual deployed redirects/canonical-origin
and deep links stay #89/#39. A 404.html file alone does not produce HTTP 404.

#90 still needs contact/copy disposition and deferred browser/manual acceptance.
After #91, the approved #88 order continues with #60 ecosystem links, then #50
shared content, the remaining setup fixes and the final engineering pass. No issue
is closed by this receipt. No purchasing, paid order, provider call or spending.
