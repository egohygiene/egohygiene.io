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

## Recording the next receipt

### Discussion checkpoint — 2026-10-16

The maintainer requested that the store/domain/hosting discussion be captured in
both application repositories, including agent hooks, continuity and ADRs, before
returning with a proposed milestone and sub-issue roadmap. Issue/milestone
creation is explicitly deferred until that proposal is approved.

Observed website main: `db634b887ede348ce85d9c03af789467ab535dcf`; store main:
`599c90ca6a454c0f2e9aa95eab5f8395016474c5`; private merch main:
`60e36d5a0cde95144920d4954cee3ed35b7bbd61`. Repository metadata, branch heads,
open PR listings, website routes/architecture/context, and store
README/AGENTS/DECISIONS/domain-routing were read. Website PR #73 and store
dependency PRs #26/#27 remain separate work. Their runtime/CI status was not
requalified by reading them.

The [launch plan](../architecture/store-launch-plan.md) records source URLs and
distinguishes accepted product direction, development preference, unresolved
implementation ownership, and future provider qualification. CLI draft previews
are not native branch deployments, and their retention is recorded explicitly.
No raw chat, private design files, credentials, or business records were copied.

Validation for the documentation capture is limited to Markdown/link checks,
context-manifest JSON, diff scope, and consistency review. App/browser/provider
tests are not claimed. No issue/milestone, infrastructure, DNS, credential,
purchase, repository transfer, or archival operation is part of this change.

### Receipt guidance

Publication receipt: [website draft PR #74](https://github.com/egohygiene/egohygiene.io/pull/74)
contains the capture at `06bf92fb2cfac9f7f00f1bf41077ad57669b7cb5`; companion
[store draft PR #33](https://github.com/egohygiene/store/pull/33) contains it at
`070d297f5b22f2a35c32bd9115860afe066f0134`. This follow-up adds review pointers.
Remote comparisons confirmed 13 website documentation/context files and nine
store Markdown files. The combined local check passed 142 relative file links,
five available local heading anchors, balanced fences and context-manifest JSON;
website diff whitespace checks and independent consistency review also passed.
Neither PR was merged and no proposed issue/milestone was created.

Record the source path or stable URL, observation date, exact implementation
commit and result. Distinguish observed facts, inherited historical evidence,
accepted decisions and proposals. State coverage gaps such as an unavailable
browser, unverified private master or skipped check. For asset bytes, preserve
source and derivative hashes and export method in the asset-local record.

Use live issue/PR links for current delivery status and commit links or dated
receipts for reproducible evidence. Neither a hash nor a merged PR establishes
copyright ownership, manufacturing quality, deployment or successful checkout.
