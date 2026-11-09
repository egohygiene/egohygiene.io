# Intelligence navigation graph

Refs [site #27](https://github.com/egohygiene/egohygiene.io/issues/27) and
[organization #41](https://github.com/egohygiene/.github/issues/41).

This slice adds the dependency-free `IntelligenceGraph` presentation component.
The host supplies already-admitted public `GraphNode[]` and `GraphEdge[]`; the
component performs no network access, source normalization, storage, collection
or authority decisions. The overview/root composition owns what enters the
model and which canonical endpoints are available.

## Input and semantics

`GraphNode` contains `id`, `label`, `kind` (`module`, `repository`, `entity`),
`href`, `state`, `description`, and an optional public `repository`.
`GraphEdge` contains `id`, `source`, `target`, `label`, `kind` (`navigation`,
`declared`), `assertion`, and `freshness`. Duplicate node/edge identities are
withheld rather than choosing a winner. An edge is shown only when both admitted
endpoints remain present.

Dashed navigation lines identify host navigation membership. Solid declared
arrows retain source → target direction and their supplied relationship label,
assertion and freshness. The component never adds an edge from titles, column
membership, proximity, activity, or a force-layout calculation. Three stable
columns group modules, repositories and evidence; their positions are display
choices, not canonical architecture or implementation relationships.

The SVG displays up to 192 unique nodes and 512 edges, in deterministic kind /
label / ID order. The component exposes a bounded-presentation notice when it
reaches those limits. Its HTML directories contain the same admitted, bounded
model and remain independent of the current neighbor-only SVG filter. The owning
endpoint views remain the full evidence entry points; the graph makes no
complete-inventory claim.

## Navigation and interaction

SVG node links and the node directory open internal canonical website paths.
`safeGraphHref` rejects external origins, schemes, traversal, percent-encoded
path ambiguity, controls, backslashes and unapproved query keys. Approved view
context (`q`, `repository`, `state`, `evidence`, `view`) follows a destination only
when that destination does not already provide its own value. Source/evidence
URLs remain in their owning endpoint; the graph does not open arbitrary URLs.

Selection uses the URL `graph` parameter, admitted only when it matches a current
public node. Inspecting a node retains surrounding URL filters and shows exact
incoming/outgoing records without converting absence into independence. Native
node links still work without JavaScript. Hydration begins from the same default
URL selection and camera as static HTML; browser URL state becomes active through
the existing browser-snapshot hook.

Controls support zoom, fit, reset, pan and an optional selected-connections view.
The background supports pointer dragging. Focusing the SVG enables arrow-key
pan, +/− zoom, Home reset and F fit; individual links retain native Enter
navigation. Node focus reveals that node's connection panel and centers its
position. The two HTML directories expose every admitted node and relationship
with state, relationship class, assertion, freshness and direction as text.
No animation or physics library is used. Theme tokens, focus outlines,
forced-color treatment, reduced-motion overrides and a text-only print view are
provided.

## Review boundary

This is an implementation slice, not accessibility or browser acceptance.
Only static source/syntax and whitespace inspection are claimed. Tests,
typechecking, full builds, browser/screen-reader/zoom/mobile/forced-color checks,
performance proof, CI and live publication are deferred under the current user
instruction. Verify SVG focus/drag behavior, keyboard scroll ownership, browser
history/hydration and large admitted models during the later qualification pass.
The parent host owns route integration and its current-state/provenance handoff.
