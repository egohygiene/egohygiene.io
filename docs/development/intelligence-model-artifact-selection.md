# Retained model selection for the organization home

Refs [organization #15](https://github.com/egohygiene/.github/issues/15),
[#27](https://github.com/egohygiene/.github/issues/27) and
[Relay #153](https://github.com/egohygiene/relay/issues/153).

This source adapter closes the handoff between retained producer models and the
existing [organization-only export](intelligence-portable-export.md). It selects
one existing core fleet bundle, one existing Audits fleet bundle and one existing
Sanity fleet bundle independently. It does not assemble another fleet, normalize
reports, create assessments, retime evidence, run AI or deploy a site.

## Select actual retained inputs

The closed request is
`contracts/organization-intelligence/export/model-selection.v1.schema.json`.
Commit one reviewed request with the explicit UTC evaluation boundary and the
intended review target `https://egohygiene.github.io` plus `/.github/`. Its three
module slots are nullable. A selected slot declares public visibility, a producer
already in the exact Hygiene public roster, full producer source SHA, workflow
path, successful canonical-default-branch push/manual run and attempt, exact
ordinary artifact ID/name, raw ZIP SHA-256, binding-file SHA-256 and a maximum
age in seconds. Those are actual operator-selected values, never a latest/name
query or a synthesized sample capture. Unknown/protected producers disappear
before inspecting their selectors, hashes, provider endpoints or diagnostics.

For core, the binding file is the existing `fleet-artifact.json`, and the ZIP
contains exactly that file and `fleet.json`. For Audits/Sanity it is the reviewed
Relay `review-feed-receipt.json`; the ZIP contains that receipt and the four
fixed `repository-audits`, `repository-sanity`, `fleet-audits`, `fleet-sanity`
JSON files. Either review slot can select the same producer bundle. There is no
combination of repository models into a new fleet at this boundary.

The optional publications binding selects an exact regular source JSON file in
this producer checkout by relative path and raw hash. The existing publication
loader still owns route/source/expiry admission; missing declarations never
become inferred custom domains. No populated selection is committed until the
real inputs exist. A dated directory or adoption ledger is not an artifact lease.

## Acquisition, clocks and independent failures

`scripts/intelligence_model_artifacts.py prepare` checks the request byte hash,
public roster and target before acquisition. Provider calls use fixed GitHub API
paths after public producer admission. It binds producer visibility, canonical
default branch, successful run/attempt/head/event/workflow, artifact ID/name,
run/head binding, expiry, raw ZIP digest and size. ZIP admission rejects extra
paths, directories, links, duplicate members, encryption and excessive sizes or
compression. Input programs and paths from an archive are never executed.

The original core `observed_at` or review fleet `as_of` must precede the producing
artifact's actual creation time. It must also precede the request's evaluation
boundary and satisfy that slot's maximum age; expiry is independently checked.
An optional `module_as_of` member in the existing export request carries these
actual clocks to the existing loader. Old export requests without it retain
their original single-clock behavior. There is no rewrite of the models or
invention of a common evidence clock. The manifest's top `as_of` remains the
selection/export evaluation boundary, while each view retains its own source
clock and source evidence.

Each slot fails independently with a closed unavailable, incompatible or stale
status. Inaccessible and expired artifacts never fall back to a different run.
An invalid optional publications file isolates core. A valid empty/uncollected
review model is context about unavailable evidence, not a clean audit or human
acceptance. The existing schema/source loader remains the final presentation
admission boundary; transport receipt verification does not replace it.

Raw provider captures, model bytes, plans and their raw checksums remain private
staging inputs. `finalize` reads the actual export manifest after the existing
loader has admitted its presentation. A candidate rejected there becomes
`OWNER_INPUT_DENIED`. Only admitted public provenance, original module clocks,
closed status and presentation identity enter the separate public receipt. No
raw rejected/unused model or whole-selection checksum enters that receipt.
The receipt's input `state` is separate from literal native
`presentation_state`. A compatible input can still display stale, partial or
unavailable evidence. The exporter writes that admitted presentation state to a
private bound sidecar for finalization; no new static-manifest field or upstream
model state is invented. An empty authored-evidence input never becomes a clean
assessment merely because its transport and schema are compatible.
The optional local `--capture-root` acquisition seam is for later offline
qualification only. Its staging is explicitly marked `captured-inputs` and
`finalize` rejects it; it cannot mint the real-provider public selection receipt.
The manual producer workflow never supplies that argument.

## Manual review workflow

`.github/workflows/intelligence-model-artifacts-export.yml` is a new manual-only
canonical-main path with contents/actions read permissions. Supply the checked-in
request path and its exact byte hash. The workflow reads a regular Git blob at
the dispatched source, stages the selected models, invokes the existing export
builder, then retains two ordinary artifacts:

- `organization-intelligence-static-v1-<run-id>-<attempt>`: exactly the existing
  sealed `export-manifest.json` plus `site/` tree.
- `organization-intelligence-model-selection-v1-<run-id>-<attempt>`: only
  `model-selection-receipt.json`, bound to the exact export manifest hash and
  actual admitted presentation identities.

The job exposes both actual IDs/ZIP digests, manifest digest and selection receipt
digest. Keep that producing run/attempt/head and these values in the review
packet. The `.github` consumer's `retained-models` profile authenticates both
artifacts from that same producer run before retaining the companion alongside
Relay's verified static review. The original `static` profile is preserved.

The read token is optional repository configuration
`INTELLIGENCE_PUBLIC_ARTIFACT_READ_TOKEN`, otherwise the job token. No availability
or cross-repository access is assumed. There is no schedule, Pages upload,
publisher, OIDC permission, DNS/CNAME operation or purchase/provider activation.
The company/store build, strict budgets, recovery and business guards are intact.

## Source review and remaining qualification

The new receipt describes source transport and presentation admission; it does
not prove report quality, conformance, full-fleet adoption or human ratification.
The proposed hosting and policy decisions keep their actual unaccepted states.
Raw actor strings or approval URLs do not supply trusted human evidence.

Only static source, schema, syntax and peer inspection are in this change.
No helper/application/native execution, tests, builds, CI, provider capture,
workflow dispatch, actual artifact export/intake, browser or publication check
was performed. Real retained inputs, reproducibility, host/source declarations,
failure canaries and exercised recovery still require their own evidence.
