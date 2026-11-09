import { intelligenceEndpointRoutes } from "../apps/egohygiene.io/src/content/intelligence-routes.ts";
import { endpointFragment } from "../apps/egohygiene.io/src/features/intelligence/endpoints/fragment.ts";
import type { IntelligenceData } from "../apps/egohygiene.io/src/features/intelligence/types.ts";
import type { EndpointReference } from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import type { GraphNode, GraphEdge } from "../apps/egohygiene.io/src/features/intelligence/graph/types.ts";
import { endpointViewGroups } from "./intelligence-endpoint-modules.mts";
import { projectDependencyEdges } from "./intelligence-support-endpoints.mts";

export function buildIntelligenceNavigation(data: IntelligenceData, views: unknown): { nodes: readonly GraphNode[]; edges: readonly GraphEdge[]; truncated: boolean } {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();
  let truncated = false;
  const addNode = (node: GraphNode) => {
    const existing = nodes.get(node.id);
    if (existing) {
      if (node.href.includes("#") && !existing.href.includes("#")) nodes.set(node.id, { ...existing, href: node.href });
      return true;
    }
    if (nodes.size >= 140) { truncated = true; return false; }
    nodes.set(node.id, { ...node, label: Array.from(node.label).slice(0, 128).join("") }); return true;
  };
  const addEdge = (edge: GraphEdge) => {
    if (!nodes.has(edge.source) || !nodes.has(edge.target)) { truncated = true; return; }
    if (edges.size >= 320) { truncated = true; return; }
    edges.set(edge.id, edge);
  };
  for (const module of data.modules) addNode({ id: `module:${module.id}`, label: module.title, kind: "module", href: module.path,
    state: module.id === "intelligence" ? data.state : data.endpoints?.[module.id]?.state ?? "unavailable",
    description: module.description });
  const repositories = [...data.repositories].sort((left, right) => left.name.localeCompare(right.name, "en"));
  if (repositories.length > 40) truncated = true;
  for (const repository of repositories.slice(0, 40)) {
    const repositoryId = `repository:${repository.name}`;
    if (!addNode({ id: repositoryId, label: repository.name, kind: "repository", repository: repository.name,
      href: `/intelligence/?repository=${encodeURIComponent(repository.name)}`, state: repository.evidenceState,
      description: `Represented commit ${repository.representedCommit}; observed ${repository.observedAt}.` })) continue;
    addEdge({ id: `navigation:intelligence:${repository.name}`, source: "module:intelligence", target: repositoryId,
      label: "Public directory", kind: "navigation", assertion: "navigation", freshness: repository.evidenceState });
  }
  const allowed = new Set(repositories.map((repository) => repository.name));
  let declaredCount = 0;
  const dependencyGroups = endpointViewGroups(views, "dependencies", allowed);
  for (const repository of repositories) {
    try {
      const admittedGroup = data.endpoints?.["dependencies"]?.groups.find((group) => group.repository === repository.name);
      if (!admittedGroup || ["incompatible", "unavailable"].includes(admittedGroup.state)) continue;
      const raw = dependencyGroups.get(repository.name);
      if (raw == null) continue;
      for (const edge of projectDependencyEdges(raw, { repository: repository.name, allowedRepositories: allowed })) {
        if (declaredCount >= 160) { truncated = true; continue; }
        const endpoint = (value: EndpointReference) => addNode({ id: `entity:${value.id}`, label: value.title, kind: "entity", repository: value.repository,
          href: `/dependencies/?repository=${encodeURIComponent(repository.name)}`, state: value.state,
          description: `${value.kind} · Captured freshness: ${value.freshness} · Source view: ${admittedGroup.state} · Source freshness: ${admittedGroup.sourceFreshness ?? "unknown"}` });
        if (!endpoint(edge.source) || !endpoint(edge.target)) continue;
        declaredCount += 1;
        addEdge({ id: `declared:${edge.id}`, source: `entity:${edge.source.id}`, target: `entity:${edge.target.id}`, label: edge.type,
          kind: "declared", assertion: edge.assertion, freshness: edge.freshness, sourceState: admittedGroup.state, sourceFreshness: admittedGroup.sourceFreshness });
      }
    } catch { /* A bad dependency module cannot remove directory/navigation nodes. */ }
  }
  for (const route of intelligenceEndpointRoutes) {
    for (const group of data.endpoints?.[route.id]?.groups ?? []) {
      const repositoryId = `repository:${group.repository}`;
      if (nodes.has(repositoryId)) addEdge({ id: `navigation:${route.id}:${group.repository}`, source: `module:${route.id}`, target: repositoryId,
        label: "View context", kind: "navigation", assertion: "navigation", freshness: group.sourceFreshness ?? "unknown" });
      for (const record of group.records) {
        if (!addNode({ id: `entity:${record.id}`, label: record.title, kind: "entity", repository: record.repository, state: record.state,
          href: `${route.path}?repository=${encodeURIComponent(group.repository)}&q=&state=#${record.anchorId ?? endpointFragment(record.id)}`,
          description: `${record.kind} · ${record.assertion} · ${record.freshness}` })) continue;
        addEdge({ id: `navigation:${route.id}:${record.id}`, source: `module:${route.id}`, target: `entity:${record.id}`,
          label: "Lists evidence", kind: "navigation", assertion: "navigation", freshness: record.freshness });
      }
    }
  }
  return { nodes: [...nodes.values()], edges: [...edges.values()], truncated };
}
