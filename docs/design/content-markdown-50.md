# Shared documentation content — #50

Recorded 2026-10-25 (America/New_York). Owner: [#50](https://github.com/egohygiene/egohygiene.io/issues/50),
under setup #88 and roadmap #84. Alan selected the issue after the roadmap sync.
Work starts from unmerged #98 at `e4e3ec2ece527e707eda0366c2ccee9b8cc6dd92`;
main remains `07d25941ceeefa53089afa025b612c6aa54f36c4`.

## A — Contract and reproduced defect

The private `@egohygiene/content` package and docs app each split Markdown into
blocks independently. Docs safely renders React text but leaves inline Markdown
literal. The exported, currently unused HTML helper directly interpolates source.
This is an unsafe helper contract, not evidence of an active docs injection.
Only the docs component and package tests use these APIs in this repository.

Pinned Node 24.21.0 and pnpm 11.28.5 were recovered without changing repository
pins. Frozen installation disabled lifecycle scripts. Package typechecking
reproduces TS2375: an optional description was always emitted with `undefined`.
A conditionally omits that property and adds empty/heading-only regressions;
strict compiler options and the existing typecheck profile remain unchanged.

The selected B contract is:

- One CommonMark parser in `@egohygiene/content` via the already locked
  `mdast-util-from-markdown` 2.0.3, converted to HAST using
  `mdast-util-to-hast` 13.2.1. No custom Markdown grammar or plugin framework.
- Preserve source body/indentation. Caller-supplied title remains authoritative
  and supplies the slug; the first top-level paragraph supplies an optional
  plain-text description. Empty, heading-only and code-only input omit it.
  Validate metadata using the existing schema rather than weakening its types.
- Support CommonMark headings, paragraphs, emphasis, inline/fenced/indented code,
  lists/nesting, blockquotes, links/references, images and thematic breaks.
  No executable MDX, frontmatter, raw HTML execution or GFM extensions are added.
- Raw HTML becomes literal text. Code stays literal. No caller plugins, arbitrary
  AST input or dangerous-HTML option enters the shared parser boundary.
- Links permit relative/query/fragment references and explicit HTTP(S)/mailto;
  images permit relative references and HTTP(S). Reject scheme-relative URLs,
  backslashes, controls and other schemes. Unsafe anchors keep their text without
  `href`; unsafe images become alt text. Parsing never fetches anything; allowed
  images may load when a consumer renders them. This is not an upload service or
  a general-purpose sanitizer for arbitrary HTML/AST input.
- `MarkdownDocument` gains a parsed `tree` alongside existing metadata/body.
  Docs uses the existing locked `hast-util-to-jsx-runtime` 2.3.6 to render it as
  React elements. The HTML helper uses the same constrained tree with the standard
  `hast-util-to-html` serializer. Both outputs share parsing and URL decisions.
- Declare direct dependencies at their actual consuming packages; preserve
  already locked versions. One narrow serializer dependency is justified to
  retain the existing helper without writing our own HTML serializer.

See [ADR 0013](../architecture/decisions/0013-shared-safe-markdown.md) for rationale,
alternatives, trust boundaries and migration constraints.

## B/C — Original delivery plan (A)

Save A to a draft PR before B. Replace both splitters, update package guidance,
and correct docs installation/dev/build examples against current scripts. Root
`pnpm dev`/`pnpm build` target the website; docs uses its explicit package commands.
Do not expand this into a framework, shared-style, test-runner or CI migration.

Test empty/heading-only/code-only input, nested/common Markdown, literal HTML,
fenced payloads, unsafe URLs and React/HTML semantic agreement. Run package/docs
types, focused units and a fresh docs build; verify actual local docs responses.
Retain browser definitions in the existing suite for the final Mac pass. Chromium
is deferred: DOM and HTTP are not browser/layout/keyboard acceptance. Keep known
website artifact-size and hosted failures visible. No merge, deployment, provider
activation, private content, package publication, purchase or spending.

## B — Shared implementation saved in draft #99

A was published first as `7f6a17b152fa4a57eea2ee88c2bb3a8cd05699af` in
[draft #99](https://github.com/egohygiene/egohygiene.io/pull/99), based on #98.
B replaces both splitters with the selected shared tree and updates all four
checked-in docs guides, home guidance and package README. The helper remains an
HTML-string API but now uses the standard serializer. Docs creates React elements
from the same tree without an HTML sink. Original decoded direct/reference URLs
are checked before conversion normalizes them; empty URLs are also rejected.

Direct pins are `mdast-util-from-markdown` 2.0.3, `mdast-util-to-hast` 13.2.1,
`mdast-util-to-string` 4.0.0, `hast-util-to-html` 9.0.5, `@types/hast` 3.0.5 and
internal `@types/mdast` 4.0.4 in content, plus `hast-util-to-jsx-runtime` 2.3.6 in
docs. Only the serializer and `html-void-elements` 3.0.0 add package versions;
remaining lock additions use existing versions/peer contexts. No existing
resolution or runtime/toolchain pin is upgraded. Frozen script-disabled install
passes with 3,916 lock entries. Existing peer/deprecation warnings remain.

Pre-publication checks pass: 50 content and 14 docs DOM tests, unchanged strict
content/docs type profiles, docs production build, workspace/exports/locale/cycle/
portable-boundary checks. Independent read-only review found no blocking issue.
Five retained docs browser journeys are discovered, not executed. C will bind
fresh build/HTTP and normal website artifact evidence to the published B source,
check browser definitions with a temporary strict profile, and refresh hosted
status. This is local implementation evidence, not final browser qualification.

## C — Local verification and handoff

Published B source is `1a5fbdf67fe11fb865cee1f4f93046513b0df95c`, tree
`ea944a6a56a292abaf1666a1d90cf06e2903db38`. The GitHub tree matched local staging;
fetched source was clean. This follow-up changes documentation/evidence only.
[Machine-readable checks](reviews/content-markdown-50/verification.json),
[docs HTTP/artifact evidence](reviews/content-markdown-50/docs-http.json) and
[normal website comparison](reviews/content-markdown-50/website-artifact-review.json)
pin the exact source, commands, scope and limits.

| Verification | Result and boundary |
| --- | --- |
| Content contracts | 50 passing tests: empty/heading/code-only metadata, caller identity, retained indentation, common/nested/reference syntax, literal HTML/fenced/attribute payloads, safe destinations and 18 unsafe URL forms across direct/reference links/images |
| Docs simulated DOM | 14 passing tests: four actual guides, correct commands, semantic code/links/lists/nesting, literal payloads, shared-tree React semantics, empty documents, duplicate blocks and home guidance |
| Strict types | Existing content/docs profiles pass; temporary docs-browser profile passes without changing repository compiler flags |
| Workspace and scoped style checks | Workspace/exports/433 messages/cycles/16-module boundary pass; eight edited JSON/TS/TSX files pass Biome; no broad lint/format claim |
| Docs build/HTTP | Fresh build passes; 11 files recorded. Six local routes and six directly linked assets return 200 and expected nonempty content types |
| Normal website build | Passes; all 44 files exactly match the prior #60 paths, sizes and SHA-256 hashes |
| Browser definitions | Five docs journeys discovered and typechecked; zero executed |
| Artifact qualification | Fails exactly the same three existing size categories; 202 references and public artwork bytes unchanged |
| Hosted source status | CI 40207096653, dependency review 40207096571 and CodeQL 40207096735 failed |

Docs remains a client-rendered SPA. Its six HTTP routes return the same app shell,
including the missing route; HTTP does not establish rendered Markdown or client
not-found behavior. The DOM suite verifies selected semantic output in simulation.
The five retained `tests/e2e/docs.spec.ts` journeys cover four direct/reloaded docs
routes and home/navigation/missing-route recovery, with local successful GET-only
requests and WebSockets closed. Execute them in the existing docs Playwright
project during #37; the existing configuration starts all three app dev servers.
This does not qualify the docs production host. #52 should include docs browser
types in its permanent consolidated profiles; the exact temporary JSON profile
used here is retained in verification.json. No new test orchestrator was added.

Normal artifact failures remain documents **317,615 / 20,000** bytes, document gzip
**85,608 / 10,000**, total **1,287,210 / 1,140,000**. No ceilings/gates changed and
no other targeted artifact finding appeared. This docs-only change did not alter
the website output. #52/#92/#37 retain budget/final engineering disposition;
#29 owns hosted reconciliation. Current hosted failures were observed, not repaired
or manually dispatched. Focused local passes are not hosted/production approval.

A/B and the requested local C tests/examples are delivered in draft #99. Keep #50
open for review/integration and record actual Chromium acceptance in the final
pass. Next: sync, then **#49 shared focus/contrast/reduced-motion review**, reusing
prior #37 fixes instead of rebuilding them. The approved order thereafter is
#53 → #56 → #59 → #92 → #52 → #29 → #57 → #70 → #37, followed by the already
recorded environment/construction-preview and real-product phases. No merge,
deployment, activation, purchase, publication, private records or spending.
