# ADR0016 — Portable organization Intelligence review artifact

- Date: 2026-11-10.
- Status: Proposed; implementation is source-only review material.
- Scope: Website-owned producer interface, organization #41 and site #27/#28/#35.
- Governing rendering boundary: [ADR0012](0012-static-public-route-rendering.md).

## Context

The organization wants its `.github` coordination surface to become the primary
Intelligence entry point. Existing fleet read models, endpoint projections and
interactive components already live in their canonical owners. The ordinary
website build also contains commerce, general routes and a fixed egohygiene.io
origin, so copying that complete build would duplicate unrelated product output
and carry the wrong target identity. Relay's repository renderer accepts a
single represented repository and cannot reinterpret a fleet as that repository.

## Proposed decision

Add one explicit, isolated website-owned producer command that composes the
existing Intelligence components and immutable admitted data into a portable
review artifact. Require the intended HTTPS origin, deployment base, exact
closed organization route inventory and input bindings. Emit the same frozen
client/server presentation, canonical metadata, local resources and full file
inventory under a producer-owned manifest. Keep all normal website/store builds,
canonicals, publication requirements and workflows unchanged.

The consumer verifies immutable producer/run/artifact identities outside the
payload and uses Relay's portable review intake. The artifact grants no Pages,
DNS, deployment, repository adoption, assessment or human decision authority.
Hygiene retains public identity, roles, surfaces and approval gates; Observatory
retains normalized model meaning. A separately proposed `.github` ADR owns the
future entry-point/hosting transition and its catalog reconciliation. Current
production destinations remain unchanged until that transition is reviewed.

## Alternatives and consequences

Creating another fleet model or renderer in `.github` would duplicate existing
owners. Republishing the entire website would also carry product/store routes.
A link-only profile can provide immediate navigation, but does not itself supply
the requested portable fleet dashboard. The isolated export adds a small target
and metadata adapter while reusing the existing views, filters and graph.

The producer must retain a closed scope, no commerce imports, explicit source
availability, exact origin/base canonical identity, safe local resources and
identical initial hydration. Unsupported/missing evidence remains unavailable;
an AI assessment never becomes human ratification. A future expansion beyond
Intelligence or a change of source/model authority requires another review.

## Evidence and recovery

Available evidence is static source/interface/schema inspection only. No build,
application execution, tests, native/browser/CI run, provider transport or live
publication qualifies this proposal. A consumer must retain exact prior accepted
bytes and its own publication/recovery evidence before any later deployment.
Reverting this additive entry leaves the ordinary website build and all existing
consumer recovery selections unchanged; it does not remove an already published
consumer artifact. No historical source or approval state is rewritten.
