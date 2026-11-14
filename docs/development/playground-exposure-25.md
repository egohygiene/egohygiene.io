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

Verification uses actual Vite builds with synthetic experiment imports and a
loopback HTTP server. Successful public-fixture output excludes the experiment
canary. The broader registry, representative experiments, promotion proof and
human accessibility acceptance remain open; this repair does not complete #25.
