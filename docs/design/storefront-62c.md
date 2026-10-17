# Storefront checkpoint C — Journey verification and content workflow

This completes the third checkpoint of
[#62](https://github.com/egohygiene/egohygiene.io/issues/62) in
[draft PR #78](https://github.com/egohygiene/egohygiene.io/pull/78), on the existing
`feat/storefront-checkpoint-62a` branch. The maintainer authorized the last
checkpoint after B. Return for a sync before merging, deploying or expanding
scope. Verified implementation: `1e784ee9a0afdc228457e63714becd69a94b97c7`.
GitHub comparison confirmed all 23 changed file hashes match the reviewed source,
documentation and captures. This following receipt changes documentation only.

## Result to review

The A/B hierarchy remains Ego Hygiene → featured Incompris → artist, with
standalone and song collection views over canonical records. Real `.play()`
selections stay empty; heartburst remains an Incompris design proof without an
artist/song assignment or garment. The public catalog still has 10 records,
eight browsable entries and three fictional non-purchasable products.

C adds focused regression coverage and the
[content-addition workflow](../store/storefront-content-workflow.md). It explains
how to publish an approved design or garment preview, place an Ego Hygiene item,
curate Incompris, add an artist, and connect a song collection while preserving
one product identity and stable shareable URLs. It links the existing schemas
and templates rather than introducing another content format.

## Coverage and evidence

| Concern | Evidence |
| --- | --- |
| Direct links and selected identity | Existing canonical detail tests plus new filtered catalog/product and artist/song Back/Forward cases |
| Empty song collection | New detail-page unit fixture proves empty copy, no unrelated products and usable catalog/store links |
| Artist return navigation | New unit journey follows a shared collection back to either curated artist's song view, retaining one product URL |
| Failed artwork | Browser request abort proves usable card/detail/viewer fallback, closing and focus restoration |
| Unknown pages and preview isolation | Existing missing slug checks plus normal-build rejection of nested unknown and local preview routes |
| Phone/tablet touch | Emulated 390px populated song journey and 820px shop → artist → catalog → product → gallery journey |
| Purchase state | Preview/unavailable browser coverage plus synthetic live UI fixture proving exact reviewed href and provider price disclosure; missing approval throws before an action is rendered |
| Long text and RTL | Test-only host composes the real shop/Incompris/artist components with longer fictional catalog copy and existing synthetic locale messages |

The synthetic live unit fixture only compares markup in JSDOM. It does not visit
a provider, create a checkout route in public content, validate a real offer or
place an order. Existing schema tests retain the broader route, variant,
artwork-revision and public-projection guards.

Local verification on 2026-10-17 passes:

| Check | Result |
| --- | --- |
| `pnpm typecheck` | App, Node catalog and portable domain pass |
| `pnpm catalog:test` | 55 pass, including public projection and live eligibility guards |
| Focused unit command below | 46 pass across eight files, including six new detail-page cases |
| Normal build | 177 modules; JS 434.00 kB / gzip 129.95 kB; CSS 49.50 kB / gzip 9.79 kB |
| Isolated preview build | 184 modules; main JS 437.32 kB / gzip 130.88 kB |
| Production browser suite | All 31 pass, including four new journey cases |
| Isolated preview browser suite | All six pass, including a new phone-touch case and extended Forward navigation |
| Layout qualification | All 32 pass: four views × four widths × expanded/synthetic RTL text; eight featured-row keyboard/focus checks included |
| Portable import boundary | 12 modules pass |
| Build isolation | Qualification host/live-test markers absent from both outputs; additional artist preview route/ID absent from normal output |
| Authoring walkthrough | Current catalog validates; generator example produces a valid draft in a temporary catalog; file links and anchors resolve |
| Scoped formatting / whitespace | Pass; existing Vite/module/config warnings remain visible |
| Independent review | No substantive source, documentation, fixture-boundary or capture findings |

No application source changes were needed. C adds tests, the qualification
runner, authoring guidance and evidence over the existing A/B implementation.

### Rendered layout evidence

All captures are labelled **LOCAL TEST ONLY** and were visually inspected.
The [capture manifest](storefront-62c/captures.json) records the source/fixture
provenance, all 32 results, actual browser version, route, dimensions, SHA-256
and empty page/image error lists. Four JPEGs total 1,177,327 bytes; quality 82,
full page, no image manipulation.

| Synthetic scenario | Capture |
| --- | --- |
| Expanded main shop with populated featured row | [1440px desktop](storefront-62c/expanded-shop-desktop.jpg) |
| Expanded Incompris collection | [820px tablet](storefront-62c/expanded-incompris-tablet.jpg) |
| RTL artist standalone view | [390px phone](storefront-62c/rtl-artist-phone.jpg) |
| RTL artist song view | [320px small phone](storefront-62c/rtl-songs-small-phone.jpg) |

These use Chromium **138.0.7204.0**, recovered as a temporary external validation
binary after the earlier browser was removed by workspace maintenance and the
pinned Playwright download returned an invalid archive. This is distinct from
B's Chromium 153 evidence; no repository dependency or lockfile was changed.
The production captures in [A](storefront-62a.md) and [B](storefront-62b.md) retain
their historical provenance. C's added captures stress layouts using fixtures.

## Repeat the checks

Use Node 24.21.0 and pnpm 11.28.5. For normal and isolated preview browsing, follow
the [content workflow](../store/storefront-content-workflow.md#validate-and-review-the-addition)
or [local setup](../store/local-preview.md). The main review routes are `/store`,
`/store/incompris`, `/store/incompris/artists/play` and its `?view=songs` view.
The fictional populated example remains `/store/preview/artists/demo-artist`
in `dist-preview` only.

```sh
pnpm typecheck
pnpm catalog:test
pnpm test:unit apps/egohygiene.io/src/features/store apps/egohygiene.io/src/features/artist-preview/fixture.test.ts apps/egohygiene.io/src/pages/HomePage.test.tsx
pnpm build
pnpm test:store
node scripts/store-environment.mjs build
pnpm test:store:preview
node tests/storefront-qualification/run.mjs
```

Browser commands require a usable Playwright Chromium installation. An existing
compatible binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
The qualification runner starts and stops its own loopback Vite server, uses a
test-only document entry, and writes disposable evidence under
`test-results/storefront-qualification`. It never edits the public catalog,
registers a production route, or adds a supported language. Its screenshots must
be described as synthetic layout evidence, not production screenshots.
Optional `--port` and `--output-dir` arguments select the loopback port and
evidence directory. Retain dated review captures instead of overwriting them
when checking later changes.

## Remaining limits and next step

These checks cover Chromium and emulated viewports/touch. They do not certify
physical phones/tablets, Safari/Firefox, assistive technology, every zoom mode,
translated catalog content or production hosting. Broader qualification stays
in #37/#49/#64/#65/#70; artwork order remains #54. Product option/checkout work
remains #36/#61 and live provider qualification #38.

Hosted CI was already failing on the starting B head. No gate was disabled or
setting changed; local evidence does not turn those checks green. No dependency,
lockfile, public artwork, catalog assignment or provider activation changed.

**Next:** review the complete A/B/C checkpoint with Alan, then choose merge and
the next bounded work explicitly. The browse structure is ready for approved
content additions; a real purchasable garment remains a separate milestone.
