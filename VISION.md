---
schema: aether.architecture-document/v1
id: website-vision
title: Ego Hygiene Website Vision
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-08-19
governed_by:
  - architecture-vision
depends_on:
  - website-purpose
related:
  - website-principles
  - website-pillars
  - website-manifesto
  - website-epistemology
supersedes: []
---

# Ego Hygiene Website Vision

## Vision statement

egohygiene.io becomes a calm portal into the organization, its products, documentation, architecture, research, and self-hosting paths.

## Desired future state

- The core capability is independently usable and documented.
- Interfaces are versioned, inspectable, and replaceable.
- Local, self-hosted, and managed contexts can compose the capability without hidden lock-in.
- People can understand consequential behavior before approving it.
- Organization integrations strengthen the standalone product rather than making it dependent on the suite.

## Intended transformation

The project moves its domain from fragmented, implicit, and manually coordinated behavior toward explicit contracts, reusable automation, and evidence-backed operation.

## Anti-vision

a centralized frontend that absorbs product ownership or proxies every service through fragile hidden coupling.

## Directional signals

- A first-time user can explain the boundary after reading the architecture.
- A consumer can integrate through a stable public contract.
- A maintainer can reproduce and validate a release.
- A contributor can distinguish implemented, proposed, and unavailable capabilities.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?
