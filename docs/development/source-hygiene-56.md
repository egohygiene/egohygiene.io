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
path is classified in the [scaffold inventory](reviews/source-hygiene-56/scaffold-inventory.json):

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

## B/C — Implementation and clean-checkout proof

Save this inventory/contract in a draft before removal. B will remove precisely
these66 outputs and26 obsolete empty paths, update the narrow ignore/Storybook
command, and link these rules from the contributor entrypoint. No source behavior,
package version, lockfile, catalogue, provider setting or workflow gate changes.

C will use a fresh checkout of published B, with removed outputs absent before
install. Use pinned Node24.21.0/pnpm11.28.5 and a frozen script-disabled install.
Run source export/boundary checks, affected types/tests and sequential fresh
website/docs/playground/Storybook builds. Regenerate utility declarations, exercise
#53's isolated consumer, and compare discovery and emitted app bytes with the
fresh merged-main baseline. Existing smoke is only supplementary existence proof
when all three app artifacts are freshly built. Confirm Git remains clean and
all rebuilt output is ignored; never rely on an existing `dist` or runner receipt.

The earlier #53 concurrent website/Storybook collision remains #52's investigation;
builds here are sequential. Chromium, broad lint/compiler/CI reconciliation,
intended hosting and deployment remain with their existing owners. No new generic
cleanup framework, dependency upgrade or permissive ignore glob is introduced.

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
