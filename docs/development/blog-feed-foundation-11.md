# Blog and feed foundation

Issue [#11](https://github.com/egohygiene/egohygiene.io/issues/11) has a private,
experimental article and syndication boundary. `@egohygiene/schemas/blog` owns
the strict runtime contract, inferred types and generated JSON Schema;
`@egohygiene/content/blog` owns deterministic article, RSS2 and Atom projections.
It reuses the existing constrained CommonMark owner, without MDX execution,
React, router, DOM, Node APIs, storage or provider calls.

```ts
import { createBlogProjection, assertBlogHistory } from "@egohygiene/content/blog";

const view = createBlogProjection(reviewedRepositorySource, {
  asOf: "2026-11-14T00:00:00Z",
});
// view.articles / view.get(slug): immutable article metadata and constrained HTML
// view.rss() / view.atom(): deterministic XML strings, no filesystem writes
// view.discovery / view.sitemap: consumer-owned routing/build descriptors
assertBlogHistory(previousRepositorySource, reviewedRepositorySource);
```

The source adapter supplies metadata plus Markdown from bounded repository
paths; raw source and its Git history remain canonical. This checkpoint contains
no real posts and does not mount a route, write public feeds, add sitemap URLs or
change the live publisher. Those actions remain explicit consumer integration
and acceptance under #11. Synthetic fixtures require `allowSynthetic: true` and
must never be treated as reviewed real writing or used in production routes.

## Editorial contract

- Categories are essay, release update, research note and community. Each post
  carries explicit authors, category, canonical Markdown source/path/revision,
  optional public provenance link and declared licensing. Missing licensing or
  provenance is not inferred from repository ownership.
- Public eligibility requires public visibility, an approved review reference,
  a non-draft publication state, original publication time at/before `asOf`, no
  future update and an explicit AI-assistance state other than unknown. An
  approval reference is a source claim, not authentication or human ratification.
- Approved scheduled posts become eligible at the explicit clock boundary;
  the library has no wall clock and performs no publication. A future update
  withholds the current supplied body rather than reconstructing an older text.
- UUIDs are canonical lowercase and become stable `urn:uuid:` feed identifiers.
  Slugs form canonical URLs under the declared base. Once published, changing
  the base/slug/original date or dropping history requires a reviewed migration.
  Declared schedules receive the same conservative identity protection: changing
  even a future schedule requires an explicit migration rather than bypassing
  history when that schedule later becomes visible.
- Updates preserve the first publication date. Content, authorship, AI, media,
  category or licensing changes require a later update and appended correction.
  The comparison helper rejects backwards clocks and altered correction prefixes.
  It is an explicit revision comparison, not an append-only storage service or
  authorization to override a privacy/removal decision.
- Archived articles remain accessible in the projection with a visible archival
  note. Draft, private, pending and unknown-AI source never enters article/feed
  output. Validation runs before filtering, so malformed hidden drafts still fail.
  Visibility flags are output rules, not access control for public Git source.

Article HTML and feed content both retain AI disclosure, correction history,
archive notice, license and public source links when supplied. Raw HTML is text;
unsafe Markdown destinations use the existing constrained renderer. XML text
and attributes are escaped, and XML-invalid Unicode/control characters fail.
RSS supplies full constrained content plus summary, original date, creators,
category and one enclosure when its byte count is known. Atom carries stable ID,
original/updated dates, author, category, rights, provenance and full HTML content.
Feed discovery and sitemap are data only. Equivalent source and clock produce
equivalent bytes; source objects and nested query results cannot mutate the index.

Related content owners remain [Hygiene #23](https://github.com/egohygiene/hygiene/issues/23)
and [Aether #56](https://github.com/egohygiene/aether/issues/56). This prototype
does not ratify their proposed guidance, invent an editorial approval, or treat
AI assistance as authorship. Real editorial categories, accessibility, mobile
article layouts, social metadata, broken links, browser and deployed-feed
acceptance remain separate integration work with actual approved writing.

## Local proof

`tests/fixtures/blog/` contains three explicitly synthetic repository-backed
Markdown fixtures (essay, release update and research note), never real articles.
Run `node --test tests/tooling/blog-feeds.test.mjs` using the pinned Node runtime.
The controls parse actual RSS/Atom XML with Python's standard XML parser and
exercise date/GUID/history, scheduling, deep immutability, disclosure/provenance,
escaping, malformed drafts and generated-schema drift. Package/app type and
normal public-build checks are recorded in the PR; no local test establishes
browser/deployment or feed-reader provider qualification.
