# Organization Intelligence specialized evidence endpoints

This bounded presentation slice provides six standalone endpoint components:

| Export | Surface ID | Organization canonical route | Source work |
| --- | --- | --- | --- |
| `StatusEndpoint` | `status` | `/status/` | [.github #33](https://github.com/egohygiene/.github/issues/33) |
| `SanityEndpoint` | `sanity` | `/sanity/` | [.github #28](https://github.com/egohygiene/.github/issues/28) |
| `HygieneEndpoint` | `hygiene` | `/hygiene/` | [.github #34](https://github.com/egohygiene/.github/issues/34) |
| `AuditsEndpoint` | `audits` | `/audits/` | [.github #35](https://github.com/egohygiene/.github/issues/35) |
| `IdentityEndpoint` | `identity_intelligence` | `/intelligence/identity/` | [.github #37](https://github.com/egohygiene/.github/issues/37) |
| `DiagnosticsEndpoint` | `diagnostics` | `/intelligence/diagnostics/` | [Relay #57](https://github.com/egohygiene/relay/issues/57) |

The exports live in
`apps/egohygiene.io/src/features/intelligence/endpoints/GovernanceEndpoints.tsx`.
They use the shared `EndpointFrame` and the existing admitted `intelligenceData`
presentation input. The separate `intelligenceGovernance` English message file
must be registered by the shared composition owner. This slice does not edit the
router, publication declarations, input loader, common frame, shared types or
translation registry.

## Useful endpoint behavior without invented evidence

Each endpoint answers a distinct primary question, explains the precise missing
source, states the independent authority boundary, supplies actionable input
requirements and links canonical owner work. Related endpoint links preserve
URL context. They are shown only when that route is registered as implemented;
route implementation does not claim that evidence is populated.

The pinned Observatory alpha.2 fleet has exactly nine named views and nine
collection domains. None represents service incidents, architecture ratification,
Hygiene conformance, audits/findings, Identity adoption or diagnosis records.
These endpoints therefore keep specialized evidence unavailable. They add no
coverage keys, fixture records, inferred applicability, implicit approval,
conformance score or synthetic successful empty inventory.

Repository context is a separate presentation of already-admitted public data:
canonical source, represented commit, original observation, independent evidence
state and relevant existing collection claims. A URL-backed repository selector
preserves other view context. Initial server render and hydration show the same
complete admitted context; selection is enabled only after the shared browser
snapshot reports ready. Native evidence disclosures and source links remain
usable without JavaScript. Missing public input does not produce a repository
total or a claim about the full organization.

| Specialized endpoint | Independent context shown | Meaning explicitly not inferred |
| --- | --- | --- |
| Status | checks, deployments | Service applicability, uptime, incident state |
| Sanity | decisions, roadmap | Architecture coherence or human ratification |
| Hygiene | checks, decisions | Applicable contracts or conformance |
| Audits | issues, pull requests, checks | Audit coverage, findings or resolution |
| Identity Intelligence | releases, checks | Brand Kit applicability, adoption, asset rights |
| Diagnostics | issues, history, checks | Confirmed diagnosis, root cause or verified remediation |

The Identity product remains a distinct owner. The accepted registry composition
reserves `/identity/` for that product and `/intelligence/identity/` for the
adoption module; this slice does not appropriate or redirect the product route.

## Actual owner dependencies

- Status: [Hygiene #62](https://github.com/egohygiene/hygiene/issues/62),
  [Observatory #23](https://github.com/egohygiene/observatory/issues/23),
  [Relay #41](https://github.com/egohygiene/relay/issues/41).
- Sanity: [Hygiene #59](https://github.com/egohygiene/hygiene/issues/59),
  [Aether #87](https://github.com/egohygiene/aether/issues/87),
  [Observatory #21](https://github.com/egohygiene/observatory/issues/21).
- Hygiene: canonical [Hygiene contracts](https://github.com/egohygiene/hygiene),
  [Observatory #5](https://github.com/egohygiene/observatory/issues/5),
  [Relay #75](https://github.com/egohygiene/relay/issues/75).
- Audits: [Aether #86](https://github.com/egohygiene/aether/issues/86),
  [Observatory #20](https://github.com/egohygiene/observatory/issues/20),
  [Reflector #258](https://github.com/egohygiene/reflector/issues/258).
- Identity Intelligence: canonical [Identity packages](https://github.com/egohygiene/identity),
  Hygiene applicability and [Observatory #5](https://github.com/egohygiene/observatory/issues/5).
- Diagnostics: [Aether #74](https://github.com/egohygiene/aether/issues/74),
  [Hygiene #41](https://github.com/egohygiene/hygiene/issues/41),
  [EgoLint #50](https://github.com/egohygiene/egolint/issues/50),
  [Observatory #16](https://github.com/egohygiene/observatory/issues/16).

Technical source-contract details stay in native disclosures. Primary copy
explains the operating implication of unavailable evidence in ordinary language.
Owner approval and privacy review remain with their existing sources; the static
pages cannot create or mutate them.

## Delivery and remaining work

The current user authorized endpoint implementation while deferring tests, CI,
builds and polish. This slice was inspected statically; no runtime rendering,
browser, build, accessibility, responsive, translation-review or deployment proof
is claimed. The shared composition owner registers exports, canonical/alias
routes, publication metadata and message resources. Actual specialized records
require compatible owner models and a separately reviewed loader extension;
schema details or an implemented route do not establish source availability.
