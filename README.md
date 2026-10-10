# Ego Hygiene website

A minimal, working monorepo for the first Ego Hygiene web platform release.

## What is here

- `apps/egohygiene.io` — the public-facing website
- `apps/docs` — repository and platform documentation
- `apps/playground` — a small surface for themes, tokens, and shared UI
- `packages/*` — shared building blocks used by the apps

## Store v1 workstream

The [Store v1 roadmap](https://github.com/egohygiene/egohygiene.io/issues/31) consolidates merchandise work into this website. Start with the [architecture plan](docs/architecture/store-v1.md) and [migration ledger](docs/migration/store-v1-consolidation.md). The [catalog authoring guide](docs/store/catalog-authoring.md) now provides a versioned schema, fictional fixtures, automatic discovery, and a command for adding draft designs. Real artwork can be added later. The current `/store` route remains an ecosystem project placeholder; the storefront UI is a later checkpoint.

```sh
node scripts/store-catalog.mts add-design --slug "my-new-design" --title "My New Design"
node scripts/store-catalog.mts validate
node --test tests/store/catalog.test.ts
```

## Requirements

- Node 24.18+
- Corepack
- pnpm 11.8+

## Install

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Local development

```bash
pnpm dev
pnpm --filter @egohygiene/egohygiene.io dev
pnpm --filter @egohygiene/docs dev
pnpm --filter @egohygiene/playground dev
```

## Quality gates

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm storybook:build
pnpm test:e2e
pnpm check
```

## Deployment status

The repository now supports a small static website slice. Product gateway routing, backend services, and production deployment integrations remain intentionally deferred.

## Current limitations

- The docs app uses a minimal markdown pipeline rather than a full CMS.
- Product routes reserve future gateway paths locally instead of proxying to separate deployments.
- Private publishing is disabled across workspace packages.
