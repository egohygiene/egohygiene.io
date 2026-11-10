# Independent fleet Audits and Sanity inputs

Refs [site #28](https://github.com/egohygiene/egohygiene.io/issues/28),
[site #35](https://github.com/egohygiene/egohygiene.io/issues/35),
[Observatory #20](https://github.com/egohygiene/observatory/issues/20) and
[Observatory #21](https://github.com/egohygiene/observatory/issues/21).

The existing site build accepts two optional, separate Observatory fleet models.
They do not add keys to the closed nine-domain fleet contract. The original
fleet lock, publisher, manual refresh workflow and repository Pages destinations
retain their existing boundaries. The central pages aggregate admitted metadata
and link to canonical evidence; each repository keeps its own evidence ownership.

| Model | Exact input file | Reviewed file SHA-256 |
| --- | --- | --- |
| `egohygiene.observatory.fleet-audits/v1` | `EGOHYGIENE_INTELLIGENCE_AUDITS_FLEET` | `EGOHYGIENE_INTELLIGENCE_AUDITS_SHA256` |
| `egohygiene.observatory.fleet-sanity/v1` | `EGOHYGIENE_INTELLIGENCE_SANITY_FLEET` | `EGOHYGIENE_INTELLIGENCE_SANITY_SHA256` |

Both require `EGOHYGIENE_INTELLIGENCE_AS_OF`, an explicit UTC second matching the
model's existing `as_of`. A website build never substitutes its own wall clock.
The equivalent loader options are `auditsFilename`, `auditsExpectedSha256`,
`sanityFilename`, `sanityExpectedSha256` and `asOf`. No raw path or checksum uses
a `VITE_` variable. The loader reads regular files with no symlink ancestry and a
16 MiB bound. Strict UTF-8/JSON transport rejects duplicate keys, lone surrogates,
more than100,000 value nodes, depth above64 and arrays above16,384 entries.
A missing input stays unavailable; an incompatible input affects
only its own endpoint. No provider read or credential is involved.

Produce the models through the exact pinned Observatory owners before host
intake. Observatory's repository/fleet builders and standalone validators own
full semantic validation, original report/source bindings, profile resolution,
history claims and Hygiene governance evaluation. The host's structural schema
intersection and safe metadata projection are additional display boundaries;
they do not replay an assessment, qualify an audit, authenticate a human source
or replace upstream validation. Review the source files and their actual raw
SHA-256 values before configuring the existing publication process. Do not
manufacture reports, captures, artifact IDs or human dispositions to populate a
page. No populated sample or claimed completed organization sweep is included.

`contracts/organization-intelligence/reviews/input-lock.json` separately binds
the normalized schemas, public catalog and expected owner/admission metadata.
The host verifies resource bytes, then admits a declared public repository
against the exact catalog before inspecting its IDs or record counts. Every
nested scope, source owner and repository namespace must also be admitted before
that repository projection can be hashed or displayed. Protected or unadmitted
rows have no public placeholder, diagnostic, ID, count or digest contribution.
Repository mentions and embedded URL tokens are checked throughout keys and
prose, regardless of case. Percent-encoded ambiguity, local/reserved DNS names
and literal IP hosts (including browser-normalized numeric aliases) are outside
this bounded display profile. GitHub source owners must be in the public roster;
personal GitHub authority references remain source claims in their exact field.
The raw file checksum binds private acquisition only. Whole-fleet summary counts
and digests are not forwarded into the browser; the disclosed presentation
SHA-256 covers only admitted projected records.

The Audits page preserves requested and resolved profile versions, scope
completion, inspected/uninspected paths, authored findings, classification
origin, severity, confidence, evidence classification, reported history and
candidate issue suggestions. Completion is scope completion. Opportunities and
experimental proposals do not become failures, confirmed defects or created
issues. Recurrence and resolution are explicitly reported source claims;
disappearance and an empty model do not establish remediation or conformance.

The Sanity page keeps explanations, components, relationships, dimensions,
assumptions, strengths, concerns, questions, alternatives and reviewer
recommendations separate from human governance. This serializable Observatory
profile evaluates Hygiene with empty authenticated human context. Claimed human
dispositions and exceptional applicability remain unverified; a serialized
`verified` marker cannot establish ratification. Original assessment digest,
represented revision, execution status, explicit material-change inventory and
unknown/stale freshness remain visible. Commit volume is not a materiality rule.

Both views use existing repository/query/state URL filters and an ordinary
server-rendered evidence list. Module cards expose their independent source
availability and represented public repository count. The existing bounded node
graph includes these records and links to the local endpoint when a reviewed
consumer Pages destination is unavailable. Graph membership and position remain
navigation, never an architectural relationship or assessment.

The legacy fleet directory remains unavailable when only independent review
models are supplied; no synthetic legacy repository snapshots are created. The
overview may be partial while either specialized model is available. Each view
discloses its own schema, exact normalized source revision, semantic owner pin,
schema digest, evaluation time and admitted presentation identity.

Static Node syntax, TypeScript/TSX parsing, standalone transport/projection type
inspection and source/JSON inspection are the authoring evidence for this slice.
Tests, full project typechecks, builds, CI, browser behavior, real report normalization,
organization sweep execution, publication and recovery qualification remain
deferred at the maintainer's request. This adds no publisher or scheduler.
