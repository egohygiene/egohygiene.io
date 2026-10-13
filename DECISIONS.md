---
schema: aether.architecture-document/v1
id: website-decisions
title: Ego Hygiene Website Decisions
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-10-13
governed_by:
  - architecture-decisions
depends_on:
  - website-principles
  - website-epistemology
  - website-foundations
  - website-system
  - website-architecture
related:
  - website-purpose
  - website-vision
  - website-pillars
  - website-manifesto
supersedes: []
---

# Ego Hygiene Website Decisions

## Purpose

This document preserves significant accepted architectural choices and their rationale. Issues coordinate work, proposals explore alternatives, and this file records decisions that constrain future implementation.

## Governance

Do not rewrite historical context to fit current understanding. Amend a record for corrections that do not change meaning; supersede it with a new record when the decision changes materially.

## Index

- ADR-001: Use a monorepo for shared public web foundations
- ADR-002: Allow products to deploy independently behind stable routes
- ADR-003: Keep the first release statically deployable
- ADR-004: Consolidate the Store v1 website and use hosted checkout

The records above are the high-level decision sequence. Concrete implementation
records (tokens, Fourthwall preview, portable store domain) are indexed in
[docs/architecture/decisions/README.md](docs/architecture/decisions/README.md).
Their numeric filenames are a separate sequence; cite full paths and titles.
See [recording practice](docs/architecture/decisions/0000-record-architecture-decisions.md)
for evidence, status and supersession, and the
[current handoff](docs/context/current-state.md) for live-work context.

## ADR-001: Use a monorepo for shared public web foundations

- **Status:** Accepted as the current architectural direction
- **Date:** 2026-08-19
- **Context:** Repository evidence and ecosystem ownership require an explicit durable boundary.
- **Decision:** Use a monorepo for shared public web foundations.
- **Consequences:** The choice improves ownership and predictability while requiring maintained contracts, validation, and migration discipline.
- **Reconsider when:** New evidence shows that the boundary prevents standalone usefulness, safety, portability, or maintainability.

## ADR-002: Allow products to deploy independently behind stable routes

- **Status:** Accepted as the current architectural direction
- **Date:** 2026-08-19
- **Context:** Repository evidence and ecosystem ownership require an explicit durable boundary.
- **Decision:** Allow products to deploy independently behind stable routes.
- **Consequences:** The choice improves ownership and predictability while requiring maintained contracts, validation, and migration discipline.
- **Reconsider when:** New evidence shows that the boundary prevents standalone usefulness, safety, portability, or maintainability.

## ADR-003: Keep the first release statically deployable

- **Status:** Accepted as the current architectural direction
- **Date:** 2026-08-19
- **Context:** Repository evidence and ecosystem ownership require an explicit durable boundary.
- **Decision:** Keep the first release statically deployable.
- **Consequences:** The choice improves ownership and predictability while requiring maintained contracts, validation, and migration discipline.
- **Reconsider when:** New evidence shows that the boundary prevents standalone usefulness, safety, portability, or maintainability.

## ADR-004: Consolidate the Store v1 website and use hosted checkout

- **Status:** Accepted direction from the Store v1 planning session; implementation details remain under checkpoint review.
- **Date:** 2026-10-10
- **Context:** Merchandise work is split between a private research/scaffold repository and this public website. The first release needs a visible mock store and one real product without requiring the operator to advance production costs.
- **Decision:** Keep the canonical storefront inside `apps/egohygiene.io`, reuse existing workspace packages, and introduce a versioned, validated public catalog. Route a live product to a qualified provider-hosted checkout; keep private assets and provider administration outside the public repository. Model designs independently from products and optional song/character/collection context.
- **Consequences:** No second website or universal order router is needed for v1. Provider eligibility and customer-funded production must be verified before activation. Private source history is preserved rather than blindly imported. Schema migrations and contract tests are explicit delivery work, not assumed benefits of configuration.
- **Supersedes:** The separate-repository and comic-first recommendations in `incomprisllc/merch` research PR #5, for this Store v1 scope. ADR-002 still permits independent deployments for other ecosystem products.
- **Evidence and implementation:** [Roadmap #31](https://github.com/egohygiene/egohygiene.io/issues/31), [architecture](docs/architecture/store-v1.md), and [migration ledger](docs/migration/store-v1-consolidation.md). No migration or checkout implementation is claimed by this record.
- **Reconsider when:** A verified need for additional commerce capabilities or provider operations changes payment, customer-data, fulfillment, or maintenance responsibilities.

## Open decisions

- Release and compatibility policy for the first stable version.
- Exact self-hosted, managed, and organization-integrated deployment boundaries.
- Which target systems must exist before the architecture status may become active.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?
