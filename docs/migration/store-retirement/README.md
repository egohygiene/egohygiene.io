# Standalone store retirement handoff

Recorded 2026-10-25 (America/New_York). Owner:
[#100](https://github.com/egohygiene/egohygiene.io/issues/100), linked from roadmap #84.
Alan requested useful material be migrated before removing `egohygiene/store`.
This checkpoint preserves source/history and moves its knowledge/backlog into the
website. **The source repository is still present; retirement is not complete.**

## What moved and what did not

The website remains the single customer-facing storefront under ADR 0007. Its
catalog, curated artist/song views, readiness, preview and hosted-handoff work
already cover much of the separate app's intended role. No application source,
workspace package, provider configuration, deployment config or dependency was
added to the active website by this migration.

The source's useful asynchronous commerce client, Fourthwall pagination/cart
operations, injected-fetch seam, mock carts, cart UI/state patterns, tests and
research are preserved in a self-contained Git bundle. They can be recovered
without the old GitHub URL. They are **inactive reference code**, not a newly
qualified integration. [The capability guide](capabilities.md) identifies actual
reuse candidates and known defects. [The backlog ledger](backlog.md) maps all
16 open source issues to existing website owners or individually retained later
research. [Original issue bodies and comments](issues.md) preserve their detailed
requirements without forcing all product ideas into the setup milestone.

## Pinned inventory

| Item | Captured state |
| --- | --- |
| Source main | `5786fd40bfe40b0d338eb96087355b98f7e16d42` |
| Source main tree | `65404b0dda75c001cc2192125c090c908c3572d4` |
| Source main files | 111, with paths, Git blob IDs, bytes and SHA-256 in manifest.json |
| Git history | 35 reachable commits; 28 named refs: 7 branches, 19 PR heads, 2 PR merge refs; bundle also names HEAD |
| Git tags / releases | None observed |
| GitHub records | 16 open issues and 19 PR records, including 2 open Dependabot PRs |
| Discussion text | 11 conversation comments; all 19 PRs queried for combined review activity (8 duplicate conversation entries); no inline review comments returned |
| Website base | Draft #99, `f901ed6e064f8045eea5d9e1633a43707b96e924` |
| Website main | `07d25941ceeefa53089afa025b612c6aa54f36c4`, unchanged |

`github-records.json.gz` contains normalized public issue/PR bodies, states,
authors, timestamps, labels, assignees, milestone data and captured discussion
text. PR branch/commit/merge metadata is retained; repeated repository/avatar API
objects and HTML renderings are omitted. Original Markdown bodies are preserved.
This is a content/history export, not a native GitHub issue transfer or a complete
backup of every GitHub service. All list responses were below their 100-item page
limit. The source remains the live tracker until final handoff reconciliation.

The original [MIT notice](LICENSE-MIT.txt) applies to preserved source; it is not
relicensed as Apache-2.0 by moving this archive. Website #59 still owns its existing
license-declaration reconciliation. Private Incompris creative/business records
were neither read into this archive nor moved. The four mock-product SVGs remain
synthetic examples, not approved merchandise.

## Recover and verify

Run from the website repository root with Python 3 and Git:

```sh
python3 docs/migration/store-retirement/verify.py
```

The verifier checks artifact hashes and exported-record counts, verifies the
bundle, restores an offline mirror in an owned temporary directory, runs Git
object checks, compares all 28 named refs/35 commits, and checks every source-main
file plus the original license. It does not install or execute the archived app,
call a provider or contact GitHub. [Verification evidence](verification.json)
records the actual result and limits.

To retain your own restored mirror for inspection:

```sh
git clone --mirror docs/migration/store-retirement/store-source.bundle ../store-restored.git
git --git-dir=../store-restored.git show main:packages/commerce/src/fourthwall/fourthwall-client.ts
```

To read the complete GitHub record export, decompress `github-records.json.gz`
with a gzip-compatible tool. Do not confuse old instructions or proposed dependency
PRs in that snapshot with the website's current commands or approved versions.

## What still prevents retirement

1. Integrate and verify this destination handoff; a draft-only copy is not the
   final retirement destination. Keep an independently recoverable copy available.
2. Refresh source refs and issue/PR changes immediately before retirement and
   recapture any delta. Preserve the two open dependency PR proposals; they do
   not need to be merged or adopted to retire the old app.
3. Reconcile each source issue disposition with the website owner/index. The
   original issues are still open; no work is silently marked completed. Original
   source URLs will stop being useful if the repository is deleted, so use these
   local records and the website's issue #100 as the durable lookup.
4. Check the wiki with repository access. GitHub says the wiki feature is enabled,
   but its Git endpoint could not be read. That is **unverified**, not proof that
   there are no wiki pages. Also inventory/dispose of any projects, settings,
   integrations/webhooks, Actions artifacts/logs and other service data worth
   retaining; Git bundles do not contain them. No attachment URLs were found in
   the captured issue/PR/comment text, no releases were listed, and no LFS pointers
   or submodule files were found in the reachable source objects.
5. Update the old README/active links during cutover. The website product registry
   already points the Store card to `/store` with no old-store repository link; a
   search of active apps/packages/scripts/tests found no `egohygiene/store` URL.
   Historical documentation links remain provenance and broader incoming links
   still need cutover review. Then carry out the selected
   archive/delete operation only after the remaining items have concrete results.
   The connected GitHub tools used here do not expose repository archive/delete
   administration. No deletion or archive operation has been attempted.

The preservation work does not require an active cart, real product, live checkout,
paid service or second deployment. #49 remains next in the functional setup queue;
#100 retains this separate retirement follow-up. Chromium and final engineering
stay in their approved places; prior size/hosted failures are not changed or
represented as passing by this documentation/archive checkpoint.
