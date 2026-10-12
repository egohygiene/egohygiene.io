# Issue #58 verification

Verified locally on 2026-10-12 from base
`a349cb39e93a1598d7c079939f56dbdf31c912e2`, with the changes in
[PR #68](https://github.com/egohygiene/egohygiene.io/pull/68).

Environment: Node 24.21.0, pnpm 11.28.5, Vite 8.2.0, Playwright 1.62.1,
Chromium 153.0.8010.0, ImageMagick 6.9.12-98 Q16. No dependency or lockfile
changes are required by this repair. The local browser was supplied separately
from the application dependency graph.

## Build and asset checks

All three production builds passed:

```bash
pnpm build
pnpm --filter @egohygiene/docs build
pnpm --filter @egohygiene/playground build
```

After the final padding adjustment, all three were rebuilt together with:

```bash
pnpm --recursive --filter @egohygiene/egohygiene.io --filter @egohygiene/docs --filter @egohygiene/playground run build
```

- All 15 committed icon files and all 15 built copies decoded successfully.
- PNG dimensions match the head/manifest declarations: 32, 180, 192 and 512 px.
- Each ICO contains decodable 16, 32 and 48 px frames.
- Every output hash matches `assets/identity/exports.json`; all three apps
  receive identical icon bytes and retain the upstream notice.
- No removed SVG placeholder remains in the built applications.
- Regeneration produced identical bytes for every export, notice and export
  record. PNG files contain only critical image chunks; timestamps do not
  make regeneration drift. The original source digest is unchanged.
- Biome check passed for the three edited HTML heads, the export utility and
  both JSON records. `git diff --check` passed.

## Built browser checks

The local smoke used each app's Vite production preview on loopback. It checked
these six routes in Chromium:

| App | Routes |
| --- | --- |
| Website | `/`, `/store`, `/store/products/does-not-exist` |
| Docs | `/`, `/getting-started` |
| Playground | `/` |

All six rendered an application heading with no page JavaScript errors and
kept their app title. On every route, the two favicon links, touch-icon link and
manifest link resolved to the app root. The product-not-found route also kept
the icons. Chromium parsed each manifest without errors; app names, relative
ID/start/scope, two icon entries, dimensions, MIME declarations, `browser`
display and `any` purpose matched the intended contract.

The browser decoded the images successfully. The 15 served assets returned
HTTP 200 with the appropriate PNG/ICO MIME types and exact export hashes.
The [review sheet](browser-icons.png) renders those actual built image files
at small icon and touch-icon sizes on light and dark surfaces. Visual review
identified the original avatar's excessive transparent margin; exports now
trim that margin and center the unchanged mark before resampling.

To repeat a manual check, build the desired app, run its `preview` script on
loopback, visit the routes above, and inspect the head links, manifest and
decoded image requests in browser developer tools. Compare served bytes with
the committed export digest record and inspect both light and dark surfaces.

## Bounds

This is headless Chromium evidence for head declarations, manifest parsing,
served bytes and image rendering. Native browser tab chrome, Safari/iOS
bookmark presentation, installed-app behavior and deployment were not tested.
The review sheet is not a screenshot of native browser chrome. No service
worker, maskable artwork claim or offline-store behavior was added.

No broad application test suite or full-repository lint gate was rerun for
this static-asset repair. The focused changed-file checks above do not imply
that existing repository-wide formatting, test-profile or dependency-review
configuration issues are resolved. No remote workflow was manually triggered
or rerun; automatic GitHub PR checks are separate evidence.
