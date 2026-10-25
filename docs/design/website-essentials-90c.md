# Website essentials #90 — checkpoint C review

Recorded 2026-10-22 (America/New_York). Alan authorized C after B. This checkpoint
reviews the six information routes, corrects one overbroad sentence, retains
browser journeys for the final Mac pass and records concrete remaining owners.
The engineering review is prepared; **#90 remains open** for the contact/copy
disposition and deferred browser/manual acceptance.

## Revision and delivery

[Draft #94][pr], branch `docs/website-essentials-90a`, still targets
`feat/store-readiness-38` (#87). C source is
`4ff01a760399cf0bfc2dff6570ae250d71c2a879`, tree
`bff27721791af1fb39eacd7fc8dc3d880732f9e3`, parent
`b83583887bfdf0950fe83e575708909eed02a3d9`. This changes only the English privacy
sentence, the six-route DOM test matrix and `tests/e2e/site.spec.ts`.

[A's contract](website-essentials-90a.md) and [B's receipt](website-essentials-90b.md)
remain historical evidence. Main was refreshed at
`07d25941ceeefa53089afa025b612c6aa54f36c4`; #87/#93/#94 and CI #73 remain
draft/unmerged. C does not change the shared draft ancestry recorded in B or
authorize merging, deployment, activation, provider requests, orders or spending.

## Copy and route review

[Source-bound review record](reviews/website-essentials-90c/content-review.json)
identifies the reviewed messages and their source hash. This is an engineering
review, not a fabricated maintainer approval or policy/compliance determination.

| Route | Reviewed visitor-facing contract | Source/DOM result |
| --- | --- | --- |
| `/help` | Navigation hub, public feedback, separate order guidance, visibly provisional policy index | One H1; labelled H2 sections; five essential destinations and the fixed report link |
| `/about` | Existing purpose, balance, awareness and creative-tool framing | Existing text retained; one H1; footer returns to Help |
| `/accessibility` | Existing skip/theme aids, incomplete review and public barrier reports | One H1; labelled sections; no conformance claim |
| `/store/help` | Physical products versus artwork, inert previews, provider checkout and private order-support boundaries | One H1; labelled sections; website feedback separated from order support |
| `/privacy` | Provisional current-site explanation and external-service notice | One H1; storage wording corrected; Help return link |
| `/terms` | Provisional website/preview terms and distinct actual-purchase terms | Existing text retained; one H1; Help return link |

All six explicit routes use existing locale-aware internal links, shared prose
styling and client title/description effects. DOM checks use the actual route
table and shell; semantic source review checked heading hierarchy, labelled
sections and the warning's association with the report link. CSS reuses the
existing content measure and logical spacing; source inspection cannot establish
readable layout, computed contrast, visible focus or assistive-technology behavior.

### Correction: preference storage

The inherited Privacy sentence said “Blocking browser storage does not prevent
browsing.” That was broader than the focused preference evidence, especially
because the shell also uses router scroll restoration. C replaces it with:

> The site can save theme and language preferences in your browser. If saving is
> blocked, those preferences may not be remembered on a later visit.

This describes guarded preference persistence without asserting all-browser or
all-storage resilience. It is not evidence of an observed browser crash.
Existing theme and locale tests cover preference storage rejection; the retained
essentials test blocks only `localStorage`, with `sessionStorage` available.

## D1–D4 dispositions and remaining decision

| Item | Engineering disposition | Remaining owner / acceptance |
| --- | --- | --- |
| D1 — Purpose | Keep current About text. No optional rewrite, biography, dates or operating-entity facts added. | #9 owns any broader canonical history/profile work. |
| D2 — Feedback | Current GitHub link and adjacent warning accurately state public visibility, account requirement and exclusion of private/order data. No private website/accessibility channel is published. | **Alan's choice remains pending.** Proposed setup disposition: retain public GitHub defect reports during setup and keep a private, accessible alternative as explicit pre-launch work in #9. Alternatively, supply a destination approved for public display. #90 is not closed on the strength of this proposal. |
| D3 — Accessibility | Keep the limited status wording. Source/DOM review and authored tests do not establish completed accessibility review. | #49 focus/contrast/motion; #70 layout/input/zoom; #37 integrated browser/manual/AT evidence. |
| D4 — Policies | Keep Privacy/Terms visibly provisional; apply only the narrow storage correction. | #9 organization/operator/privacy/contact applicability; #59 artwork/code rights; #38 actual product/provider/customer facts; #89 host/data-processing behavior. |

The ordinary copy is source-reviewed and ready for Alan's review; no factual
approval is inferred from authorization to implement C. No private address was
inferred from account metadata or unrelated records. A missing contact channel
cannot be replaced by directing order or personal data to public GitHub.

### Actual commerce facts retained in #38

The #38 handoff names each still-unverified fact: exact physical item and approved
artwork/template/rights; provider/channel eligibility and customer-funded terms;
variant/price/currency mapping and actual final shipping/tax/fee totals; delivery
regions/timing; returns/refunds/cancellations; and a suitable private order-support
destination and responsible party. Review actual evidence and update the exact
qualified route/customer disclosures before activation. Existing synthetic
readiness records and these help pages do not supply any of those facts.

#9 keeps operator/privacy applicability and private website/accessibility feedback;
#89 keeps actual host behavior. Private business, customer and rights documents
remain outside public Git; only public-safe decisions/references belong here.

## Local evidence and limits

[Check receipt](reviews/website-essentials-90c/checks.json) ·
[normal-artifact report](reviews/website-essentials-90c/artifacts.json) ·
[hosted status](reviews/website-essentials-90c/hosted-status.json).

Pinned runtime: Node **24.21.0**, pnpm **11.28.5**; reused the existing locked
installation. No dependency, schema, catalog, artwork, provider or CSS change.

| Check actually performed | Result |
| --- | --- |
| Website app and selected browser TypeScript profiles | Both passed |
| Locale validation | 433 English messages / 10 namespaces; source SHA-256 `fbef47f7d3c51c22d5f8727f9e7c918f9c8dba4f51eff98a860d29c8e40377f8` |
| Focused pages/footer/header/locale-provider/theme tests | 54 tests / eight files passed; essentials now has 11 cases, including all six routes |
| Browser definition discovery | Nine new essentials cases listed in the existing production profile; **zero executed** |
| Normal build with preview disabled | Passed; ten catalog entries / one image / curation validated; 194 modules transformed |
| Normal-artifact scan | 16 files / 12 asset references / zero findings; approved Heartburst bytes match |
| Independent source/test review | One inherited copy overstatement corrected; no remaining blocking code/test finding |

Checks ran locally before publication; the published source tree was verified
equal to staging. The browser-check follow-up only clarified a comment naming the
normal production runner. Build/scanner ran on clean published C source; later
continuity edits change no app or test behavior. Existing Node module-type and
Vite native-config-loader warnings were not suppressed.

Artifact totals are **966,210 raw / 583,455 level-9 gzip bytes**; JavaScript
**472,942 / 137,228 bytes**. The scanner executes no application code or network
request. Its marker/reference checks and provisional size limits are not complete
security coverage, measured performance or agreed production budgets.

Documentation checks passed: 260 relative links, 37 context-manifest paths,
changed JSON/reference definitions and diff whitespace. The content-review hash
matches the actual message file; the saved artifact report matches the generated
report exactly. Independent documentation/evidence review found no blocker.

The hosted snapshot records failures for CI **39875866505**, Dependency review
**39875866514** and CodeQL **39875866901**, separately from local results. No hosted
failure was
re-diagnosed, workflow manually dispatched or gate disabled. Broad lint/full-suite/
refactor/CI repair remains scheduled later. No fresh isolated preview build was
needed for this copy/test-only change.

## Retained browser and final-pass handoff

Nine new definitions in `tests/e2e/site.spec.ts` reuse the existing local-only
request guard, production profile and final `scripts/qualify-store.mjs` selection:

- Six direct-load/reload cases assert route-specific content/client metadata and
  return to Help through the footer.
- One Help hub journey visits all five other information routes and returns,
  preserving explicit `?lang=en`.
- Two keyboard journeys (1280px and 390px) use actual Tab/Enter and the skip link,
  inspect the public report link's warning, and navigate between help surfaces.
  They focus but never activate external reporting links.

Discovery and type-checking do not start the server/browser or prove those
journeys pass. No new runner, framework, Taskfile entry or CI configuration was
added. #52 can wrap the existing commands when the integrated final pass is ready.

For the later focused run, after the pinned setup and browser are available:

```sh
VITE_STORE_PREVIEW=false pnpm build
pnpm exec playwright test --config playwright.store.config.ts tests/e2e/site.spec.ts --grep "website essentials" --reporter=list
```

The full final profile remains `node scripts/qualify-store.mjs`; run it only at
the selected integrated revision in the scheduled engineering pass. Record its
actual command output, revision, browser/environment and observed defects.

Required manual/browser work remains explicit:

- #49: keyboard order, visible focus, warning announcement, light/dark/high-contrast
  text/link contrast and reduced motion across all six routes.
- #70: readable prose and reachable footer/report/policy links at representative
  320/390/820/1440px widths, long-text/RTL fixtures, native text enlargement and
  400% zoom/reflow. CSS probes and a 390px keyboard test are not that whole review.
- #37: execute the retained journeys and record the actual assistive-technology,
  engine/device coverage and unsupported environments.
- #91: include these current routes in meaningful raw HTML/metadata/canonical/
  sitemap review; derive catalog routes from the validated catalog. This receipt
  is not a second application route registry.
- #89: later verify actual-host direct/reloaded routes, assets, redirects and
  metadata at the deployed revision. Local SPA success is not host evidence.

**Next:** sync on the C review and the proposed interim contact disposition.
Keep #90 open for remaining acceptance. The next implementation issue in the
approved setup order is #91 A; it has not started here.

[pr]: https://github.com/egohygiene/egohygiene.io/pull/94
