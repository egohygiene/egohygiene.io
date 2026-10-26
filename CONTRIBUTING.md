# Contributing

Use pinned Node `24.21.0` and pnpm `11.28.5`; install with
`pnpm install --frozen-lockfile --ignore-scripts`. See
[local preview](docs/store/local-preview.md) for the `mise`/Task workflow.

Start application changes with the [dependency rules](docs/architecture/dependency-rules.md)
and [extension examples](docs/architecture/store-extension-contracts.md). Keep
feature presentation app-owned, portable rules free of browser/framework APIs,
and private source material outside this public repository. Catalog additions
follow [catalog authoring](docs/store/catalog-authoring.md).

Use a small branch and draft PR tied to an issue. Explain the actual problem,
resulting behavior, relevant checks and remaining limits. For store contract
changes, run `pnpm typecheck`, `pnpm catalog:test`, relevant `pnpm test:unit` files
and `pnpm check`; run build/browser checks when the affected path needs them.
Report failures honestly instead of claiming all CI passed from focused tests.

Review only applicable checklist items: dependency direction, caller-provided
messages, token/layout/accessibility behavior, schema compatibility and public
projection. Framework migration, live provider activation and deployment are
separate review decisions; see the [migration boundary](docs/architecture/framework-migration.md).


## Source and asset provenance

Read [licensing status and scope](LICENSING.md) and [third-party notices](THIRD_PARTY_NOTICES.md)
before importing code, research, fonts, artwork or brand assets. Keep an original
notice with copied material; changing a root software license never replaces an
imported notice or establishes creative rights.

For each public import or replacement, record the repository/provider URL, pinned
revision and source path when available, SHA-256 of the exact public file, original
license/notice, transformation method and the evidence supporting its intended use.
Use asset-local records like [identity](assets/identity/source/provenance.json),
[fonts](assets/fonts/atkinson/provenance.json) and [Heartburst](assets/designs/heartburst/README.md).
Mark missing evidence as unresolved. Regenerating a vendored worker or replacing a
font requires rechecking its version-specific notice and the built distribution.

Display approval, product placement, print readiness and approval to sell are
separate facts; retain the existing catalog readiness workflow. Do not publish
private masters, contracts, business/customer records or raw private attachment
links as evidence. Use an appropriate public-safe reference/disposition instead.
Software-license changes and new asset publication rights require a concrete owner
decision; record it in the issue/continuity ledger and an ADR when architectural.
