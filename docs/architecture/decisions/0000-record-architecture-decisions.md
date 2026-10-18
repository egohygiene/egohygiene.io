# Recording architecture decisions

Status: repository documentation practice, recorded 2026-10-13.

Keep durable architectural rationale in this directory and index it in
[README](README.md). Keep changing issue/PR status in the
[current handoff](../../context/current-state.md) and dated validation evidence
in the owning checkpoint/asset record, linked through
[provenance](../../context/provenance.md).

Root [DECISIONS](../../../DECISIONS.md) contains earlier high-level ADR-0001 through
ADR-0004. They are a separate sequence from these implementation filenames.
Always cite the full file path/link and title; “ADR 003” alone is ambiguous.
Do not renumber historical decisions to hide the distinction. Empty 0001/0002
files are reserved scaffolds, not accepted decisions or implementation evidence.

## What a new record needs

- Status, date, scope and owning issue/PR.
- Observed problem and source revision; distinguish evidence from assumptions.
- Decision, alternatives actually considered and the reason for the choice.
- Consequences, relevant validation and any incomplete qualifications.
- Rollback/migration implications and what would trigger reconsideration.
- Source/license provenance if external code, contracts or assets informed it.

Label a proposal as proposed. A decision can be recorded for a local checkpoint
while its implementation is still a draft PR; record both states separately.
Do not convert a hypothetical roadmap item into an accepted record just to fill
a placeholder.

Correct factual errors in place with provenance. When a decision changes
materially, add a successor and reciprocal supersedes/superseded-by links instead
of rewriting its original rationale. Update the index and current handoff when
that affects the next agent's work. Avoid repeating an ADR's body across root
meta documents, handoffs and agent instructions.
