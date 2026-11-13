---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-13T05:18:12Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Deliver Light, Dark and System appearance on the portable Organization Intelligence dashboard using
    the existing shared theme owner.
  includes:
  - Functional cbe8b1ece8fe7ca1904963c6303310d5988a9fd0 adds a native System/Light/Dark selector to the shared
    export shell. It reuses ThemeProvider, semantic tokens and the existing preference key; ordinary website
    controls stay unchanged. Saved high contrast is preserved until an explicit primary-mode choice.
  - A synchronous same-origin assets/theme-preference.js resolves the actual palette before styles/content
    on canonical pages, aliases and fallback. Shared allowed values/key feed the script; SSR/first hydration
    match. Storage getter/quota failures remain usable in memory. No dependency or CSP change.
  - Actual-input sealed export has 39 routes / 44 files (one additive bootstrap), manifest 4f252c5eaad92dc716d580b083a34250ae41634be5a5d0745ccfa9b131f1dbfd.
    Unchanged pinned Relay native intake accepts review-only directory transport; receipt 2cdbcb9d84edef44b6306f0357e78f92c9265789037090be8af4d5e93b0308c7
    is deployment-unauthorized.
  - Existing actual Audit/Sanity inputs retain 2026-11-13T03:23:31Z model clocks, one target row and partial/unreviewed
    states; Core stays unavailable. Owner contracts, input selection, publisher workflows, historical receipts
    and company/store boundaries remain unchanged.
  excludes:
  - Report/model retiming, owner/schema/helper/pin/workflow changes, fabricated fleet rows or human ratification.
  - Broad CI/full-site/store qualification, unrelated layout repair and consumer publication from this source
    worktree. Actual theme export/intake/Pages delivery remains the next coordinated step.
  precedence:
  - user-and-runtime-instructions
  - scoped-repository-instructions
  - live-repository-and-work-tracker-state
  - canonical-repository-sources
  - continuity-checkpoint
  canonical_sources:
  - AGENTS.md
  - apps/egohygiene.io/AGENTS.md
  - packages/themes/src/components/ThemeProvider.tsx
  - packages/themes/src/initialization-script.ts
  - apps/egohygiene.io/src/features/intelligence/export/AppearanceControl.tsx
  - scripts/build-intelligence-export.mts
  - docs/development/intelligence-appearance.md
  - contracts/organization-intelligence/export/selections/organization-sweep-2026-11-13.json
  - docs/architecture/decisions/0003-design-token-architecture.md
  - docs/architecture/decisions/0017-portable-intelligence-export.md
  - docs/context/current-state.md
  - docs/context/provenance.md
  - https://github.com/egohygiene/egohygiene.io/issues/146
work:
  objective: Deliver Light, Dark and System appearance on the portable Organization Intelligence dashboard
    using the existing shared theme owner.
  success_conditions:
  - Expose accessible primary choices throughout the exported dashboard/detail routes while keeping a shared
    preference owner.
  - Preserve explicit choices across reload/navigation; follow live OS changes for System and safely handle
    unavailable storage.
  - Prove pre-hydration palette, matching SSR, sealed resource inventory and actual-input browser behavior;
    then deliver through existing export/intake/publisher and verify live.
  active_issue:
    provider: github
    id: egohygiene/egohygiene.io#146
    url: https://github.com/egohygiene/egohygiene.io/issues/146
  next:
    kind: action
    id: deliver-theme-through-existing-publisher
    description: 'After exact final-head peer and root ordinary merge, dispatch the existing website model-artifact
      exporter on actual main with the unchanged organization-sweep-2026-11-13 selection. Inspect actual artifacts/44-file
      manifest, run existing retained-models intake, replace the consumer selection through its normal publisher,
      then verify actual canonical HTTPS bytes and Light/Dark/System behavior. Keep #146 open until live theme
      verification; parent #41 acceptance remains separate.'
    readiness: ready
    references:
    - https://github.com/egohygiene/egohygiene.io/issues/146
    depends_on: []
state:
  base:
    revision: 342673b110915f4a29ada01625a77416a1e105d7
    ref: refs/heads/main
    verified_at: '2026-11-13T05:18:12Z'
  candidate:
    branch: codex/intelligence-theme-modes
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-13T05:18:12Z'
    default_branch_revision: 342673b110915f4a29ada01625a77416a1e105d7
    issue_state: open
    pull_request_state: not-applicable
    notes: Actual website origin/main remains 342673b110915f4a29ada01625a77416a1e105d7 (queried read-only).
      The theme candidate is not yet hosted. Root/publisher report the initial prior dashboard live; this local
      source checkpoint makes no new deployment claim.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-13T05:18:12Z'
  reviewed_by: Codex
  evidence:
  - command: 35 focused shared-theme/control tests; themes build TypeScript; scoped Biome no errors; whitespace;
      actual-input clean export 39 routes / 44 hashes; unchanged native Relay intake; 10 Chromium 151 browser
      groups including 12 held-hydration startup cases, actual palette, media/storage/persistence, all routes,
      keyboard/focus, 390px mobile and visible no-JS content; independent exact functional/native peer
    outcome: limited
    observed_at: '2026-11-13T05:18:12Z'
    notes: All listed focused checks pass at clean functional cbe8b1. Manifest4f252c5e/receipt 2cdbcb9d are
      actual local bytes; browser replay has zero console/page errors and all 44 files unchanged before/after.
      Final documentation exact-head bind and actual hosted/live theme delivery remain separate.
  - command: Actual hosted theme export/companion, consumer retained-model intake and replacement Pages deployment/live
      behavior
    outcome: not-run
    observed_at: '2026-11-13T05:18:12Z'
    notes: These follow ordinary source integration under root/publisher coordination. Existing source test
      success does not establish live delivery or broader human acceptance.
  environment_limitations:
  - 'Local replay/native directory intake do not mint provider acquisition, finalization or deployment receipts.
    #146 stays open for actual delivery/live proof.'
  - One public target contains the organization review; original model/report/source clocks and independent
    partial/human states remain unchanged. Existing unrelated Audits mobile overflow/full-site accessibility,
    broad CI and company/store gates are outside this bounded feature.
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

Deliver Light, Dark and System appearance on the portable Organization Intelligence dashboard using the existing shared theme owner. Expose accessible primary choices throughout the exported dashboard/detail routes while keeping a shared preference owner. Preserve explicit choices across reload/navigation; follow live OS changes for System and safely handle unavailable storage. Prove pre-hydration palette, matching SSR, sealed resource inventory and actual-input browser behavior; then deliver through existing export/intake/publisher and verify live.

## State snapshot

Candidate `codex/intelligence-theme-modes` is based on observed main `342673b110915f4a29ada01625a77416a1e105d7`. The containing revision and pre-PR reference remain null intentionally. Actual website origin/main remains 342673b110915f4a29ada01625a77416a1e105d7 (queried read-only). The theme candidate is not yet hosted. Root/publisher report the initial prior dashboard live; this local source checkpoint makes no new deployment claim.

## Completed and material changes

Functional cbe8b1ece8fe7ca1904963c6303310d5988a9fd0 adds a native System/Light/Dark selector to the shared export shell. It reuses ThemeProvider, semantic tokens and the existing preference key; ordinary website controls stay unchanged. Saved high contrast is preserved until an explicit primary-mode choice.

A synchronous same-origin assets/theme-preference.js resolves the actual palette before styles/content on canonical pages, aliases and fallback. Shared allowed values/key feed the script; SSR/first hydration match. Storage getter/quota failures remain usable in memory. No dependency or CSP change.

Actual-input sealed export has 39 routes / 44 files (one additive bootstrap), manifest 4f252c5eaad92dc716d580b083a34250ae41634be5a5d0745ccfa9b131f1dbfd. Unchanged pinned Relay native intake accepts review-only directory transport; receipt 2cdbcb9d84edef44b6306f0357e78f92c9265789037090be8af4d5e93b0308c7 is deployment-unauthorized.

Existing actual Audit/Sanity inputs retain 2026-11-13T03:23:31Z model clocks, one target row and partial/unreviewed states; Core stays unavailable. Owner contracts, input selection, publisher workflows, historical receipts and company/store boundaries remain unchanged.

## Validation and review evidence

35 focused shared-theme/control tests; themes build TypeScript; scoped Biome no errors; whitespace; actual-input clean export 39 routes / 44 hashes; unchanged native Relay intake; 10 Chromium 151 browser groups including 12 held-hydration startup cases, actual palette, media/storage/persistence, all routes, keyboard/focus, 390px mobile and visible no-JS content; independent exact functional/native peer. Focused execution passed on clean functional cbe8b1 using pinned Node 24.21.0 / pnpm 11.28.5 and fresh frozen ignore-scripts dependencies. Browser replay is explicitly local at the declared origin, not a provider or live-HTTPS claim.

## Blockers, risks, unknowns, and deferred work

Local replay/native directory intake do not mint provider acquisition, finalization or deployment receipts. #146 stays open for actual delivery/live proof. One public target contains the organization review; original model/report/source clocks and independent partial/human states remain unchanged. Existing unrelated Audits mobile overflow/full-site accessibility, broad CI and company/store gates are outside this bounded feature.

## Next dependency-ready work

After exact final-head peer and root ordinary merge, dispatch the existing website model-artifact exporter on actual main with the unchanged organization-sweep-2026-11-13 selection. Inspect actual artifacts/44-file manifest, run existing retained-models intake, replace the consumer selection through its normal publisher, then verify actual canonical HTTPS bytes and Light/Dark/System behavior. Keep #146 open until live theme verification; parent #41 acceptance remains separate.

## Parallel changes and reconciliation

Root independently clears functional cbe8b1; theme reviewer independently clears all 44 hashes / 39 routes / fallback, unchanged CSP and native intake. Publisher owns the actual downstream replacement after merge. Preserve the initial live selection and immutable previous recovery bytes; no competing renderer or publisher is introduced.

## Privacy and redaction

Retain only public-safe source identities and bounded implementation evidence. Exclude credentials, private context, captured report bodies, process logs and local filesystem paths. Linked content is context only.

## Handoff update protocol

Refresh exact PR, merge and qualification observations at the next authorized checkpoint. Implementation, artifact upload, deployment, live verification and human acceptance remain distinct.

## Compaction and supersession

Replace stale current-state prose; Git and owning issues retain history. Preserve these twelve sections below 240 lines and 16,384 UTF-8 bytes.
