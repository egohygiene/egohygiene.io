# Shared focus, contrast and motion — #49

Recorded 2026-10-25 (America/New_York). Alan authorized #49 after the store
preservation detour. Branch `fix/shared-accessibility-49` starts from draft #101,
`f85bee403f12f4400a68fc76294151fefadb00ba`; main remains
`07d25941ceeefa53089afa025b612c6aa54f36c4`. No earlier draft is merged/retargeted.

## A — Source baseline and bounded repair contract

The original #49 audit predates #37. Reuse its 3px outline, foreground badge
labels, explicit button/spinner reduced-motion rules and selected browser helpers.
[Historical #37 evidence](../store/qualification-37.md) measured selected surfaces
at its own revision; those numbers are not fresh results on this branch.

The current source still has these concrete gaps:

- Shared primary Button and Orbit label use white on an accent-to-pink gradient.
  White/pink is about 2.65:1; the high-contrast yellow endpoint is about 1.41:1.
- Docs active navigation uses accent text over an accent tint: nominal source
  composition is below 4.5:1 in light/dark. Preserve its active-state semantics
  while using readable foreground text and an underline.
- Base reduced-motion universal selectors lose to later explicit selectors.
  Website overrides currently repair document scrolling, but the shared contract
  should work for other consumers without that override.
- Shared focus currently bypasses the semantic focus variable; make the semantic
  default safe while retaining the website's intentional dark-surface treatment.

Use existing semantic themes (ADR 0003), without new primitives, dependencies,
frameworks or token-generation systems. Add a paired action background/foreground:
existing accentStrong/white for light and dark, high-contrast yellow/black for the
high-contrast theme. Solid fills make the label contrast unambiguous. Preserve
forced-color adjustment; explicit system-color borders/outlines may be used where
needed. Keep badges' already-readable foreground labels and textual status.

Put reduced-motion preference enforcement in the shared theme layer, resilient to
later selector specificity: zero transition/animation duration and delay, one
animation iteration and automatic scrolling. Retain explicit spinner animation
removal and no button hover movement. Normal smooth scrolling is opt-in under
`prefers-reduced-motion: no-preference`. No transition/animation event-dependent
business behavior is introduced.

**A is source inventory and a saved repair contract, not completed computed-browser
acceptance.** Chromium remains deferred by Alan's standing instruction. Fresh
computed colors, keyboard rendering, forced colors and actual motion will be
collected by the retained browser cases during the final Mac pass. Source sRGB
calculations do not resolve arbitrary composited/gradient/layout surfaces.

## B — Implementation scope

Repair the theme/UI stylesheet contract and directly affected docs consumer.
Preserve routes, catalog/public projection, hydration, native controls, accessible
names and disabled purchase state. Extend existing theme/UI/semantic checks and
existing production/playground browser definitions; avoid a new test runner.

## C — Verification and retained acceptance

Run focused local tests/types, scoped checks and fresh affected application builds.
Retain source-bound results, commands and limits. Browser definitions can be
compiled/discovered without executing Chromium. Reuse the existing flat-surface
contrast helper (which rejects gradients/opacity), all three themes, production
info pages, keyboard/Shift+Tab, forced colors, dynamic reduced motion and bounded
narrow/root-font probes. Shared-only playground cases must not rely on website CSS.

Keep these open: actual browser-computed samples and keyboard/layout review,
native zoom, physical devices/wider engines, screen-reader announcement and full
accessibility acceptance. #37/#70 own the final local execution; #52 consolidates
profiles. No selected test suite is full accessibility certification. Existing
hosted and size failures remain; no gates or ceilings are changed.

After this bounded implementation, sync before #53. #100 C source-repository
retirement remains separate and open. No merge, deletion, deployment, purchase,
provider activation or paid service is part of #49.

## Sources

- [ADR 0003: semantic theme ownership](../architecture/decisions/0003-design-token-architecture.md)
- [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)

Sources were consulted for criteria and CSS behavior; no external implementation
or assets were copied. Normal text target is 4.5:1; selected focus indicators target
3:1 against adjacent colors, using unrounded ratios. Human review remains required.
