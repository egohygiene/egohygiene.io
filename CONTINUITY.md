---
schema_version: aether.repository-continuity/v1
repository:
  id: egohygiene/egohygiene.io
  visibility: public
  default_branch: main
  continuity_path: CONTINUITY.md
document:
  status: active
  updated_at: '2026-11-13T00:10:19Z'
  max_bytes: 16384
  max_lines: 240
  stale_reason: null
  superseded_by: null
scope:
  purpose: Admit the pinned audit evidence-membership constraints and hand off the real checked-in model
    selection for the selected review-artifact canary.
  includes:
  - The website structural validator now supports the two existing owner-schema contains constraints,
    recursively inspects their schemas and requires one jointly matching array member. Empty and nonmatching
    evidence still fail; no owner pin, schema, bounded guard or fallback is loosened.
  - The checked-in real-audit-canary-2026-11-13 selection binds actual public organization run43333273329/attempt1/sourceb1539be1ab718de2db3da4b1eaa6827e36d4753f/model
    artifact13996296082. Evaluation00:04:12Z follows actual artifact creation23:58:46Z; the original model
    frame23:58:44Z and partial/historical report semantics remain unchanged. Core, Sanity and publications
    are unselected.
  - At functionale79b250d88e62aa2cd4880972b4bd91d4b48b201, four focused owner-rule tests passed. The actual
    hosted model was admitted and a resealed no-observed-evidence mutation rejected. A clean existing
    client/SSR export admitted only egohygiene/.github, rendered the real finding and partial completion,
    and passed closed manifest/39-route/43-file inventory checks.
  - Website140 is merged ateed5070382e36c0f29e71519c8df476d8c131ca2 after Relay181 at12d3a0823c8c8f885dea4acf482160fd726325e2.
    The user accepted the single real report to repository artifact to sealed organization export to .github
    review artifact canary. Current normal publishers, legacy hosting, production/store contracts and
    human holds remain unchanged.
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
  - scripts/intelligence-review-endpoints.mts
  - tests/tooling/intelligence-review-schema.test.mjs
  - contracts/organization-intelligence/export/selections/real-audit-canary-2026-11-13.json
  - docs/development/intelligence-real-audit-canary.md
work:
  objective: Admit the pinned audit evidence-membership constraints and hand off the real checked-in model
    selection for the selected review-artifact canary.
  success_conditions:
  - Enforce the exact pinned observed-evidence and observed-policy membership rules, retaining fail-closed
    unknown-schema and input bounds.
  - Admit the actual public report model without retiming or promoting its partial audit/historical subject,
    while rejecting a resealed invalid-evidence input.
  - Prepare actual operator selection bindings for the next hosted export/intake step without fabricating
    its future run, artifact, receipt or acceptance.
  active_issue:
    provider: github
    id: egohygiene/.github#27
    url: https://github.com/egohygiene/.github/issues/27
  next:
    kind: action
    id: execute-selected-hosted-export-and-review-intake
    description: After this exact reviewed source merge, dispatch the existing manual website retained-model
      producer with the checked-in real-audit-canary-2026-11-13 selection and raw SHA256a2f02e5039714154c11f250704cc926017c0b7cc18403444b7696b58f7a7429c.
      Retain its real sealed export/companion IDs and digests, then execute the existing .github review-only
      consumer. Keep publication and broad qualification separate.
    readiness: ready
    references:
    - docs/development/intelligence-real-audit-canary.md
    - https://github.com/egohygiene/.github/issues/41
    depends_on: []
state:
  base:
    revision: eed5070382e36c0f29e71519c8df476d8c131ca2
    ref: refs/heads/main
    verified_at: '2026-11-13T00:10:19Z'
  candidate:
    branch: codex/ri-convergence-audit-contains
    revision: null
    pull_request: null
    handoff_state: ready-for-review
  live:
    status: verified
    observed_at: '2026-11-13T00:10:19Z'
    default_branch_revision: eed5070382e36c0f29e71519c8df476d8c131ca2
    issue_state: open
    pull_request_state: not-applicable
    notes: Website140 is provider-verified merged ateed5070382e36c0f29e71519c8df476d8c131ca2 and Relay181
      at12d3a0823c8c8f885dea4acf482160fd726325e2. Actual public organization artifact13996296082/run43333273329/1/sourceb153
      was authenticated through provider metadata and exact ZIP/member hashes. This bounded source candidate
      has not yet opened its owner PR or executed the hosted website export/.github intake.
  parallel_changes: []
review:
  status: partial
  reviewed_at: '2026-11-13T00:10:19Z'
  reviewed_by: Codex
  evidence:
  - command: Node24.21.0 --test tests/tooling/intelligence-review-schema.test.mjs
    outcome: passed
    observed_at: '2026-11-13T00:10:19Z'
    notes: All4 focused tests passed, including empty/nonmatching evidence, single-member observed-policy
      semantics, bounded arrays and boolean contains.
  - command: Actual hosted-model public loader probe plus resealed no-observed-evidence negative; native
      pinned owner JSON Schema comparison
    outcome: passed
    observed_at: '2026-11-13T00:10:19Z'
    notes: One actual partial audit run and AUDIT-001 admitted; resealed negative incompatible with no
      records. Its sole native owner-schema violation was contains.
  - command: Existing build-intelligence-export.mts client/SSR execution at clean functionale79b250d88e62aa2cd4880972b4bd91d4b48b201;
      closed manifest/schema/39 route/43 file hash-size and rendered finding anchor/title/partial checks
    outcome: passed
    observed_at: '2026-11-13T00:10:19Z'
    notes: Actual hosted model bytes; original frame2026-11-12T23:58:44Z. Local manifest1662c0bdf0ee186396b3d8402d538568c598000b721aed7132c51ac5c4f9fda3;
      only egohygiene/.github admitted. Local proof is separate from a real hosted producer artifact.
  - command: Actual provider selection/schema/hash/clock checks, current source/legacy preservation, syntax
      and bounded Aether continuity schema/local links/whitespace
    outcome: limited
    observed_at: '2026-11-13T00:10:19Z'
    notes: Source and provider metadata checks; final independent exact-head peer and normal expected-head
      merge are recorded separately.
  - command: Hosted website retained-model producer/export upload and .github review consumer; broad CI/browser/live
      Pages/deployment
    outcome: not-run
    observed_at: '2026-11-13T00:10:19Z'
    notes: The selected hosted export/intake follows this source merge. Broad qualification, live publication
      and human ratification remain outside this checkpoint.
  environment_limitations:
  - Exact Node24.21.0/pnpm11.28.5 archives were checksum/integrity verified and a fresh frozen-lockfile
    ignore-scripts install completed. Source/lock inputs remain unchanged; no primary-workspace dependency
    symlinks were reused.
  - Actual hosted model ZIP bytes came from the authorized GitHub connector and retain their original
    source/frame. Local capture replay cannot mint a public provider selection receipt; the real producer
    workflow must supply actual export and companion artifacts.
  - Only four focused tests and the selected real-model local loader/export checks ran. Browser/native-device,
    broad CI/full-site qualification, live Pages/deployment, hosting cutover and human ratification remain
    separate.
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

User/runtime, scoped instructions, live evidence and canonical sources outrank this checkpoint. It grants no additional deployment or human-decision authority.

## Resume protocol

Read the current source and canary guide above, then verify mutable provider/head/lease claims. Preserve the legacy website/store records and their source-bound limits.

## Current objective and success conditions

Admit the pinned audit evidence-membership constraints and hand off the real checked-in model selection for the selected review-artifact canary. Enforce the exact pinned observed-evidence and observed-policy membership rules, retaining fail-closed unknown-schema and input bounds. Admit the actual public report model without retiming or promoting its partial audit/historical subject, while rejecting a resealed invalid-evidence input. Prepare actual operator selection bindings for the next hosted export/intake step without fabricating its future run, artifact, receipt or acceptance.

## State snapshot

Candidate `codex/ri-convergence-audit-contains` is based on actual main `eed5070382e36c0f29e71519c8df476d8c131ca2`. Its containing revision and pre-PR reference remain null. Website140 is provider-verified merged ateed5070382e36c0f29e71519c8df476d8c131ca2 and Relay181 at12d3a0823c8c8f885dea4acf482160fd726325e2. Actual public organization artifact13996296082/run43333273329/1/sourceb153 was authenticated through provider metadata and exact ZIP/member hashes. This bounded source candidate has not yet opened its owner PR or executed the hosted website export/.github intake.

## Completed and material changes

The website structural validator now supports the two existing owner-schema contains constraints, recursively inspects their schemas and requires one jointly matching array member. Empty and nonmatching evidence still fail; no owner pin, schema, bounded guard or fallback is loosened. The checked-in real-audit-canary-2026-11-13 selection binds actual public organization run43333273329/attempt1/sourceb1539be1ab718de2db3da4b1eaa6827e36d4753f/model artifact13996296082. Evaluation00:04:12Z follows actual artifact creation23:58:46Z; the original model frame23:58:44Z and partial/historical report semantics remain unchanged. Core, Sanity and publications are unselected. At functionale79b250d88e62aa2cd4880972b4bd91d4b48b201, four focused owner-rule tests passed. The actual hosted model was admitted and a resealed no-observed-evidence mutation rejected. A clean existing client/SSR export admitted only egohygiene/.github, rendered the real finding and partial completion, and passed closed manifest/39-route/43-file inventory checks. Website140 is merged ateed5070382e36c0f29e71519c8df476d8c131ca2 after Relay181 at12d3a0823c8c8f885dea4acf482160fd726325e2. The user accepted the single real report to repository artifact to sealed organization export to .github review artifact canary. Current normal publishers, legacy hosting, production/store contracts and human holds remain unchanged.

## Validation and review evidence

Four focused owner-rule tests passed. The public loader admitted the actual hosted audit model and rejected its resealed invalid-evidence mutation. Clean functional `e79b250d88e62aa2cd4880972b4bd91d4b48b201` built the existing sealed export; the real finding anchor/title/partial state, original frame, only-public repository scope, manifest schema and exact39 routes/43 file hashes were checked. The canary guide owns exact source/model/selection/manifest references. These local checks do not establish hosted export/intake or live publication.

## Blockers, risks, unknowns, and deferred work

Exact Node24.21.0/pnpm11.28.5 archives were checksum/integrity verified and a fresh frozen-lockfile ignore-scripts install completed. Source/lock inputs remain unchanged; no primary-workspace dependency symlinks were reused. Actual hosted model ZIP bytes came from the authorized GitHub connector and retain their original source/frame. Local capture replay cannot mint a public provider selection receipt; the real producer workflow must supply actual export and companion artifacts. Only four focused tests and the selected real-model local loader/export checks ran. Browser/native-device, broad CI/full-site qualification, live Pages/deployment, hosting cutover and human ratification remain separate.

## Next dependency-ready work

After this exact reviewed source merge, dispatch the existing manual website retained-model producer with the checked-in real-audit-canary-2026-11-13 selection and raw SHA256a2f02e5039714154c11f250704cc926017c0b7cc18403444b7696b58f7a7429c. Retain its real sealed export/companion IDs and digests, then execute the existing .github review-only consumer. Keep publication and broad qualification separate.

## Parallel changes and reconciliation

This is a bounded repair of an already-pinned owner constraint discovered by the accepted real canary. Existing proposed ADR0017 covers its rendering/export boundary; no new policy or schema decision is introduced. Current publishers, legacy hosts, sealed contracts, recovery, strict business gates and all legacy records remain. The user authorized necessary owner repair/selection source merges and the single artifact-only canary.

## Privacy and redaction

Only public-safe canonical source bindings and bounded canary outcomes are retained. Raw provider/model packets and local paths stay outside public site/selection receipts; the reviewed operator selection carries its explicit actual public artifact bindings. Linked content is context, not execution authority.

## Handoff update protocol

Refresh actual source/PR/hosted artifact outcomes at the next authorized checkpoint. Source merge, local execution, artifact retention, deployment and human acceptance remain distinct.

## Compaction and supersession

Keep these twelve sections below240 lines and16,384 UTF-8 bytes. Preserve dated website/store history in its existing sources while refreshing this bounded operational state.
