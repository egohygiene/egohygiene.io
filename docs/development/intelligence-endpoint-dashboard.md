# Endpoint aggregation and navigation dashboard

Refs site #27 and organization #41. This candidate composes the independently
reviewable endpoint families and navigation graph above the shared endpoint
foundation and the earlier #118 host. It is code for review, not a deployed or
accepted control plane.

## Canonical endpoint composition

The overview `/intelligence/` now connects eighteen dedicated endpoints:

| Endpoint | Supported evidence or explicit boundary |
| --- | --- |
| `/roadmap/` | Repository-owned steps, outcomes, criteria and explicit public references. Organization initiative semantics remain separate. |
| `/decisions/` | Source lifecycle, canonical owner, scope, implementation and directed ADR lineage. |
| `/dependencies/` | Direct source-supplied depends-on/blocks edges; no transitive or causal inference. |
| `/health/` | Individual check records, execution/findings separation, explicit source scope; no roll-up score. |
| `/releases/` | Publication observations, included work and deployment links kept separate. |
| `/distribution/` | Upstream installation/distribution normalization unavailable; related release evidence is not install proof. |
| `/sanity/` | Human-ratified architecture conclusions unavailable until the owning model supplies them. |
| `/hygiene/` | Applicable contract/conformance projection remains unavailable pending its owner. |
| `/audits/` | Canonical finding/disposition projection remains unavailable pending its owner. |
| `/status/` | Service/incident projection remains unavailable; Health is not runtime Status. |
| `/intelligence/identity/` | Identity Intelligence retains its distinct route and owner gap; `/identity/` is not reassigned. |
| `/intelligence/now/` | Source-owned attention lanes with collection and source-age disclosures. |
| `/intelligence/journey/` | Observed chronological events and admitted explicit release boundaries; no parent DAG inference. |
| `/intelligence/work/` | Issues and PRs remain distinct; source queues do not imply human acceptance. |
| `/search/` | Source-supplied opaque search representation, without invented field attribution. |
| `/intelligence/compare/` | Current source context; before/after evidence remains unavailable without an explicitly admitted compatible baseline/comparison. |
| `/intelligence/diagnostics/` | Dedicated normalized findings remain upstream-owned and unavailable. |
| `/intelligence/dashboard/` | Aggregated view/repository/evidence navigation and declared relationship map. |

The canonical composition and compatibility aliases are checked against the
source-pinned Hygiene registry. All dedicated routes are synchronous, included
in the static publication inventory and conservatively noindex during review.
Metadata and local preview filename mapping share their route declarations.
Explicit Caddy redirects preserve canonical slashes and accepted aliases while
unrelated existing website/store path conventions remain intact. Client alias
navigation preserves URL context. Static alias behavior requires the documented
host redirect rules; no generic static-host acceptance is claimed.

## Data composition

The existing reviewed, SHA-bound Observatory fleet input remains build-time only.
Node projectors admit public rows before identity/record lookup, then isolate each
repository and module. The merged fleet Search records/coverage shape is handled
separately from the other per-repository module views. Domain coverage is checked
against the admitted repository source, never upgraded by the presence of a view.
Original capture timestamps, record assertions and lifecycle states are retained.

Source age is disclosed independently of native record freshness. An old source
cannot become current merely because rendering uses a newer evaluation boundary.
A failed claim remains an error even when presentation is bounded. Module output
is capped at 120 records per repository and 800 per view; scope disclosures and
canonical links remain, and truncation is visible. Unsupported views do not
invent new alpha.2 coverage domains.

The website's directory and endpoint projections do not certify every upstream
field. Full owner schema/semantic validation remains producer/review authority.
Derived roadmap readiness/root markers are explicitly unprojected here because
the fleet view does not include an independently proven derivation graph. Source
lifecycle, criteria and public directed references still remain inspectable.
The separate reviewed Now lanes retain their existing assertion labels.

## Interactive map

`IntelligenceGraph` is dependency-free SVG with a deterministic module/repository/
entity layout, URL selection, destination links, neighbor inspection and finite
pan/zoom/fit/reset controls. Navigation membership and source relationship edges
remain different classes. Layout and proximity never create a dependency or
causal assertion. Directed dependency edges come only from the admitted existing
Dependencies projection, retaining source type/assertion/freshness.

The Node model prioritizes declared dependency edges before generic evidence
membership, reserves directory space for up to forty public repositories, and
caps the full map at 140 nodes and 320 links (160 declared links). The repository
and endpoint directories retain access to other admitted context. The complete
component-bounded node/edge lists remain present as HTML for no-JavaScript,
keyboard and assistive access. Root presentation bounds do not claim a new fleet
inventory count. Entity destinations use the same exact URL-safe identity
encoding as record cards; no DOM-only hashing or percent-decoding mismatch.

Graph inputs and route links never navigate arbitrary snapshot URLs. Source links
pass the separate same-repository GitHub evidence allowlist. React renders text;
no snapshot HTML or provider script is evaluated. The map creates no backend,
network lookup, database, canonical registry or publication authority.

## Review and next proof

Source slices remain separately reviewable before this aggregate. Shared
`docs/context/current-state.md` edits should be reconciled by actual integration
order rather than concatenating competing current objectives.

Static peer/source review, TypeScript/TSX syntax parsing, relative-import
inspection, Node syntax checks, JSON parsing and whitespace inspection were
performed. No install, full build, typecheck, test suite, browser, Caddy execution,
CI investigation, real canary or live deployment was performed. Required native
privacy/source compatibility, route/hydration, alias, a11y and performance proof
remain in the deferred validation pass. No parent issue is complete by this
candidate's existence.
