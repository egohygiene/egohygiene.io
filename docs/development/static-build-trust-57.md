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

## B — Verified trust input

Source `2f61616310b47658742694c7a3938705807a0b36` stacks on #131's
`0f9de22cd772707c2077b61ac4291357afede121`. The image builder enables Node's
environment-proxy support. The local runner validates optional public CA input
before Docker, rejects malformed/private-key-bearing input and passes a valid
bundle only to the normal build as a BuildKit secret. Docker command errors and
public receipts omit its path/content. Twelve runner cases cover command scoping,
no-custom-CA behavior and negative input cases; existing trust remains enabled.

For a TLS-intercepting development proxy, keep the public CA bundle outside the
checkout and select it explicitly:

```sh
STORE_BUILD_CA_CERT=/absolute/path/to/public-ca.pem task qualify:static
```

Otherwise use `task qualify:static` as before. No CA is needed merely because
Docker is in use. Keep the existing local-socket selection and normal setup
requirements from [the original walkthrough](static-serving-57.md).

## C — Actual Task, Docker and HTTP evidence

Clean B source passes both real Docker context exports: 38 included and 46
excluded synthetic samples, then 205 actual checkout files/14 workspace manifests.
A fresh no-cache image builds with Node 24.21.0/pnpm 11.28.5, frozen installation
and disabled lifecycle scripts. Docker client/server 28.4.0 runs the Linux amd64
image with Caddy 2.11.7. All 26 raw public pages and 388 loopback HTTP checks pass,
including GET/HEAD byte identity, MIME, canonical aliases/query preservation,
health and genuine missing-resource/method responses. Ownership-checked container
cleanup passes. All 45 extracted artifact hashes match the independently rebuilt
host artifact at the same source.

The [verification](reviews/static-build-trust-57/verification.json) identifies the
exact image, source and commands; [all HTTP observations](reviews/static-build-trust-57/container-http.json)
retain request paths/status/types/hashes without raw build logs or CA input.
Task 3.54.0's official release archive checksum is retained. The actual task
executes successfully through the HTTP checks, then returns **201** because the
inner qualifier returns **1** on the strict artifact gate. This is an overall
failed qualifier, with successful container/HTTP evidence.

The complete [non-browser profile](reviews/static-build-trust-57/non-browser.json)
also executes through Task at clean B: 15 steps pass, including formatting,
lint (84 existing warnings/44 informational diagnostics), all compiler/boundary
profiles, 152 catalog tests, 111 tooling tests, 354 unit tests, four semantic
checks, one isolated-consumer test, three fresh smoke tests and raw HTML.
The next artifact step fails the same three limits; fail-stop leaves native
Storybook unrun in this profile. It already passed in the independent complete
[#70 browser profile](browser-closeout-70.md).

Current failing budgets are documents raw **319,972 > 20,000** bytes, documents
separate-file gzip **86,962 > 10,000**, and total raw **1,290,004 > 1,140,000**.
JavaScript, CSS, images, fonts and total gzip meet their existing limits. No gate
or limit changed. Resolving the document/total costs remains engineering work
under #52/#91/#29/#37, not a requested owner waiver.

The [hosted parent snapshot](reviews/static-build-trust-57/hosted-parent-131.json)
records #131 head `0f9de22`: CodeQL passes, CI fails the same artifact stage and
skips browsers, and dependency review reports unsupported repository/Dependency
graph configuration. These are parent-source results, not a hosted pass for this
new branch. Mac/Apple Silicon, native operator walkthrough and physical/AT/zoom
checks remain distinct in #115. No image was deployed and no draft was merged.
