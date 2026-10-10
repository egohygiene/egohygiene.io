# Catalog authoring checkpoint — 2026-10-10

## Decision and scope

Real artwork ingestion is deferred until the creator is ready. Pull the bounded catalog-authoring portion of [#34](https://github.com/egohygiene/egohygiene.io/issues/34) forward so website work can continue with fictional examples. The repository migration and broader foundation work in #32/#33 remain open.

Implemented in this draft:

- One strict version 1 Zod contract in `packages/schemas`, with inferred types and independent design, product, collection, and creative-context entries.
- Eight fictional preview entries, recursive JSON discovery, and a safe `add-design` command. It generates a permanent ID, validates the prospective catalog, and refuses to overwrite files.
- Validation in the CLI, Vite build hook, and public app catalog adapter. Errors identify files and fields; unknown fields, invalid versions, duplicate identifiers, broken references, and public references to drafts fail.
- Preview/unavailable purchase actions are disabled. Live configuration requires an explicit reviewed Fourthwall route, product and variant mappings, and image artwork at approved revisions. The actual route list is empty.
- A public projection excludes drafts. This only controls rendering: all committed material is public repository content. Private originals and notes stay outside this repository.
- [Authoring instructions and templates](catalog-authoring.md), an initial compatibility policy, and local contract/authoring tests.
- One existing `ThemeProvider` index-signature access corrected so the public app typechecks with the repository's strict settings.

## Verification

Local verification uses Node 24.19.0, Zod 4.4.3, TypeScript 5.9.3, Vite 8.2.0, and the public app's declared React/router versions. Dependencies were installed into an isolated verification directory and workspace packages linked into it. This is **not** evidence of a successful frozen-lockfile workspace install or resolution of the existing runtime/package-manager mismatch.

Commands from the repository root:

```sh
node scripts/store-catalog.mts validate
node --test tests/store/catalog.test.ts
tsc --project tsconfig.store.json --noEmit
tsc --project packages/schemas/tsconfig.build.json --noEmit
tsc --project apps/egohygiene.io/tsconfig.app.json --noEmit
```

All 11 contract and authoring tests pass, as do the catalog, schema-package, and public-app typechecks. The app-scoped Vite production build succeeds. A temporary invalid catalog entry was rejected by that same build hook with its filename; the temporary file was removed. The Vite-loaded app adapter returns eight public mock entries and zero checkout routes. No real artwork, provider account, checkout, payment, or deployment was exercised. Remote CI was not dispatched.

The root workspace still needs #33: reconcile runtime/package-manager declarations, install policy, compiler/tool dependencies, root scripts, and the lockfile. `catalog:typecheck` expects an installed `tsc`, like the existing root typecheck scripts; declaring and locking the workspace compiler remains part of that foundation checkpoint.

## Next checkpoint

Review this catalog foundation, then stabilize the remaining website tooling and build the mock storefront against the validated adapter. Real design ingestion can happen at any later checkpoint using the same authoring workflow; it is not a dependency for the UI work.

This does not close #34: explicit brand/artist ownership semantics, a real version migration when a successor contract exists, and UI consumption are still outstanding. The future live-product checkpoint must verify the actual destination, variants, artwork, product quality, policies, and customer-funded fulfillment before populating a route. Schema validation cannot perform those external checks. Prices are optional display metadata in integer minor units; supported currencies currently share two decimal places, and the provider checkout remains authoritative for totals, shipping, and tax.
