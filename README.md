# Ego Hygiene website

The website and Store v1 catalog live in this monorepo.

## Workspace

- `apps/egohygiene.io` — public website and `/store`
- `apps/docs` — repository documentation
- `apps/playground` — themes, tokens, and shared UI
- `packages/*` — shared app building blocks

## Agent and session context

Start a fresh session with [AGENTS.md](AGENTS.md) and the
[current handoff](docs/context/current-state.md), then refresh its linked GitHub
issue/PR status. The [context map](docs/context/README.md) connects implementation
decisions, provenance and verification receipts to the existing [META](META.md)
architecture graph.

## Local website

For the store and local Fourthwall tryout, install [Task v3](https://taskfile.dev/docs/installation) and activate Node **24.21.0**, then run:

```sh
task preview:store
```

The task selects pinned pnpm, installs locked dependencies, validates the catalog, builds an isolated preview, and opens **http://127.0.0.1:4173/store**. Use **Try the Fourthwall demo** to select a fictional product variant and preview the handoff. Stop with Ctrl+C. No Fourthwall account is needed for the mock experience.

See [local preview setup](docs/store/local-preview.md) for prerequisites, live editing, and troubleshooting, or [Fourthwall connection setup](docs/store/fourthwall-local-setup.md) for the optional read-only account check.

### Other workspace commands

Use **Node 24.21.x** and **pnpm 11.28.5** (also declared in `.tool-versions` and `package.json`). Activate the pinned pnpm version with Corepack or your preferred version manager.

```sh
corepack enable
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

`pnpm dev`, `pnpm build`, and `pnpm preview` target the public website. The docs and playground remain available through `pnpm --filter @egohygiene/docs dev` and `pnpm --filter @egohygiene/playground dev`.

```sh
pnpm typecheck
pnpm test
pnpm check
pnpm build
pnpm preview --host 127.0.0.1
```

`typecheck` covers the public app and catalog contracts. `test` runs catalog/provider contracts and workspace unit tests. `check` validates workspace manifests, exports, locales, and package dependency cycles. See the [foundation record](docs/store/foundation.md) for verification and deferred wider gates.

## Store v1

Start with the [roadmap](https://github.com/egohygiene/egohygiene.io/issues/31), [architecture](docs/architecture/store-v1.md), and [migration ledger](docs/migration/store-v1-consolidation.md). `/store` now browses connected designs, products, and collections with search, filters, themes, and responsive detail pages. See the [visual direction](docs/store/visual-direction.md) and [test plan](docs/store/test-plan.md).

For the next session, follow [preview one real design](docs/store/next-design-session.md). The [catalog authoring guide](docs/store/catalog-authoring.md) explains automatic discovery, versioned schemas, fictional fixtures, and adding a draft without touching UI code:

```sh
pnpm catalog:add-design --slug "my-new-design" --title "My New Design"
pnpm catalog:validate
pnpm catalog:test
```

[Provider notes](docs/store/providers.md) distinguish fulfillment, payments, and banking. Every provider placeholder is disabled. The catalog currently contains preview/unavailable products, with no purchase destination. Keep original artwork, credentials, and private business records out of this public repository.

## Deployment and remaining work

Local build verification does not establish production hosting. [Issue #29](https://github.com/egohygiene/egohygiene.io/issues/29) owns host configuration, SPA rewrites, remote CI, and deployment. The wider dependency lab, Storybook, formatting/lint cleanup, and separate product gateways remain independent workstreams. Private package publishing remains disabled.
