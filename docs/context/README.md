# Repository context

This is the operational entry point for a fresh chat or contributor. It links
the existing Aether architecture graph to current implementation and evidence.

| Need | Read |
| --- | --- |
| Agent instructions | [Root](../../AGENTS.md), [website](../../apps/egohygiene.io/AGENTS.md), [schemas](../../packages/schemas/AGENTS.md) |
| Checkout-handoff closeout | [#37 regression/artifact receipt](../store/checkout-handoff-37c.md), [keyboard/touch journeys](../store/checkout-handoff-37b.md) and [fixture boundary](../store/checkout-handoff-37a.md); bounded slice merged in #82, broader #37 qualification selected next |
| Artwork ordering | [#54 contract and verification](../store/design-order-54.md); A/B/C merged in #81; #54 closed |
| Schema audit | [#34 bounded envelope hardening](../store/schema-audit-34.md); bounded contribution merged in #79; broader #34 remains open |
| Storefront checkpoint C | [#62 final journey review](../design/storefront-62c.md); PR #78 merged and #62 closed on 2026-10-17; next work awaits selection |
| Add storefront content | [Approved item, feature, artist and song workflow](../store/storefront-content-workflow.md) |
| Earlier storefront checkpoint B | [Artist/song review and authoring](../design/storefront-62b.md); historical evidence retained |
| Earlier storefront checkpoint A | [Curated shop review and authoring](../design/storefront-62a.md); historical evidence retained |
| Landing/shell visual review | [#35 rendered checkpoint](../design/landing-shell-35.md), including before/after and locale stress captures |
| Resume the current work | [Current state](current-state.md), then refresh its live GitHub links |
| Decisions and rationale | [ADR index](../architecture/decisions/README.md) and [high-level decisions](../../DECISIONS.md) |
| Website/store launch discussion | [Launch plan](../architecture/store-launch-plan.md), [ADR 0006](../architecture/decisions/0006-store-launch-direction.md), and [proposed milestone backlog](../roadmaps/store-launch.md) |
| Two-store ownership comparison | [Selected owner and preservation plan](../architecture/storefront-ownership.md), [ADR 0007](../architecture/decisions/0007-canonical-storefront-owner.md), issue #75 |
| Actual module boundaries | [Dependency rules](../architecture/dependency-rules.md) and [extension contracts](../architecture/store-extension-contracts.md) |
| Evidence, origin and limitations | [Provenance ledger](provenance.md); asset-local records remain authoritative for assets |
| Wider purpose and architecture graph | [META](../../META.md) |
| Machine-readable navigation | [Manifest](manifest.json); paths are relative to the repository root |

The role of each source matters: code/configuration shows implementation;
accepted decisions explain intended constraints; issues/PRs show live delivery
state; dated receipts show what was actually checked at a particular commit.
If they disagree, inspect and record the discrepancy. A newer handoff does not
erase an older receipt or silently supersede an ADR.

## Refresh at the end of a checkpoint

1. Refresh branch/issue/PR state and record the implementation commit checked.
2. Update current state: what changed, what remains, and the next concrete action.
3. Add evidence to the ledger with source path/URL, date, commit/hash where
   available, result and limitations. Label historical or unverified claims.
4. Update the ADR index if a decision was recorded/superseded. Keep asset hashes,
   source revisions and export methods beside the assets and link to them.
5. Check relative links, manifest paths/JSON and the diff. Do not embed local
   scratch paths, signed URLs, private exports or the entire chat transcript.

Pin the implementation revision, not the not-yet-created documentation commit.
Git history records the context update itself. Tests of an earlier implementation
must not be reported as freshly run tests of a later code change.

A fresh chat can start with: “Continue this repository from `AGENTS.md` and
`docs/context/current-state.md`; refresh GitHub state, then resume the next
checkpoint within my current instructions.”
