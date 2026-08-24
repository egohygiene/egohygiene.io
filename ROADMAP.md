---
schema: aether.architecture-document/v1
id: website-roadmap
title: Ego Hygiene Website Roadmap
kind: architecture-document
version: 0.1.0
status: provisional
owners:
  - egohygiene
created: 2026-08-19
updated: 2026-08-24
governed_by:
  - architecture-roadmap
depends_on:
  - website-vision
  - website-pillars
  - website-architecture
  - website-decisions
related:
  - website-purpose
  - website-principles
  - website-manifesto
  - website-epistemology
supersedes: []
---

# Ego Hygiene Website Roadmap

<!-- BEGIN ROADMAP EXECUTION SNAPSHOT -->
<!-- roadmap-manifest
schema: hygiene.roadmap/v1alpha1
repository: egohygiene/egohygiene.io
visibility: public
publication: canonical
route: /roadmap/
updated: 2026-08-24
-->
## 2026-08-24 execution snapshot

> This evidence-reconciled snapshot is the issue-generation and visual-roadmap handoff. The longer-horizon strategy below remains canonical context; generated HTML, JSON, progress, issue plans, and commit lists are projections.

**Lifecycle:** functional static alpha  
**Current gate:** Fix undefined CI scripts and red CodeQL, correct stale repository metadata, and restore a verified deployment path.  
**North-star outcome:** A deployed organization portal that presents trustworthy product, evidence, and roadmap surfaces under stable routes.

### Visual roadmap publication

**Mode:** `canonical`  
**Route:** `/roadmap/`  
**Current publication evidence:** React/Vite organization portal; deployment is currently disabled and no healthy production publication was proven.

Own the canonical organization route at /roadmap/ and the central /roadmap/<repo>/ views after CI, CodeQL, route precedence, and the single deployment path are green.

### Quest line

<!-- roadmap-step
id: WEB-Q01
status: complete
depends_on: []
issues: []
-->
#### WEB-Q01 — Establish the portal application

**State:** `complete`  
**Depends on:** None

**Outcome:** A substantial React/Vite monorepo provides the organization portal foundation.

**Exit criteria:**

- [x] The portal builds locally from declared package metadata.
- [x] Product routing and shared UI packages are represented.

**Current evidence:**

- The audit found a substantial React/Vite monorepo implementation.

<!-- roadmap-step
id: WEB-Q02
status: blocked
depends_on: [WEB-Q01]
issues: []
-->
#### WEB-Q02 — Restore CI and metadata integrity

**State:** `blocked`  
**Depends on:** `WEB-Q01`

**Outcome:** Default-branch quality and security checks pass against current repository names and URLs.

**Exit criteria:**

- [ ] All workflow-referenced scripts exist and pass.
- [ ] CodeQL is green and stale repository URLs are corrected.

**Current evidence:**

- CI references undefined scripts.
- CodeQL was red and old repository URLs were observed.

<!-- roadmap-step
id: WEB-Q03
status: planned
depends_on: [WEB-Q02]
issues: []
-->
#### WEB-Q03 — Restore hosting and preview

**State:** `planned`  
**Depends on:** `WEB-Q02`

**Outcome:** Every main-branch change produces a verified production deployment and reviewable preview.

**Exit criteria:**

- [ ] Deployment is enabled with a green production run.
- [ ] A pull request exposes a working preview or equivalent review artifact.

**Current evidence:**

- Deployment was disabled at audit time.

<!-- roadmap-step
id: WEB-Q04
status: planned
depends_on: [WEB-Q02]
issues: []
-->
#### WEB-Q04 — Add the organization roadmap route

**State:** `planned`  
**Depends on:** `WEB-Q02`

**Outcome:** A first-class /roadmap route renders the canonical quest graph before the generic /:product route.

**Exit criteria:**

- [ ] Route ordering makes /roadmap unambiguous.
- [ ] The view renders repository, dependency, gate, state, and evidence data accessibly.

**Current evidence:**

- No explicit /roadmap route exists and it must precede /:product.

<!-- roadmap-step
id: WEB-Q05
status: planned
depends_on: [WEB-Q03, WEB-Q04]
issues: []
-->
#### WEB-Q05 — Publish immutable product handoffs

**State:** `planned`  
**Depends on:** `WEB-Q03`, `WEB-Q04`

**Outcome:** Product pages and roadmap nodes link to immutable source, issue, PR, commit, release, and deployment evidence.

**Exit criteria:**

- [ ] Public evidence links resolve without privileged access.
- [ ] Private repository entries expose only deliberately sanitized metadata.

**Current evidence:**

- A unified evidence-backed product handoff was not observed.

### Roadmap-to-issue handoff

- A step is complete only when its exit criteria and required evidence are satisfied; commit count never determines progress.
- Ready or planned steps without an issue are candidates for the private, duplicate-aware roadmap.issue-plan.json dry run.
- Issue creation or reconciliation requires human approval or an explicitly authorized Pace operation and returns issue references through a reviewable roadmap pull request.
- Pull requests and commits should include Roadmap-Step: <ID>; historical evidence may be linked through existing issue and pull-request relationships.
- Public rendering uses only allowlisted build-time evidence and never places a GitHub token or private issue plan in the browser artifact.

<!-- END ROADMAP EXECUTION SNAPSHOT -->

## Strategic context

This roadmap describes capability evolution, not promised dates or an issue queue. Sequence follows architecture dependencies and may change when evidence or risk changes.

## Phase 1: Ship the root portal

**Outcome:** A bounded capability advances from documented intent to validated, independently usable behavior.

**Exit signals:**

- The owning contract and acceptance criteria are versioned.
- Implementation and documentation agree.
- Relevant tests and safety checks pass.
- Downstream consumers and migration impact are understood.
- Remaining uncertainty is visible.

## Phase 2: Stabilize shared web packages

**Outcome:** A bounded capability advances from documented intent to validated, independently usable behavior.

**Exit signals:**

- The owning contract and acceptance criteria are versioned.
- Implementation and documentation agree.
- Relevant tests and safety checks pass.
- Downstream consumers and migration impact are understood.
- Remaining uncertainty is visible.

## Phase 3: Connect product and repository routes

**Outcome:** A bounded capability advances from documented intent to validated, independently usable behavior.

**Exit signals:**

- The owning contract and acceptance criteria are versioned.
- Implementation and documentation agree.
- Relevant tests and safety checks pass.
- Downstream consumers and migration impact are understood.
- Remaining uncertainty is visible.

## Phase 4: Unify documentation and architecture discovery

**Outcome:** A bounded capability advances from documented intent to validated, independently usable behavior.

**Exit signals:**

- The owning contract and acceptance criteria are versioned.
- Implementation and documentation agree.
- Relevant tests and safety checks pass.
- Downstream consumers and migration impact are understood.
- Remaining uncertainty is visible.

## Phase 5: Add governed dynamic services where justified

**Outcome:** A bounded capability advances from documented intent to validated, independently usable behavior.

**Exit signals:**

- The owning contract and acceptance criteria are versioned.
- Implementation and documentation agree.
- Relevant tests and safety checks pass.
- Downstream consumers and migration impact are understood.
- Remaining uncertainty is visible.

## Cross-cutting tracks

- Security, privacy, accessibility, licensing, and provenance.
- Documentation, architecture portals, examples, and onboarding.
- Packaging, release, compatibility, and self-hosting.
- Organization integration through explicit contracts.
- Observatory evidence and Pace conformance when those systems exist.

## Deferred direction

Optional managed services, enterprise controls, marketplaces, and the conversational organization compiler remain later architecture work. Current choices should preserve portability and avoid foreclosing them.

## Evidence and uncertainty

- **Observed:** The repository README establishes the intended boundary as the public egohygiene.io gateway, documentation surface, playground, and shared web-platform monorepo; significant implementation remains incomplete.
- **Decided for this draft:** The repository owns the bounded concern described here and participates through versioned contracts.
- **Proposed:** Target systems and later roadmap phases remain proposals until accepted and implemented.
- **Open question:** Which parts of this draft should become active in the first independently versioned release?
