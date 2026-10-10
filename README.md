# Ego Hygiene website

The website and Store v1 catalog live in this monorepo.

## Workspace

- `apps/egohygiene.io` — public website and `/store`
- `apps/docs` — repository documentation
- `apps/playground` — themes, tokens, and shared UI
- `packages/*` — shared app building blocks

## Local website

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

Start with the [roadmap](https://github.com/egohygiene/egohygiene.io/issues/31), [architecture](docs/architecture/store-v1.md), and [migration ledger](docs/migration/store-v1-consolidation.md). `/store` has an explicit route ahead of the generic ecosystem gateway.

The [catalog authoring guide](docs/store/catalog-authoring.md) explains automatic discovery, versioned schemas, fictional fixtures, and adding a draft without touching UI code:

```sh
pnpm catalog:add-design --slug "my-new-design" --title "My New Design"
pnpm catalog:validate
pnpm catalog:test
```

[Provider notes](docs/store/providers.md) distinguish fulfillment, payments, and banking. Every provider placeholder is disabled. The catalog currently contains preview/unavailable products, with no purchase destination. Keep original artwork, credentials, and private business records out of this public repository.

## Deployment and remaining work

Local build verification does not establish production hosting. [Issue #29](https://github.com/egohygiene/egohygiene.io/issues/29) owns host configuration, SPA rewrites, remote CI, and deployment. The wider dependency lab, Storybook, formatting/lint cleanup, and separate product gateways remain independent workstreams. Private package publishing remains disabled.
