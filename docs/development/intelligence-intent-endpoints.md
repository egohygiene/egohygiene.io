# Roadmap and Decisions endpoints

Refs [Organization Intelligence host #27](https://github.com/egohygiene/egohygiene.io/issues/27),
[organization Roadmap #29](https://github.com/egohygiene/.github/issues/29),
[organization Decisions #36](https://github.com/egohygiene/.github/issues/36) and
[final acceptance #41](https://github.com/egohygiene/.github/issues/41).

## Supported input

`scripts/intelligence-intent-endpoints.mts` exports:

```ts
projectRoadmap(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[]
projectDecisions(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[]
```

Each function receives one repository's normalized view payload from the pinned
Observatory alpha.2 fleet, not a whole graph, raw roadmap/ADR source or provider
response. Observatory revision
`f411b83398dd07aa3d5e6e2c89d1e8dfff746085` supplies the supported projections.
The shared input adapter owns public identity admission, bounded text and safe
evidence URLs. Root module loading owns coverage and group-level quarantine.

Roadmap consumes `steps`, each public local `entity`, `outcome`, `exit_criteria`,
`issue_references`, and the normalized `dependencies`, `blocked_by`,
`tracked_by`, `informed_by`, `evidence` and `verified_by` arrays.

Source exit-criterion marks remain source marks. Canonical step lifecycle,
provider issue state and human acceptance remain independent. The adapter does
not recompute readiness or progress. Authored issue URLs are retained only for public allowlisted
repositories and supported issue paths; they remain references without invented
issue nodes, titles or provider states.

The fleet view supplies derived `readiness` and `roots` values but does not
carry machine-verifiable proof of the original public graph used to derive
them. Filtering private prerequisite references afterward cannot establish
that those values are independent of protected topology. This endpoint
therefore leaves readiness/root membership explicitly unprojected and does not
read or export those payloads. A future reviewed public derivation seam can
enable them; this adapter does not infer replacement readiness or chapters.

Decisions consumes each public `entity`, `decision_scope`,
`implementation_status`, `supersedes`, `superseded_by`, `informs`, `tracked_by`,
`evidence` and `verified_by`. Both same-repository and explicitly allowlisted
public source-repository records can be shown. Canonical source repository and
consumer projection remain separate. Organization scope is displayed only from
the supplied scope field; no inherited human approval is inferred from an
entity's repository or from activity.

Missing decision scope/implementation fields are shown as “Not projected.”
Lifecycle is never rewritten to match implementation. The pinned view does not
carry approval receipts, rationale text, date/owner facets or domain/component
metadata; this adapter does not reach into unprovided graph/source data or
fabricate those fields. Canonical decision links remain the drill-down path.

## Visibility, limits and errors

Public references are admitted before reading hidden IDs, prose, lifecycle,
scope or links. Hidden roots/references are omitted without placeholders or
counts. Public relation endpoints retain their canonical owner and direction;
the view does not provide edge-level assertions, so none are invented.

The adapter accepts at most 1,024 public primary records, 256 public references
per relation collection, and 128 source exit criteria per step. Raw collections
have a separate defensive 100,000-element bound. Oversized public collections,
conflicting public identities, malformed canonical facts or unsupported states
throw the shared closed input error. The owning loader quarantines that module;
unrelated modules and repository groups remain available. No partial array is
silently presented as a complete inventory.

`IntentEndpoints.tsx` exports `RoadmapEndpoint` and `DecisionsEndpoint` using
the common `EndpointFrame`. It adds domain-specific intent/authority boundaries,
source-marked exit criteria and authored issue disclosures. The shared frame
retains URL filters, SSR-safe initial state, per-group coverage, record state
and native relation disclosures. There is no new browser data source, graph
normalizer, initiative registry, mutation control or approval workflow.

## Review status

This is implementation for review, based on endpoint foundation
`a513f91f3680b4fe925f7d16f214d32e2f75e202`. Per the current user instruction,
tests, builds, typechecks, CI and browser execution are deferred. Static source,
syntax and whitespace inspection do not establish live canary, accessibility,
privacy regression or release acceptance. The owning integration still needs
route registration, public module handoff and the later validation pass.
