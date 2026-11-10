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

Pending source-bound final run. Preliminary normal/report builds have identical
64-file path/hash inventories. The manager and four existing browser cases pass.
Historical output-writer root cause remains unknown; guards detect corruption,
and clean repeats do not establish a causal repair.

