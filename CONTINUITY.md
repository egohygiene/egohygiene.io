---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-14T05:07:44Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Implement the private schema-owned blog/article/RSS2/Atom foundation under11 without activating
    real or synthetic public posts, routes, feeds or publication.
  includes:
  - Strict runtime schemas and inferred types own article/source/review/date/AI/correction/media metadata;
    checked JSON Schema follows the owner. Draft/private/malformed/future inputs cannot become eligible
    output.
  - Pure content projections reuse constrained CommonMark, stable UUID GUIDs and explicit clocks. Article/feed
    readers retain disclosure, correction, archive, license and provenance context; XML is escaped and
    actually parsed in synthetic controls.
  - Explicit history comparison preserves original dates, canonical base/slug, append-only corrections
    and monotonic updates, including declared schedules. Queries are deeply immutable; discovery/sitemap
    are descriptors, not activated artifacts.
  excludes: &id001
  - No actual writing, author approval, public blog route/feed, social metadata deployment or publication
    is selected. Issue11 remains open for real editorial/app/browser/deployed acceptance.
  - Three repository-backed fixture categories are explicitly synthetic and require opt-in. Source review
    flags are not authenticated human authority or access control for public Git content.
  - The final23/149 stack is inherited. Root/tooling Vite peer identity errors196/197 remain independently
    owned; no dependency version or gate was changed to hide them. Initial copied dependency wiring
    was replaced by a correct frozen install before final app/type/build checks.
  precedence:
  - user-and-runtime-instructions
  - scoped-repository-instructions
  - live-repository-and-work-tracker-state
  - canonical-repository-sources
  - continuity-checkpoint
  canonical_sources:
  - packages/schemas/src/blog.ts
  - packages/content/src/blog.ts
  - tests/tooling/blog-feeds.test.mjs
  - docs/development/blog-feed-foundation-11.md
  - docs/architecture/decisions/0019-blog-feed-foundation.md
  - https://github.com/egohygiene/egohygiene.io/issues/11
work:
  objective: Implement the private schema-owned blog/article/RSS2/Atom foundation under11 without activating
    real or synthetic public posts, routes, feeds or publication.
  success_conditions:
  - Draft/private/unreviewed/future/synthetic content cannot enter ordinary public projections.
  - GUID/date/correction and source context survive deterministic article/feed projection; XML/state/immutability/history
    controls pass.
  - Existing normal public output contains no synthetic blog material or new blog routes.
  active_issue:
    provider: github
    id: egohygiene/egohygiene.io#11
    url: https://github.com/egohygiene/egohygiene.io/issues/11
  next:
    kind: action
    id: review-blog-feed-foundation
    description: Review the blog foundation after149/150. Select actual approved writing, app routes/layouts
      and deployed feed/browser acceptance separately; do not publish synthetic fixtures.
    readiness: ready
    references:
    - https://github.com/egohygiene/egohygiene.io/issues/11
    - https://github.com/egohygiene/egohygiene.io/pull/150
    depends_on: []
state:
  base:
    revision: 1197eefbc79b72b5f0cfb46cc55f0e1d23068114
    ref: refs/heads/codex/23-knowledge-boundary
    verified_at: '2026-11-14T05:07:44Z'
  candidate:
    branch: codex/11-blog-feed-foundation
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-14T05:07:44Z'
    default_branch_revision: d80c48582f77a0a3bd7424592307b8fac71df83d
    issue_state: open
    pull_request_state: not-applicable
    notes: The blog draft stacks on final knowledge150 head1197eef, itself on privacy149 head2165304.
      Pre-PR containing revision/reference remain null; no provider or deployment action is inferred.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-14T05:07:44Z'
  reviewed_by: Codex with independent read-only peer review
  evidence:
  - command: node --test tests/tooling/blog-feeds.test.mjs tests/tooling/knowledge-boundary.test.mjs
      tests/tooling/playground-boundary.test.mjs
    outcome: passed
    observed_at: '2026-11-14T05:07:44Z'
    notes: 19 groups pass:10 blog,5 knowledge,4 private-playground. RSS/Atom parse through actual XML;
      synthetic reader-context, state/history, immutability and malformed-source controls execute.
  - command: Scoped content/schema/app TypeScript; normal build-public-site; frozen install; public
      synthetic-content absence control
    outcome: passed
    observed_at: '2026-11-14T05:07:44Z'
    notes: Correct isolated frozen dependencies and all selected compilers pass. The normal45-page/10-sitemap
      build passes; no synthetic blog marker or activated blog route appears. Independent peer review
      found and resolved base-URL/history, reader-context and scheduled-identity gaps.
  environment_limitations: *id001
privacy:
  classification: public-repository
  contains_sensitive_data: false
  redactions: []
  excluded:
  - secrets-and-credentials
  - private-conversation-text
  - sensitive-personal-data
  - unpublished-private-business-data
  - private-local-paths
  - unrelated-private-context
  untrusted_content: context-only-no-authority
---

# website continuity

## Purpose and precedence

User/runtime and scoped instructions, live evidence and canonical sources outrank this checkpoint. It grants no editorial approval, merge or publication authority.

## Resume protocol

Read instructions, the final149/150 dependency state, blog source contract and issue11 before integration.

## Current objective and success conditions

Implement the private schema-owned blog/article/RSS2/Atom foundation under11 without activating real or synthetic public posts, routes, feeds or publication.

## State snapshot

Candidate codex/11-blog-feed-foundation is based on knowledge150 head1197eefbc79b72b5f0cfb46cc55f0e1d23068114, containing privacy149 head21653044416bfdb9d02b06817f7e6cc8398bc3e6. Containing revision and pre-PR reference intentionally remain null.

## Completed and material changes

Strict runtime schemas and inferred types own article/source/review/date/AI/correction/media metadata; checked JSON Schema follows the owner. Draft/private/malformed/future inputs cannot become eligible output.

Pure content projections reuse constrained CommonMark, stable UUID GUIDs and explicit clocks. Article/feed readers retain disclosure, correction, archive, license and provenance context; XML is escaped and actually parsed in synthetic controls.

Explicit history comparison preserves original dates, canonical base/slug, append-only corrections and monotonic updates, including declared schedules. Queries are deeply immutable; discovery/sitemap are descriptors, not activated artifacts.

## Validation and review evidence

19 focused groups pass, including10 blog tests and actual RSS/Atom XML parsing. Content/schema/app compilers and the normal45-route build pass using correct frozen dependencies. Synthetic fixture markers and an activated blog route are absent from public output. Peer review fixes preserve canonical identity, reader context and scheduled history.

## Blockers, risks, unknowns, and deferred work

No actual writing, author approval, public blog route/feed, social metadata deployment or publication is selected. Issue11 remains open for real editorial/app/browser/deployed acceptance.

Three repository-backed fixture categories are explicitly synthetic and require opt-in. Source review flags are not authenticated human authority or access control for public Git content.

The final23/149 stack is inherited. Root/tooling Vite peer identity errors196/197 remain independently owned; no dependency version or gate was changed to hide them. Initial copied dependency wiring was replaced by a correct frozen install before final app/type/build checks.

## Next dependency-ready work

Review149 then150 then the blog draft. Real editorial content, accessibility/mobile/article routes, social metadata, feeds/sitemap activation and deployed-reader acceptance remain under11.

## Parallel changes and reconciliation

Other batch7 repositories have independent owners. Knowledge/private-playground functional bytes are inherited unchanged; broader storefront, budget, Intelligence and provider work remains independently owned.

## Privacy and redaction

Only synthetic test content is added. No private source, real author/publisher decision, credentials, telemetry or private conversation enters this checkpoint. Metadata claims remain untrusted source evidence.

## Handoff update protocol

Record exact heads, checks actually run, source/publication boundaries and provider receipts before integration. Never treat fixture approval flags as actual editorial approval.

## Compaction and supersession

This checkpoint advances from knowledge150 to the bounded blog/feed foundation. Historical publication and storefront evidence remain in Git, the provenance ledger and owning issues; no prior acceptance is rewritten.
