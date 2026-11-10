# Actual browser and theme-transition closeout — #70 / #49

## A — Observed defect and bounded coverage, 2026-11-09

Input is [draft #130](https://github.com/egohygiene/egohygiene.io/pull/130),
`1720b9e50eef6cca4bd495b846d219c159d094e1`, after #129/#117 and the original
storefront stack. Current Chromium 151.0.7922.34 and native Storybook execute.
Alan authorized the overnight issue batch and next-day review.

The actual playground suite fails Secondary text in dark at 2.8633:1 and Primary
text in high contrast at 3.2458:1. A direct browser probe confirms the cause:
the button background transitions for 180 ms while text color changes immediately.
Immediately after light→dark, Secondary has near-white text on white; after
dark→high-contrast, Primary has black text on purple. Settled colors meet the
declared contracts, so existing source-token tests do not catch this interval.

Remove the background-color transition from shared buttons so foreground and
background theme changes are applied together. Retain purposeful hover transform
and existing reduced-motion behavior. Preserve the 4.5:1 browser assertion and
improve its diagnostic data; no color/token, brand or layout redesign is needed.

Execute the full existing browser qualifier after fresh prerequisites. Extend
the existing expanded/RTL fixture runner with wide and breakpoint-adjacent widths
through 2560 CSS px, preserving its no-remote/no-mutation host boundary. Add a
bounded twelve-case production-route sample for landing/ecosystem/store/collection/
artist/product/design surfaces, including the 640/896px breakpoint boundaries,
overflow, visible main heading and selected unedited captures. Reuse existing
keyboard/touch/gallery/theme/motion/forced-color/locale journeys.

Any new observed failure is repaired at its owning seam and rechecked. Record
browser/source/command/results and failures honestly. Chromium emulation, synthetic
text scaling and forced colors do not establish real devices, native zoom,
assistive technology, Safari/iOS or Mac/Apple Silicon acceptance. Those remain in
#115; creative associations/pages remain #116 and real publication remains #31.

## B — Observed failures repaired

Source checkpoints `229e949` / `adb9a51` fix theme-switch contrast and enlarged
footer text; `d04dc61` repairs images that fail before hydration. The renderer
checks an already-complete image after mounting instead of depending only on a
later error event. Seven focused artwork tests cover both failed/successful
completed images, normal errors, changed sources and placeholder/hero identity.
The real missing-artwork journey now deliberately delays modules until the raw
image has failed, then verifies recovery and gallery/navigation behavior.

The 200% expanded-text probe identified a specific Accessibility footer link
extending a 390px document to 399px. Footer navigation and link widths are bounded
and long labels wrap; content and controls remain visible. All 99 expanded/RTL
layout cases subsequently pass, including the narrow enlarged-text case.

An existing hydration assertion used exact label-text matching even though the
native select's accessible role/name is correct. It now uses the Language
combobox role while retaining the same exact name/value and hydration identity
checks; the targeted actual journey passes.

At `d04dc61`, the complete browser qualifier passes application, production,
isolated preview, component and intercepted-checkout steps, then finds the test
host executing under two module URLs: `/@fs//…` and Vite's canonical `/@fs/…`.
That creates two mounted shells on locale history navigation. Source `e80ca51`
canonicalizes the test entry URL and adds an explicit single-shell invariant.
All ten real locale/history/storage/gallery/inert-preview journeys pass in the
focused runner; no locator is weakened with first-match selection or retry.
The final complete profile and source-bound C receipt follow this checkpoint.

## C — Complete browser qualification

Clean source `4ddc3d37fccafde6bf8145426b5c1edf88f0f567` passes
`pnpm ci:browser` with exit 0, Chromium 151.0.7922.34 and Node 24.21.0.
The [verification receipt](reviews/browser-closeout-70/verification.json) records
all 15 successful steps, fresh artifacts and exact UTC timestamps. Application
tests pass 31 cases, production store 118, isolated preview six and component
styles four; these profile counts overlap. The same invocation passes 99 layout
cases, ten locale journeys, seven catalog-localization journeys and two
intercepted-handoff scenarios. No retry, weaker contrast limit or skipped assertion
is used to turn the observed failures into passes.

Unedited production captures retain narrow and wide examples:
[landing at 320px](reviews/browser-closeout-70/landing-320.png) and
[store at 2560px](reviews/browser-closeout-70/store-2560.png). Receipt hashes identify
their original bytes. Both were inspected for clipping and legibility; a full-page
capture can include an off-screen lazy image before it loads. These examples
supplement the measured route/viewport matrix rather than establishing every
content or device state.

A supplemental Storybook **manager** probe has a separate failed result: local
theme changes retained the iframe document, then the guard blocked three Chakra
reference metadata/iframe requests. The four local component iframe/standalone
cases pass in the supported profile. External-reference and manager-offline
acceptance are still incomplete; do not describe this supplemental probe as a
pass or close #53's remaining scope from it.

Earlier failed invocations remain in the dated history. A prior layout
`failure.json` can remain in the ignored local output directory; the current
parent invocation and current journey/capture timestamps identify this passing
run. Physical devices, native zoom, assistive technology, Safari/iOS and Mac/
Apple Silicon remain owner/manual checks in #115. Strict budgets, hosted results
and real Docker evidence are separate. This qualifies the unmerged storefront
stack, excluding main's newer Intelligence changes; it does not authorize merge,
publication or real provider activity. #70/#49 retain their original criteria.
