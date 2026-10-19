# Checkout handoff regression closeout — #37 checkpoint 3

Status: all three checkpoints of the bounded intercepted-handoff slice are
complete for review in [draft PR #82](https://github.com/egohygiene/egohygiene.io/pull/82).
Branch: `test/checkout-handoff-37a`. Alan authorized this final checkpoint after
the keyboard/touch sync. Verification date: **2026-10-19 UTC** (October 18 in
America/New_York). #37 remains open; the PR remains draft and unmerged.

Tested commit: `89d33e49eca49530645042930df92373daf33a84`, tree
`4083c3b8e5a462e145d78383c547f010e93a83f8`. Runtime/harness implementation remains
`e90e9b65b54a7365b6668802d8a984ee392be837`; checkpoint 3 required no code fix.
This following change records evidence and continuity only. The earlier
[fixture boundary](checkout-handoff-37a.md) and [actual link journeys](checkout-handoff-37b.md)
remain the implementation receipts.

## Fresh local results

Node **24.21.0**, pnpm **11.28.5**, Playwright **1.62.1**, Chrome for Testing
**155.0.8059.84**; existing verified executable selected through
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Browser acquisition remains documented in
checkpoint 1. No dependency, lockfile or framework change was needed.

| Check | Result |
| --- | --- |
| Catalog/schema, purchase guards, public-build/dev boundary | 73 pass |
| Store, gallery, artwork-order, Fourthwall and artist fixture units | 55 pass across 10 files (53 + 2 focused runs) |
| App, catalog/tooling and DOM-free domain types | Pass |
| Portable imports | 12 source modules pass |
| Normal build | 10 catalog records, one verified public artwork image, 177 modules |
| Existing production browser journeys | 31 pass, zero retries; 26.7 seconds |
| Existing isolated Fourthwall/artist browser journeys | 6 pass, zero retries; 18.7 seconds; fresh 184-module preview build |
| Handoff boundary and actual-link journeys | Three states and four denied probes pass; both keyboard/touch journeys pass with exact destination counts and no unexpected requests or page errors |
| Normal-artifact isolation | 16 files hashed, eight text files scanned, 10 excluded markers absent, three public controls present |
| Scoped source/config formatting and diff | Seven files pass Biome; whitespace checks pass |

The [check inventory](reviews/checkout-handoff-37c/checks.json) records commands,
counts, environment, selected captures and remaining limits. Fresh
[boundary](reviews/checkout-handoff-37c/baseline.json) and
[journey](reviews/checkout-handoff-37c/journeys.json) reports pin this tested commit.
The new handoff captures are byte-identical to checkpoint 2's retained PNGs;
those exact files/hashes are referenced rather than duplicated.

## Artifact and visual review

The [production manifest](reviews/checkout-handoff-37c/production-artifact.json)
records every emitted file's bytes/SHA-256 and the exact scan scope. No handoff
fixture ID/label/provider-shaped URL or destination HTML, Fourthwall/artist
preview route or qualification marker appears in normal output. Positive
Heartburst and public product controls verify that the real catalog is present.
The emitted Heartburst image exactly matches its public derivative. All nine
provider entries stay disabled and the real checkout-route list stays empty.

Normal JS is **434,262 bytes** (Vite gzip 130.03 kB), CSS **49,505 bytes**
(gzip 9.79 kB). The isolated preview's main JS is 437.57 kB (gzip 130.95 kB),
plus its existing lazy Fourthwall/artist chunks. These are measurements, not a
new performance budget or proof of deployed performance.

Fresh desktop/mobile catalog, artwork-viewer and Fourthwall preview captures
were inspected. Text, preview labels, image presentation and modal controls fit
the reviewed layouts. Retained examples: [Heartburst mobile](reviews/checkout-handoff-37c/heartburst-mobile.png)
and [inert Fourthwall mobile](reviews/checkout-handoff-37c/fourthwall-preview-mobile.png).
Their exact hashes are in the check inventory; other inspected capture hashes
and reproducible ignored output paths remain in the production manifest and
check inventory.
Heartburst is artwork only, with no connected real garment; Fourthwall remains
a fictional local tryout. No fresh visual defect or functional regression was
found in this selected set. Independent source/evidence review found no blocker.

## Repeat the checks

From the repository root after the pinned setup and browser installation:

```sh
node scripts/store-environment.mjs run typecheck
node --test tests/store/*.test.ts
node scripts/store-environment.mjs run test:unit apps/egohygiene.io/src/features/store apps/egohygiene.io/src/features/fourthwall-preview
node scripts/store-environment.mjs run test:unit apps/egohygiene.io/src/features/artist-preview/fixture.test.ts
node scripts/checks/check-store-boundaries.ts
node scripts/store-environment.mjs run build
node scripts/store-environment.mjs run test:store
node scripts/store-environment.mjs build
node scripts/store-environment.mjs run test:store:preview
node tests/checkout-handoff/run.mts --output-dir test-results/checkout-handoff/checkpoint-3
```

For the exact reviewed build, repeat the manifest/marker verification below.
Changed source or toolchain may legitimately produce different file hashes;
update the evidence through review instead of treating an old manifest as current.

```sh
python - <<'PY'
import hashlib
import json
from pathlib import Path

receipt = json.loads(Path("docs/store/reviews/checkout-handoff-37c/production-artifact.json").read_text())
artifact = Path(receipt["artifactRoot"])
files = sorted(path for path in artifact.rglob("*") if path.is_file())
suffixes = {".html", ".js", ".mjs", ".cjs", ".json", ".map", ".css", ".txt", ".webmanifest"}
texts = {path.relative_to(artifact).as_posix(): path.read_text() for path in files if path.suffix in suffixes or path.name == "CNAME"}
assert list(texts) == receipt["scan"]["scannedTextFiles"]
for check in receipt["scan"]["markerChecks"]:
    marker = check["marker"]
    assert marker in Path(check["source"]).read_text(), check["label"]
    assert not any(marker in text for text in texts.values()), check["label"]
    assert not any(marker in path.relative_to(artifact).as_posix() for path in files), check["label"]
for control in receipt["scan"]["positiveControls"]:
    assert any(control["marker"] in text for text in texts.values()), control["marker"]
actual = [{"path": path.relative_to(artifact).as_posix(), "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()} for path in files]
assert actual == receipt["files"]
assert (artifact / "store/heartburst/heartburst-light.webp").read_bytes() == Path("apps/egohygiene.io/public/store/heartburst/heartburst-light.webp").read_bytes()
assert json.loads(Path("apps/egohygiene.io/src/content/store/checkout-routes.json").read_text()) == []
assert all(provider["enabled"] is False for provider in json.loads(Path("apps/egohygiene.io/src/content/store/providers.json").read_text())["providers"])
print(f"Verified {len(files)} artifact files, {len(texts)} text files, and {len(receipt['scan']['markerChecks'])} absent fixture markers.")
PY
```

## Remaining work and delivery boundary

The bounded local testing slice is complete. No defect was found in its selected
checks and no runtime application/schema/catalog/provider change was required.
Normal and preview browser regressions include existing failed-image fallback,
canonical browsing, history, themes and non-purchase guards; the #62 storefront
was reused. The synthetic expanded-copy/RTL/locale matrix was not rerun.

At the tested commit, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489271),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489275)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39177489490)
all reported failure. Local passes do not make those hosted gates green. No
manual workflow dispatch, setting change, gate override, payment or hosting
activation occurred.

Broader #37 remains open for its existing qualification gaps: deployed-host
routes/metadata, agreed performance budgets, wider accessibility/browser/device
and locale matrices, and schema migration cases when a real migration exists.
This marker scan is not a general secret audit. Browser interception does not
qualify HTTP cache/BFCache behavior. Real-provider checkout, variants, current
pricing/shipping/tax/returns, orders, fulfillment and print approval remain
separate work; no actual provider was contacted by these tests.

Next: sync with Alan on the complete draft, then merge only when instructed.
#38's real-product readiness preparation remains the proposed next issue; it
has not started, and a separate readiness record is still proposed rather than
an implemented guard. No purchase or deployment is authorized by these results.
