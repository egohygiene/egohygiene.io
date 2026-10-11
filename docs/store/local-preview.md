# Try the store locally

From the repository root, run:

```sh
task preview:store
```

This checks Node, obtains the pinned pnpm if needed, installs the locked dependencies, validates the catalog, builds a fresh preview, and opens **http://127.0.0.1:4173/store**. Stop the server with **Ctrl+C**. No account, environment file, or payment information is needed to browse the initial preview.

The first install can take a while: the repository still includes the larger experimental dependency collection tracked in #16. Subsequent runs reuse the package caches and reconcile the installation against the lockfile. A failed install, catalog check, or build stops the task before it starts a server.

## One-time prerequisites

You need [Task v3](https://taskfile.dev/docs/installation) and Node with npm. The repository currently pins **Node 24.21.0** and **pnpm 11.28.5**; its supported Node range is `>=24.21.0 <25`. An existing supported Node installation is sufficient. The setup helper reads the declarations in `package.json` and `.tool-versions` and reports a clear error if your active Node is unsupported.

On macOS with Homebrew, install Task:

```sh
brew install go-task
task --version
node --version
```

If you already use asdf with the Node plugin, the checked-in `.tool-versions` selects the installed Node automatically:

```sh
asdf install nodejs 24.21.0
task preview:store
```

Alternatively, with [mise](https://mise.jdx.dev/cli/install.html):

```sh
mise install node@24.21.0
mise exec node@24.21.0 -- task preview:store
```

The explicit `mise exec` works without changing your default Node or shell configuration. If mise asks you to trust the repository configuration, inspect that configuration before accepting. Linux users can install Task through their distribution or use the platform binaries listed in the official installation guide, then use the same Node and preview commands. A direct installation from [Node.js](https://nodejs.org/en/download) also works when it satisfies the repository's declared range.

You do not have to install pnpm globally. The helper uses `pnpm` already on your path when its version matches the pin; otherwise it runs the exact version through `npm exec --yes --ignore-scripts --package=pnpm@11.28.5 -- pnpm`. This downloads into npm's cache. Dependency installation always uses `--frozen-lockfile --ignore-scripts`; the tasks do not rewrite the lockfile or run dependency installation hooks.

## Commands

| Command | Result |
| --- | --- |
| `task setup:store` | Check the environment and install dependencies without building or starting a server. |
| `task preview:store` | Prepare dependencies, validate, build, and serve the production-style local preview. |
| `task build:store` | Prepare and build the isolated preview without starting a server. |
| `task dev:store` | Prepare dependencies and open `/store` at port 5173 with live reload while editing. |
| `task fourthwall:check` | Check optional Fourthwall credentials with read-only requests; see the [connection guide](fourthwall-local-setup.md). |
| `task test:store:tooling` | Run the setup helper's focused tests without a dependency installation. |
| `task --list` | Show all available public tasks. |

Both servers bind to `127.0.0.1` and refuse to silently switch to another port. If a previous server is using the port, stop it with Ctrl+C or choose an explicit alternative:

```sh
STORE_PREVIEW_PORT=4174 task preview:store
STORE_DEV_PORT=5174 task dev:store
```

To run without automatically opening a browser:

```sh
STORE_OPEN_BROWSER=false task preview:store
```

Open the printed address manually if your environment does not support browser launching. The supported overrides are `STORE_PREVIEW_PORT`, `STORE_DEV_PORT`, and `STORE_OPEN_BROWSER` (`true` or `false`). `task preview:store` rebuilds every time, so catalog and local configuration changes appear when you restart it. Use `task dev:store` for editing with live reload; restart the dev server after changing environment files.

## Preview and deployment boundary

Local preview builds set `VITE_STORE_PREVIEW=true` and write **`apps/egohygiene.io/dist-preview`**. This enables the local Fourthwall demonstration while keeping its output separate from the normal website build. The preview server serves that same directory. Live editing enables the same local mode.

The normal `pnpm build` path continues to write **`apps/egohygiene.io/dist`** without the task's preview flag. Do not publish `dist-preview` as the production website. Do not add `VITE_STORE_PREVIEW=true` to a general environment file or hosting configuration.

See [Fourthwall local setup](fourthwall-local-setup.md) for the connection trial and the distinction between mock products and an actual provider connection. Put any supported local configuration in the ignored `apps/egohygiene.io/.env.local` file described there. Never put a secret in a `VITE_` setting: those settings are included in browser code.

These tasks do not deploy the website, create service accounts, activate checkout routes, or place orders. Hosting remains tracked by #29 and live provider activation by #38.

## Troubleshooting

- **`task: command not found`:** Install Task, reopen your terminal if necessary, and check `task --version`.
- **Unsupported Node:** Follow the exact Node version hint. Installing dependencies with an older Node will not solve a runtime mismatch.
- **pnpm and npm unavailable:** Activate Node with its bundled npm, or activate the exact pnpm version from `package.json`.
- **Frozen lockfile failure:** Pull the matching manifest and lockfile changes together. Do not work around it with `--no-frozen-lockfile`.
- **Install interrupted or dependency missing:** Rerun `task setup:store`; it rechecks the installation instead of relying on a potentially stale success marker.
- **Offline first run:** The pinned pnpm and dependencies must already be cached to avoid downloads. Complete one successful setup while online.

Implementation references: [Task sequential task calls](https://taskfile.dev/docs/guide/dependencies), [npm exec package selection and cache](https://docs.npmjs.com/cli/v11/commands/npm-exec/), [asdf version selection](https://asdf-vm.com/manage/versions.html), and [mise exec](https://mise.jdx.dev/cli/exec.html). The helper never installs operating-system tools or changes shell configuration automatically.
