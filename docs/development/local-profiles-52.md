# Explicit local compiler and test profiles — #52

Recorded 2026-10-26 (America/New_York). Authorized overnight batch: #92 → #52 →
#29, with licensing/merges at the next sync. Input is #106 final evidence head
`c5935ae45d582af19a4175db1f1e05168393e0f6`; branch `fix/local-profiles-52` stacks on
`refactor/bounded-sweep-92`. #105 and #106 remain draft/unmerged; main stays
`89fc70440f9c3cf32d37a6da83c7a2b969efa97d`. No license choice is inferred.

## A — Actual profile gaps

[Audit](reviews/local-profiles-52/audit.json), [fresh compiler baseline](reviews/local-profiles-52/baseline-types.json),
[discovery](reviews/local-profiles-52/baseline-discovery.json) and
[workspace/story baseline](reviews/local-profiles-52/baseline-workspaces.json)
retain exact source revisions. Current tools config reports 58 diagnostics;
Vitest types report 27. Narrow browser types pass but omit maintained docs,
playground and standalone-component inputs. All 14 workspace typechecks and three
existing Storybook type profiles pass at #92 B (unchanged implementation at input).
Browser discovery finds 31 default, 106 production, six preview and four component
cases; it starts no browsers. These counts may overlap and are not summed as
unique journeys.

The tools config mixes NodeNext/composite emission with Vite/Storybook inputs and
misses .mts and runner configs. Unit types lack runtime aliases and mix independent
runners. Three build-smoke assertions accept stale directory contents; root build
only prepares the website. The existing full qualifier and runner configurations
are reusable; no parallel test framework or general orchestration layer is needed.

## Selected implementation

| Scope | Concrete change |
| --- | --- |
| Fast types | Keep existing site/catalog/portable-domain command and strict DOM-free domain boundary. |
| Tooling/unit/browser/story/workspace types | Repair noEmit configuration and exact aliases/includes; expose complete named commands. Preserve strictness and runtime-negative fixture coverage with explicit malformed-input boundaries. |
| Unused compiler solution | Retire the unused references-only tsconfig.typecheck.json; replace its misleading partial build graph with explicit sequential typecheck:all composition. |
| Build smoke | Extend the existing qualifier with a named smoke profile that clears only owned generated outputs, builds website/docs/playground sequentially, records a per-invocation receipt and then invokes Vitest. Verify emitted HTML/assets and refuse missing/stale/tampered receipts or failed prerequisites. No skip-build mode. |
| Named test scopes | Expose semantic accessibility, tooling, isolated consumer, discovery and browser commands with Taskfile wrappers through the pinned environment runner. Reuse all four Playwright configs and existing real-shell/keyboard/contrast/motion tests. |
| Profile coverage | Record maintained test discovery and add a check against silently omitted suites. Discovery never counts as browser execution. |
| Full qualification | Reuse scripts/qualify-store.mjs; retain fresh prerequisites, failure reports and independent runnable slices. Keep the existing failing artifact gate intact. |

No root ESM reclassification, schema expansion, new browser framework or dependency
upgrade is needed. Existing invalid fixture types should not weaken schema enums;
unsupported API options can be corrected while retaining equivalent assertions.
CLI arguments use supported long flags. The supported Mac workflow stays explicit.

## Validation and remaining acceptance

Save A before implementation. Prove each compiler profile; run existing units,
catalog/tooling/semantic/consumer checks and fresh all-app smoke. Negative smoke
probes must fail for stale/missing/tampered output and failed prerequisites. Verify
all maintained browser suites remain independently discoverable/typechecked. Keep
new report scope/source identity and exact command failures, not only a test count.

Current native Storybook 10.6.2 fails in this sandbox when its import enumerates
OS interfaces. The prior #92 temporary build-only probe is not a supported command
or native/security pass. Keep normal Storybook/browser prerequisites strict; no
compatibility shim is added to the repository. Actual Chromium/manual/native zoom
and screen-reader acceptance remain #37/#70 on Alan's Mac.

The artifact qualifier still fails three existing size categories. Storage totals,
per-document diagnostics and actual browser-transfer cost are distinct; do not
raise ceilings or automatically scale them by route count. An accepted budget
policy/disposition remains open for review. Independent browser commands may run
without claiming the entire qualifier passes.

Prior #53 recorded a concurrent sitemap collision. Current outputs are distinct;
its cause is not established. Sequential supported aggregate builds avoid that
avoidable contention but do not retroactively diagnose or fix the old observation.
A same-target concurrency experiment may inform a future narrow lock decision;
no lock/second build architecture is assumed here.

After source-bound C evidence, continue #29 against this profile contract and
preserve/supersede useful #73 work without merging its stale source wholesale.
All draft integration, licensing and unresolved acceptance return to morning sync.

## B — Implemented profiles

A was saved in [draft #107](https://github.com/egohygiene/egohygiene.io/pull/107) at
`25ab678b7d713c2b0232f8d8903c7d3e7f3152ae` before implementation. Tooling, unit and
browser configs now include their maintained inputs under unchanged strict base
options. Narrow fixture/API typing fixes preserve runtime assertions. The unused
references-only config is removed; `typecheck:all` explicitly composes the fast
site/domain checks, all 14 workspaces, tooling/tests/browsers/stories/locales.

The existing qualifier owns fresh all-app smoke. It clears only the three app
`dist` directories, builds sequentially and supplies an invocation-bound receipt
to the consumer. Source and emitted-file identities plus HTML/module/style checks
reject stale, changed, incomplete and failed prerequisites. Failure-path contracts
exercise the actual runner. Browser discovery compares all four real configurations
with maintained spec files and nonempty projects; the independent Node consumer
is explicitly mapped to its separate command. Default app browser servers now use
strict loopback ports and cannot reuse a previously running instance.

[Commands and scope](../../tests/README.md) and Taskfile wrappers expose each slice
through the existing pinned runtime adapter. The full qualifier uses complete type,
tooling and unit scopes while preserving artifact and browser gates. Separate
default-app and component browsers are explicitly available; #29 will wire all
intended scopes into CI. No Chromium was executed during implementation. C records
clean-source verification separately; native Storybook/budget/manual gaps remain.

## C — Published-source checks and remaining gaps

Tested B `47c25784b6853a415257a88150e2851d0b147e7a`, clean checkout.
[Verification](reviews/local-profiles-52/verification.json): `typecheck:all` and
workspace/locale/boundary checks pass; 344 units, 152 catalog, 58 tooling, four
semantic and one isolated consumer test pass. Discovery is 31/106/6/4 across
14 unique browser spec files; no browsers executed. Task YAML and command targets
validate, but the Task binary is unavailable here.

The first published-source smoke correctly failed: the homepage had become a
1,862-byte client shell after public rendering reported success. Read the exact
[output investigation](reviews/local-profiles-52/output-investigation.json). No
responsible application writer was found. Controlled sequential builds preserved
the expected root digest after every step; unchanged-source named and direct smoke
repeats both pass three tests. This is an unresolved intermittent output finding,
not a demonstrated fix or reproducibility qualification. Keep it with #52/#37; the
prior #53 collision is relevant history, not a proven identical cause. No retry
workaround, lock or weakened assertion was introduced.

After those builds, raw inspection passes all 26 routes and all 45 website artifact
files are byte-identical to #92 B. Existing artifact limits still fail documents
319,972 raw/86,947 gzip bytes and total 1,289,794 raw bytes. Native Storybook fails
with the same OS interface error. Initial raw/artifact commands were rejected for
an incorrectly chosen report directory; the corrected commands/results are listed
separately. No complete qualifier/browser/hosted/production pass is claimed.

Automatic source-B CI40274165740, dependency-review40274165698 and
CodeQL40274165769 fail. #29 now owns the supported formatting/workflow repair;
#52 remains open for output investigation, reviewed size policy and actual browser/
manual/native acceptance. Both inactive software-license patches still check cleanly.
Licensing selection, draft review and ordered integration wait for morning sync.
