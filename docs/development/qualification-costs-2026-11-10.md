# Qualification costs and local Storybook — 2026-11-10

## A: selected contract

Alan authorized the next independent batch after the merged closeout: #52/#29/#91
cost and hosted diagnostics, followed by #53 local manager acceptance. Base is
`dfff96af545628edf4d68476587b6f093313c437`. The subsequent requested technology
research will receive its own issue and report after this batch.

The integrated baseline has 45 rendered pages and eight strict size findings:
JavaScript, CSS, documents and total, each raw and gzip. Controlled original main
already has those eight findings; see the [prior measured comparison](reviews/merge-closeout-2026-11-10/main-cost-baseline.json).
The active document ceiling is 20,000 aggregate bytes, inherited from the SPA.
Chunk splitting cannot satisfy aggregate JavaScript limits. Preserve every
active ceiling while attributing cost and removing avoidable shipped code.
If a multi-page policy needs review, provide measured proposed limits separately;
never turn that proposal into a passing result for the active gate.

1. Attribute actual production modules, styles and per-route documents; keep
   diagnostics out of public artifacts and preserve public input pins/URLs.
2. Make bounded behavior-preserving cost fixes where evidence supports them.
   Verify raw rendering, the relevant units/types and actual browser journeys.
3. Diagnose hosted dependency review using its actual API/action responses.
   Keep failure visible if the repository/platform configuration is unavailable.
4. Stop Storybook from auto-composing external dependency stories. Verify local
   manager story/theme transitions in the same iframe document with the existing
   strict GET-only local network guard.
5. Save implementation and source-bound verification in focused reviewable PRs.
   Reconcile issue criteria honestly; owner/native and creative approval remain
   in #115/#116. No deployment, provider activation, licensing or paid service.

## B: delivered changes

`pnpm report:costs` runs a fresh normal build and writes
`test-results/store-qualification/costs.json` outside public output. It records
final chunk hashes/module weights, observed CSS source sizes, per-document
reachability and shared assets alongside the unchanged strict qualifier result.
Chunk attribution is observed after Vite finalizes emitted bytes; stale or extra
unattributed JS fails. Module weights precede final chunk minification, CSS
weights precede transformation, and neither is additive gzip attribution.
The command exits 1 while any active artifact finding remains. Ordinary builds
keep their current behavior; the optional host diagnostics module is loaded only
when requested and stays excluded from the bounded Docker context.

Storybook uses a refs function returning an empty registry, replacing automatic
package discovery. An empty object alone merges discovery. No external URL is
allowlisted. A persistent manager test exercises ThemeToggle → Button plus light,
dark and high-contrast toolbar choices with one surviving document marker, real
computed contrast and the existing local GET-only/no-WebSocket guard. Passing
screenshots cover Button/Orbit in all themes and the manager transitions.

## C: verification

[Exact verification](reviews/qualification-costs-2026-11-10/verification.json) and
[complete attributed artifact report](reviews/qualification-costs-2026-11-10/costs.json)
retain clean source `70cc124`, all 64 hashes and the eight active failures.
`task ci:check` passes its first 15 steps (363 units, 115 tooling, 152 catalog,
four semantic, one consumer, three smoke; every compiler profile) then fails the
strict artifact step: Task 201, inner 1. `pnpm report:costs` exits 1 for the same
eight findings. Default/report builds have identical 64-file inventories.
Fresh native Storybook/consumer builds and all five actual Chromium cases pass
at `dc4bb25`; the later source differs only in context-manifest formatting.
Nine passing screenshots were saved; Button/Orbit geometry/colors and manager
states were inspected in the three themes. Native Mac/AT checks remain #115/#37.
No runtime dependencies, public pins, URLs, purchase guards or limits changed.

### Cost interpretation and prepared decision

46 HTML documents include the separate 404 artifact; the public inventory remains
45 pages/ten sitemap entries. The largest documents are catalog (42,233 bytes),
Intelligence overview (41,128) and dashboard (28,799). The 20,000-byte aggregate
ceiling cannot contain even the catalog page on its own. Shared scripts/styles
and public assets are referenced by many documents and counted once in aggregate
artifact totals. Per-route static reachability is conservative, not a browser
waterfall or a Core Web Vitals measurement.

React DOM/router, Zod and actual page/graph code dominate attributed modules.
The root's many laboratory dependencies are not all shipped to visitors. Zod
also revalidates live purchase facts: removing it would require proving the same
fail-closed contracts, not a type assertion. CSS source attribution is diagnostic
only; nested imports may be handled internally by Vite. No speculative schema
rewrite or rendering migration was attempted to make a number green.

The [inactive proposed policy](proposals/public-budgets-2026-11-10.md) supplies
measured ceilings and an applicable patch for one #115 review. It is not active,
not an optimization, and not agreed user-performance policy. #52/#29 retain
regression policy/optimization, output-cause and hosted acceptance. #91's actual
rendering criteria can be reconciled separately against the already-qualified
45-page raw/HTTP and app-browser receipts; this does not waive cost failures.

### Current hosted readback

At draft #134 head `401845a`, CodeQL [42860458365](https://github.com/egohygiene/egohygiene.io/actions/runs/42860458365) succeeds. CI [42860458475](https://github.com/egohygiene/egohygiene.io/actions/runs/42860458475) passes 45-page raw inspection then fails 64 files/335 references/eight strict findings; browser install/profile are skipped. Dependency review [42860458408](https://github.com/egohygiene/egohygiene.io/actions/runs/42860458408) repeats unsupported repository/Dependency graph configuration. [Observed jobs/source](../research/evidence/maintainer-stack-2026-11-10/batch-hosted.json). No current hosted-browser pass is inferred.

### Hosted dependency-review boundary

The live repository is public. Official [GitHub dependency-review documentation](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review)
says the feature becomes available with dependency graph enabled. Current
[security-settings guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository)
does not guarantee graph is enabled for every public repository. Do not prescribe
a paid plan based on this error.

At prior hosted head `68f17cf`, [run 42787359682](https://github.com/egohygiene/egohygiene.io/actions/runs/42787359682)
reported unsupported repository/graph configuration. The connector has no graph
settings operation; its raw repository snapshot omits configured graph state.
The available CLI connection returns HTTP 403 for an identical-head dependency
comparison, and 404 for SBOM export. These responses do not prove the graph is off.
No workflow permission, service setting or gate was changed.

Prepared #115 action: open [repository security settings](https://github.com/egohygiene/egohygiene.io/settings/security_analysis)
with the owner's administrative session and read the actual Dependency graph
state. If disabled, enable it; if already enabled, retain that evidence and use
the failing run/403/404 packet for GitHub configuration/support diagnosis. Verify
on the next ordinary PR run. Do not add continue-on-error, silently skip review,
buy a feature or treat a settings toggle alone as a successful dependency review.

Historical output-writer root cause remains unknown; guards detect corruption,
and clean repeats do not establish a causal repair.

