# Fleet artifact intake

Refs [site #27](https://github.com/egohygiene/egohygiene.io/issues/27) and
[Relay #153](https://github.com/egohygiene/relay/issues/153).

The existing build-time fleet loader accepts the optional Relay ordinary
artifact handoff. Keep the exact downloaded `fleet.json` and
`fleet-artifact.json` together in a reviewed local artifact directory. Retain
the actual producer repository/run/attempt, artifact ID and ZIP digest in the
host's review packet; do not select a mutable latest/name lookup. This adapter
performs no provider read and receives no provider credential.

Supply the existing `EGOHYGIENE_INTELLIGENCE_FLEET`,
`EGOHYGIENE_INTELLIGENCE_SHA256`, `EGOHYGIENE_INTELLIGENCE_AS_OF`, plus the
optional `EGOHYGIENE_INTELLIGENCE_MANIFEST` and
`EGOHYGIENE_INTELLIGENCE_MANIFEST_SHA256`. The two SHA-256 values bind exact
downloaded file bytes. They differ from the uploaded ZIP digest and from the
public presentation digest. No environment variable uses a `VITE_` prefix;
local paths and acquisition-only metadata never enter the browser bundle.

The loader checks the supported manifest identity, public organization,
generator reference, assembly state, explicit observation/expiry and exact
fleet file hash/size. It then uses the existing owner-pinned fleet projection,
repository publication links and interactive navigation graph. A partial
handoff keeps the overall overview partial even when all available fleet rows
are current; an omitted/unavailable repository cannot silently turn into a
fully available fleet. Original per-repository coverage and times remain
visible. An expired/incompatible/unavailable manifest renders the existing
closed module diagnostic and preserves ordinary website/store routes.

Manifest validation binds the supported intake fields; it does not repeat
upstream owner validation or certify arbitrary metadata. Public catalog,
projection, privacy and owner-schema acceptance remain producer/review gates.
The `public-fleet.review.json` wrapper stays publication-denied and is never
imported. A reviewed artifact is input to the host's existing publication
boundary; this change adds no deployer, scheduler, provider activation or
publication success claim. Without the optional manifest, the existing exact
standalone fleet-file path retains its behavior.

ADR not required: this is an additive input binding within the existing
build-time Observatory projection and consumer-owned publication boundary.
Static Node syntax and whitespace inspection ran. Tests, typechecks, builds,
CI, browsers, real artifact acquisition, mixed-state canaries, publication and
recovery qualification remain deferred at maintainer request.

## Manual artifact refresh

`.github/workflows/intelligence-fleet-refresh.yml` provides the operator path.
It is `workflow_dispatch` only, gated to this public repository's `main`, with
`contents: read`, `actions: read`, a30-minute job bound and no cancellation of
an in-progress refresh. It uses the exact reviewed Relay artifact action;
no site build, Pages upload, scheduler or deployment runs. This repository has
no workflow catalog to update; existing CI, preview, release and deploy files
retain their current behavior.

Supply exactly one `plan_json` or `plan_path`, the exact plan byte `plan_sha256`,
an explicit UTC `as_of`, and ordinary artifact `retention_days` (default30).
The checked-in path is read as a regular JSON Git blob at the exact dispatched
main SHA, rather than executing or trusting a working-tree program. Inline JSON
is data in an environment variable. The preflight rejects conflicting inputs,
wrong digests, duplicate JSON members, unsupported public organization/schema
and invalid UTC boundaries before invoking Relay. Relay then admits canonical
public membership before inspecting any artifact identity or provider lookup.

The plan must use real retained repository pair IDs, ZIP digests, represented
commits and successful producing runs/attempts. No populated plan is checked
in until those values exist. The workflow can use an explicitly configured
`INTELLIGENCE_PUBLIC_ARTIFACT_READ_TOKEN` secret with read access to the selected
public Actions artifacts; otherwise it uses the job's existing GitHub token.
No credential availability or cross-repository permission is assumed or created.
An inaccessible selection remains isolated and can produce an unavailable or
partial handoff. Raw provider captures and the review wrapper are not uploaded.

After a successful ordinary upload, retain the workflow run/attempt, artifact
ID/ZIP digest, manifest/file digests, as-of and reported assembly status in the
review packet. The job exposes these exact outputs. Download that selected
artifact, review it and feed its bound files through the loader variables above
using the existing site publication process. A green artifact job alone does
not establish usable evidence, current Pages content or completed publication.
No dispatch, provider download/upload or native execution was performed while
authoring this workflow; YAML/embedded Python/bash inspection is source evidence.
