# Context provenance ledger

Recorded 2026-10-13. This ledger routes to evidence without duplicating asset
masters, full test logs or private source inventories. Git history preserves
earlier versions; retain dated entries when the current handoff changes.

| Claim / record | Evidence and revision | Limits |
| --- | --- | --- |
| Store ownership and consolidation direction | [High-level ADR-004](../../DECISIONS.md#adr-004-consolidate-the-store-v1-website-and-use-hosted-checkout), [original architecture](../architecture/store-v1.md), [migration ledger](../migration/store-v1-consolidation.md) | The original ledger is a 2026-10-10 snapshot at website `524aa4c139e926ca549f6bef067fc9ed40d15afb`; do not treat its PR states or proposed migration work as current completion. |
| Existing Fourthwall preview decision | [Implementation ADR 0004](../architecture/decisions/0004-adapt-fourthwall-for-local-store-preview.md), present on main `1c635ea2af5b254c8cd1200f479585fd941b2c33` | The ADR pins the inspected upstream starter at `e571fffe4ab7b51fa08b7441055ca0e3d92a3eeb` and states that no implementation was copied. Provider facts were researched then; reverify before live qualification. |
| Heartburst display derivative | [Asset provenance/export record](../../assets/designs/heartburst/README.md), [merged PR #71](https://github.com/egohygiene/egohygiene.io/pull/71), merge `1c635ea2af5b254c8cd1200f479585fd941b2c33` | Asset record pins the private pack revision, source blobs/SHA-256, derivative SHA-256 and conversion command. This context update uses that recorded lineage, not a new retrieval of private masters. Public proof is not print approval. |
| Portable store boundary and adapter | [Implementation ADR 0005](../architecture/decisions/0005-portable-store-domain.md), [draft PR #72](https://github.com/egohygiene/egohygiene.io/pull/72), implementation `08a092b1b576abf9c4b7ea182ec423a586ed5b34` | Decision recorded for the local checkpoint; delivery is still a draft PR. The alternate provider payload is fictional, not an external API contract. |
| Local verification, bundle and rollback evidence | [Checkpoint receipt](../architecture/store-domain-checkpoint.md) at implementation `08a092b1b576abf9c4b7ea182ec423a586ed5b34` | Reports 38 catalog tests + 23 focused unit tests, types/checks/builds, and exact byte/gzip methodology. Browser smoke was blocked before the journeys ran. Documentation updates do not turn these into new test runs. |
| GitHub CI failure evidence | [Validation run](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659599), [dependency-review run](https://github.com/egohygiene/egohygiene.io/actions/runs/38415659412) for PR #72's implementation head | Validation stopped at 37 formatting diagnostics. Dependency review reported unsupported repository configuration. Not evidence that later CI tests ran or that dependencies were reviewed successfully. |
| Repository context layer | Maintainer request on 2026-10-13 to preserve agent instructions, ADRs, provenance and restart context; this documentation change in PR #72 | Task authorization is scoped to the requested update. No transcript, private Drive inventory or new operational authority is embedded here. |

## Merge receipt — 2026-10-13

The maintainer explicitly requested merging PR #72 and returning to choose the
next issue. GitHub confirmed [PR #72](https://github.com/egohygiene/egohygiene.io/pull/72)
merged at 15:25:52 UTC with merge commit
`0b536b9f62c5921d70c515fdd102001dd39e7f37`, preserving implementation
`08a092b1b576abf9c4b7ea182ec423a586ed5b34` and context commit
`e7cf8581e8ec7d80e221c42e18f034465d245ff3`. The earlier draft-state entries above
are historical observations. The local checkout was fast-forwarded to `main`.

At the approved PR head, GitHub reported no merge conflicts or submitted/inline
review comments. The [validation log](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486285)
again reported 37 formatting errors before subsequent CI tests, and
[dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/38420486278)
again reported unsupported repository configuration and requested Dependency
graph. The normal merge API accepted the expected head; no checks or repository
settings were disabled or bypassed. This is a merge receipt, not a new runtime,
browser or post-merge CI pass. #69 remains open and no next issue is selected.

## CI repair checkpoint — 2026-10-13

The maintainer selected #29's CI repair after the architecture merge, with
hosting/deployment still deferred. Implementation
`48223775dde607c2116d0e78f9c5bed5f487ef7c` is in
[draft PR #73](https://github.com/egohygiene/egohygiene.io/pull/73), based on main
`db634b887ede348ce85d9c03af789467ab535dcf`. The
[CI guide](../development/ci-baseline.md) records sources, local commands, scope,
rollback and verification results. It pins the inspected upstream CodeQL workflow
revision that lacked `workflow_call`; supported action entry points replace it.

Complete local `pnpm ci:check` passed, including 38 catalog, 64 unit and 10 tooling
tests, current types/boundaries, production and Storybook builds. The isolated
preview build and actionlint 1.7.12 checks also passed. Browser discovery found
23 journeys; no local browser run was inferred from it. Of the changed source
files, 31 match exactly the formatter output for their base contents; first-party
lint repairs account for the other formatted source changes. Generated token
outputs, the upstream MSW worker, old tracked Storybook assets and the lockfile
retain their base bytes. Warnings and profile gaps remain documented.

The maintainer reported enabling Dependency graph at 11:54 America/New_York.
The [dependency-review job](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467658)
still returned the same unsupported-configuration error at 11:57 for the named
implementation. This is an observed check result, not an independent read of the
admin setting. New [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467586)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/38426467708)
jobs ran automatically for the PR; no manual rerun/dispatch or gate bypass
was used. Both completed successfully for implementation
`48223775dde607c2116d0e78f9c5bed5f487ef7c`. The CI log confirms 112 non-browser
tests, the existing type/boundary/build gates and **23 browser journeys passed**
(3 legacy, 18 production store/theme, 2 isolated preview). CodeQL's log confirms
successful results upload and completed analysis processing. This closes the
execution gap for those specific journeys, not broader visual, accessibility,
cross-browser, deployment or security qualification. Dependency review remains
failed. Refresh the current PR head before assuming a later documentation update
has its own completed checks.

## Recording the next receipt

Record the source path or stable URL, observation date, exact implementation
commit and result. Distinguish observed facts, inherited historical evidence,
accepted decisions and proposals. State coverage gaps such as an unavailable
browser, unverified private master or skipped check. For asset bytes, preserve
source and derivative hashes and export method in the asset-local record.

Use live issue/PR links for current delivery status and commit links or dated
receipts for reproducible evidence. Neither a hash nor a merged PR establishes
copyright ownership, manufacturing quality, deployment or successful checkout.
