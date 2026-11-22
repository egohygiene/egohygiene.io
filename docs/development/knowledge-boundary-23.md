# Knowledge foundation checkpoint

Issue [#23](https://github.com/egohygiene/egohygiene.io/issues/23) now has a private,
experimental `@egohygiene/knowledge` query package. Its runtime schema and inferred
types live at `@egohygiene/schemas/knowledge`; the checked JSON Schema is generated
from that owner. Cross-record identity, dangling references and membership-cycle
checks supplement JSON Schema through the runtime validator.

`createKnowledgeIndex(input)` validates before selecting reviewed/public nodes.
It exposes immutable `list(kind?)`, `getById`, `getBySlug`, `relationships` and
bounded outgoing `traverse` queries. Hidden/missing identities both return no
result; hidden edges and endpoints do not enter public lists or traversal.
Ordering is independent of source-array order. Source objects cannot mutate the
index. This filter is an output boundary, not authentication of a serialized
review claim or permission to publish source records.

Synthetic datasets require `{ allowSynthetic: true }` and belong only in tests
or deliberately isolated consumers. The website feature starts empty. There are
no invented canonical pillars, terms, posts or relationships and no new public
routes in this checkpoint. Markdown bodies remain with content ownership.

## Legacy intake dispositions

The issue names legacy files; none is present in the selected current public
source. Absence is not evidence of deletion or review. Preserve originals and
defer intake until a bounded, provenance-backed source selection is available:

| Legacy source | Proposed target / current disposition |
| --- | --- |
| `manifest.json`, `ontology.json` | Defer; map reviewed identity/version/provenance into the dataset manifest. |
| `pillars.json`, `terms.json`, `synapses.json`, `systems.json`, `tags.json` | Defer; map approved domain metadata to typed nodes without changing semantics. |
| `relationships.json` | Defer; explicitly map relation types and endpoints, preserve cycles where meaningful. |
| Domain models and slug/query helpers | Defer; compare with inferred types and stable query APIs before replacement. |

No source was fetched, deleted, relicensed or silently transformed. The package
stays private0.1.0; `schemaVersion` identifies the experimental v1 structure and
`datasetVersion` identifies supplied data independently. Unknown schema versions
fail. A future breaking change needs explicit migration/rollback and reviewed
dataset dispositions; source deployment remains on the prior reviewed revision
until its own acceptance. See [proposed ADR0018](../architecture/decisions/0018-knowledge-source-boundary.md).

## Validation and remaining scope

Focused controls cover empty/malformed/duplicate/dangling/cyclic inputs,
synthetic gating, privacy, immutable results and isolated non-React consumption.
The standalone package compiler has no DOM/Node ambient library. Source/bundler
proof is not npm publication or actual term/synapse UI qualification. Legacy
intake, reviewed real data, useful public routes and full packaging acceptance
remain open under #23.
