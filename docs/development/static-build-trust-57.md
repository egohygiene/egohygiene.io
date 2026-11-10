# Local static image build through a verified proxy — #57

## A — Observed failure and contract, 2026-11-09

The current managed Docker engine executes the real ignore/context export probes.
The normal image then fails while Corepack downloads pinned pnpm 11.28.5: Node's
fetch attempts direct registry connections and reports ECONNREFUSED/ENETUNREACH.
This is actual image-build evidence, distinct from the earlier unavailable engine.

A separate Node 24.21.0 Alpine container using the inherited proxy, a read-only
managed public CA mount, NODE_USE_ENV_PROXY=1 and NODE_EXTRA_CA_CERTS reaches the
exact pinned registry metadata with HTTP 200 and TLS verification intact.

Enable proxy-aware Node fetch in the existing builder RUN. Support an optional
explicit STORE_BUILD_CA_CERT path in the local qualifier, passing a public CA
bundle only as a BuildKit secret to that networked RUN. Validate the input before
any Docker command/context transfer: readable PEM certificate(s), no private key,
and an ordinary unambiguous secret-source path. Preserve normal no-custom-CA
builds. Do not copy the bundle into context/image layers, print its contents or
persist an environment-specific trust store. No insecure TLS or proxy bypass.

The optional input belongs only to the normal-image build command; scratch
context probes do not receive a secret. Reports record whether custom trust was
selected without its contents or private source path. Keep Node/pnpm pins,
frozen script-disabled install, Docker ownership cleanup and strict budgets.

Exercise missing/malformed/private-key-bearing inputs and command scoping with
the existing runner fixture. Then build and run an actual image, inspect emitted
artifacts/HTTP and preserve overall failure if budgets still fail. Record exact
image/source/architecture/Caddy identity and cleanup. Mac/Apple Silicon and any
unavailable operator checks remain #115; no production publication is performed.

Preparation starts from browser source `d04dc61` in an isolated worktree while
the primary browser run is frozen. Stack the focused commits on that batch's
published documentation checkpoint before final exact-source image verification.
