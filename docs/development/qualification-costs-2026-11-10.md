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

## B/C

Pending implementation and measured verification. Historical output-writer root
cause is still unknown; repeated clean builds do not establish that cause.
