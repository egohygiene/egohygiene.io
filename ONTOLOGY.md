---
schema: aether.architecture-document/v1
id: website-ontology
title: Ego Hygiene Website Ontology
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-08-19
governed_by:
  - architecture-ontology
depends_on:
  - website-purpose
  - website-vision
  - website-principles
  - website-epistemology
related:
  - website-pillars
  - website-manifesto
  - website-ai-constitution
  - website-personal-model
supersedes: []
---

# Ego Hygiene Website Ontology

## Domain scope

Ego Hygiene Website models the concepts needed for give the organization and its products one coherent, accessible public home while allowing independently owned sites to evolve. The ontology names conceptual entities and relationships; it is not a source-code class model, API schema, or database design.

## Canonical concepts

| Concept | Meaning |
| --- | --- |
| Gateway | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Site | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Route | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Product surface | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Documentation | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Playground | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Shared package | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Theme | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Deployment | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |
| Navigation | A canonical concept in the Ego Hygiene Website domain whose exact fields belong to specifications or schemas, not this ontology. |

## Core relationships

- A repository or person provides source context to one or more domain artifacts.
- A specification constrains how an artifact is interpreted or produced.
- A plan separates proposed action from execution.
- Evidence supports a claim; a decision authorizes a durable direction.
- Provenance connects derived artifacts to their inputs and processing context.
- A consumer integrates through an explicit interface rather than internal structure.

## Boundaries

- Conceptual identity is distinct from filesystem path, database identifier, or display label.
- Observed state is distinct from desired state.
- Proposed relationships are not accepted facts.
- Neighboring repositories retain ownership of their domain concepts.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?
