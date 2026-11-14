---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-14T04:11:03Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Implement the issue25 private-playground exposure prerequisite in the authorized organization
    issue batch; leave experiment lifecycle and production publication separate.
  includes:
  - Loopback playground development/preview, crawler headers and standalone HTML/robots directives implement
    the declared exposure policy.
  - The public website Vite build rejects direct, transitive and symlinked playground module/asset imports, inline URL/CSS and decoded HTML/srcset references and public-directory copies.
    Shared workspace packages remain the promotion boundary.
  excludes: &id001
  - Indexing metadata is not access control. Do not deploy playground output or store secrets/private
    fixtures there.
  - Issue25 registry, representative experiments, promotion lifecycle and broader accessibility acceptance
    remain open. No deployment, hosted CI or product activation occurred.
  - Root tooling TypeScript has a retained Vite peer-cohort identity conflict in unchanged build-intelligence-export.mts;
    focused runtime/build evidence does not claim a green full compiler profile.
  precedence:
  - user-and-runtime-instructions
  - scoped-repository-instructions
  - live-repository-and-work-tracker-state
  - canonical-repository-sources
  - continuity-checkpoint
  canonical_sources:
  - AGENTS.md
  - docs/development/playground-exposure-25.md
  - scripts/vite-playground-boundary.mts
  - tests/tooling/playground-boundary.test.mjs
  - https://github.com/egohygiene/egohygiene.io/issues/25
work:
  objective: Implement the issue25 private-playground exposure prerequisite in the authorized organization
    issue batch; leave experiment lifecycle and production publication separate.
  success_conditions:
  - Actual forbidden imports fail public builds.
  - Actual loopback responses and built standalone metadata discourage indexing without changing public
    site indexing.
  active_issue:
    provider: github
    id: egohygiene/egohygiene.io#25
    url: https://github.com/egohygiene/egohygiene.io/issues/25
  next:
    kind: action
    id: review-playground-exposure
    description: Review the bounded draft and continue the separately selected knowledge23/blog11 foundations.
      Preserve all remaining qualification and owner gates.
    readiness: ready
    references:
    - https://github.com/egohygiene/egohygiene.io/issues/25
    depends_on: []
state:
  base:
    revision: d80c48582f77a0a3bd7424592307b8fac71df83d
    ref: refs/heads/main
    verified_at: '2026-11-14T04:11:03Z'
  candidate:
    branch: codex/25-playground-exposure
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-14T04:11:03Z'
    default_branch_revision: d80c48582f77a0a3bd7424592307b8fac71df83d
    issue_state: open
    pull_request_state: not-applicable
    notes: Fresh main is d80c485; the containing revision and pre-PR reference remain null. Historical
      Intelligence publication and its original source/model/evaluation clocks remain unchanged.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-14T04:11:03Z'
  reviewed_by: Codex
  evidence:
  - command: node --test tests/tooling/playground-boundary.test.mjs; pnpm build; scoped biome check
    outcome: passed
    observed_at: '2026-11-14T04:11:03Z'
    notes: Four actual Vite/HTTP groups pass, covering direct/transitive/symlink import rejection and
      crawler responses. Normal public build emits45 pages. Scoped formatting/import checks pass.
  - command: pnpm exec tsc --project tsconfig.node.json --noEmit
    outcome: failed
    observed_at: '2026-11-14T04:11:03Z'
    notes: Existing root/tooling Vite peer type identity conflict remains in unchanged build-intelligence-export.mts;
      no locked dependency or compiler suppression changed.
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

# egohygiene.io continuity

## Purpose and precedence

User/runtime and scoped repository instructions, live evidence and canonical sources outrank this checkpoint. It grants no deployment or human-decision authority.

## Resume protocol

Read current instructions, source issue and exact branch/base before integration.

## Current objective and success conditions

Implement the issue25 private-playground exposure prerequisite in the authorized organization issue batch; leave experiment lifecycle and production publication separate.

## State snapshot

The candidate is based on fresh main d80c485. Containing revision and pre-PR identity are intentionally null.

## Completed and material changes

Loopback playground development/preview, crawler headers and standalone HTML/robots directives implement the declared exposure policy.

The public website Vite build rejects direct, transitive and symlinked playground module/asset imports, inline URL/CSS and decoded HTML/srcset references and public-directory copies. Shared workspace packages remain the promotion boundary.

## Validation and review evidence

Four real Vite/HTTP groups, normal45-page public build and scoped Biome checks pass. The root tooling compiler retains its preexisting peer-cohort conflict.

## Blockers, risks, unknowns, and deferred work

Indexing metadata is not access control. Do not deploy playground output or store secrets/private fixtures there.

Issue25 registry, representative experiments, promotion lifecycle and broader accessibility acceptance remain open. No deployment, hosted CI or product activation occurred.

Root tooling TypeScript has a retained Vite peer-cohort identity conflict in unchanged build-intelligence-export.mts; focused runtime/build evidence does not claim a green full compiler profile.

## Next dependency-ready work

Review the bounded draft and continue the separately selected knowledge23/blog11 foundations. Preserve all remaining qualification and owner gates.

## Parallel changes and reconciliation

The issue23 knowledge boundary and issue11 blog/feed foundation are next independent stacked checkpoints; other organization repositories have separate owners.

## Privacy and redaction

Public-safe synthetic fixtures only. Crawler directives and noindex are not permission to expose private data.

## Handoff update protocol

Record exact tested heads, provider receipts, actual failures and remaining acceptance without calling a source merge a deployment.

## Compaction and supersession

This bounded checkpoint supersedes the current operational handoff only. Earlier Intelligence/store receipts and clocks remain in canonical context and Git history.
