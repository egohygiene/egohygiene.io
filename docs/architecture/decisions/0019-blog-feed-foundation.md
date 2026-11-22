# ADR 0019: Private blog article and feed projection boundary

Status: Proposed; implemented for review under issue11.

The schema package owns the strict experimental v1 collection/post contract and
inferred types. The private content package's explicit `/blog` entry point owns
pure deterministic article, RSS2 and Atom projections using its existing safe
CommonMark renderer. Keeping the new entry point separate leaves existing
Markdown consumers unchanged and avoids a module cycle or duplicate parser.

Source adapters own bounded repository metadata/Markdown acquisition. Public
eligibility uses explicit review, visibility, source dates and an as-of clock;
no runtime clock, network, filesystem, database or publisher enters the package.
Synthetic source is opt-in and cannot masquerade as actual approved writing.

Stable UUID feed identities and original dates survive updates. Correction
history is append-only under explicit revision comparison; canonical URL changes
require migration. Article/feed readers retain AI, correction, archive, license
and public provenance context. Source claims are not authenticated decisions.

This is a foundation, not blog activation. Real content, app routes/layouts,
social metadata, feeds/sitemap publication and browser/deployed acceptance stay
under #11 and the existing release controls. The package remains private0.1.0;
breaking changes require a reviewed migration and compatible source rollback.
