# Bounded application and dependency sweep — #92

Recorded 2026-10-26 (America/New_York). Alan authorized several roadmap issues
while away, with licensing reconciliation and merges deferred to the next sync.
Selected order: #92, #52, then #29. No deployment, browser execution, license
choice, provider activation or private-source migration is part of this work.

## A — Audited source and baseline

Main remains `89fc70440f9c3cf32d37a6da83c7a2b969efa97d` (#104 merged, #56 closed).
The working input is unmerged #105 head `2b9ebe5d3aba4f7cccb277252d15a48325ff205d`;
branch `refactor/bounded-sweep-92` is stacked on `docs/licensing-provenance-59`.
The licensing draft's notices/proposals remain intact and inactive. Old CI draft
#73 is not merged; #29 will preserve its useful changes against current source.

The [dependency audit](reviews/bounded-sweep-92/dependency-audit.json) preserves all
400 root declarations (252 runtime/148 development), 14 child manifests and exact
lock/install observations. These counts are not browser bundle measurements.
The [code audit](reviews/bounded-sweep-92/code-audit.json) separates concrete
maintenance work from speculative architecture. [Baseline](reviews/bounded-sweep-92/baseline.json):
frozen script-disabled install with Node 24.21.0/pnpm 11.28.5, workspace/boundary
checks, existing site/catalog/domain types, 341 unit tests and 152 catalog tests
pass. Normal website and static Storybook builds pass. The website emits 26 pages,
10 sitemap entries and a noindex 404; 45 files/202 asset references are inspected.
[Artifact check](reviews/bounded-sweep-92/baseline-artifact.json) still fails the same
three document/raw-total budgets. No threshold changed. Browser runs remain zero.

## B — Selected improvements and limits

| Candidate | Disposition and reason |
| --- | --- |
| Shared StoreCard/StoreMetadata in the 813-line page module | Extract existing feature-local components and update the three sibling consumers; preserve props, DOM, locale links and CSS. No new package or generic component system. |
| Repeated design/context resolution during search | Reuse a lookup/resolved designs within one filter call where this simplifies actual repeated work; preserve result identity/order, visibility, Unicode/localized search and malformed-input behavior. No persistent cache. |
| Repeated localized value resolution in rendered contexts/gallery | Bind existing pure presentation once per element where touched; no new state. |
| Storybook 10.5.9 | Pin the nine existing Storybook 10 packages to synchronized 10.6.2, the same-major security fix; verify installed peer ranges and configured story/static consumers. Keep secure defaults; no Storybook 11 migration. |
| Seven unreferenced consolidated Storybook 8 direct dependencies | Remove only after source/config/documented-consumer search; record exact names/lockfile changes and retained optional integrations. |
| Broad root experiment dependency inventory | Keep under #15/#16; root install scope and emitted website bytes are separate measurements. No blind removal or broad latest-version update. |
| Inline SVG externalization, lazy routes, browser validation stripping | Defer; these alter rendering or contract boundaries and need measured visual/hydration review. Purchase/readiness validation stays intact. |
| Compiler/test freshness and CI policy | Existing owners #52/#29; consume their findings after this draft, don't duplicate them here. |

The official [Storybook advisory](https://github.com/storybookjs/storybook/security/advisories/GHSA-f2ph-cmg5-wxc8)
includes installed Storybook/addon-vitest 10.5.9; it concerns the development
server, not a built static Storybook. [Release 10.6.2](https://github.com/storybookjs/storybook/releases/tag/v10.6.2)
patches it and GHSA-px85-f4q5-jh77. The upgrade retains restricted iframe/messaging
defaults; no insecure compatibility flag is enabled. Dependency work will record
exact importer/transitive changes and any remaining optional-integration mismatch.
Change the existing dev command from all-interface binding to explicit loopback
127.0.0.1 and use its supported long port flag. No remote/LAN integration is required
by configured consumers. This targeted update is not a complete dependency security certification.

## C — Verification contract and handoff

Save A as a draft before B. Verify affected storefront/localization/artwork units,
portable catalog/order/search/readiness contracts, type/boundary checks, normal
and isolated-preview builds, and upgraded static Storybook. Compare route HTML,
public data/assets and emitted sizes with baseline; record expected bundler naming
changes rather than claim byte equivalence where absent. Do not loosen artifact
budgets to obtain a pass. Recheck a frozen install after dependency changes.

Maintain the existing canonical URLs/IDs, schema/migration version, declared
artwork order, curated selections, locale/hydration boundary and disabled purchase
states. Keep private artwork/records out of the repo. No actual browser behavior
is qualified by source, unit, build or discovery checks.

A new architectural layer is unnecessary: ADRs 0005/0008/0009/0011/0012/0015 still
apply. Revert the bounded source and dependency/lock changes together to roll back;
no catalog/data migration is introduced. Final #37 acceptance stays on Alan's Mac.
After this reviewable draft: #52 profiles, then #29 current validation/CI repair;
#57/#70 and final #37 remain in the saved queue. All merges wait for morning sync.
