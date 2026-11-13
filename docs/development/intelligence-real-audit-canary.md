# Real audit input and required evidence membership

The first real audit-model export exposed a website adapter defect: the pinned
owner schema already uses JSON Schema `contains`, but the bounded structural
validator rejected that keyword. The exporter completed with an incompatible
audit input and no admitted audit presentation. A successful build alone did
not prove that the report reached the page.

The repair admits `contains` during recursive schema inspection and requires at
least one array member to satisfy its complete nested schema. Confirmed findings
still require observed evidence; a policy-conformance finding requires one
member that is both observed and policy evidence. Empty or nonmatching arrays
fail. Unsupported keywords, existing bounds, pins and owner schemas stay intact.
No new ADR is needed: this implements the existing pinned contract within the
proposed [portable export boundary](../architecture/decisions/0017-portable-intelligence-export.md).

## Actual selected source

The checked-in [selection](../../contracts/organization-intelligence/export/selections/real-audit-canary-2026-11-13.json)
binds the actual successful [organization canary run 43333273329, attempt 1](https://github.com/egohygiene/.github/actions/runs/43333273329)
at source `b1539be1ab718de2db3da4b1eaa6827e36d4753f`. It selects ordinary model
artifact `13996296082`, named
`repository-intelligence-real-review-v1-43333273329-1`, and the exact ZIP and
receipt hashes recorded in that JSON. Provider metadata says it was created at
`2026-11-12T23:58:46Z`; the selection evaluation is later, at
`2026-11-13T00:04:12Z`, with an 86,400-second maximum age.

The selection SHA-256 is
`a2f02e5039714154c11f250704cc926017c0b7cc18403444b7696b58f7a7429c`.
Core, Sanity and publications are explicitly unselected. The admitted audit
model retains its original `2026-11-12T23:58:44Z` frame, one partial audit run
and one positive observation. Its historical report subject stays historical;
neither partial completion nor available transport establishes conformance.

## Focused executed checks

At source `e79b250d88e62aa2cd4880972b4bd91d4b48b201`, Node `24.21.0` and pnpm
`11.28.5` used a fresh frozen-lockfile, ignore-scripts dependency install.

```sh
node --test tests/tooling/intelligence-review-schema.test.mjs
```

All four focused tests passed. They consume the exact pinned owner conditions,
including an observed/source member plus a separate inferred/policy member that
must not satisfy the single-member policy requirement. A separate real-input
loader probe admitted the hosted model; changing all its observed evidence to
inferred and resealing the input rejected it. The owner schema identified
`contains` as that negative input's sole structural violation.

The existing client/SSR export then built that actual hosted model at its
unchanged frame. Its manifest admits only `egohygiene/.github`, with Audits
available and Core/Sanity unavailable. All 39 route files and all 43 public
file hashes/sizes match; the audit finding's canonical anchor, title and partial
completion appear in generated Audits HTML. The local manifest SHA-256 is
`1662c0bdf0ee186396b3d8402d538568c598000b721aed7132c51ac5c4f9fda3`.

This is local execution against actual provider model bytes. The website's
manual retained-model workflow and the `.github` review consumer still need
their own real producer/run/artifact proof. No local capture replay receipt was
minted. Broad CI, browser, live Pages, hosting cutover and human ratification
remain separate; existing publisher and business gates are preserved.

## Hosted source-identity checkpoint

Website [PR #141](https://github.com/egohygiene/egohygiene.io/pull/141) merged as
`0847371698710df35d79190e32154be96c72858e`. The actual hosted
[export run 43335344355, attempt 1](https://github.com/egohygiene/egohygiene.io/actions/runs/43335344355)
completed the model-selection/acquisition step and Node `24.21.0`, pnpm
`11.28.5` and frozen ignore-scripts installation. It then failed the existing
combined 40-hex HEAD and clean-source guard. Finalization and uploads were
skipped: this attempt produced no sealed export or public companion receipt.

The exact failing identity or source path was not logged. Local exact frozen
installs remained clean, including with Git file-mode checking; these results
do not establish a hosted cause. The selected diagnostic retry observes fixed
checkpoints after checkout, model acquisition, dependency installation and a
failed export. The last observation also catches mutations during exporter
imports or input admission before its guard.
[The observer](../../scripts/intelligence_source_status.py) reports HEAD
validity/public SHA and at most 32 JSON-escaped canonical relative status
paths. Git stdout and execution time are bounded, rename fields remain paired,
and noncanonical or credential-like names are omitted. Optional Git index
writes are disabled. No contents, diffs, private inputs, environment,
configuration or new hashes are logged. The original export guard still
decides admission; no reset, deletion, ignore or gate relaxation is selected.

Metadata-only disposable Git checks cover clean identity/status, tracked
typechanges, NUL-delimited renames, path omission and explicit row truncation.
The next actual workflow must supply the checkpoint evidence before a cause
and repair are claimed. Hosted export/finalization and `.github` intake remain
incomplete, separately from the executed local membership/export checks above.
Preparation can degrade an individual acquisition failure to an unavailable
module; its green step alone does not prove hosted audit-model admission.

## Observed GitHub CLI device-state boundary

Diagnostic [run 43337872934, attempt 1](https://github.com/egohygiene/egohygiene.io/actions/runs/43337872934)
at `d476a224c97d311cbe034f7e9d15ee3d37e1c6c4` reported valid HEAD and a clean
checkout. Immediately after acquisition, its only dirty path was untracked
`.local/state/gh/device-id`; install and failed-export observations agreed.
The existing guard rejected export, so no finalization or uploads occurred.

The sanitized child environment intentionally omits HOME. Newer GitHub CLI
device state uses `XDG_STATE_HOME` independently of the already bounded
`GH_CONFIG_DIR`; without HOME or an explicit state root it wrote relative to
the checkout. The repair sets only `XDG_STATE_HOME` beneath the existing
validated private acquisition workspace outside source. It does not change
HOME, fixed read-only API arguments, credentials/proxy/CA allowlists, module
failure isolation, source guards, ignores, owner pins or selection bytes.

```sh
python3 -I tests/tooling/intelligence_model_artifacts_test.py
```

The one focused actual-child mock test reproduces the HOME-absent fallback and
proves a clean checkout, private device-state placement, exact GET arguments
and captured-byte preservation. It passes at
`8711a380cc4ebe38bcc0a67744fd0f45bb65245b` and fails against the exact pre-fix
Provider as expected. It makes no network call and uses no real credential.
Local GitHub CLI `2.46.0` predates the hosted behavior; the actual repaired
workflow retry remains necessary. Inspect its admitted audit presentation and
public companion receipt before claiming transport or end-to-end success.
