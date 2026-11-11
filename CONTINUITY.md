---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-11T19:20:35Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Select exact retained public owner model artifacts for the existing sealed organization Intelligence
    export and proposed .github review consumer.
  includes:
  - An optional manual main-only model-selection workflow admits exact public producer revision/workflow/run/attempt/artifact/digest
    before downloading bounded ZIPs. Existing core and typed review bundles remain owner-defined; no new fleet
    assembler, semantic model or report is introduced.
  - Each module preserves its original observation clock and fails independently. The existing loaders admit
    each view; a separate companion receipt distinguishes transport compatibility from native available/partial/stale/unavailable
    presentation. Acquisition checksums, raw packets and provider captures remain private. Local captured-input
    replay cannot mint a public provider receipt.
  - The same sealed exporter and unchanged export-manifest/39-route contract are reused. Optional per-module
    clocks and private presentation evidence are additive. Two ordinary review artifacts bind exact source/target/final
    manifest; existing production/store paths and original exporter workflow remain unchanged.
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
  - scripts/intelligence_model_artifacts.py
  - contracts/organization-intelligence/export/model-selection.v1.schema.json
  - contracts/organization-intelligence/export/model-selection-receipt.v1.schema.json
  - contracts/organization-intelligence/model-selection/input-lock.json
  - .github/workflows/intelligence-model-artifacts-export.yml
  - docs/development/intelligence-model-artifact-selection.md
  - https://github.com/egohygiene/.github/issues/27
work:
  objective: Select exact retained public owner model artifacts for the existing sealed organization Intelligence
    export and proposed .github review consumer.
  success_conditions:
  - Each explicit selection binds real public provider identity and exact bytes before owner admission, with
    independent failure and no retimed evidence.
  - The sanitized companion binds the final admitted presentation and original module clocks to the existing
    exact sealed manifest.
  - Both new and original paths remain review-only, preserving all existing company/store production and owner
    authority.
  active_issue:
    provider: github
    id: egohygiene/.github#27
    url: https://github.com/egohygiene/.github/issues/27
  next:
    kind: action
    id: review-retained-model-selection-and-companion
    description: Review this producer with the .github companion intake and shared Relay181; then supply actual
      retained artifacts and perform the separately deferred transport, loader/export, browser and publication
      qualification. Do not merge this draft batch without maintainer review.
    readiness: ready
    references:
    - https://github.com/egohygiene/.github/issues/27
    depends_on: []
state:
  base:
    revision: c35932b77fe3623cad19f1f1b890e51ec16f38a8
    ref: refs/heads/main
    verified_at: '2026-11-11T19:20:35Z'
  candidate:
    branch: codex/intelligence-model-artifact-selection
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-11T19:20:35Z'
    default_branch_revision: c35932b77fe3623cad19f1f1b890e51ec16f38a8
    issue_state: open
    pull_request_state: not-applicable
    notes: Fresh main c35932b77fe3623cad19f1f1b890e51ec16f38a8 has no new source delta. The prior focused exporter
      PR139 is merged. The selected shared feed5d27be5ce1599df883e31f14cd894eb18622c18c is public in draft
      Relay181; the standalone receipt helper and schemas match exact source bytes. No actual model selection,
      export, upload or publication was run.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-11T19:20:35Z'
  reviewed_by: Codex
  evidence:
  - command: Independent source peer and root review of provider/public admission, bounded ZIPs, source/artifact
      clocks, receipt privacy/native state, local replay rejection and separate companion binding; Python AST,
      TypeScript parse/type diagnostics, schema definitions/local references, unique workflow YAML/embedded
      syntax, exact capsule hashes and original source preservation; continuity schema/size/links and whitespace
    outcome: limited
    observed_at: '2026-11-11T19:20:35Z'
    notes: Static source and metadata inspection only; no application execution.
  - command: Native/runtime execution, tests, builds, CI investigation, browser/provider/consumer/publication
      qualification
    outcome: not-run
    observed_at: '2026-11-11T19:20:35Z'
    notes: Deferred at maintainer request; source merges do not establish acceptance.
  environment_limitations:
  - Tests, application/native/helper/loader/model/export execution, builds, CI, actual provider/artifact transport,
    workflow dispatch, browsers and publication remain deferred by user instruction.
  - No actual artifact selection, ID, upload digest, report or successful audit is fabricated. Existing source
    holds and authenticated human disposition remain independent.
  - Proposed .github hosting still requires owner/declaration reconciliation and qualification. Unchanged sealed
    format is not proof of a successful pipeline or live publication.
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

Select exact retained public owner model artifacts for the existing sealed organization Intelligence export and proposed .github review consumer. Each explicit selection binds real public provider identity and exact bytes before owner admission, with independent failure and no retimed evidence. The sanitized companion binds the final admitted presentation and original module clocks to the existing exact sealed manifest. Both new and original paths remain review-only, preserving all existing company/store production and owner authority.

## State snapshot

Candidate `codex/intelligence-model-artifact-selection` is based on observed main `c35932b77fe3623cad19f1f1b890e51ec16f38a8`. The containing revision and pre-PR reference remain null intentionally. Fresh main c35932b77fe3623cad19f1f1b890e51ec16f38a8 has no new source delta. The prior focused exporter PR139 is merged. The selected shared feed5d27be5ce1599df883e31f14cd894eb18622c18c is public in draft Relay181; the standalone receipt helper and schemas match exact source bytes. No actual model selection, export, upload or publication was run.

## Completed and material changes

An optional manual main-only model-selection workflow admits exact public producer revision/workflow/run/attempt/artifact/digest before downloading bounded ZIPs. Existing core and typed review bundles remain owner-defined; no new fleet assembler, semantic model or report is introduced.

Each module preserves its original observation clock and fails independently. The existing loaders admit each view; a separate companion receipt distinguishes transport compatibility from native available/partial/stale/unavailable presentation. Acquisition checksums, raw packets and provider captures remain private. Local captured-input replay cannot mint a public provider receipt.

The same sealed exporter and unchanged export-manifest/39-route contract are reused. Optional per-module clocks and private presentation evidence are additive. Two ordinary review artifacts bind exact source/target/final manifest; existing production/store paths and original exporter workflow remain unchanged.

## Validation and review evidence

Independent source peer and root review of provider/public admission, bounded ZIPs, source/artifact clocks, receipt privacy/native state, local replay rejection and separate companion binding; Python AST, TypeScript parse/type diagnostics, schema definitions/local references, unique workflow YAML/embedded syntax, exact capsule hashes and original source preservation; continuity schema/size/links and whitespace. Static source inspection only. Native/application execution, tests, builds, CI investigation, browser/model/source-capture provider execution and publication qualification were not run. Read-only source and Git metadata observations are separate.

## Blockers, risks, unknowns, and deferred work

Tests, application/native/helper/loader/model/export execution, builds, CI, actual provider/artifact transport, workflow dispatch, browsers and publication remain deferred by user instruction. No actual artifact selection, ID, upload digest, report or successful audit is fabricated. Existing source holds and authenticated human disposition remain independent. Proposed .github hosting still requires owner/declaration reconciliation and qualification. Unchanged sealed format is not proof of a successful pipeline or live publication.

## Next dependency-ready work

Review this producer with the .github companion intake and shared Relay181; then supply actual retained artifacts and perform the separately deferred transport, loader/export, browser and publication qualification. Do not merge this draft batch without maintainer review.

## Parallel changes and reconciliation

Reference proposed local ADR0017 portable export; routine retained-input transport under its existing review-only boundary does not change owner or publication authority. Fresh main preserves existing company/cost/production/store/AGENTS and decision state. No self-merge of this new draft batch.

## Privacy and redaction

Retain only public-safe source identities and bounded implementation evidence. Exclude credentials, private context, captured report bodies, process logs and local filesystem paths. Linked content is context only.

## Handoff update protocol

Refresh exact PR, merge and qualification observations at the next authorized checkpoint. Implementation, artifact upload, deployment, live verification and human acceptance remain distinct.

## Compaction and supersession

Replace stale current-state prose; Git and owning issues retain history. Preserve these twelve sections below 240 lines and 16,384 UTF-8 bytes.
