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
