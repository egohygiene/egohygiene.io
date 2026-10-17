# Decision index

High-level decisions live in root [DECISIONS.md](../../../DECISIONS.md). Its
ADR-001–ADR-004 sequence is distinct from the implementation filenames below.
Use full paths/links and titles in issues, handoffs and provenance.

| Record | Role / recorded status | Implementation evidence at the 2026-10-13 snapshot |
| --- | --- | --- |
| [0000 — Recording decisions](0000-record-architecture-decisions.md) | Documentation practice and source requirements | Context update in [PR #72](https://github.com/egohygiene/egohygiene.io/pull/72) |
| [0001 — pnpm workspaces](0001-use-pnpm-workspaces.md) | Empty reserved scaffold | Tool use is visible in configuration; no rationale is recorded here yet |
| [0002 — Turborepo](0002-use-turborepo.md) | Empty reserved scaffold | Configuration presence is not a completed ADR |
| [0003 — Tokens and semantic themes](0003-design-token-architecture.md) | Accepted record of the existing implementation | Record filled in PR #72; describes existing token/theme code |
| [0004 — Fourthwall local preview](0004-adapt-fourthwall-for-local-store-preview.md) | Accepted for the synthetic local preview | Present on main `1c635ea2af5b254c8cd1200f479585fd941b2c33`; live qualification remains separate |
| [0005 — Portable store domain](0005-portable-store-domain.md) | Accepted for the local architecture checkpoint | Implementation `08a092b1b576abf9c4b7ea182ec423a586ed5b34` in draft PR #72; browser proof pending |
| [0006 — Ego Hygiene identity and staged store launch](0006-store-launch-direction.md) | Accepted discussion direction on 2026-10-16; delivery/ownership unresolved | Documentation on `docs/store-launch-direction-20261016`; no deployment or storefront migration at that historical checkpoint |
| [0007 — One canonical V1 storefront](0007-canonical-storefront-owner.md) | Selected website ownership/composed build for #75; submitted for review | Pinned comparison and preservation plan; no code migration or deployment |
| [0008 — Curated storefront views](0008-curated-storefront-views.md) | Accepted; #62 checkpoints A/B/C merged in PR #78 on 2026-10-17 | Ordered editorial and artist/song references over one public catalog; merge receipt in current handoff |

This table records a dated delivery snapshot, not live merge status. Refresh the
[current handoff](../../context/current-state.md) and GitHub before resuming.
Preserve intent/rationale here and implementation results in the owning receipt.
