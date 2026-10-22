# Website essentials #90 — checkpoint B

Recorded 2026-10-22. Alan selected continued work after A. This checkpoint
implements the bounded Help/Accessibility surfaces in [draft #94][pr], reusing
the [A contract](website-essentials-90a.md) and unmerged #87 readiness foundation.
It does not complete #90's copy/contact review or browser acceptance.

## Exact source and draft integration

Implementation: `6f5208d7abcd9882a63f4f157b525f584ce207dd`, tree
`12d1e3b7312fa0f393cd78d533247632d02dfa88`. Branch remains
`docs/website-essentials-90a`; #94 now targets `feat/store-readiness-38` (#87)
so its review diff isolates essentials and continuity from readiness code.

Integration commit `9f8842553908fb339fa6c43691027a3d98954bac`, tree
`37c22c29feef57b679e9435205bd12e1b6115ab8`, has ordered parents:

1. A source `a7d5e7062aa62cd09f5cf4299b8591ef04a4ffad` (includes #93 roadmap history).
2. #87 head `ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6`.

Only AGENTS, context README and current-state required conflict resolution;
both dated histories were preserved. The integration tree differs from #87 only
in seven documentation files. It is a working-draft integration, not a merge
into main. Main remains `07d25941ceeefa53089afa025b612c6aa54f36c4`;
#87, #93, #94 and older CI #73 remain draft/unmerged. Future PR integration must
account for the shared ancestry and preserve the existing evidence.

## Visitor behavior

- `/help` links to About, Store help, Accessibility and visibly labelled Privacy
  and Terms drafts. Website problem reporting is separate from order help.
- `/accessibility` describes existing navigation/theme aids and incomplete
  keyboard, focus, contrast, motion, zoom, layout and assistive-technology review.
  It makes no conformance or completed-review claim.
- Footer, Store help and policy pages expose coherent locale-aware help links.
  Internal links preserve language selection; the external GitHub URL is fixed.
- A small shared `WebsiteFeedback` component associates the translated warning
  with its report link through `aria-describedby`. All three reporting pages
  explain that GitHub issues are public, require an account and must not contain
  private/order information. A private website-feedback channel is not published.
- Existing About and Privacy/Terms copy is unchanged from #87. Policy text remains
  provisional. The optional condensed About rewrite was not used.

Pages reuse existing prose styling, headings/sections, locale messages,
`LocaleLink` and client-side `PageMetadata`. There is no new contact backend,
schema, dependency, framework or architectural contract; no new ADR is needed.
Catalog identities, artwork, real artist selections and purchase settings are
unchanged. No real product, provider or language was activated.

## Focused local verification

Pinned runtime: Node **24.21.0**, pnpm **11.28.5**. Frozen offline installation
with scripts disabled reused 3,770 cached packages without downloads. Manifests
and lockfile are unchanged. [Check summary](reviews/website-essentials-90b/checks.json)
records commands and scope; it is an authored receipt of observed results.

| Check | Actual result |
| --- | --- |
| Website app TypeScript profile | Passed; one app profile, not all repository/test profiles |
| Locale validation | 433 English messages in 10 namespaces including preview; SHA-256 `7099d1ff622aa5abe7fa0137ef8965e42cf8ad17a150e86a4fba45714022dc46` |
| Focused page/footer/header Vitest run | 25 tests in six files passed |
| Normal build with `VITE_STORE_PREVIEW=false` | Passed; ten catalog entries, one image and curation validated; 194 modules transformed |
| [Normal-artifact scan](reviews/website-essentials-90b/artifacts.json) | 16 files, 12 local asset references, zero findings; approved Heartburst bytes match |
| Independent code/test review | No remaining blocking finding; scope/feedback/policy boundaries retained |

The seven new simulated-DOM cases use the real route table and shell: direct
Help/Accessibility registration and client metadata; warnings on all three report
surfaces; language-preserving page/policy navigation; and direct render,
navigation and remount while `localStorage` access throws. They do not follow the
external report link. `sessionStorage` is not blocked, scrolling is mocked and
events are simulated; this is not complete blocked-storage or browser proof.

Type, locale and unit checks ran before publication on the exact staged source
tree subsequently verified against the published tree. Build/scanner ran at clean
published source `6f5208d7abcd9882a63f4f157b525f584ce207dd`. The documentation
follow-up changes only receipts/continuity. Diff whitespace passed, and source
comparison confirmed About/policy copy, manifests, lockfile, catalog and schemas
unchanged from #87. Existing Node module-type and Vite native-config-loader
warnings were not suppressed.

Artifact totals: **966,182 raw / 583,438 level-9 gzip bytes**; JavaScript
**472,914 / 137,212 bytes**. This is +6,466 raw / +1,060 gzip versus #87's normal
receipt. Local size ceilings are provisional review limits, not measured network
performance. The scanner executes no app code or network requests and checks
selected resource references/markers, not all possible secrets or runtime URLs.

Documentation validation passed: 240 relative links in the changed documents,
36 context-manifest paths, changed JSON parsing, reference-link definitions and
diff whitespace. The saved artifact report is byte-identical to the generated
report. Independent review of the implementation found no remaining blocker.

## Hosted results and deferred work

[Source-head hosted status](reviews/website-essentials-90b/hosted-status.json)
records completed failures for CI **39863154582**, Dependency review
**39863154652** and CodeQL **39863154631**. Causes were not re-diagnosed here.
No manual dispatch, gate disabling or workflow repair occurred. Local results
are not hosted CI success or production/provider qualification.

No Chromium, screenshot, responsive/expanded-text/RTL, actual keyboard traversal,
screen-reader, network or deployed deep-link check ran. Broad lint/full-suite/CI
repair and the controlled refactor sweep remain in the approved later issues.
Client metadata is not crawler-visible HTML proof; #91 has not started.

## C handoff and factual dispositions

| A review item | B disposition and remaining owner |
| --- | --- |
| D1 — Purpose | Existing About copy retained; no new biography/history or condensed rewrite. Broader history remains #9. |
| D2 — Feedback/contact | Public/account/private-data warning implemented consistently. The missing private website/accessibility channel remains an explicit #90/#9 gap; Alan must review the interim path or supply an approved public destination. Do not close #90 without that disposition. Actual order-support facts remain #38. |
| D3 — Accessibility | Limited status copy implemented. Actual focus/contrast/motion, layout/input and final browser/assistive-technology evidence remain #49/#70/#37. |
| D4 — Policies | Provisional copy preserved. #9 owns organization/privacy/contact applicability, #59 rights/licensing, #38 commerce/policy/support facts and #89 actual hosting. No factual approval is inferred from implementation authorization. |

Next is **checkpoint C**: review the actual strings, resolve or explicitly assign
the remaining factual/contact decisions, check bounded route semantics and carry
these routes into #91 and final #37. The routes are `/help`, `/about`,
`/accessibility`, `/store/help`, `/privacy` and `/terms`.
Keep required browser/manual work visible under the agreed final-pass schedule.
No issues closed, PRs merged into main, providers contacted, orders placed,
deployment or spending occurred.

[pr]: https://github.com/egohygiene/egohygiene.io/pull/94
