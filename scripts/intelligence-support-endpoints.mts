import type {
  EndpointRecord,
  EndpointReference,
} from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import {
  instant,
  list,
  plain,
  reference,
  text,
  type EndpointProjectionContext,
} from "./intelligence-endpoint-input.mts";

/** Exact admitted directed edges; this is presentation transport, not a new graph contract. */
export interface DependencyEndpointEdge {
  readonly id: string;
  readonly source: EndpointReference;
  readonly target: EndpointReference;
  readonly type: "depends-on" | "blocks";
  readonly assertion: string;
  readonly freshness: string;
}

type SearchRecord = EndpointRecord & { readonly searchText: string };
const assertions = ["authoritative", "inferred", "unknown"] as const;
const freshnessStates = ["current", "stale", "unknown", "not_applicable"] as const;
const queues = ["active", "ready", "waiting", "blocked", "unknown"] as const;
const entityKinds = new Set(["repository", "roadmap_step", "architecture_decision", "issue", "pull_request", "commit", "check", "release", "deployment"]);
const eventLabels: Readonly<Record<string, string>> = {
  "repository.observed": "Repository observed",
  "roadmap_step.created": "Roadmap step created",
  "roadmap_step.status_changed": "Roadmap state changed",
  "architecture_decision.proposed": "Decision proposed",
  "architecture_decision.accepted": "Decision accepted",
  "architecture_decision.rejected": "Decision rejected",
  "architecture_decision.deprecated": "Decision deprecated",
  "architecture_decision.superseded": "Decision superseded",
  "issue.opened": "Issue opened",
  "issue.closed": "Issue closed",
  "issue.reopened": "Issue reopened",
  "pull_request.opened": "Pull request opened",
  "pull_request.merged": "Pull request merged",
  "pull_request.closed": "Pull request closed",
  "commit.created": "Commit recorded",
  "check.completed": "Check completed",
  "release.published": "Release published",
  "deployment.completed": "Deployment completed",
};

function evidenceClaim(value: unknown, states: readonly string[]): string {
  const result = text(value, 128);
  if (!states.includes(result)) throw new TypeError("ENDPOINT_INPUT");
  return result;
}

function isPublicEndpoint(value: unknown, context: EndpointProjectionContext): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return item["visibility"] === "public" && typeof item["repository"] === "string"
    && context.allowedRepositories.has(item["repository"]);
}

function addUnique(identifiers: Set<string>, identifier: string): void {
  if (identifiers.has(identifier)) throw new TypeError("ENDPOINT_INPUT");
  identifiers.add(identifier);
}

/** Exclude unsupported/private relationships before inspecting edge identity or prose. */
export function projectDependencyEdges(value: unknown, context: EndpointProjectionContext): readonly DependencyEndpointEdge[] {
  const view = plain(value);
  const result: DependencyEndpointEdge[] = [];
  const identifiers = new Set<string>();
  for (const raw of list(view["relationships"])) {
    const edge = plain(raw);
    const type = edge["type"];
    if (type !== "depends-on" && type !== "blocks") continue;
    const sourceValue = edge["source"], targetValue = edge["target"];
    if (!isPublicEndpoint(sourceValue, context) || !isPublicEndpoint(targetValue, context)) continue;
    if (sourceValue["repository"] !== context.repository && targetValue["repository"] !== context.repository) continue;
    const source = reference(sourceValue, context);
    if (!source) continue;
    const target = reference(targetValue, context);
    if (!target) continue;
    const id = text(edge["id"], 512);
    addUnique(identifiers, id);
    if (source.id === target.id) throw new TypeError("ENDPOINT_INPUT");
    result.push({ id, source, target, type,
      assertion: evidenceClaim(edge["assertion"], assertions),
      freshness: evidenceClaim(edge["freshness"], freshnessStates) });
  }
  return result;
}

/** Group admitted direct edges by their actual source without expanding transitively. */
export function projectDependencies(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  const grouped = new Map<string, { source: EndpointReference; edges: DependencyEndpointEdge[] }>();
  for (const edge of projectDependencyEdges(value, context)) {
    const prior = grouped.get(edge.source.id);
    if (prior) {
      if (JSON.stringify(prior.source) !== JSON.stringify(edge.source)) throw new TypeError("ENDPOINT_INPUT");
      prior.edges.push(edge);
    } else grouped.set(edge.source.id, { source: edge.source, edges: [edge] });
  }
  return [...grouped.values()].map(({ source, edges }) => ({
    ...source,
    summary: "Direct relationships supplied by the normalized source. Prerequisites and blockers retain their declared direction and evidence assertions.",
    details: edges.map((edge) => ({ label: `${edge.type} edge identity`, value: edge.id })),
    relations: edges.map((edge) => ({ label: edge.type, target: edge.target,
      assertion: edge.assertion, freshness: edge.freshness })),
  }));
}

/** Render execution inventories and the separately inferred roadmap-readiness queues. */
export function projectWork(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  const view = plain(value);
  const result: EndpointRecord[] = [];
  const identifiers = new Set<string>();
  for (const [member, kind, label] of [
    ["open_issues", "issue", "Open issues"],
    ["open_pull_requests", "pull_request", "Open pull requests"],
  ] as const) {
    for (const raw of list(view[member])) {
      const item = reference(raw, context);
      if (!item) continue;
      if (item.kind !== kind || item.state !== "open") throw new TypeError("ENDPOINT_INPUT");
      addUnique(identifiers, item.id);
      result.push({ ...item, details: [{ label: "Execution inventory", value: label }], relations: [] });
    }
  }
  const readiness = plain(view["roadmap_queues"]);
  if (Object.keys(readiness).length !== queues.length || !queues.every((queue) => Object.hasOwn(readiness, queue))) throw new TypeError("ENDPOINT_INPUT");
  for (const queue of queues) {
    for (const raw of list(readiness[queue])) {
      const item = reference(raw, context);
      if (!item) continue;
      if (item.kind !== "roadmap_step") throw new TypeError("ENDPOINT_INPUT");
      addUnique(identifiers, item.id);
      result.push({ ...item,
        summary: `Projected readiness queue: ${queue}. Observatory derives this from canonical state and explicit relationships; the queue does not grant human approval or acceptance.`,
        details: [{ label: "Readiness queue (inferred)", value: queue },
          { label: "Canonical roadmap state", value: item.state }], relations: [] });
    }
  }
  return result;
}

/** Preserve observed event order and keep event state separate from current subject state. */
export function projectJourney(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  const view = plain(value);
  const result: EndpointRecord[] = [];
  const indices = new Map<string, number>();
  let previous: { occurredAt: string; id: string } | undefined;
  for (const raw of list(view["events"])) {
    const event = plain(raw);
    if (event["visibility"] !== "public") continue;
    const subject = reference(event["subject_entity"], context);
    if (!subject) continue;
    const type = event["type"];
    if (typeof type !== "string" || !Object.hasOwn(eventLabels, type)) continue;
    const id = text(event["id"], 512);
    if (indices.has(id) || event["subject"] !== subject.id) throw new TypeError("ENDPOINT_INPUT");
    const occurredAt = instant(event["occurred_at"]);
    const recordedAt = instant(event["recorded_at"]);
    if (occurredAt > recordedAt || (previous && (occurredAt < previous.occurredAt || (occurredAt === previous.occurredAt && id <= previous.id)))) throw new TypeError("ENDPOINT_INPUT");
    previous = { occurredAt, id };
    const assertion = evidenceClaim(event["assertion"], assertions);
    const freshness = evidenceClaim(event["freshness"], freshnessStates);
    indices.set(id, result.length);
    result.push({ ...subject, id, key: id, kind: "event", title: `${eventLabels[type]} · ${subject.title}`,
      state: type, assertion, freshness,
      details: [{ label: "Occurred at", value: occurredAt }, { label: "Recorded at", value: recordedAt },
        { label: "Subject state at this snapshot", value: subject.state },
        { label: "Subject assertion", value: subject.assertion }, { label: "Subject freshness", value: subject.freshness }],
      relations: [{ label: "Event subject", target: subject, assertion, freshness }] });
  }
  // A tail chapter's text can mention a prior unprojected release. Preserve only
  // explicit admitted release boundaries, never arbitrary chapter titles/IDs.
  const chapterAssignments = new Map<string, string>();
  for (const raw of list(view["chapters"])) {
    const chapter = plain(raw);
    if (chapter["boundary"] == null) continue;
    const boundary = reference(chapter["boundary"], context);
    if (!boundary) continue;
    if (boundary.kind !== "release") throw new TypeError("ENDPOINT_INPUT");
    for (const candidate of list(chapter["event_ids"])) {
      if (typeof candidate !== "string" || !indices.has(candidate)) continue;
      if (chapterAssignments.has(candidate)) throw new TypeError("ENDPOINT_INPUT");
      chapterAssignments.set(candidate, boundary.id);
      const index = indices.get(candidate)!;
      const current = result[index]!;
      result[index] = { ...current,
        details: [...current.details, { label: "Explicit release chapter boundary", value: boundary.title }],
        relations: [...current.relations, { label: "Release chapter boundary", target: boundary }] };
    }
  }
  return result;
}

/** Keep Observatory's opaque matching string; never derive local field attribution. */
export function projectSearch(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  const view = plain(value);
  const result: SearchRecord[] = [];
  const identifiers = new Set<string>();
  for (const raw of list(view["records"])) {
    if (!isPublicEndpoint(raw, context) || raw["repository"] !== context.repository) continue;
    const item = reference(raw, context);
    if (!item || item.repository !== context.repository || !entityKinds.has(item.kind)) continue;
    const supplied = plain(raw);
    const searchText = text(supplied["search_text"], 4096);
    addUnique(identifiers, item.id);
    result.push({ ...item, searchText,
      details: [{ label: "Search matching", value: "The supplied normalized search_text; no local reindexing or ranking." },
        { label: "Matched fields", value: "Attribution unavailable in the pinned opaque Search contract." }],
      relations: [] });
  }
  return result;
}
