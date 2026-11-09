# Organization Intelligence supporting endpoints

This source slice adds website projections for Dependencies, Work, Journey and
Search. It consumes each repository's existing Observatory fleet-view `data`
object. Search is the owner model's special merged fleet view; pass that `views.search`
object for each context and the projector partitions by actual repository.
It does not collect, normalize, mutate, publish or infer canonical state.
The host loader retains input/schema admission, group coverage, source-revision
binding, public repository selection and route ownership.

## Projection APIs

`scripts/intelligence-support-endpoints.mts` exports:

- `projectDependencies(value, context): readonly EndpointRecord[]` groups admitted
  direct edges by their actual source. `depends-on` and `blocks` stay distinct;
  source entity state and edge evidence remain independent.
- `projectDependencyEdges(value, context)` returns exact admitted edge ID, source,
  target, type, assertion and freshness for the host's separate graph renderer.
  No transitive expansion or generic card-layout inference is required.
- `projectWork(value, context): readonly EndpointRecord[]` preserves open issue
  and pull-request inventories, and the active/ready/waiting/blocked/unknown
  roadmap queues. Inferred queue membership does not replace canonical state.
- `projectJourney(value, context): readonly EndpointRecord[]` preserves observed
  chronological event order, occurrence/recording times and linked subject state.
  Only explicitly admitted release chapter boundaries are linked. Raw chapter
  titles, actors, arbitrary change payloads and commit parent topology are omitted.
- `projectSearch(value, context): readonly EndpointRecord[]` preserves supplied
  `search_text` as `searchText`. The shared frame must use that field verbatim
  for substring matching, without NFKC reindexing of displayed fields. Current
  field attribution is explicitly unavailable under Observatory #24 / Relay #102.

The context is the shared `EndpointProjectionContext`, with the represented
repository and its admitted public repository set. Both endpoints of a relationship are preflighted together before either
reference payload is inspected. References are filtered by
visibility and repository membership before their IDs, titles, states and URLs
are read. A relationship is excluded completely if either endpoint is excluded;
unsupported relationship types never contribute rows, edges, counts or prose.
Opaque external repository summary arrays are ignored. Malformed admitted
records throw the shared bounded endpoint-input error so the host can isolate
that repository/module. Hidden records never participate in duplicate checks.

The React exports in `endpoints/SupportEndpoints.tsx` are `DependenciesEndpoint`,
`WorkEndpoint`, `JourneyEndpoint`, and `SearchEndpoint`. They use the shared
frame's URL-backed filters, source disclosure, no-JavaScript content and matching
initial hydration. Directed relationships show textual labels and separate edge
assertion/freshness. The host owns route publication, metadata and localized
shared copy.

## Deferred verification

This is implementation for review. Tests, CI, builds, browser checks and live
publication are deferred by the current user instruction. Static peer review
and source-level syntax inspection do not establish runtime or release acceptance.
