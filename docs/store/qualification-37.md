# Storefront qualification — #37 local completion pass

Date: 2026-10-19 UTC. Alan authorized merging #82 and continuing #37 toward
completion. #82 merged at `6841b3a9ab20d3be68162da69500bdd7f2ba1ef7`.
This subsequent work is in [draft PR #83](https://github.com/egohygiene/egohygiene.io/pull/83),
branch `test/store-qualification-37`; it has not been authorized for merge.

Tested implementation: `5e148843998a44ce7c7923c0fd27cf944dce5187`, tree
`01bfbe2568bfab4470e7f967b0e4e5128107f373`. The published tree exactly matched
local source, and the complete profile started with a clean checkout. The
following evidence/continuity update changes no runtime or test implementation.

## Delivered

`node scripts/qualify-store.mjs` runs one explicit website/store qualification
profile. Normal and isolated preview builds are mandatory sequential prerequisites;
a failed step stops the profile. Browser servers cannot reuse stale servers.
The normal build explicitly disables the ambient preview flag. Existing catalog,
unit, Fourthwall, artist, intercepted-handoff and expanded/RTL work is reused.
No framework, package, dependency or schema was replaced.

The profile adds a browser TypeScript configuration, activates existing shell
journeys, verifies client-rendered metadata through direct/reloaded/SPA/history
routes, and checks selected computed contrast, focus, forced colors, layout and
motion behavior. Existing homepage copy was already current; the shell tests
were previously outside the storefront browser profile.

The concrete UI changes are in shared CSS: replace shadow-only focus with a
3px foreground outline, keep badge labels readable using foreground text while
retaining their colored borders, and explicitly remove shared button/spinner
motion under reduced-motion preferences. The website's ecosystem status badges,
shell controls and store surfaces are covered. Docs/playground consumers were
not newly qualified; wider #49/#70 work remains open.

The artifact checker hashes every emitted regular file, resolves selected literal
HTML/CSS/JS and manifest asset references, checks public-image identity, rejects
source maps/environment/private-master paths, and scans selected text formats for
fixture and common credential patterns. Diagnostics omit matched credential
values. Six fixtures prove useful failure paths, including missing assets,
secret-shaped strings and an over-budget bundle split into multiple chunks.
This is a targeted check, not a comprehensive security or binary metadata audit.

## Fresh local evidence

[Profile commands and timings](reviews/qualification-37/checks.json) ·
[browser cases and measured samples](reviews/qualification-37/browser.json) ·
[artifact inventory](reviews/qualification-37/production-artifact.json) ·
[file hashes](reviews/qualification-37/manifest.json).

| Check | Result |
| --- | --- |
| Catalog, provider, public-build and artifact contracts | 79 pass |
| Store/preview/theme/locale units | 92 pass across 13 files |
| Website semantic component checks | 3 pass |
| App, catalog/tooling, portable-domain and selected browser types | All four profiles pass |
| Portable import boundary | 12 modules pass |
| Fresh normal and isolated preview builds | Pass |
| Production website browser cases | 70 pass, no retries |
| Isolated Fourthwall/artist browser cases | 6 pass, no retries |
| Intercepted checkout boundary and keyboard/touch journeys | Pass |
| Expanded/synthetic RTL layout, regional interaction and motion cases | 35 pass |
| Normal artifact check | 16 files, 12 local references, zero findings |
| Scoped Biome | 13 files pass; two existing-style environment warnings and two bracket-key suggestions remain in the browser config |
| Evidence/docs | JSON, manifest paths, hashes, relative links and diff validated |

All 13 steps of the combined profile passed on the published implementation.
Runtime: Node 24.21.0, pnpm 11.28.5, Playwright 1.62.1 and Chrome for Testing
155.0.8059.84. The existing verified browser executable was reused. No dependency
installation, browser acquisition, paid service or remote workflow dispatch was
required for this pass. The [earlier handoff receipt](checkout-handoff-37a.md)
retains browser acquisition details.

Selected computed samples span light/dark/high-contrast themes: 69 text samples
have a minimum ratio of 5.934; nine focused-control samples have a minimum ratio
of 7.533. Assertions use the unrounded values and thresholds of 4.5 and 3,
respectively. The color helper resolves flat composed backgrounds and fails
rather than guessing about gradients or opacity. This is selected surface
coverage, not an all-page contrast audit. References:
[W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

The 23 viewport cases consume #70's eleven reference sizes from 320×568 through
2560×1440, plus widths immediately around actual 360/368/620/640/896/900px
breakpoints. Representative route pairings avoid multiplying every combination.
Existing native keyboard, phone/tablet touch and modal journeys remain active.
Separate probes use a 32px root font and a 320×256 CSS-pixel viewport; they are
**CSS text/reflow approximations, not native text-only preferences or native
400% browser zoom**. Native zoom, real screen readers, Firefox/WebKit and physical
Safari/iOS/Android remain untested. See W3C's
[reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and
[text resizing](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) guidance.

The existing synthetic host now proves result counts, search, empty-state reload,
canonical product links and focus restoration in English and explicit synthetic
`ar-u-nu-arab` formatting. The initial preflight assumption that bare `ar` always
uses Arabic-Indic digits was wrong in this browser; the test fixture now requests
that numbering system explicitly. Production locale behavior is unchanged.
This proves existing component formatting, not a public Arabic translation,
locale switcher, source-language fallback or translated catalog contract.

## Visual review and preservation

Retained captures include [text enlargement](reviews/qualification-37/root-text-200-percent.png),
[short-viewport reflow](reviews/qualification-37/400-percent-equivalent-reflow.png),
[expanded tablet collection](reviews/qualification-37/layout/expanded-incompris-tablet.jpg)
and [synthetic RTL artist](reviews/qualification-37/layout/rtl-artist-phone.jpg).
Those four were inspected. Labels, status explanations, search and modal-close
controls remain available; narrow two-column wrapping under root enlargement is
visible and not presented as polished native zoom behavior. Full-page modal
captures show the fixed modal over the viewport and inert document below it.
No image manipulation or pixel-baseline approval is claimed.

The [layout report](reviews/qualification-37/layout/captures.json) contains all
35 cases and four raw capture hashes. Fresh [handoff baseline](reviews/qualification-37/handoff/baseline.json)
and [journey report](reviews/qualification-37/handoff/journeys.json) retain their
own captures. Existing #54 gallery order, #55 publication isolation and #62
image-failure/curated browsing cases run without rebuilding those features.

Nine provider placeholders remain disabled; real checkout routes remain empty.
Real `.play()` selections remain intentionally empty. Heartburst is an approved
public artwork preview, not an approved garment. Catalog, schemas, provider
configuration, public artwork, canonical identities and URLs are unchanged.
No actual provider, order, deployment, print or fulfillment proof is involved.

## Proposed performance limits

The scanner enforces provisional local regression ceilings, pending Alan's
review. They are aggregate limits so splitting chunks cannot evade them. JS/CSS
leave modest headroom above the recorded #37c baseline. These are neither an
already-agreed launch budget nor network timing/Core Web Vitals evidence.
Gzip uses level 9 per file, so it differs from Vite's displayed estimate.

| Group | Actual raw / gzip bytes | Proposed maximum raw / gzip bytes |
| --- | --- | --- |
| JavaScript | 434262 / 128572 | 500000 / 150000 |
| CSS | 49715 / 9728 | 60000 / 12000 |
| Images | 391855 / 387352 | 500000 / 500000 |
| Fonts | 46572 / 46531 | 60000 / 50000 |
| Documents | 4582 / 2489 | 20000 / 10000 |
| Entire output | 926986 / 574672 | 1140000 / 722000 |

## Acceptance mapping and remaining dependencies

| #37 requirement | Status after this PR |
| --- | --- |
| A: executable current contracts and negative purchase cases | Delivered; actual version migration remains dependent on #34 |
| B: browse/routes/states, intercepted handoff, keyboard/names/contrast/mobile/motion/images | Delivered as bounded local Chromium qualification |
| C: fresh artifacts, targeted leakage scan, client metadata, selected visual regressions | Delivered locally; proposed budgets still need review and deployed-host evidence is separate |
| Fixture-only checklist | Delivered by #82 and retained #62 image-failure checks; freshly rerun here |
| #70 matrix consumption | Reference/breakpoint samples and CSS resize/reflow delivered; native zoom, wider engines/devices/assistive technology remain unverified |
| #64/#65 locale contract consumption | Expanded/RTL and existing number-format behavior delivered; locale selection, source-language/translation fallback and localized catalog/offer journeys are not implemented upstream |
| #69 portable/component contracts | Existing consumer/unit and intercepted-handoff checks pass |

**#37 stays open.** Its explicit version migration and true locale/fallback
qualification cannot pass before the owning implementations exist. #34 calls for
a justified migration coordinated with ownership/catalog translations; inventing
a version bump just to make a checkbox green would not satisfy that requirement.
#64 owns the single locale/fallback contract; #65 consumes it for translated
catalog content and regional offers, coordinated with #34's one migration chain.

Next: review this complete local checkpoint and proposed budgets with Alan. To
finish #37 as written, sequence the missing #64 contract, #65/#34 coordinated
catalog/migration work and their resulting journey fixtures, then remaining
supported-environment checks. Actual deployed deep links/crawler metadata stay
with #22/#29 and real product/provider qualification with #38. No unrelated
framework migration or real commerce activation is implied. Existing #49/#52/
#70 scopes are not silently closed by this bounded contribution.

At the tested head, hosted [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917425),
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917449)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39217917918)
failed. The CI job passed installation, failed `format:check`, and skipped its
later validation/build/browser steps. Dependency review failed at its action;
its detailed cause and CodeQL's cause were not re-diagnosed. No gate was disabled
or workflow manually dispatched. Local passing evidence does not turn hosted
CI green or establish production qualification.
