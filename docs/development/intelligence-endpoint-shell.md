# Shared Intelligence endpoint presentation

Refs site #27 and organization #41. This foundation sits above host draft #118;
it defines presentation transport, shared evidence rendering and the closed route
composition used by the independently authored endpoint slices.

`src/content/intelligence-routes.ts` lists the source-registry canonical paths,
aliases and one primary question per endpoint. It does not claim each upstream
normalized model exists. Identity Intelligence stays at `/intelligence/identity/`;
the distinct Identity product route remains owned by the registry.

`features/intelligence/endpoints/types.ts` describes a website-only presentation:
records, directed related references, repository groups, coverage and view
availability. It is not a new Hygiene/Observatory canonical schema. Producer
meaning, human lifecycle and applicability stay with their original owners.

`EndpointFrame` shares URL-backed repository/query/state filters, deterministic
initial SSR content, independent source-freshness display, progressive evidence,
metadata and no-JavaScript record content. Search records may supply opaque
`searchText`; the frame uses it directly rather than inventing match attribution.
`endpointFragment` encodes the exact UTF-16 identity into a URL-safe reversible
anchor shared by cards and the eventual navigation model.

`intelligence-endpoint-input.mts` bounds Node-side presentation parsing and
filters non-public/unselected references before reading titles, IDs, states or
URLs. Evidence links are restricted to literal HTTPS GitHub repository evidence
paths; unknown text never becomes HTML or executable configuration. Child
projectors retain domain-specific validation and do not copy aggregate scores.

This foundation does not activate the new endpoints by itself. The aggregate
slice registers synchronous routes, metadata/static output, host redirects,
module admission and graph navigation. The domain slices add their own projectors
and page components. Existing store routes and consumer publication remain owned
by the current website stack.

Only static syntax/source/peer inspection and whitespace checks were performed.
Full builds, types, tests, browsers, host behavior and live acceptance remain
explicitly deferred for the requested implementation pass.
