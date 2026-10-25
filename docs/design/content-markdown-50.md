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
