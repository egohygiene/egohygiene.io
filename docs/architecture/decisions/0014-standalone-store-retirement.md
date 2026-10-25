# ADR 0014 — Preserve the standalone store before retiring its repository

- Date: 2026-10-25 (America/New_York).
- Status: Migration prepared in a draft; source retirement is not complete.
- Owner: [#100](https://github.com/egohygiene/egohygiene.io/issues/100).
- Prior decision: [ADR 0007](0007-canonical-storefront-owner.md).

## Context and selected direction

The website already owns the canonical customer-facing storefront. The separate
`egohygiene/store` retains unique async cart/Fourthwall examples and 16 unresolved
research/implementation issues. Alan requested migration of useful material and
subsequent removal of that separate repository on 2026-10-25.

Consolidate the recoverable source/history, original license, public GitHub record
content and readable capability/backlog dispositions into the website repository.
Keep the separate code inactive: preservation does not approve its defects,
provider contract, toolchain, mock products or deployment configuration. Adopt
individual capabilities only if existing #61/#38 work establishes a need and
qualifies the behavior behind the website's explicit I/O boundaries.

This advances ADR 0007's preservation plan toward retirement while retaining its
one-app/one-catalog ownership choice. It does not delete the source merely because
its storefront is no longer canonical. The [handoff](../../migration/store-retirement/README.md)
records source revisions, archive hashes, offline recovery, all issue dispositions
and the remaining cutover requirements.

## Consequences and alternatives

- Keeping two active storefronts would retain duplicate maintenance and unclear
  ownership. The website remains the only active implementation destination.
- Importing the old application/packages wholesale would add a second catalog,
  configuration and dependency/deployment path without a current capability need.
- A recoverable Git bundle retains history/branches/PR code with little active-tree
  clutter. Its contents require explicit restoration for inspection and retain
  their original MIT notice; they are not website build inputs.
- GitHub issue/PR bodies and captured discussions need a separate export; Git
  history alone does not preserve them. An individually addressable ledger keeps
  deferred ideas available without making every product concept a sprint blocker.
- Archiving preserves GitHub-native links/history; deletion makes old URLs and
  uncaptured platform data unavailable. The current user goal is removal after
  migration, but the repository remains intact until the destination is integrated
  and remaining wiki/platform-state questions are resolved.

No private Incompris source, master artwork, customer/business data, account
configuration, provider activation or spending is included. No application tests
or production qualification are implied by successful archive verification.
Existing setup order resumes at #49; #100 owns the outstanding retirement step.
