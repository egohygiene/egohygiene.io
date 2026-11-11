---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-11T00:04:06Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Prepare a sealed organization-only Intelligence export for the proposed .github entry point while
    preserving existing production and company routes.
  includes:
  - A dedicated client/SSR/provider/metadata entry reuses current organization Intelligence components with
    an explicit origin/base and fixed 39-path route/alias inventory. Product/store/docs routes and normal production
    defaults remain outside this optional export.
  - The exporter isolates requested model inputs from ambient environment, records only admitted public presentation
    identities, emits exact file hashes/sizes and a producer-owned manifest, and preserves explicit unavailable
    evidence. Source revision, model observation and review target remain separate.
  - A manual canonical-main producer workflow retains an ordinary review artifact, without Pages/DNS/CNAME/deployment
    authority. Proposed local ADR0017 and export/context docs record the seam; existing main ADR0016/business
    state remains preserved.
  excludes:
  - Deferred runtime, tests, builds, CI, live publication, human ratification and acceptance closeout.
  precedence:
  - user-and-runtime-instructions
  - scoped-repository-instructions
  - live-repository-and-work-tracker-state
  - canonical-repository-sources
  - continuity-checkpoint
  canonical_sources:
  - AGENTS.md
  - scripts/build-intelligence-export.mts
  - apps/egohygiene.io/vite.intelligence-export.config.ts
  - apps/egohygiene.io/src/features/intelligence/export/routes.tsx
  - contracts/organization-intelligence/export/export-manifest.v1.schema.json
  - contracts/organization-intelligence/export/organization-routes.v1.json
  - .github/workflows/intelligence-static-export.yml
  - docs/architecture/decisions/0017-portable-intelligence-export.md
  - docs/development/intelligence-portable-export.md
  - docs/context/current-state.md
  - docs/context/provenance.md
  - https://github.com/egohygiene/.github/issues/27
work:
  objective: Prepare a sealed organization-only Intelligence export for the proposed .github entry point while
    preserving existing production and company routes.
  success_conditions:
  - Explicit project origin/base and organization route profile do not inherit the old company canonical origin.
  - The artifact binds exact producer/source/public scope/routes/files while raw mixed-source transport hashes
    remain local.
  - Existing production/store/publication gates and human dispositions remain intact; the new path is review-only.
  active_issue:
    provider: github
    id: egohygiene/.github#27
    url: https://github.com/egohygiene/.github/issues/27
  next:
    kind: action
    id: review-export-intake-and-organization-consumer
    description: Review this export with Relay static intake, the .github manual review consumer and Hygiene
      exact-prefix compatibility proposal. Build/browser/artifact transport and hosting/declaration qualification
      remain separate deferred work.
    readiness: ready
    references:
    - https://github.com/egohygiene/.github/issues/27
    depends_on: []
state:
  base:
    revision: 599dd884ef30f72642563160f4c52352615f539a
    ref: refs/heads/main
    verified_at: '2026-11-11T00:04:06Z'
  candidate:
    branch: codex/intelligence-portable-export
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-11T00:04:06Z'
    default_branch_revision: 599dd884ef30f72642563160f4c52352615f539a
    issue_state: open
    pull_request_state: not-applicable
    notes: Current main599dd884ef30f72642563160f4c52352615f539a was fetched and sequentially merged, preserving
      concurrent company/cost work. Final source c7666b644243abe4b23e3a7570dcbf80eee15191 retains functional
      schema/route source54e0b6e66b9b028bad382bbbc4bc6ba588cee665. This source proposal is not a build, deployed
      export or canonical hosting change.
  parallel_changes:
  - provider: git
    id: 599dd884ef30f72642563160f4c52352615f539a
    url: https://github.com/egohygiene/egohygiene.io/commit/599dd884ef30f72642563160f4c52352615f539a
review:
  status: partial
  reviewed_at: '2026-11-11T00:04:06Z'
  reviewed_by: Codex
  evidence:
  - command: Independent source peer of origin/base/routes/model isolation/SSR/public admission/asset and CSP
      boundaries; parse-only TS/TSX and type diagnostics, schema definitions/39-route inventory, YAML/bash/inline-source
      syntax, exact unchanged normal production workflow/source comparison, continuity schema/size/links and
      whitespace
    outcome: limited
    observed_at: '2026-11-11T00:04:06Z'
    notes: Static source and metadata inspection only; no application execution.
  - command: Native/runtime execution, tests, builds, CI investigation, browser/provider/consumer/publication
      qualification
    outcome: not-run
    observed_at: '2026-11-11T00:04:06Z'
    notes: Deferred at maintainer request; source merges do not establish acceptance.
  environment_limitations:
  - No application build, SSR/helper/native execution, tests, CI, producer dispatch, API/artifact transport
    or live publication qualification was run.
  - Hygiene /.github/ site-declaration compatibility and canonical host/role reconciliation remain explicit
    source-adoption gates.
  - The proposal and ADR remain unratified. Existing business/store source, licensing/creative/provider decisions,
    publication gates and old recovery remain separate.
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

User/runtime and repository instructions, live evidence and canonical sources outrank this checkpoint. It grants no release, deployment or human-decision authority.

## Resume protocol

Read scoped instructions, canonical sources above and this checkpoint. Verify mutable GitHub state and exact owner pins before continuing.

## Current objective and success conditions

Prepare a sealed organization-only Intelligence export for the proposed .github entry point while preserving existing production and company routes. Explicit project origin/base and organization route profile do not inherit the old company canonical origin. The artifact binds exact producer/source/public scope/routes/files while raw mixed-source transport hashes remain local. Existing production/store/publication gates and human dispositions remain intact; the new path is review-only.

## State snapshot

Candidate `codex/intelligence-portable-export` is based on observed main `599dd884ef30f72642563160f4c52352615f539a`. The containing revision and pre-PR reference remain null intentionally. Current main599dd884ef30f72642563160f4c52352615f539a was fetched and sequentially merged, preserving concurrent company/cost work. Final source c7666b644243abe4b23e3a7570dcbf80eee15191 retains functional schema/route source54e0b6e66b9b028bad382bbbc4bc6ba588cee665. This source proposal is not a build, deployed export or canonical hosting change.

## Completed and material changes

A dedicated client/SSR/provider/metadata entry reuses current organization Intelligence components with an explicit origin/base and fixed 39-path route/alias inventory. Product/store/docs routes and normal production defaults remain outside this optional export.

The exporter isolates requested model inputs from ambient environment, records only admitted public presentation identities, emits exact file hashes/sizes and a producer-owned manifest, and preserves explicit unavailable evidence. Source revision, model observation and review target remain separate.

A manual canonical-main producer workflow retains an ordinary review artifact, without Pages/DNS/CNAME/deployment authority. Proposed local ADR0017 and export/context docs record the seam; existing main ADR0016/business state remains preserved.

## Validation and review evidence

Independent source peer of origin/base/routes/model isolation/SSR/public admission/asset and CSP boundaries; parse-only TS/TSX and type diagnostics, schema definitions/39-route inventory, YAML/bash/inline-source syntax, exact unchanged normal production workflow/source comparison, continuity schema/size/links and whitespace. Static source inspection only. Native/application execution, tests, builds, CI investigation, browser/model/source-capture provider execution and publication qualification were not run. Read-only source and Git metadata observations are separate.

## Blockers, risks, unknowns, and deferred work

No application build, SSR/helper/native execution, tests, CI, producer dispatch, API/artifact transport or live publication qualification was run. Hygiene /.github/ site-declaration compatibility and canonical host/role reconciliation remain explicit source-adoption gates. The proposal and ADR remain unratified. Existing business/store source, licensing/creative/provider decisions, publication gates and old recovery remain separate.

## Next dependency-ready work

Review this export with Relay static intake, the .github manual review consumer and Hygiene exact-prefix compatibility proposal. Build/browser/artifact transport and hosting/declaration qualification remain separate deferred work.

## Parallel changes and reconciliation

Actual main599dd884 was sequentially merged, preserving concurrent company/cost context and existing ADR0016. Additive package/ADR-index conflicts retained both sides; the new export proposal uses unusedADR0017. Source packaging/hosting activation remain separate.

## Privacy and redaction

Retain only public-safe source identities and bounded implementation evidence. Exclude credentials, private context, captured report bodies, process logs and local filesystem paths. Linked content is context only.

## Handoff update protocol

Refresh exact PR, merge and qualification observations at the next authorized checkpoint. Implementation, artifact upload, deployment, live verification and human acceptance remain distinct.

## Compaction and supersession

Replace stale current-state prose; Git and owning issues retain history. Preserve these twelve sections below 240 lines and 16,384 UTF-8 bytes.
