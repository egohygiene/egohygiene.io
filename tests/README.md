# Local website qualification

Use the pinned Node/pnpm runtime and an installed Playwright Chromium (or the
existing `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override), then run:

```sh
node scripts/qualify-store.mjs
```

This website/store profile runs the existing catalog, unit, browser, intercepted
handoff and synthetic-layout checks together with the focused artifact and
accessibility checks. It builds normal and isolated-preview output immediately
before their consumers and stops on any failure. It never reuses an existing
browser server. Results are written under ignored
`test-results/store-qualification/profile/`; production browser details and
attachments are in `test-results/store/report.json`.

`tsconfig.store-browser.json` checks the browser suites selected by the normal
and preview profiles. This is separate from the wider workspace test/compiler
cleanup in #52. The older all-app existence-only smoke profile is not part of
this storefront qualification and cannot substitute for a fresh build.

The [store test plan](../docs/store/test-plan.md) records detailed scope and
historical evidence. Synthetic fixtures, Chromium emulation and client-rendered
metadata do not qualify real checkout, physical devices, assistive technology,
future schema migrations or an eventual deployed host. Artifact size ceilings
are proposed local regression limits pending maintainer review.
