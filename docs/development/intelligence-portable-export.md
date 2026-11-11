# Portable organization Intelligence export

Refs [organization #41](https://github.com/egohygiene/.github/issues/41),
[site #27](https://github.com/egohygiene/egohygiene.io/issues/27),
[site #28](https://github.com/egohygiene/egohygiene.io/issues/28) and
[site #35](https://github.com/egohygiene/egohygiene.io/issues/35).

The optional producer command packages this repository's existing organization
Intelligence overview, endpoints and interactive graph for a separately reviewed
consumer. The website remains the rendering owner; Hygiene owns public identity,
roles and route semantics, Observatory owns normalized models, and Relay owns
portable intake mechanics. The `.github` hosting proposal and its role/catalog
reconciliation remain independent review gates. This draft creates review bytes;
it does not change the current website's origin, canonical paths, build, store
publication policy or workflows.

## Explicit local producer input

Use the pinned Node/pnpm runtime, a clean exact producer checkout and its locked
dependencies. The request is data governed by
`contracts/organization-intelligence/export/export-request.v1.schema.json`.
Supply the actual UTC evaluation boundary, explicit intended origin and mount,
then either exact normalized file bindings or null for each model. For example,
the following illustrates an unavailable skeleton; its time and target are
operator-selected inputs, not observations or a declaration of live hosting:

```json
{
  "schema": "egohygiene.website.organization-intelligence-export-request/v1",
  "contract_version": "1.0.0-alpha.1",
  "target": {
    "origin": "https://egohygiene.github.io",
    "base_path": "/.github/"
  },
  "as_of": "2026-11-10T00:00:00Z",
  "models": { "core": null, "audits": null, "sanity": null }
}
```

For real evidence, `core` is an object with required `fleet`, `manifest` and
`publications` members. `fleet` is a file binding; the other two may be null.
Audits and Sanity are each a nullable file binding. Every binding has exactly
`path` and `sha256`, with a canonical relative path below the selected input root
and the actual raw file SHA-256. `fleet` accepts the existing core alpha.2 model;
Audits and Sanity accept their separate alpha.1 fleet models. The optional core
manifest and repository-publication file retain their existing intake contracts.
Use the exact artifacts/owner queries described in the
[fleet handoff](intelligence-fleet-artifact-intake.md) and
[review-model intake](intelligence-audits-sanity-intake.md).
The optional [retained-model selection workflow](intelligence-model-artifact-selection.md)
binds those actual ordinary artifacts to this same exporter. Its optional
`module_as_of` request member preserves independent original module clocks;
omitting it keeps the existing request behavior. The export manifest, route
contract and static intake format are unchanged.

```bash
pnpm intelligence:export \
  --request /review/export-request.json \
  --request-sha256 ACTUAL_REVIEWED_REQUEST_SHA256 \
  --input-root /review/inputs \
  --output /review/new-organization-export
```

The new output must be outside the producer checkout and must not contain the
request/input source. Existing output is rejected. Regular-file, symlink,
strict UTF-8/JSON, duplicate-key, byte and hash checks precede model intake.
The ordinary loader captures one immutable public presentation for both client
and server builds; absent models override ambient input environment variables.
The exact public catalog narrows the core input before public identities and
counts, while separate review inputs retain their existing public-source gates.
No raw model packet or acquisition-only file is copied into the export.

## Artifact and route contract

The result is an ordinary directory containing `export-manifest.json` and
`site/`. The producer-owned manifest schema and exact route fixture are under
`contracts/organization-intelligence/export/`. They bind:

- Exact producer repository/revision, explicit intended origin/base path and UTC
  evaluation boundary, without asserting that the target exists or is deployed.
- The selected public scope and the existing exact Hygiene admission metadata;
  an empty scope is allowed and hashes the empty selected public row list.
- Availability and declared presentation identities of the three compatible
  model inputs. Availability means admitted input, including empty authored
  evidence, and is never a finding, freshness, ratification or conformance score.
- All39 fixed logical paths and their exact relative HTML filenames: the
  overview,18 existing organization endpoints and their aliases/root redirect.
  Identity remains `/intelligence/identity/`; the product `/identity/` is outside
  this export. The registry/source discrepancy remains an owner roadmap item.
- Every public file's raw hash and size, capped at256 files,16 MiB per file and
  64 MiB total. `404.html` and `.nojekyll` are operational files; `CNAME`, source
  maps, store assets, general application routes and the SSR bundle are absent.

Manifest model identities are producer claims over the existing admitted
presentation, not proof that Relay replayed upstream normalization. The inlined
client data and server renderer use the same captured snapshot. Source model
truth, original report qualification and authenticated human evidence remain
with their owners. The public scope is the union actually represented by the
admitted models, not a fabricated full inventory or adoption total.

The dedicated Vite entry reuses the existing feature components, source locale,
theme and metadata ports, with an export-only metadata adapter and focused
dictionaries. Its module boundary rejects commerce imports. Browser and SSR use
the same router basename and initial snapshot; graph anchor URLs honor that
mount while admitted external repository destinations retain their own origin.
Local resources are hashed, no assets are inlined, and all HTML carries the
bounded CSP shared with the intake profile. The CSP permits the inline styles
needed by React/SVG and denies connections, frames, workers, forms and external
script/resource origins. This does not certify arbitrary JavaScript behavior.

The literal `/.github/` mount is explicitly representable here. Its compatibility
with a consumer's separately pinned Hygiene site declaration requires the
reviewed exact-prefix correction and deliberate pin/digest adoption. This export
does not silently upgrade that contract or ratify its proposed route registry.

## Manual ordinary-artifact producer

`.github/workflows/intelligence-static-export.yml` is manual only, public
canonical-main only, with `contents: read`. Supply a checked-in regular request
path and its exact SHA-256; request model paths are relative to the producer
checkout. No request or populated report is invented automatically. The workflow
selects the exact source, binds request bytes, installs the locked producer and
uploads `organization-intelligence-static-v1-<run-id>-<run-attempt>` containing
the complete artifact directory. Its outputs expose the actual ordinary upload
ID/ZIP digest and raw manifest digest. There is no Pages upload, deploy step,
write/OIDC permission, schedule or DNS operation.

A consumer retains the successful producing run/attempt, workflow/source SHA,
actual artifact ID/name/ZIP digest, manifest digest and expected target outside
the artifact, then invokes Relay's separate static-intake review boundary.
Checksums do not authenticate their own source. Consumers stage only the exact
verified `site/` bytes; review retention does not authorize deployment. Existing
egohygiene.io production URLs remain unchanged until a separately reviewed
hosting transition establishes one canonical home and deliberate aliases.

## Decision and qualification boundary

[ADR0017](../architecture/decisions/0017-portable-intelligence-export.md) records
this proposed producer interface, composing
[ADR0012](../architecture/decisions/0012-static-public-route-rendering.md).
Organization hosting remains the separate proposed `.github` decision. Hygiene's
ADR-0001 approval hold and all historical consumer recovery paths remain intact.

Only static source, schema, syntax and interface inspection was performed while
authoring. No export build, application/owner helper, tests, CI, workflow dispatch,
artifact upload/download, browser, Pages publication, DNS or runtime qualification
was executed. Actual hydration, CSP/resources, base-path navigation, reproducible
bytes, failure cleanup and consumer recovery remain explicit later checks.
