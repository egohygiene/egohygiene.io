# Shared documentation content

`@egohygiene/content` is a private, framework-independent CommonMark boundary.
It parses strings with `mdast-util-from-markdown` and converts them to a constrained
HAST tree with `mdast-util-to-hast`. It performs no network, filesystem or browser
operations. See [ADR 0013](../../docs/architecture/decisions/0013-shared-safe-markdown.md)
and the [#50 receipt](../../docs/design/content-markdown-50.md).

## Contract

`parseMarkdownDocument(source, title)` returns:

- `title`: the caller's non-empty title, validated by `markdownMetadataSchema`.
- `slug`: the existing `createSlug(title)` result; headings do not change identity.
- `body`: the original source, including indentation and boundary whitespace.
- `description`, when present: plain text from the first top-level paragraph,
  with whitespace collapsed. Headings, code blocks and blockquotes are not used
  as descriptions. Empty summaries omit the property entirely.
- `tree`: the constrained HAST root produced from that same parse. Docs renders
  it through `hast-util-to-jsx-runtime`; it does not parse Markdown again.

`renderMarkdownToHtml(source)` uses the same parser and URL rules, then serializes
with `hast-util-to-html`. Standard CommonMark whitespace and escaping replace the
former splitter's output. A consumer constructing `MarkdownDocument` manually
must now supply `tree`, or preferably call `parseMarkdownDocument`.

Supported syntax includes headings, paragraphs, emphasis, links and references,
images, nested ordered/unordered lists, blockquotes, thematic breaks, inline
code, and fenced/indented code. HTML is displayed literally. There is no executable
MDX, frontmatter interpretation, GFM extension, custom AST input or parser plugin
API. A `.mdx` filename loaded with `?raw` is still ordinary Markdown here.

## Trust and destinations

Raw HTML becomes text, including script/style elements and event attributes.
Code and attribute strings are escaped by the output adapters; no dangerous-HTML
option is enabled. The returned tree is ordinary structured data, not an immutable
security token: do not append untrusted nodes or properties before rendering it.
The adapters are not sanitizers for arbitrary AST or HTML inputs.

Link URLs allow explicit `http:`, `https:`, `mailto:` and relative, query or
fragment references. Images allow HTTP(S) and relative references. Empty URLs,
other schemes, scheme-relative `//` destinations, backslashes, whitespace and
control characters are rejected. Checks use parser-decoded URLs before URI
normalization, including reference definitions. Unsafe links keep their contents
without `href`; unsafe images become their alt text. No links force a new tab.

Allowed external URLs are not endorsed or made private by this policy. Rendering
an allowed image can cause its consumer to request that resource. Current docs
remain checked-in public content; there is no upload or remote ingestion service.

## Focused checks

From the repository root:

```sh
pnpm --filter @egohygiene/content typecheck
pnpm --filter @egohygiene/docs typecheck
pnpm exec vitest run --config vitest.unit.config.ts packages/content/src/index.test.ts apps/docs/src/components/MarkdownPage.test.tsx
pnpm --filter @egohygiene/docs build
```

These checks do not establish browser, accessibility, hosted CI or production
qualification. Preserve the recorded limitations in the owning review.
