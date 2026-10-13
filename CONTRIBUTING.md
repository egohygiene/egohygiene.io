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

For the full current CI baseline, use `pnpm ci:check` and then `pnpm ci:browser`
with Chromium installed. See [validation scope and setup](docs/development/ci-baseline.md)
for generated-file policy, browser prerequisites and remaining security settings.

Review only applicable checklist items: dependency direction, caller-provided
messages, token/layout/accessibility behavior, schema compatibility and public
projection. Framework migration, live provider activation and deployment are
separate review decisions; see the [migration boundary](docs/architecture/framework-migration.md).
