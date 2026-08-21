---
schema: aether.architecture-document/v1
id: website-system
title: Ego Hygiene Website System
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-08-19
governed_by:
  - architecture-system
depends_on:
  - website-foundations
  - website-ontology
related:
  - website-purpose
  - website-vision
  - website-principles
  - website-pillars
supersedes: []
---

# Ego Hygiene Website System

## Purpose and scope

This document identifies Ego Hygiene Website's logical systems and responsibilities. It answers what the major systems do; [ARCHITECTURE.md](ARCHITECTURE.md) owns their structural organization and dependency rules.

## System inventory

| System | State | Responsibility |
| --- | --- | --- |
| egohygiene.io application | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Documentation application | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Design playground | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Shared UI and configuration packages | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Static build | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Routing and deployment adapters | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |
| Site analytics and health | Target | Owns its bounded portion of the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; exposes explicit inputs, outputs, failure states, and evidence. |

## External systems

- Identity system
- LaunchKit-derived product sites
- repository documentation and architecture sites
- Store
- Akashic and future product subdomains

External systems are integrations, not hidden implementation units. Each requires version, authentication, availability, data, error, and replacement boundaries appropriate to its risk.

## System interactions

Inputs enter through an adapter or validated contract, move through domain systems, produce artifacts and diagnostics, and leave through a stable interface. Evidence flows back to validation, review, and future decisions.

## Failure model

Systems fail closed at destructive, publication, privacy, and security boundaries. Partial results identify coverage and remain distinguishable from complete success.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?
