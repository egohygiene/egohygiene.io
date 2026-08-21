---
schema: aether.architecture-document/v1
id: website-purpose
title: Ego Hygiene Website Purpose
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-08-19
governed_by:
  - architecture-purpose
depends_on:
  []
related:
  - website-vision
  - website-principles
  - website-pillars
  - website-manifesto
supersedes: []
---

# Ego Hygiene Website Purpose

## Purpose statement

Ego Hygiene Website exists to give the organization and its products one coherent, accessible public home while allowing independently owned sites to evolve.

## Need

separate repositories need a shared domain, navigation, identity, documentation, and routing model without becoming one deployment monolith.

## Beneficiaries

- people discovering Ego Hygiene
- product users
- contributors
- repository site maintainers

## Enduring value

The enduring value is a trustworthy, portable capability that remains useful when its implementation, delivery channel, or surrounding platform changes.

## Scope boundaries

Ego Hygiene Website owns the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo. It does not absorb neighboring repositories, treat temporary implementation choices as purpose, or claim authority beyond its explicit contracts.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?

## Open questions

- Which beneficiary needs require direct research before this document can become active?
- Which current features are incidental and should remain outside the enduring purpose?
