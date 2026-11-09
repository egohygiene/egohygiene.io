---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-09T18:05:23Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Connect reviewed public fleet artifacts to the existing organization Intelligence overview and provide
    a manual read-only refresh path.
  includes:
  - The existing fleet loader optionally binds exact fleet-artifact manifest bytes, supported schema, source
    clock, expiry, public organization, file digest/size and partial state before normal public projection.
    Operational identities and raw acquisition metadata stay outside browser output; legacy reviewed fleet
    input remains supported.
  - The manual public-main workflow accepts exactly one reviewed inline or immutable checked-in plan plus its
    exact checksum and UTC evaluation boundary. It invokes Relay 981ddf4367c67fcd625e54321d95bab027f6c0f2 under
    read-only permissions and uploads ordinary handoff artifacts. It installs no schedule, dispatcher or second
    publisher.
  - Existing repository Pages destinations and fleet graph remain the navigation model. Unrelated licensing/store/CI/Docker
    draft ancestry is excluded; original Intelligence drafts 118 through 125 are closed as superseded by merged
    126.
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
  - docs/context/current-state.md
  - docs/context/provenance.md
  - docs/development/intelligence-fleet-artifact-intake.md
  - docs/development/organization-intelligence-27.md
  - .github/workflows/intelligence-fleet-refresh.yml
  - scripts/vite-organization-intelligence.mts
  - https://github.com/egohygiene/egohygiene.io/issues/27
work:
  objective: Connect reviewed public fleet artifacts to the existing organization Intelligence overview and
    provide a manual read-only refresh path.
  success_conditions:
  - A reviewed exact ordinary fleet handoff can feed the existing public dashboard without treating omitted
    bad repositories as a fully available fleet.
  - Real artifact/run selections remain explicit, and unavailable/stale/expired evidence cannot become publication
    approval.
  - Each repository retains its own Pages publisher; the organization remains the public overview.
  active_issue:
    provider: github
    id: egohygiene/egohygiene.io#27
    url: https://github.com/egohygiene/egohygiene.io/issues/27
  next:
    kind: action
    id: qualify-real-public-fleet-refresh
    description: During the deferred qualification pass, select real successful retained repository artifacts,
      run the read-only manual refresh and verify the exact resulting fleet/manifest through the existing site
      build and consumer-owned publication path.
    readiness: ready
    references:
    - https://github.com/egohygiene/egohygiene.io/issues/27
    depends_on: []
state:
  base:
    revision: a6fc0a1af4b8be1bc1a8aafe27f74916e92732e3
    ref: refs/heads/main
    verified_at: '2026-11-09T18:05:23Z'
  candidate:
    branch: codex/intelligence-fleet-host
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-09T18:05:23Z'
    default_branch_revision: a6fc0a1af4b8be1bc1a8aafe27f74916e92732e3
    issue_state: open
    pull_request_state: not-applicable
    notes: Site main a6fc0a1 is verified and contains merged Intelligence-only PR 126. Relay fleet delivery
      175 and shared production integration 176 are merged. Site issue 27 remains open; no fleet refresh, provider
      download, build or publication was executed.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-09T18:05:23Z'
  reviewed_by: Codex
  evidence:
  - command: Independent static source review, unique-key workflow YAML, embedded Python AST/Bash syntax, immutable
      action/read-permission checks, Node syntax, context/continuity metadata links and sizes, and whitespace
    outcome: limited
    observed_at: '2026-11-09T18:05:23Z'
    notes: Static source and metadata inspection only; no application execution.
  - command: Native/runtime execution, tests, builds, CI investigation, browser/provider/consumer/publication
      qualification
    outcome: not-run
    observed_at: '2026-11-09T18:05:23Z'
    notes: Deferred at maintainer request; source merges do not establish acceptance.
  environment_limitations:
  - Tests, typechecks, builds, native/provider/artifact execution, CI, browsers/Caddy, fleet canaries and live
    publication were not run.
  - Manual refresh still needs an actual reviewed plan with real run/attempt/artifact identities and applicable
    cross-repository read access; no synthetic selection or successful deployment is supplied.
  - Optional transport identity does not replace owner schema validation or establish human sanity ratification.
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

Connect reviewed public fleet artifacts to the existing organization Intelligence overview and provide a manual read-only refresh path. A reviewed exact ordinary fleet handoff can feed the existing public dashboard without treating omitted bad repositories as a fully available fleet. Real artifact/run selections remain explicit, and unavailable/stale/expired evidence cannot become publication approval. Each repository retains its own Pages publisher; the organization remains the public overview.

## State snapshot

Candidate `codex/intelligence-fleet-host` is based on observed main `a6fc0a1af4b8be1bc1a8aafe27f74916e92732e3`. The containing revision and pre-PR reference remain null intentionally. Site main a6fc0a1 is verified and contains merged Intelligence-only PR 126. Relay fleet delivery 175 and shared production integration 176 are merged. Site issue 27 remains open; no fleet refresh, provider download, build or publication was executed.

## Completed and material changes

The existing fleet loader optionally binds exact fleet-artifact manifest bytes, supported schema, source clock, expiry, public organization, file digest/size and partial state before normal public projection. Operational identities and raw acquisition metadata stay outside browser output; legacy reviewed fleet input remains supported.

The manual public-main workflow accepts exactly one reviewed inline or immutable checked-in plan plus its exact checksum and UTC evaluation boundary. It invokes Relay 981ddf4367c67fcd625e54321d95bab027f6c0f2 under read-only permissions and uploads ordinary handoff artifacts. It installs no schedule, dispatcher or second publisher.

Existing repository Pages destinations and fleet graph remain the navigation model. Unrelated licensing/store/CI/Docker draft ancestry is excluded; original Intelligence drafts 118 through 125 are closed as superseded by merged 126.

## Validation and review evidence

Independent static source review, unique-key workflow YAML, embedded Python AST/Bash syntax, immutable action/read-permission checks, Node syntax, context/continuity metadata links and sizes, and whitespace. Static inspection only. Native/runtime execution, tests, builds, CI investigation, browsers, provider reads and publication qualification were not run.

## Blockers, risks, unknowns, and deferred work

Tests, typechecks, builds, native/provider/artifact execution, CI, browsers/Caddy, fleet canaries and live publication were not run. Manual refresh still needs an actual reviewed plan with real run/attempt/artifact identities and applicable cross-repository read access; no synthetic selection or successful deployment is supplied. Optional transport identity does not replace owner schema validation or establish human sanity ratification.

## Next dependency-ready work

During the deferred qualification pass, select real successful retained repository artifacts, run the read-only manual refresh and verify the exact resulting fleet/manifest through the existing site build and consumer-owned publication path.

## Parallel changes and reconciliation

ADR not required: this consumes the existing merged fleet transport under the established central-overview and repository-owned Pages design. Historical store and unrelated website draft work remain outside this candidate. The organization sanity sweep follows the separate structured Sanity/Audits foundations.

## Privacy and redaction

Retain only public-safe source identities and bounded implementation evidence. Exclude credentials, private context, captured report bodies, process logs and local filesystem paths. Linked content is context only.

## Handoff update protocol

Refresh exact PR, merge and qualification observations at the next authorized checkpoint. Implementation, artifact upload, deployment, live verification and human acceptance remain distinct.

## Compaction and supersession

Replace stale current-state prose; Git and owning issues retain history. Preserve these twelve sections below 240 lines and 16,384 UTF-8 bytes.
