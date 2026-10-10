# Store v1 consolidation ledger

Checkpoint: [#32 A — Inventory and agree on architecture](https://github.com/egohygiene/egohygiene.io/issues/32). Observed: 2026-10-10. Parent: [#31](https://github.com/egohygiene/egohygiene.io/issues/31). Milestone: [Store v1](https://github.com/egohygiene/egohygiene.io/milestone/1).

This is an inventory and disposition plan. No source files, issues, attachments, or history have been migrated, archived, deleted, or marked finished by this checkpoint. Proposed destinations below are not claims that those files already exist.

## Accepted direction and checkpoint handoff

`egohygiene/egohygiene.io` is the canonical website/store codebase. Keep its actual application at `apps/egohygiene.io`; the source merch repository has no application implementation to transplant. The [Store v1 architecture](../architecture/store-v1.md) describes the proposed catalog publication and hosted checkout boundaries. Root [DECISIONS.md](../../DECISIONS.md) records the consolidation choice.

| Checkpoint | State | Next action |
| --- | --- | --- |
| A: inventory and architecture | Prepared for review in this change | Review this ledger and architecture, then sync in chat |
| B: bounded migration | Not started | Migrate reviewed research, preserve MIT notices, select artwork policy, and reconcile backlog with reciprocal links |
| C: verification and retirement | Not started | Verify migrated links and app behavior, preserve recoverable source/attachments, then prepare archival handoff |

Do not close #32 after A. Do not advance to B before the checkpoint sync. A clean starting prompt is: “Continue egohygiene.io #32 checkpoint B from the accepted consolidation ledger; recheck source heads and the draft PR before editing.”

## Snapshot and coverage

| Repository/ref | Pinned commit | Visibility / state |
| --- | --- | --- |
| [egohygiene.io main](https://github.com/egohygiene/egohygiene.io/tree/524aa4c139e926ca549f6bef067fc9ed40d15afb) | `524aa4c139e926ca549f6bef067fc9ed40d15afb` | Public; one branch, no tag refs, no open PR before this checkpoint |
| [merch main](https://github.com/incomprisllc/merch/tree/5907d90b59a87aa94b34210637e9a754c4caf6e4) | `5907d90b59a87aa94b34210637e9a754c4caf6e4` | Private; preserve as migration source |
| [merch research branch](https://github.com/incomprisllc/merch/tree/dfb459eb15fc034936a0541945725233fdc284c3) | `dfb459eb15fc034936a0541945725233fdc284c3` | Private; open draft PR #5 |

The source has exactly two branches: `main` and `docs/merch-provider-research-2026-10-09`, with no tag refs. Its default history contains two commits; the earlier initialization commit is `cb7d233bdc70c6eff97b249500c45d8a9ca3de65`. Keep both branch tips and all reachable history until preservation is verified. Public references to a private source are provenance for authorized maintainers, not public download links.

Complete recursive trees were inventoried without truncation: website 395 tracked blobs; source main 20; research head 21. No `AGENTS.md` was present in these trees. Website `AI_CONSTITUTION.md`, `METHODOLOGY.md`, existing architecture, and checkpoint requirements were read. File counts establish inventory coverage, not a claim that every generated/vendor blob was semantically reviewed or that a historical secret scan ran.

## Website inventory and disposition

Retain the existing website structure. These groups partition all 395 tracked blobs at the pinned baseline; empty counts distinguish scaffolding from implementation. All groups remain in place during checkpoint A.

| Existing group | Blobs / empty | Disposition |
| --- | --- | --- |
| `root files` | 51 / 12 | Retain existing docs/config; add linked store plan and decision. |
| `.changeset` | 2 / 1 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `.github` | 12 / 6 | Retain; hosting/workflow restoration stays with #29. |
| `.storybook` | 6 / 0 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `.vitest` | 2 / 0 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `.vscode` | 4 / 0 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `apps/docs` | 20 / 1 | Retain separate supporting app; no competing storefront. |
| `apps/egohygiene.io` | 61 / 11 | Canonical website and proposed store home; #33–#36 extend it. |
| `apps/playground` | 10 / 0 | Retain separate supporting app; no competing storefront. |
| `config` | 1 / 0 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `docs` | 18 / 12 | Retain existing docs/config; add linked store plan and decision. |
| `infra` | 2 / 0 | Retain; hosting/workflow restoration stays with #29. |
| `packages/api-client` | 8 / 4 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/config` | 8 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/content` | 5 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/design-tokens` | 13 / 0 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/i18n` | 12 / 2 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/icons` | 7 / 2 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/schemas` | 12 / 2 | Extend with catalog contracts in #34; preserve existing exports. |
| `packages/themes` | 13 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/ui` | 22 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/utilities` | 7 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `packages/visualizations` | 6 / 1 | Reuse appropriate implementation; broader publication stays with #18. |
| `public` | 1 / 0 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `scripts` | 10 / 1 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `storybook-static` | 63 / 0 | Generated output; do not treat as canonical source or current passing evidence. |
| `test-results` | 1 / 0 | Generated output; do not treat as canonical source or current passing evidence. |
| `tests` | 10 / 4 | Retain existing foundation; reconcile only relevant gaps in #33. |
| `tooling` | 8 / 8 | Retain existing foundation; reconcile only relevant gaps in #33. |

### Evidence that affects the store

| Evidence at the pinned revision | Consequence / owner |
| --- | --- |
| `apps/egohygiene.io/src/app/router.tsx`, `src/content/products.ts`, `src/pages/ProductPage.tsx` | `/store` is a planned ecosystem project page through `:product`. Add explicit store routes in #33/#36; preserve other project routes. |
| App manifest, shell, `packages/ui`, `themes`, `design-tokens`, `icons` | Reuse React/Vite and implemented shared presentation instead of creating a second app. |
| `packages/schemas/src/index.ts`, `schemas/*.schema.json`, empty `scripts/generate-types.ts` | Three enums and seven permissive object schemas are not a catalog contract. #34 owns validation, projection, versions, and migrations. |
| `packages/content/src/index.ts` | Documentation Markdown processing is not merchandise storage. Keep store-specific authoring under the app unless a reusable need is demonstrated. |
| `packages/config/src/{schema,browser,environment}.ts` | Existing browser-safe site configuration is reusable; keep secrets and private supplier fields out of both public Git and public output. |
| Root `package.json` vs `README.md`, `.github/workflows/ci.yml`, `infra/docker/Dockerfile` | Node `>=25.9.0` conflicts with documented/configured 24.18. Root scripts and documented workspace commands drift. Reconcile in #33/#29; do not treat this source audit as a successful build. |
| Root `package.json` scripts | `format:check`, `lint`, `test`, `storybook:build`, `test:e2e`, and `check` are referenced by CI/docs but absent. Root dev/build need app-entry review. |
| `.github/workflows/{deploy,preview}.yml` | Only manually dispatched disabled placeholders. #29 owns the hosting decision and eventual deployment evidence. |
| `tests/`, package/component tests | 25 test/spec files, 22 nonempty. They cover existing platform behavior, not commerce. Future store contract/journey tests belong to #34/#37. |
| `apps/docs/src/app/router.tsx` | Imports four local MDX pages; adding this repository Markdown does not automatically publish it in the docs app. |
| `LICENSE` and root package metadata | Root license is empty while metadata declares Apache-2.0. Resolve explicit licensing before importing source material; do not silently relabel MIT research or artwork. |

The main website has two nonempty Atkinson font files, an empty favicon and two empty app icon files. The playground has a nonempty favicon. Generated Storybook output contains additional icons/fonts. No merchandise artwork is tracked in the inspected website tree. Verify asset provenance/notices during the foundation pass; a filename is not a usage-rights receipt.

### Existing links and related work

- Keep current root/about/ecosystem/privacy/terms and project URLs compatible. Exact store and collection routes are proposed in the architecture document; direct navigation, reloads, and asset paths belong to #29/#33.
- Root package repository/bugs metadata still references `egohygiene/website`. Record and correct stale identity links during #33 without assuming redirects have been verified.
- [#29](https://github.com/egohygiene/egohygiene.io/issues/29) is the deployment/build owner; its historical 404 and CI observations were not rerun in this checkpoint.
- [#3](https://github.com/egohygiene/egohygiene.io/issues/3), [#9](https://github.com/egohygiene/egohygiene.io/issues/9), [#18](https://github.com/egohygiene/egohygiene.io/issues/18), [#20](https://github.com/egohygiene/egohygiene.io/issues/20), and [#22](https://github.com/egohygiene/egohygiene.io/issues/22) retain their broader ownership. Do not require their complete organization-wide scope to launch the bounded store.
- [#30](https://github.com/egohygiene/egohygiene.io/issues/30) is parallel central-roadmap hosting work. Preserve its route/deployment ownership; this change creates no competing host.

## Source file disposition: all main files and PR-only content

Source root [LICENSE](https://github.com/incomprisllc/merch/blob/5907d90b59a87aa94b34210637e9a754c4caf6e4/LICENSE) is MIT, copyright 2025 incomprisllc, blob `8481c5bb868eb457fc739d7f86ab62ab05af4739`. A substantial import must preserve its notice and record the source revision. This is provenance inventory, not a blanket determination of artwork rights.

The main tree is `a6f81f52207c93e788104d262d487a30619f35db`; research tree is `de02b3d2662cfc8c33d5022bcf45e22320fcb64d`. Main has three nonempty root files and 17 empty Markdown scaffolds. There is no dependency manifest, application code, CI workflow, catalog configuration, or tracked binary artwork.

| Source path at main | Bytes | Planned disposition |
| --- | --- | --- |
| `.gitignore` | 2152 | Retain in source history; no application settings to transplant. |
| `LICENSE` | 1069 | Preserve MIT notice with any substantial imported material; keep original in source. |
| `README.md` | 62 | Preserve source; later add destination notice. Website README remains canonical. |
| `merch/00_system/manufacturing.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/00_system/platforms.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/00_system/vision.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/00_system/workflow.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/01_ideas/backlog.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/01_ideas/inbox.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/alpal/concept.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/alpal/manufacturing.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/alpal/products.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/demonfrog/concept.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/demonfrog/manufacturing.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/02_characters/demonfrog/products.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/06_store/pricing.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/07_experiments/dropshipping.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/07_experiments/makeship.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/07_experiments/weird_ideas.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |
| `merch/README.md` | 0 | Empty scaffold: retain in source history, omit destination copy; unfinished ideas stay in the backlog ledger. |

| Research-branch change | Provenance | Planned disposition |
| --- | --- | --- |
| `README.md` | Research head above; blob `b45545ec26d7ad4ae656c956e53c8eb00c088f34` | Preserve in source; rewrite a destination notice only at verified retirement. Do not replace website README. |
| `merch/00_system/research/2026-10-09-provider-scout.md` | Research head above; blob `7e5db8c9347ba7788b71087929ae1fd42f1b2c2f` | B: review and adapt publishable research into proposed `docs/research/merch/2026-10-09-provider-scout.md`, with source path/ref/license and explicit amendments. Not copied yet. |

Research facts remain dated 2026-10-09 evidence. The separate-repository and comic-first recommendations are superseded by #31 and the current architecture; preserve that change in an amendment note rather than silently altering historical intent. Recheck provider capabilities and economics at product activation. Do not copy personal circumstances or private operational details into public research.

Relative links in the source README and research need rebasing at the destination. Preserve authoritative external research references with their checked dates; current availability of every supplier link was not revalidated for this inventory. Public documentation must stand on its own even when its provenance source is private.

## Source backlog and attachments

All four source issues are open and unfinished with zero comments. PR #5 is open and draft, with no issue or inline review comments. These are explicit deferrals; no issue is considered satisfied by being listed here.

| Source | What remains | Checkpoint B disposition |
| --- | --- | --- |
| [merch#1](https://github.com/incomprisllc/merch/issues/1), Alpal plushie | Campaign/prototype/manufacturing investigation | Create a reviewed successor backlog item outside Store v1, or keep privately with explicit reason; record destination and reciprocal links. Preserve two reference attachments privately. |
| [merch#2](https://github.com/incomprisllc/merch/issues/2), DemonFrog purse | Construction, tech pack, sourcing, quotes, sample work | Same explicit successor process, outside Store v1. Preserve one reference attachment privately. |
| [merch#3](https://github.com/incomprisllc/merch/issues/3), automated made-to-order store | Bounded store plus later automation/reference-store research | Map first-release scope to #31–#39 and create a separate successor for unfinished automation/shared-cart research. Preserve the original incomplete notes without inventing missing requirements. |
| [merch#4](https://github.com/incomprisllc/merch/issues/4), blanket hoodie | Materials/lining/template, quotes, sample and laundering validation | Reviewed successor outside Store v1; capture remaining product-development gates. |
| [merch PR #5](https://github.com/incomprisllc/merch/pull/5) | Provider research and obsolete planning recommendations | Keep source branch/PR intact until adapted research is accepted with a destination link and preserved history. Then close as superseded/migrated, not as product delivery. |

Three image references live in issue attachments outside Git. They were identified from issue bodies, not downloaded or visually/rightfully qualified in this checkpoint. A Git bundle alone cannot preserve them or issues/PR discussions. Before retirement, store originals in an appropriate private location with source issue, original attachment reference, byte count, content hash, retrieval result, and rights/publication status. Do not put raw private exports or attachment URLs in the public ledger. If anything cannot be retrieved, mark it unresolved and keep the source accessible.

[Sample packs](https://github.com/incomprisllc/samplepacks/issues/1) and [beat licensing](https://github.com/incomprisllc/beatstore/issues/1) retain their own repositories and future issues. They are not source repos to merge during this milestone.

## Publication and preservation gates for checkpoint B

1. Recheck both main heads and research PR #5. Record any delta against these pins before migrating; never overwrite concurrent work.
2. Review the exact research text for public suitability. Create an adapted, dated document with the original path/revision, preserved MIT notice, and a visible architecture/launch-priority amendment. Keep nonpublic working details private.
3. Select and record an artwork policy distinct from software/research licensing. Record creator/rights holder, original source, artwork revision, intended use, and permitted public derivative. Until resolved, keep masters and issue attachments private; no production-ready-artwork claim.
4. Create successor backlog issues only for reviewed publishable scope, or explicitly retain private work with a durable destination. Add reciprocal references before closing anything as migrated. The ledger must name each destination, not just say “moved.”
5. Keep empty scaffolds in preserved history; do not import empty files merely to recreate folder shape. Place actual catalog configuration through #34's contract work.
6. Validate imported relative links and review the diff for accidental private fields. Record the destination commit and remaining deferrals. Stop for chat sync with a draft PR.

## Checkpoint C preservation, retirement, and rollback

Before archiving, confirm that every ledger row has a verified destination, retained-private location, or explicit deferral. Preserve both source branch tips and reachable commits in a private recovery copy, plus a separate private export of issues, PR metadata/discussions, and all three attachment originals. Record checksums and a recovery test, not just a backup command. No backup or recovery test has been performed yet.

Verify the destination's relevant app behavior and migrated links. Add a source README notice naming the canonical website and migration receipt. Archive `incomprisllc/merch` as the default reversible retirement after acceptance; deletion is a separate later action. Archiving must preserve its existing private visibility. Keep any unresolved source work readable and clearly routed.

Rollback: before archival, revert only the reviewed destination migration commits if needed; source branches remain unchanged. After archival, unarchive the private source and recover from the verified private copy if needed. Do not roll back unrelated website changes. Store activation later has its own catalog/build rollback in the architecture plan.

## Verification receipt for checkpoint A

- Retrieved both repository metadata snapshots, all branch names returned by the bounded listings, tag refs, complete recursive trees, website open PRs, source issue bodies, and research PR metadata/files. Source counts and revisions are recorded above.
- Cross-checked relevant website implementation, workflow declarations, existing architecture documents, and #31–#34/#29 ownership. Reviewed source licensing and identified attachment references separately from Git blobs.
- Checked ledger coverage against tree entries and checked changed documentation links against the pinned website tree plus new files. Reviewed the Mermaid graph source and the documentation diff.
- This checkpoint makes documentation changes only. Dependency installation, app build/runtime/visual checks, remote CI, supplier-account qualification, paid orders, attachment download/rights verification, migration, backup recovery, deployment, and repository retirement were not performed.

The draft PR and #32 checkpoint comment are the review receipt. Resume from them and this ledger; do not infer completion from older chat context.
