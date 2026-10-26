# Canonical source and generated output — #56

Recorded 2026-10-25 (America/New_York). Alan authorized merging #103 as the
prerequisite and continuing with #56. #103 merged at
`3a7527697fd9726279f809ca89235f2fbf5ac88e`, whose tree
`68faf30731958a2ace4255068eff1db310b8df7f` equals reviewed head
`b31b30551ef13766524178f364ea466e0e4f9f1f`. Refreshed validate and dependency-review
checks failed; source CodeQL also failed. No gates changed. #53 C browser/visual
acceptance remains open. #73 still belongs to #29/#52 conflict reconciliation.

## A — Inventory and bounded disposition

A fresh clone of merged source has the following tracked generated output:

| Output | Files | Bytes | Planned disposition / generator |
| --- | ---: | ---: | --- |
| `storybook-static/` | 63 | 8,544,669 | Remove tracked historical build; `pnpm storybook:build` will emit `.cache/storybook` |
| `test-results/.last-run.json` | 1 | 45 | Remove stale runner status; existing Playwright profiles regenerate diagnostics |
| `packages/utilities/dist/` | 2 | 521 | Remove old declaration/map; explicit utility declaration compilation regenerates them |
| Total | 66 | 8,545,235 | Existing Git history remains recoverable |

[Exact output inventory](reviews/source-hygiene-56/generated-inventory.json) records
all paths, blob IDs, sizes and SHA-256, plus retained source contracts. No package
export points to `dist`; utilities exports its source. No current source/config
consumer uses these historical outputs. Existing ignores cover package dist and
test results; add only `/storybook-static/` for legacy command output. The explicit
Storybook command will align with #53's ignored output and retained browser profile.

There are **61 zero-byte files**, down from the earlier audit's71. Every current
path is classified in the [readable disposition table](reviews/source-hygiene-56/scaffolds.md)
and [machine-readable inventory](reviews/source-hygiene-56/scaffold-inventory.json):

| Classification | Count | Planned action |
| --- | ---: | --- |
| Required but incomplete | 21 | Retain with existing owners; emptiness does not satisfy the contract |
| Intentional future scaffold | 14 | Retain, with scope/owner visible; no implementation claimed |
| Obsolete | 26 | Remove only paths with no consumers and an identified active replacement/profile |

Obsolete groups: three API-client internal stubs, one locale hook, unused landing
and ambient stubs, three assertion-free tests, one unused environment-check stub,
ten empty package Vitest configs and six unused testing adapters. Real API/locale
implementations, app declarations, root test profiles and environment tooling stay.
Discovery before/after must match; empty tests are not passing coverage.

Keep empty `LICENSE` for #59's actual licensing decision, governance files with
#9/#29, and historical ADR0001/0002 for gated #26 backfill. Their reserved paths
and unknown rationale remain intact; no history or policy is fabricated. No empty
public assets remain. Keep source-generated design-token exports under ADR0003,
MSW's integration asset, real fixtures, reviewed screenshots/receipts, and #100's
source preservation bundle. Generated headers alone are not a removal rule.

## B — Implementation

A was saved at `f7311c089b2197658851eff166ceb6486aa3cd9d` in [draft #104](https://github.com/egohygiene/egohygiene.io/pull/104)
before removal. B removes exactly66 generated outputs and26 obsolete empty paths.
It adds the narrow legacy ignore and explicit Storybook output command described
above; README links this contract. The35 retained empty paths keep their owners.
No implementation, public assets, token files, package versions or lockfile changed.

## C — Clean-checkout proof

Published B `2697f5a967a950d7e4abb3d77615478a83567c0c`, tree
`d27295f399faf0496382f9c8b27d70161d9c2b8b`, exactly matched staging. C used a fresh
detached checkout with no dependencies, caches, app output or removed roots,
then a frozen script-disabled install using Node24.21.0/pnpm11.28.5. This evidence
follow-up changes documentation only. [Exact verification](reviews/source-hygiene-56/verification.json).

| Fresh-checkout check | Result |
| --- | --- |
| Workspace/export/boundary checks and six selected type configs | Pass |
| Root unit suite | 341 tests /45 files pass |
| Sequential website/docs/playground/Storybook builds | Pass; website26 pages/ten sitemap entries, Storybook18 entries |
| Utility declaration regeneration | Pass; output ignored, source exports still authoritative |
| Isolated #53 consumer | One test/three negative probes pass |
| Existing all-app build smoke | Three pass after fresh builds; existence proof only |
| Unit/default-browser/component-browser discovery | Same341/31/4 tests before and after; zero browser execution |
| Source/index/ignore checks | Git stays clean; output roots untracked; all seven ignore probes pass |
| Historical recovery | All66 old output blobs readable with saved hashes |

All66 files across the website/docs/playground artifacts match the fresh merged-
main baseline byte-for-byte. Storybook59/62 files match, including story index and
all preview assets. Its `project.json` timestamp/discovery statistic and two minified
addon manager bundles differ; no full-byte or browser-equivalence claim. See
[artifact comparison](reviews/source-hygiene-56/artifact-comparison.json). Discovery
comparison normalizes checkout paths and ordering while preserving multiplicity.

The existing normal-artifact scanner still fails three budget categories: documents
317,615/20,000 raw,85,589/10,000 gzip, total1,287,246/1,140,000 raw. Its44 files/202
asset references and [findings](reviews/source-hygiene-56/artifact-summary.json) are
unchanged in substance. B hosted CI40257317928, dependency40257317842 and
CodeQL40257317937 failed. No gates/ceilings changed. Existing Storybook unmatched-
glob/large-chunk and module-type warnings remain. Builds are sequential; the prior
#53 concurrent-output collision remains #52's investigation, not a fixed claim.

Local A/B/C is complete in draft #104; integration/review remains. Chromium, broad
lint/compiler/CI reconciliation, intended hosting and actual product activation
remain outside #56. No new generic cleanup framework or dependency upgrade.

## Reproduction and rollback

From a clean checkout after dependency setup:

```sh
pnpm check
pnpm typecheck
pnpm build
pnpm --filter @egohygiene/docs build
pnpm --filter @egohygiene/playground build
pnpm storybook:build
pnpm exec tsc --project packages/utilities/tsconfig.build.json
node --test tests/component-styles/consumer.test.mjs
pnpm exec vitest run --config vitest.smoke.config.ts
```

Playwright diagnostics are regenerated only by a future actual browser run;
creating a fake successful runner receipt would not validate them. A harmless
ignore probe can check the output directory without executing Chromium.

Review `git status --short` after these commands and `git ls-files` for the three
removed output roots. For recovery, restore individual paths from the pinned
pre-cleanup merge above with `git restore --source <revision> -- <path>`, or revert
the cleanup commit as a unit. This preserves original Git objects/blame; no history
rewrite or new archive of disposable output is needed.

ADR not required: this implements the existing source-export/generated-output
boundary and local ignore policy. ADR0000/0003/0014/0015 remain authoritative;
#26 historical reconstruction and #59 licensing decisions are not undertaken here.
Next after local delivery/sync: **#59 licensing and asset provenance**.
