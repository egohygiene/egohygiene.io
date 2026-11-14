# Private playground exposure checkpoint

Issue [#25](https://github.com/egohygiene/egohygiene.io/issues/25) owns the broader
experiment registry and promotion lifecycle. This checkpoint first implements
its explicit exposure prerequisite: the local playground binds loopback, serves
`X-Robots-Tag: noindex, nofollow, noarchive` in development and preview, and
retains equivalent HTML and robots directives in its standalone build.

Indexing directives are requests to crawlers, not authentication or access
control. Do not deploy the playground or put secrets/private source data in it.
An operator who deliberately overrides the loopback bind owns that exposure.
Production deployments continue using the website artifact, never playground
`dist`, and the website Vite build rejects direct, transitive or symlinked
imports of playground modules. Workspace packages remain the promotion path.

The guard also inspects static `new URL(..., import.meta.url)` references before
Vite can inline their bytes, CSS asset/import references, emitted asset origins,
and the public-directory copy tree (including symlinks). Dynamic directories
that can reach the playground fail; unresolved expressions and escaped CSS asset
references require explicit review. This is a source/build boundary for the
normal Vite pipeline, not a sandbox for arbitrary build plugins or concurrent
changes to source files.

Verification uses actual Vite builds with synthetic experiment imports and a
loopback HTTP server. Successful public-fixture output excludes the experiment
canary. Negative controls cover emitted and inline assets, inline query flags,
CSS, TypeScript assertions, dynamic prefixes and public-directory copies. Three
focused groups and the normal45-route build pass. The broader registry,
representative experiments, promotion proof and
human accessibility acceptance remain open; this repair does not complete #25.
