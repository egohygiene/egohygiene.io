# Repository context

This is the operational entry point for a fresh chat or contributor. It links
the existing Aether architecture graph to current implementation and evidence.

| Need | Read |
| --- | --- |
| Agent instructions | [Root](../../AGENTS.md), [website](../../apps/egohygiene.io/AGENTS.md), [schemas](../../packages/schemas/AGENTS.md) |
| Licensing/provenance audit | [#59 audit](../legal/licensing-59.md) and [asset inventory](../legal/reviews/licensing-59/asset-inventory.json); #104 merged, evidence/notice work underway, first-party license selection remains open |
| Source hygiene delivery | [#56 receipt](../development/source-hygiene-56.md), [verification](../development/reviews/source-hygiene-56/verification.json) and [all empty-file dispositions](../development/reviews/source-hygiene-56/scaffolds.md); merged #104, fresh-checkout local A/B/C complete; current #59 work is linked above |
| Component style delivery | [#53 receipt](../design/component-styles-53.md), [verification](../design/reviews/component-styles-53/verification.json), [ADR 0015](../architecture/decisions/0015-explicit-component-styles.md) and [consumer commands](../../tests/component-styles/README.md); merged #103, actual browser acceptance deferred; #56 local delivery is linked above |
| Current merge catch-up | [Exact merge receipt](merges-2026-10-25.json): #87/#93/#94/#95/#98/#99/#101/#102 integrated; #73 deferred; #53 delivered in draft, prior acceptance gaps remain |
| Prior shared accessibility | [#49 receipt](../design/shared-accessibility-49.md) and [source-bound evidence](../design/reviews/shared-accessibility-49/verification.json); draft #102 on #101, 52 focused tests/three builds pass; B implemented, A/C browser acceptance deferred, #53 next |
| Prior standalone store preservation | [#100 handoff](../migration/store-retirement/README.md), [all 16 issue dispositions](../migration/store-retirement/backlog.md), [recovery evidence](../migration/store-retirement/verification.json) and [ADR 0014](../architecture/decisions/0014-standalone-store-retirement.md); source remains intact pending integration/wiki/platform-state review, #49 next functional work |
| Prior shared Markdown checkpoint | [#50 contract and delivery receipt](../design/content-markdown-50.md), [ADR 0013](../architecture/decisions/0013-shared-safe-markdown.md); draft #99 on #98, shared parser/React/HTML contract, 64 focused tests and [source-bound C evidence](../design/reviews/content-markdown-50/verification.json); Chromium deferred, #49 next |
| Prior ecosystem navigation checkpoint | [#60 destination contract, implementation and local evidence](../design/ecosystem-links-60.md); draft #98 on #95, seven local card links, separate repositories, 81 focused tests; C browser acceptance remains; #50 is linked above |
| Deployment environments and early production preview | [Ordered plan](../roadmaps/store-launch.md), [#96 commands](https://github.com/egohygiene/egohygiene.io/issues/96) and [#97 construction mode](https://github.com/egohygiene/egohygiene.io/issues/97); reuse #21/#89 after setup, before real products; #91 C local review is now recorded below |
| Prior public rendering checkpoint | [#91 C local review and remaining acceptance](../design/public-rendering-91c.md), [B implementation](../design/public-rendering-91b.md) and [ADR 0012](../architecture/decisions/0012-static-public-route-rendering.md); draft #95 fixes local clean-path serving, verifies 26 pages/52 responses and retains 13 browser cases; size/hosted/browser gaps remain; #60 is linked above |
| Prior website essentials checkpoint | [#90 C copy review, retained journeys and remaining decisions](../design/website-essentials-90c.md), [B implementation](../design/website-essentials-90b.md), [A contract](../design/website-essentials-90a.md); draft #94 based on #87; contact proposal awaiting disposition, browser/manual acceptance deferred; current #91 B is linked above |
| Remaining work in execution order | [Roadmap #84](https://github.com/egohygiene/egohygiene.io/issues/84), [setup parent #88](https://github.com/egohygiene/egohygiene.io/issues/88), [real-product parent #31](https://github.com/egohygiene/egohygiene.io/issues/31), and [approved issue/milestone map](../roadmaps/store-launch.md); #90/#91 essentials/rendering, concrete fixes, #92 refactor/upgrades, final local #37, then environments/public construction preview and actual products/launch |
| Integrated readiness/disclosure | [PR #87](https://github.com/egohygiene/egohygiene.io/pull/87) and [pinned receipt](https://github.com/egohygiene/egohygiene.io/blob/ba4cc9270ed8b0dd3ae9dd650400e4c67a2d20e6/docs/store/product-readiness-38.md); [local workflow](../store/product-readiness.md) and [ADR 0011](../architecture/decisions/0011-reviewed-product-readiness.md); merged catalog v3/readiness work, no actual product/provider activation |
| Prior #65 C / #34 checkpoint | [Synthetic integration and deferred browser proof](../store/catalog-localization-65c.md), [first-language review](../store/catalog-language-review.md), [B presentation](../store/catalog-localization-65b.md), [A contract](../store/catalog-localization-65a.md); merged in #86 after #83/#85; acceptance reconciliation belongs to setup #88 and final #37 |
| Deferred #64 review checkpoint | [C implementation and browser blocker](../store/locale-review-64c.md), [message workflow](../store/interface-message-workflow.md), [B service](../store/locale-service-64b.md), [A foundation](../store/locale-contract-64a.md), [ADR 0009](../architecture/decisions/0009-single-locale-runtime.md); merged in #85; C browser acceptance remains open |
| Current #37 local qualification | [Complete local review and remaining dependencies](../store/qualification-37.md); merged in #83; final integrated validation is planned on Alan’s machine with Taskfile conveniences |
| Checkout-handoff closeout | [#37 regression/artifact receipt](../store/checkout-handoff-37c.md), [keyboard/touch journeys](../store/checkout-handoff-37b.md) and [fixture boundary](../store/checkout-handoff-37a.md); bounded slice merged in #82, broader #37 qualification selected next |
| Artwork ordering | [#54 contract and verification](../store/design-order-54.md); A/B/C merged in #81; #54 closed |
| Schema audit | [#34 bounded envelope hardening](../store/schema-audit-34.md); bounded contribution merged in #79; broader #34 remains open |
| Storefront checkpoint C | [#62 final journey review](../design/storefront-62c.md); PR #78 merged and #62 closed on 2026-10-17; next work awaits selection |
| Add storefront content | [Approved item, feature, artist and song workflow](../store/storefront-content-workflow.md) |
| Earlier storefront checkpoint B | [Artist/song review and authoring](../design/storefront-62b.md); historical evidence retained |
| Earlier storefront checkpoint A | [Curated shop review and authoring](../design/storefront-62a.md); historical evidence retained |
| Landing/shell visual review | [#35 rendered checkpoint](../design/landing-shell-35.md), including before/after and locale stress captures |
| Resume the current work | [Current state](current-state.md), then refresh its live GitHub links |
| Decisions and rationale | [ADR index](../architecture/decisions/README.md) and [high-level decisions](../../DECISIONS.md) |
| Website/store launch discussion | [Launch plan](../architecture/store-launch-plan.md), [ADR 0006](../architecture/decisions/0006-store-launch-direction.md), and [approved roadmap with historical proposals](../roadmaps/store-launch.md) |
| Two-store ownership comparison | [Selected owner and preservation plan](../architecture/storefront-ownership.md), [ADR 0007](../architecture/decisions/0007-canonical-storefront-owner.md), issue #75 |
| Actual module boundaries | [Dependency rules](../architecture/dependency-rules.md) and [extension contracts](../architecture/store-extension-contracts.md) |
| Evidence, origin and limitations | [Provenance ledger](provenance.md); asset-local records remain authoritative for assets |
| Wider purpose and architecture graph | [META](../../META.md) |
| Machine-readable navigation | [Manifest](manifest.json); paths are relative to the repository root |

The role of each source matters: code/configuration shows implementation;
accepted decisions explain intended constraints; issues/PRs show live delivery
state; dated receipts show what was actually checked at a particular commit.
If they disagree, inspect and record the discrepancy. A newer handoff does not
erase an older receipt or silently supersede an ADR.

## Refresh at the end of a checkpoint

1. Refresh branch/issue/PR state and record the implementation commit checked.
2. Update current state: what changed, what remains, and the next concrete action.
3. Add evidence to the ledger with source path/URL, date, commit/hash where
   available, result and limitations. Label historical or unverified claims.
4. Update the ADR index if a decision was recorded/superseded. Keep asset hashes,
   source revisions and export methods beside the assets and link to them.
5. Check relative links, manifest paths/JSON and the diff. Do not embed local
   scratch paths, signed URLs, private exports or the entire chat transcript.

Pin the implementation revision, not the not-yet-created documentation commit.
Git history records the context update itself. Tests of an earlier implementation
must not be reported as freshly run tests of a later code change.

A fresh chat can start with: “Continue this repository from `AGENTS.md` and
`docs/context/current-state.md`; refresh GitHub state, then resume the next
checkpoint within my current instructions.”
