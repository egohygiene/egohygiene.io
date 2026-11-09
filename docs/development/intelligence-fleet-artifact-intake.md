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
