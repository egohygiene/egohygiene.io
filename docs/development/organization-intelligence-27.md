# Organization Intelligence foundation

Refs [site #27](https://github.com/egohygiene/egohygiene.io/issues/27),
[organization acceptance #41](https://github.com/egohygiene/.github/issues/41),
and [Relay fleet assembly #153](https://github.com/egohygiene/relay/issues/153).

This bounded delivery adds one content-first `/intelligence/` overview to the
existing website. It has source-owned Now evidence, a searchable public
repository directory, per-domain collection/freshness disclosures, represented
revisions, source links and explicit unavailable/error states. Future modules
are reserved navigation anchors showing their Hygiene-owned canonical paths and
owning issues. They are not separate implemented/published routes.

## Input and review boundary

The additive [fleet artifact intake](intelligence-fleet-artifact-intake.md)
binds Relay's ordinary handoff manifest, source availability and expiry alongside
the exact fleet file. The standalone file path below remains supported.

Relay's `public-fleet.review.json` remains publication-denied. The host never
imports that review envelope or treats its presence as publication approval.
After reviewing the exact public candidate, deliberately extract its unmodified
`fleet_snapshot_candidate` as a standalone Observatory alpha.2 JSON artifact.
Record the extracted file's SHA-256 in the consumer's review/publication packet.
Supply that exact byte digest and an explicit UTC evaluation boundary:

```sh
EGOHYGIENE_INTELLIGENCE_FLEET=/artifacts/reviewed/public-fleet.json \
EGOHYGIENE_INTELLIGENCE_SHA256=<reviewed-file-sha256> \
EGOHYGIENE_INTELLIGENCE_AS_OF=2026-11-09T03:00:00Z \
pnpm build
```

The timestamp is an example, not a current observation or deployment claim.
Use an actual reviewed evaluation boundary. No browser token, remote fetch,
backend or provider configuration is involved. These variables have no `VITE_`
prefix; paths and acquisition-only hashes do not enter public output.

The optional artifact is intentionally absent from source. A default build
renders “No reviewed public snapshot is connected yet,” with no repository
count or invented empty/healthy state. Incorrect/missing review binding,
inaccessible files, incompatible contracts or unusable input render closed
module diagnostics; ordinary website/store pages remain available. Broken
trusted contract files are a build configuration failure, rather than permission
to bypass the pinned input boundary.

## Contract and projection

`contracts/organization-intelligence/input-lock.json` pins exact Observatory
alpha.2 fleet schema and Hygiene route-registry bytes. The original normalized
fleet remains owned by Observatory. The Node adapter checks its supported
schema/version and validates the bounded fields used by this first presentation;
it does not implement a general JSON Schema engine, repeat normalization, or
certify the whole artifact's upstream validation. Full owner schema/semantic
validation and review remain producer/publication gates.

Only explicit public repository rows are selected, before identities, counts,
freshness aggregation or Now lookup. Non-public/unclassified rows and unrelated
Now groups are ignored without names, counts, placeholders or error details.
An invalid admitted public repository is omitted with a generic partial-input
state; unaffected rows remain visible. Malformed Now data is isolated to that
repository's Now section. Duplicate public identities are withheld rather than
selecting a winner. A globally private fleet is denied.

The browser receives only the admitted directory, three Now lanes, explicit
coverage claims and pinned public provenance. Unused search/graph/module
payloads are never serialized. The raw input checksum is local admission data.
The displayed presentation identity, digest and observation window are derived
from admitted public presentation rows, rather than whole input bytes or owner
aggregates that could include discarded rows. Per-repository source snapshot
identity/digest remain clearly source-owned; the snapshot identity must bind to
the declared repository and represented commit.

All text is bounded and rendered as React text. Navigable evidence links require
literal standard-port HTTPS GitHub URLs in the represented repository, with
closed issue/PR/commit/blob/tree/release path forms. Percent encoding, decoded
dot-segment ambiguity, backslashes, controls, credentials and query strings are
rejected. Source and represented-commit links are constructed from validated
canonical repository IDs. Cross-repository Now relationships are unsupported
in this first host slice and become module-unavailable rather than invented
links. No arbitrary snapshot HTML is evaluated.

Freshness uses the explicit evaluation boundary and a one-day default maximum
age. The API supports a bounded caller-selected maximum age, but no automatic
wall clock is inserted into deterministic output. Original domain claims and
observation times are not rewritten; stale evidence remains stale.

## Existing build and route ownership

`loadOrganizationIntelligence` captures one immutable presentation module.
The existing normal build passes the same frozen module into browser and SSR
builds, alongside its unchanged frozen store catalog. The route receipt's
`publicInputSha256` binds both public modules. No second deployer or static
generator is introduced. The content-first page and first hydration share an
unfiltered source snapshot; URL controls enhance after the existing browser
snapshot boundary. No-JavaScript output retains the admitted directory and
native evidence disclosures.

The canonical path is `/intelligence/`, following Hygiene's organization
profile. Existing website/store canonical path spelling is preserved. Narrow
publication/file/preview exceptions emit `intelligence/index.html` and preserve
the slash; Caddy has explicit `/intelligence` and `/intelligence/index.html`
redirects to that canonical directory route. No future module aliases or extra
canonical pages are manufactured. The new page is intentionally noindex during
foundation review; its navigation and generated route receipt still exist.

## Review and remaining work

Implementation starts at verified draft #117 head
`a7e15c7b1543dcba01647ec8ff358aab5126c817`, preserving the existing unmerged
#105→#106→#107→#108→#109→#117 stack. No commerce source, purchase eligibility,
provider state, license choice or existing acceptance gate is changed.

This is an implementation checkpoint for review. The user explicitly deferred
tests, CI and broad polish. No install, build, typecheck, browser, Caddy runtime,
live fleet canary, privacy regression suite or deployment ran for this change.
Static syntax/JSON/diff inspection is reported separately from those gates.
Existing route qualification/alias verifiers need the new canonical-slash case
in the later verification pass. Previous build/browser/size/hosted receipts
remain historical; adding the page is not a new passing qualification.

Next: review this foundation together with Relay #153's exact public extraction
handoff; exercise missing/malformed/mixed-visibility/mixed-failure fixtures,
static/hydration/keyboard/mobile/alias behavior, then connect a reviewed public
canary through the website's existing preview/publication boundary. Module
implementation, owner acceptance, hosting and release closeout remain open.
