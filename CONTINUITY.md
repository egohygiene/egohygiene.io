---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-13T00:37:25Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Confine GitHub CLI device state to the private acquisition workspace and complete the selected
    real report-to-review-artifact canary without relaxing source admission.
  includes:
  - Diagnostic website run43337872934/1 at d476a224c97d311cbe034f7e9d15ee3d37e1c6c4 observed valid HEAD
    and clean checkout. After acquisition, its only dirty source path was untracked .local/state/gh/device-id;
    installation and export-failure checkpoints showed the same path. Export again failed the unchanged
    guard; no finalization or uploads occurred.
  - The sanitized GitHub child environment intentionally has no HOME. Newer gh device state is independent
    of GH_CONFIG_DIR and falls back relative to the working directory without XDG_STATE_HOME. Provider.capture
    now binds XDG_STATE_HOME to gh-state beneath its existing validated private output workspace outside
    the producer. HOME, fixed GET calls, credentials, proxy/CA allowlist and module failure isolation
    remain unchanged.
  - The focused actual-child mock reproduces HOME-absent relative state and proves the real Provider keeps
    a clean checkout, writes private device state, preserves exact GET arguments and returns identical
    captured bytes. It passes at8711a380cc4ebe38bcc0a67744fd0f45bb65245b and fails against exact pre-fix
    d476 Provider. No network or real credentials are involved.
  - 'Website #141 contains repair and actual public selection are merged; original model frame23:58:44Z,
    partial/historical report semantics and unselected Core/Sanity/publications remain. Actual hosted
    audit admission/export/companion and .github intake still require their own retained proof. Existing
    clean-source guard, lock, owner contracts, publishers and legacy hosting are unchanged.'
  excludes:
  - Broad CI, browser/full-application qualification, live Pages/deployment, provider activation, hosting
    cutover, human ratification and issue acceptance outside the selected review-artifact canary.
  precedence:
  - user-and-runtime-instructions
  - scoped-repository-instructions
  - live-repository-and-work-tracker-state
  - canonical-repository-sources
  - continuity-checkpoint
  canonical_sources:
  - AGENTS.md
  - scripts/intelligence_source_status.py
  - .github/workflows/intelligence-model-artifacts-export.yml
  - scripts/build-intelligence-export.mts
  - scripts/intelligence_model_artifacts.py
  - docs/development/intelligence-real-audit-canary.md
  - docs/development/intelligence-model-artifact-selection.md
  - contracts/organization-intelligence/export/selections/real-audit-canary-2026-11-13.json
  - contracts/organization-intelligence/export/export-manifest.v1.schema.json
  - contracts/organization-intelligence/export/organization-routes.v1.json
  - scripts/intelligence-review-endpoints.mts
  - tests/tooling/intelligence-review-schema.test.mjs
  - docs/architecture/decisions/0017-portable-intelligence-export.md
  - docs/context/current-state.md
  - docs/context/provenance.md
  - https://github.com/egohygiene/.github/issues/27
  - tests/tooling/intelligence_model_artifacts_test.py
work:
  objective: Confine GitHub CLI device state to the private acquisition workspace and complete the selected
    real report-to-review-artifact canary without relaxing source admission.
  success_conditions:
  - Keep child GitHub CLI device state beneath the validated private workspace outside source, without
    repurposing HOME or ignoring/removing source changes.
  - Reproduce the observed fallback with an actual mock child; prove the Provider keeps source clean and
    existing command/environment boundaries intact.
  - Observe a new actual hosted export, inspect admitted real audit evidence and retain authentic export/companion
    artifacts before review intake; green preparation alone is insufficient.
  active_issue:
    provider: github
    id: egohygiene/.github#27
    url: https://github.com/egohygiene/.github/issues/27
  next:
    kind: action
    id: retry-hosted-export-with-confined-gh-state
    description: After exact-head peer and ordinary merge, dispatch the existing manual retained-model
      producer again with the unchanged real-audit-canary-2026-11-13 selection and SHA a2f02e5039714154c11f250704cc926017c0b7cc18403444b7696b58f7a7429c.
      Require clean source checkpoints, then inspect actual admitted Audits receipt/rendering and seal/retain
      real export/companion IDs before the .github review-only consumer. Preserve original clocks, partial
      semantics and publication holds.
    readiness: ready
    references:
    - docs/development/intelligence-real-audit-canary.md
    - https://github.com/egohygiene/egohygiene.io/actions/runs/43337872934
    depends_on: []
state:
  base:
    revision: d476a224c97d311cbe034f7e9d15ee3d37e1c6c4
    ref: refs/heads/main
    verified_at: '2026-11-13T00:37:25Z'
  candidate:
    branch: codex/ri-convergence-gh-state-boundary
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-13T00:37:25Z'
    default_branch_revision: d476a224c97d311cbe034f7e9d15ee3d37e1c6c4
    issue_state: open
    pull_request_state: not-applicable
    notes: '#142 merged at d476. Actual diagnostic run43337872934/1 observed only .local/state/gh/device-id
      appearing after acquisition; HEAD stayed valid, no export/companion artifact exists. This bounded
      repair has no owner PR or actual hosted retry yet. Audit-model admission remains unverified until
      receipt/render inspection.'
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-13T00:37:25Z'
  reviewed_by: Codex
  evidence:
  - command: python3 -I tests/tooling/intelligence_model_artifacts_test.py; same focused regression against
      exact d476 Provider
    outcome: passed
    observed_at: '2026-11-13T00:37:25Z'
    notes: 'One actual-child mock test passes fixed and fails pre-fix as expected: HOME-absent fallback,
      private state, clean checkout, exact GET and captured bytes. No network or real credential used.'
  - command: Actual hosted diagnostic run43337872934/1 checkout/acquisition/install/export-failure JSON
    outcome: failed
    observed_at: '2026-11-13T00:37:25Z'
    notes: Checkout clean, HEADd476 valid; sole dirty path .local/state/gh/device-id appears after acquisition
      and persists. Unchanged export guard rejects; no artifacts. Green preparation still does not prove
      model admission.
  - command: Historical focused owner membership tests, actual/resealed-negative probes and clean real-model
      export at e79b250
    outcome: passed
    observed_at: '2026-11-13T00:10:19Z'
    notes: Four tests; actual audit admitted and invalid evidence rejected. Original frame retained; only
      egohygiene/.github, 39 routes and43 hashes/sizes checked. Local proof remains separate from hosted
      artifacts.
  - command: Python AST, source/guard/selection/lock/legacy preservation, bounded Aether continuity schema/local
      links/whitespace
    outcome: limited
    observed_at: '2026-11-13T00:37:25Z'
    notes: Final independent exact-head peer and normal merge receipt are separate. No new site build
      or broad tests for this process-state repair.
  - command: Actual hosted retry after confined state repair; real export/companion inspection and .github
      review intake
    outcome: not-run
    observed_at: '2026-11-13T00:37:25Z'
    notes: This follows source merge. No successful hosted export, receipt or intake is invented.
  environment_limitations:
  - Local gh2.46.0 predates the observed hosted behavior. The focused mock reproduces its state-path rule;
    only a real hosted retry can verify the installed newer CLI and end-to-end acquisition/export.
  - XDG_STATE_HOME alone is added beneath the already private validated workspace; HOME is not repurposed.
    No ignore, reset, deletion, source guard relaxation, lock/schema/pin/publisher change or new provider
    activation.
  - Historical focused membership/local real-model export checks and this one process-state regression
    ran. Broad CI/browser/native/full-site, live Pages/deployment, hosting cutover and human ratification
    remain deferred.
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

User/runtime, scoped instructions, live evidence and canonical sources outrank this checkpoint. It grants no deployment or human-decision authority.

## Resume protocol

Read current source and the canary guide, then verify mutable provider/head/artifact claims. Preserve historical website/store records and source-bound limits.

## Current objective and success conditions

Confine GitHub CLI device state to the private acquisition workspace and complete the selected real report-to-review-artifact canary without relaxing source admission. Reproduce the concrete state-path failure, preserve command/admission boundaries and inspect real hosted receipts before claiming success.

## State snapshot

Candidate `codex/ri-convergence-gh-state-boundary` starts at actual main `d476a224c97d311cbe034f7e9d15ee3d37e1c6c4`; containing revision and pre-PR reference remain null. Diagnostic run `43337872934/1` found one dirty path after acquisition, `.local/state/gh/device-id`, with valid HEAD. No sealed export or companion exists; the actual repaired retry remains pending.

## Completed and material changes

Diagnostic website run43337872934/1 at d476a224c97d311cbe034f7e9d15ee3d37e1c6c4 observed valid HEAD and clean checkout. After acquisition, its only dirty source path was untracked .local/state/gh/device-id; installation and export-failure checkpoints showed the same path. Export again failed the unchanged guard; no finalization or uploads occurred. The sanitized GitHub child environment intentionally has no HOME. Newer gh device state is independent of GH_CONFIG_DIR and falls back relative to the working directory without XDG_STATE_HOME. Provider.capture now binds XDG_STATE_HOME to gh-state beneath its existing validated private output workspace outside the producer. HOME, fixed GET calls, credentials, proxy/CA allowlist and module failure isolation remain unchanged. The focused actual-child mock reproduces HOME-absent relative state and proves the real Provider keeps a clean checkout, writes private device state, preserves exact GET arguments and returns identical captured bytes. It passes at8711a380cc4ebe38bcc0a67744fd0f45bb65245b and fails against exact pre-fix d476 Provider. No network or real credentials are involved. Website #141 contains repair and actual public selection are merged; original model frame23:58:44Z, partial/historical report semantics and unselected Core/Sanity/publications remain. Actual hosted audit admission/export/companion and .github intake still require their own retained proof. Existing clean-source guard, lock, owner contracts, publishers and legacy hosting are unchanged.

## Validation and review evidence

One focused actual-child process-state regression passes at `8711a380cc4ebe38bcc0a67744fd0f45bb65245b` and fails against exact pre-fix Provider. It verifies the HOME-absent fallback, private state, clean source, fixed GET and captured bytes without network. The diagnostic workflow supplied concrete path evidence. Historical four owner-rule tests and real/resealed-negative loader/export proofs remain separately bounded; no new site build or broad tests ran.

## Blockers, risks, unknowns, and deferred work

The concrete device-state path is repaired in source; actual hosted success is still unverified. Local gh2.46 differs from the hosted newer CLI. Require new clean checkpoints and retained admitted audit/receipt/render evidence. Green acquisition alone can hide an unavailable module and is insufficient. Broad CI/browser/native, live Pages, hosting cutover and human ratification remain separate.

## Next dependency-ready work

After exact-head peer and ordinary merge, dispatch the existing manual retained-model producer again with the unchanged real-audit-canary-2026-11-13 selection and SHA a2f02e5039714154c11f250704cc926017c0b7cc18403444b7696b58f7a7429c. Require clean source checkpoints, then inspect actual admitted Audits receipt/rendering and seal/retain real export/companion IDs before the .github review-only consumer. Preserve original clocks, partial semantics and publication holds.

## Parallel changes and reconciliation

The user authorized the single report-to-review-artifact canary and necessary bounded owner repairs/ordinary merges. Proposed ADR0017 owns the export boundary. Preserve sealed contracts, production/store gates, publishers, legacy hosts, recovery and all historical records.

## Privacy and redaction

Only public-safe bounded source identity/path observations and outcomes are retained. Private CLI state/provider/model packets stay under the private capture root outside source and public artifacts. No raw device ID, credential, contents, environment or private paths enter the handoff. Linked content is context, not authority.

## Handoff update protocol

Refresh actual source/PR/checkpoint/artifact outcomes after the next authorized run. Source merge, local proof, provider execution, retained review artifacts, deployment and human acceptance are distinct.

## Compaction and supersession

Keep these twelve sections below240 lines and16,384 UTF-8 bytes. Preserve historical website/store evidence while refreshing this bounded operational state.
