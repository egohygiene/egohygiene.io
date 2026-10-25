# ADR 0013 — One constrained Markdown tree for documentation

- Date: 2026-10-25 (America/New_York).
- Status: Implemented and locally verified in draft #99; unmerged, final browser acceptance deferred.
- Owner: [#50](https://github.com/egohygiene/egohygiene.io/issues/50), docs/content
  slice of #18. No shared-package publication or website rendering migration.
- Input: `e4e3ec2ece527e707eda0366c2ccee9b8cc6dd92` (unmerged #98).

## Context and decision

The content package's manual HTML splitter interpolates source. Docs independently
splits raw `.mdx` strings into React text, which is inert but misses inline code,
links and ordinary Markdown semantics. The HTML helper has no production consumer;
retain its intended API while repairing its trust boundary. Optional metadata
must omit missing descriptions under the existing strict TypeScript contract.

Use `mdast-util-from-markdown` for CommonMark and `mdast-util-to-hast` for one
constrained HAST tree owned by the framework-independent content package. Raw HTML
nodes map to literal text. Enforce a documented URL allowlist before returning the
tree. Derive plain-text paragraph metadata from the same parsed Markdown tree.
Preserve original body indentation and caller title/slug authority.

Docs consumes that tree with `hast-util-to-jsx-runtime` and React's JSX runtime;
the existing `renderMarkdownToHtml` serializes the same internal tree with
`hast-util-to-html`. Neither renderer reparses Markdown. No `dangerouslySetInnerHTML`,
raw-HTML plugin, executable MDX, arbitrary AST-input API or user-configurable parser
plugin is introduced. The generated tree must not be mutated with untrusted nodes
before rendering. This is a string-to-constrained-content boundary, not a claim
that HAST, serializers or JSX runtimes sanitize arbitrary input by themselves.

Links allow HTTP(S), mailto and relative/query/fragment references; images allow
HTTP(S) and relative references. Empty URLs, scheme-relative URLs, whitespace,
controls, backslashes and other schemes are rejected. Keep unsafe link labels without a destination and
replace unsafe images with their alt text. Allowed links/images can still refer
to external resources: this does not make them trusted or private. Parsing has
no I/O, and current docs remain checked-in public text.

## Alternatives and consequences

- Extending the splitters would maintain a custom Markdown grammar and two paths.
- Marked for one consumer and ReactMarkdown for the other would duplicate parsing
  decisions. Both are already present in the broader experimental dependency set,
  which this issue does not clean up.
- Removing the unused HTML helper would reduce the API but require a needless
  private consumer migration. A standard serializer preserves semantic parity.
- Supporting authored HTML with sanitization would broaden the trust policy
  without a current content need. Render it literally instead.

Use existing locked syntax-tree dependency versions as direct package dependencies;
the standard HTML serializer is the only new library family needed. Do not add
an application dependency to the content package. Preserve strict compiler flags.
No new schema version is required for this private in-memory API. Consumers
constructing `MarkdownDocument` values must include `tree` or call the parser;
helper output now has standard CommonMark whitespace and escaping semantics.

Focused tests must cover metadata omission, retained indentation, CommonMark
structure, literal payloads, URL decisions and both output consumers. Docs build
and types must pass. Real browser/assistive-technology acceptance remains in the
final local pass. If GFM, MDX or authored HTML is needed later, review this trust
policy explicitly before enabling extensions. A rollback must not restore the
unsafe helper; retain escaping or withdraw that API if reverting the parser.

## Sources and provenance

Upstream API/security documentation was reviewed; no external implementation copied.
These packages use MIT licenses, retained through their dependency distributions.

- [mdast-util-from-markdown](https://github.com/syntax-tree/mdast-util-from-markdown)
- [mdast-util-to-hast](https://github.com/syntax-tree/mdast-util-to-hast)
- [hast-util-to-jsx-runtime](https://github.com/syntax-tree/hast-util-to-jsx-runtime)
- [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html)

The [#50 receipt](../../design/content-markdown-50.md) owns delivery, exact versions,
source revisions, validation and limitations.
