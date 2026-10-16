# Ego Hygiene identity and staged store launch

Date: 2026-10-16. Status: **accepted direction; delivery and repository ownership
remain proposed/unresolved**. Scope: website/store planning and continuity only.
Owner: `egohygiene/egohygiene.io`, coordinated with `egohygiene/store`.
Review branch: `docs/store-launch-direction-20261016`; the containing PR is the
documentation review receipt. Proposed issue creation awaits maintainer approval.

## Context

The maintainer wants Ego Hygiene's mission and future product at the root, a
community store at `/store`, featured artist content, and a separate song-merch
catalog. Phone-based development review must work without a running laptop.

At website `db634b887ede348ce85d9c03af789467ab535dcf` and store
`599c90ca6a454c0f2e9aa95eab5f8395016474c5`, both repositories contain storefront
implementations. Website high-level ADR-004 favors consolidation; store ADR-003
favors separate deployment. Those are different records and remain in history.

## Recorded direction

1. Preserve Ego Hygiene as the root identity, with community commerce and
   featured artist content as bounded areas. Keep canonical URLs and entity IDs
   independent of manufacturing providers and future artist-site moves.
2. Prefer local development plus a Netlify development preview, updated after
   merges into `development`, using a reusable GitHub Actions workflow.
3. Keep production host selection and release separate. Cloudflare versus Google
   remains undecided. Start with one qualified physical merchandise purchase;
   comics and campaigns follow in separate milestones.
4. Compare the two implementations and select one canonical storefront before
   enabling deployment. Keep the public `/store` contract regardless of whether
   the selected delivery uses separate origins or one composed build.
5. Capture the proposed issue hierarchy and sync before creating GitHub issues
   or milestones. This documentation checkpoint is not implementation authority.

## Alternatives and tradeoffs

Netlify's native Git integration is viable, but GitHub Actions better fits the
requested reusable workflow and explicit validation/deployment control. CLI
draft aliases differ from native branch deploys and need retention qualification.
Do not run both deployment mechanisms for the same merge.

One composed application reduces routing/configuration surfaces. Separate apps
allow independent release ownership behind path routing. Evidence comparison is
still required; this ADR does not prematurely settle that choice or supersede
website ADR-004/store ADR-003 in full.

Keeping private merch sources separate is the current recommendation, not an
authorized repository transfer. Their publication boundary is separate from
which organization owns a repository or which brand appears on a product.

## Consequences, evidence, and reconsideration

The [launch plan](../store-launch-plan.md) owns the detailed requirements,
provenance, provider sources, open questions, and development cost caveats. The
[proposed backlog](../../roadmaps/store-launch.md) owns candidate delivery slices.
No runtime, workflow, DNS, secret, provider, or repository-ownership setting is
changed. Validation is documentation/link/consistency checking, not deployment
or manufacturing qualification.

Reconsider topology after the comparison, and provider/hosting choices if actual
capabilities or costs fail the first-sale requirements. Record a successor with
reciprocal links when an ownership decision changes. Preserve working URLs,
source history, licensing, and a rollback path during any later migration.
