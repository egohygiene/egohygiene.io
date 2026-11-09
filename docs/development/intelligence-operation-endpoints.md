# Organization Intelligence operational endpoints

Refs the organization acceptance program
[`.github#41`](https://github.com/egohygiene/.github/issues/41), site host
[#27](https://github.com/egohygiene/egohygiene.io/issues/27), and owning organization
[Health](https://github.com/egohygiene/.github/issues/40) and
[Releases/Distribution](https://github.com/egohygiene/.github/issues/39) surfaces.

This bounded presentation slice adds Health, Releases and Distribution page
components to the shared endpoint shell. It does not acquire provider evidence,
normalize new semantics, publish a site or qualify product acceptance.

## Projection APIs

`scripts/intelligence-operation-endpoints.mts` exports:

```ts
projectHealth(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[];
projectReleases(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[];
```

Pass the individual repository's normalized `views.health` or `views.releases`
data obtained from the admitted Observatory fleet's corresponding repository
view. The shared host owns source admission, fleet/repository identity, module
coverage, state/failure isolation and presentation bounds. This slice consumes
the compact alpha.2 view shape already selected by the host; it does not read
raw Relay review envelopes, native provider payloads or full canonical graphs.

The shared endpoint helper filters a reference's visibility and authorized
repository before reading its ID, title, state or canonical URL. Health also
requires the reference to belong to the current repository. Releases gates the
owning release entity before touching the wrapper's publication time or nested
references. Related work/deployments may refer to separately authorized public
repositories; protected references are omitted before inspecting their fields.
Arrays and text use bounded shared helpers. Duplicate owning IDs, unsupported
entity kinds, malformed dates or invalid view structure fail with the fixed
`ENDPOINT_INPUT` code for host-owned module isolation.

All rendered links pass through the shared credential-free canonical GitHub URL
allowlist. Rejected links remain text. React owns text escaping; raw HTML,
provider logs, query-bearing URLs and arbitrary source payloads are not emitted.

## Health

Primary question: what do the supplied check records say, and where is the
evidence stale, unknown or unavailable?

`projectHealth` retains each normalized `checks[*]` reference independently and
requires the owner's `score: null` contract. It does not combine execution and
findings, infer check facets from arbitrary identifiers, or calculate a score.
The Relay captured-report adapter's separate execution/findings records therefore
remain separate cards; native provider status stays unchanged when supplied.

The view's raw `check_states`, assertion/freshness distributions and stale/unknown
ID lists are deliberately excluded. Those aggregates could contain fields outside
the selected public record scope, and their presence is not a completeness claim.
The host supplies filtered repository coverage and module state separately.
An empty projected list never becomes a passing check result. Hygiene conformance,
runtime Status and human architecture dispositions retain their own owners.

## Releases

Primary question: what release evidence is published, what work does it include,
and what deployment observations are linked?

`projectReleases` follows the actual compact normalized release shape:

| Upstream field | Presentation |
| --- | --- |
| `entity` | Original public release identity, state, assertion, freshness and canonical URL |
| `published_at` | Original UTC publication timestamp, or explicit unavailable text |
| `includes` | Separately labeled public work references |
| `deployments` | Separately labeled public deployment observations |
| `boundary_event_ids` | Omitted: opaque IDs alone provide no separately visibility-checkable evidence link |

Included references admit the owner's roadmap-step, issue, pull-request and
commit kinds. Deployment references require `deployment`. No release-state
translation promotes drafts, prereleases, retractions, unknown evidence or a
build result into stable publication. No missing deployment is invented, and
related observations retain their individual states, assertions and freshness.

## Distribution

Primary question: what evidence verifies installation and distribution?

The selected upstream read model has no normalized distribution domain.
`DistributionEndpoint` therefore explicitly says unavailable for installation,
package-manager availability, supported targets and distribution freshness.
It projects no synthetic distribution records or success state. Related links
are drawn only from already admitted public release presentation records, capped
at 24, and point to canonical release sources plus the Releases route. They are
context for a future verification path, not installation proof.

## Components and integration

`OperationEndpoints.tsx` exports `HealthEndpoint`, `ReleasesEndpoint` and
`DistributionEndpoint`. Each uses `EndpointFrame` with its matching module ID
(`health`, `releases`, `distribution`) and a distinct primary question. Shared
filters, provenance/coverage, SSR behavior and record rendering remain in the
shared shell. This slice adds no CSS, network client, browser storage or feature
locale provider.

Root integration owns the shared loader, routes, module registry, metadata,
locale resources and coverage. Distribution must remain unavailable in that
module registry until a supported owner projection exists; related Releases
records must not change its state.

## Delivery state

Prepared as implementation work for review. The user explicitly deferred tests,
CI, builds and polish; no typecheck, test, renderer/browser run, accessibility
qualification, native snapshot canary or deployment was performed in this slice.
Only source/syntax and diff inspection are used at this checkpoint. The later
validation pass must exercise malformed/hidden references, isolated module
failure, stale and empty captures, missing distribution semantics, SSR/hydration,
URL filtering and actual canonical source links.
