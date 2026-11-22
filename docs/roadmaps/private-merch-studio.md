# Private merch studio roadmap

The first reviewable milestone is a local owner workflow on the website: sign in with a demo identity, add and edit a fictional product, see it as a draft, and verify that neither the studio nor its data enters a public build. Use the existing issues below. Each draft advances part of its linked issue; broader acceptance remains in the issue.

| Order | Existing issue | Review slice | Exit evidence |
| --- | --- | --- | --- |
| 1 | [#69 — Extension contracts](https://github.com/egohygiene/egohygiene.io/issues/69) | Compose a dev-only route and inject the owner-session adapter | Signed-out baseline, mock sign-in/out, loopback dev command, route absent outside opt-in development |
| 2 | [#34 — Catalog contracts](https://github.com/egohygiene/egohygiene.io/issues/34) | Add the local draft repository behind an asynchronous interface | Validation, stable IDs, reload persistence, controlled storage errors, and an explicit version |
| 3 | [#116 — First-product drafts](https://github.com/egohygiene/egohygiene.io/issues/116) | Make draft creation, editing, and removal accessible | The owner can prepare a fictional listing without editing repository JSON |
| 4 | [#36 — Mock storefront](https://github.com/egohygiene/egohygiene.io/issues/36) | Preview a saved draft using the existing catalog model and storefront presentation | Schema-valid draft records, visual preview, and disabled purchasing |
| 5 | [#37 — Engineering qualification](https://github.com/egohygiene/egohygiene.io/issues/37) | Prove the authoring flow and its isolation | Chromium checks for sign-in, authoring, reload, sign-out, plus public build exclusion |

## Local review

Install with the repository-pinned Node and pnpm versions. From the repository root:

```bash
node scripts/store-environment.mjs setup
node scripts/store-environment.mjs studio
```

Open <http://127.0.0.1:5173/store/studio> and choose **Sign in as demo owner**. If port 5173 is occupied, set `STORE_DEV_PORT` to a free port. Use fictional details in this prototype. Drafts are browser-local for the same origin and profile. The mock identity resets on reload. The development route is excluded from the public and isolated static preview artifacts.

## Replacing the mock connectors

The studio accepts an owner-session adapter and an asynchronous draft repository. Keep the same contracts and change their composition when a real private backend is selected. A hosted studio must enforce owner authorization on the server for every draft read and write, and keep private artwork and records in their owning stores. The demo button, browser storage, and a draft visibility field provide no hosted access control.

The accepted storefront remains in `egohygiene/egohygiene.io`. [#61](https://github.com/egohygiene/egohygiene.io/issues/61) retains its reusable commerce proof; the standalone store and private merch repositories retain relevant work, including [the standalone store cart handoff](https://github.com/egohygiene/store/issues/32), [artist collections](https://github.com/egohygiene/store/issues/30), and [the merch design-to-sample workflow](https://github.com/incomprisllc/merch/issues/8).

After this stack, review the real pilot and approved assets under [#116](https://github.com/egohygiene/egohygiene.io/issues/116) and complete the upstream private projection and receipt work under [#34](https://github.com/egohygiene/egohygiene.io/issues/34). The publication path under [#31](https://github.com/egohygiene/egohygiene.io/issues/31) retains environment and hosting work, the purchasing-disabled public construction preview, then [#38](https://github.com/egohygiene/egohygiene.io/issues/38) checkout qualification and [#39](https://github.com/egohygiene/egohygiene.io/issues/39) launch.
