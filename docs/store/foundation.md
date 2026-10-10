# Website foundation checkpoint

Recorded 2026-10-10 for roadmap #33; hosting remains owned by #29.

## Baseline and focused changes

The app entry is `apps/egohygiene.io/index.html` → `src/main.tsx` → providers/router. It uses React 19.2.8, React DOM 19.2.8, React Router DOM 7.18.2, Vite 8.2.0, and shared workspace UI/configuration/schema packages. Docs and playground are separate apps. Root dependencies also contain a large experimental library collection; those libraries are not all public-app runtime dependencies.

The old root Vite commands targeted a directory without an app entry. The old root typecheck targeted an empty references-only configuration without build mode, so it did not check the website. TypeScript was not declared. Runtime requirements disagreed between package metadata, README, CI, and Docker.

This checkpoint:

- Directs root dev/build/preview to the website; build validates the catalog first.
- Checks the public app and catalog contracts explicitly, with a separate `typecheck:workspaces` option.
- Pins pnpm 11.28.5, uses the Node 24 LTS line with minimum 24.21.0, and aligns `.tool-versions`, CI, and Docker examples.
- Declares TypeScript 5.9.3 and Node 24 types. Existing application and experimental dependency versions are retained; the regenerated lockfile adds only TypeScript, Node types, and their `undici-types` version. Peer snapshots change with Node types.
- Replaces invalid workspace build-policy placeholder values with `false`; the documented install suppresses lifecycle scripts. This path successfully builds the public app without running dependency lifecycle hooks.
- Restores named root quality commands already referenced by CI. Their presence does not mean every wider gate has passed.
- Reserves `/store` explicitly ahead of `:product`, adds navigation, and provides a recoverable router error page alongside the existing application error boundary and not-found page.

The store is built from synchronous local catalog data. There is no remote data-loading state or fake network spinner. Search empty states and catalog-specific missing records belong to the storefront checkpoint.

Version evidence: [Node 24.21.0 LTS release](https://nodejs.org/en/blog/release/v24.21.0), [pnpm 11.28.5 release](https://pnpm.io/blog/releases/11.28.5). This is a bounded compatible toolchain update, not a claim that every dependency in the repository has been audited or upgraded.

## Public configuration boundary

`packages/config` parses browser-safe `VITE_SITE_NAME` and `VITE_SITE_URL` with defaults. No credentials are needed for install, dev, build, or mock browsing. Anything prefixed `VITE_` and anything checked into the catalog can reach the browser. Provider records contain descriptions and official source URLs only; their strict schema rejects activation, credentials, clients, and purchase URLs. Checkout routes remain a separately reviewed contract.

Draft catalog records are excluded from the public catalog projection, but this repository is public. Draft visibility is not private storage. Keep production artwork masters, personal details, rights documents, and provider secrets elsewhere.

## Reproduce

```sh
# Node 24.21.x; packageManager selects pnpm 11.28.5
corepack enable
pnpm install --frozen-lockfile --ignore-scripts
pnpm typecheck
pnpm test
pnpm check
pnpm build
pnpm preview --host 127.0.0.1
```

Open `/` and `/store` at the preview URL. Use `pnpm dev` for editing. No environment file or service account is required.

## Verification

- Clean worktree frozen install passed with Node 24.21.0/pnpm 11.28.5; a full 15-workspace install also passed.
- Public-app and catalog TypeScript checks passed.
- 16 catalog/provider contract tests and 25 existing unit tests passed.
- Workspace manifest/export/locale/cycle checks passed.
- Catalog validation and website production build passed (8 catalog entries).
- Production preview HTTP smoke checks cover `/` and `/store`. Browser navigation and responsive checks are tracked with #35–#37 and the storefront test checkpoint.

Node reports the existing root package's implicit module-type warning for TypeScript scripts; Vitest reports a future Vite config-loader warning. Neither prevented these checks. Broad lint/format, Storybook, experimental workspaces, remote CI, and production deployment were not verified. Commits use `[skip ci]` for this authorized local sprint.

## Rollback and hosting handoff

Revert the foundation checkpoint together (manifest, lockfile, tool declarations, scripts, and route changes), then reinstall from the restored lockfile. Do not hand-edit peer snapshots or roll back only the manifest. Catalog/provider work is in separate checkpoints.

The build output is `apps/egohygiene.io/dist`. The eventual host must serve `index.html` for direct SPA routes, including `/store/products/...`, without rewriting real assets. Local Vite preview does not prove those production rules. #29 retains hosting and CI ownership; do not configure a second deployment as part of this store checkpoint.
