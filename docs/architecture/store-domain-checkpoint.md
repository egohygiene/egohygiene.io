# Store architecture checkpoint — 2026-10-13

Issue #69, based on website `main` at
`1c635ea2af5b254c8cd1200f479585fd941b2c33`. This is a draft implementation
checkpoint, not deployment or completion of all related UI/localization work.

## Implemented

- An app-owned portable store entry point: selectors, canonical paths, normalized
  synthetic offers and inert handoff rules. Selector order remains unchanged;
  three discarded `forEach` callback return values were made explicit for lint.
- A Fourthwall normalization adapter used by the existing preview page. Provider
  response fields stop at the adapter; canonical identity and preview eligibility
  belong to the domain.
- A Node consumer of the same entry point, with a disabled alternate provider
  fixture. Both remain fictional; no network, credentials or live routes added.
- A DOM-free TypeScript gate and a focused import-boundary check incorporated in
  existing commands. Existing package cycle/export checks are retained.
- Dependency/state ownership, token ADR, adapter ADR, runnable extension examples,
  schema/rollback guidance, framework migration checklist and contributor review
  guidance linked from the application-boundary document.

## Verification

Using Node `24.21.0`, pnpm `11.28.5` and the frozen existing lockfile:

| Check | Result |
| --- | --- |
| `pnpm typecheck` | Pass: app, catalog/tooling/tests and DOM-free store domain |
| `pnpm catalog:test` | 38 pass, including the new Node consumer and existing real build/dev projection tests |
| Focused store and Fourthwall unit tests | 23 pass; selector tests also rerun after the callback cleanup (5 pass) |
| `pnpm check` | Pass: workspace, exports, English locale population, package cycles, portable imports |
| Temporary negative probes, removed afterward | React import rejected by the boundary check; `document` rejected by the DOM-free compiler |
| Focused new-file Biome check | Pass; touched legacy feature lint has no errors and retains 9 warnings |
| Normal and isolated preview builds | Pass; catalog has 9 entries and one verified image file |
| Emitted fixture boundary | Normal output excludes the preview route and synthetic fixtures; alternate fixture is excluded from both builds |
| Local Markdown links / `git diff --check` | Pass |
| `pnpm test:store:preview` | Blocked before either browser journey ran; see limitation below |

The installed Playwright browser download failed. A separate Chrome for Testing
`155.0.8059.39` was downloaded, but this execution environment denies the local
socket creation required at browser startup (`process_singleton_posix.cc`,
`Operation not permitted`). Neither the 1440px nor 390px browser journey ran.
The React interaction test passes, but that is not a substitute for a completed
browser/visual review. Run the existing preview smoke in an environment where
Chromium can launch before marking the checkpoint fully reviewed. No browser
workaround, package update or launch-configuration change is committed.

Repository-wide formatting/lint/CI is not claimed from these focused checks.

## Bundle and dependencies

Same runtime, lockfile and Vite configuration before/after. Totals include all
emitted JavaScript or CSS chunks per build; gzip totals sum each file compressed
with Python `gzip.compress` at its default level 9 and `mtime=0`. These are byte
counts for this build, not measured download or rendering performance.

| Artifact | Before bytes | After bytes | Delta | Gzip before | Gzip after | Gzip delta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Normal JavaScript | 406,129 | 406,135 | +6 | 122,142 | 122,143 | +1 |
| Normal CSS | 31,352 | 31,352 | 0 | 6,707 | 6,707 | 0 |
| Preview JavaScript | 413,887 | 414,897 | +1,010 | 124,986 | 125,322 | +336 |
| Preview CSS | 35,870 | 35,870 | 0 | 7,951 | 7,951 | 0 |

No direct/runtime dependencies or lockfile entries changed. The check uses the
existing TypeScript dependency. Normal output tree-shakes the synthetic offer
code; the small preview increase is the explicit adapter/identity/capability
contract.

Retained: React/Vite/router, existing schema package, UI/theme/token packages,
public projection and approved live-purchase guards. Simplified: provider wire
fields no longer leak into selection controls; handoff eligibility is shared
instead of attached to one provider contract. Deferred: shared commerce package,
provider registry, general service container, global state, second framework and
remote offer loading without an actual qualified provider.

## Remaining review and separate implementation

Keep #69 open for review and the browser smoke. This checkpoint adds no shared
control requiring a new localization/responsive implementation. Existing store
copy, `en-US` formatting, locale selection/fallback/RTL and complete screen-size
coverage remain the work of #65/#70, with #64's visual/accessibility work.
Known catalog cover ordering remains #54. Real garments, variant authoring and
product media remain #34/#36; adoption and real checkout qualification remain
#61/#38. Publication (#18), Holon (#20), rendering/SEO (#22) and deployment do not
need to happen to review this boundary.

Revert this checkpoint's code and docs together to roll back. No persisted
schema/data migration, provider state change or hosted deployment is involved.
