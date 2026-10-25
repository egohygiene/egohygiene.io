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

## B/C — Planned local delivery

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
