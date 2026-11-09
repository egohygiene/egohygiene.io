import type {
  EndpointRecord,
  EndpointRelation,
} from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import {
  evidenceUrl,
  list,
  optionalText,
  plain,
  record,
  reference,
  text,
  type EndpointProjectionContext,
} from "./intelligence-endpoint-input.mts";

const maximumRaw = 100000;
const maximumRecords = 1024;
const maximumReferences = 256;
const roadmapStates = new Set(["planned", "ready", "active", "blocked", "complete", "deferred", "cancelled", "unknown"]);
const decisionStates = new Set(["proposed", "accepted", "rejected", "superseded", "deprecated", "unknown"]);
const implementations = new Set(["not_started", "in_progress", "implemented", "verified", "not_applicable", "unknown"]);

function requireInput(condition: unknown): asserts condition {
  if (!condition) throw new TypeError("ENDPOINT_INPUT");
}

/** A hidden entity is filtered before its identity or attached prose is read. */
function admittedRows(value: unknown, key: string, context: EndpointProjectionContext, ownRepository: boolean) {
  const selected: { row: Record<string, unknown>; entity: EndpointRecord }[] = [];
  const seen = new Set<string>();
  for (const raw of list(plain(value)[key], maximumRaw)) {
    const row = plain(raw);
    const item = ownRepository ? record(row["entity"], context) : reference(row["entity"], context);
    if (!item) continue;
    requireInput(!seen.has(item.id));
    seen.add(item.id);
    selected.push({ row, entity: { ...item, details: [], relations: [] } });
    requireInput(selected.length <= maximumRecords);
  }
  return selected;
}

function relations(value: unknown, label: string, context: EndpointProjectionContext): EndpointRelation[] {
  const result: EndpointRelation[] = [];
  const seen = new Map<string, string>();
  for (const raw of list(value, maximumRaw)) {
    const target = reference(raw, context);
    if (!target) continue;
    const serialized = JSON.stringify(target);
    const previous = seen.get(target.id);
    requireInput(previous === undefined || previous === serialized);
    if (previous !== undefined) continue;
    seen.set(target.id, serialized);
    // The normalized view supplies endpoint assertions, not edge assertions.
    // Do not manufacture authoritative relationship evidence here.
    result.push({ label, target });
    requireInput(result.length <= maximumReferences);
  }
  return result;
}

/** Authored URLs remain references, without invented issue entities or provider states. */
function issueReferences(value: unknown, context: EndpointProjectionContext): string[] {
  const result = new Set<string>();
  for (const raw of list(value ?? [], maximumRaw)) {
    if (typeof raw !== "string") continue;
    const match = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/issues\/[1-9]\d*$/.exec(raw);
    if (!match?.[1] || !context.allowedRepositories.has(match[1])) continue;
    const url = evidenceUrl(raw, match[1]);
    if (url) result.add(url);
    requireInput(result.size <= maximumReferences);
  }
  return [...result];
}

/** Present repository-owned intent; do not turn repository steps into organization initiatives. */
export function projectRoadmap(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  const view = plain(value);
  const selected = admittedRows(view, "steps", context, true);
  return selected.map(({ row, entity }): EndpointRecord => {
    requireInput(entity.kind === "roadmap_step" && roadmapStates.has(entity.state));
    const outcome = optionalText(row["outcome"], 8192);
    const details: { label: string; value: string }[] = [
      { label: "Canonical step state", value: entity.state },
      // The fleet view carries derived values but not a verifiable original
      // public graph. Filtering endpoints cannot prove those derivations did
      // not depend on protected prerequisites. Never infer a replacement.
      { label: "Derived readiness", value: "Not projected; a proven public derivation boundary is required" },
      { label: "Root membership", value: "Not projected; a proven public derivation boundary is required" },
    ];
    const criteria = list(row["exit_criteria"], 128);
    for (const [index, raw] of criteria.entries()) {
      const criterion = plain(raw);
      requireInput(typeof criterion["complete"] === "boolean");
      details.push({ label: `Exit criterion ${index + 1}`,
        value: `${criterion["complete"] ? "Marked complete" : "Not marked complete"} · ${text(criterion["text"], 4096)}` });
    }
    if (!criteria.length) details.push({ label: "Exit criteria", value: "Not projected" });
    for (const url of issueReferences(row["issue_references"], context)) details.push({ label: "Authored issue reference", value: url });
    return { ...entity, ...(outcome ? { summary: outcome } : {}), details,
      relations: [
        ...relations(row["dependencies"], "Depends on", context),
        ...relations(row["blocked_by"], "Blocked by", context),
        ...relations(row["tracked_by"], "Tracked by", context),
        ...relations(row["informed_by"], "Informed by decision", context),
        ...relations(row["evidence"], "Source evidence", context),
        ...relations(row["verified_by"], "Verification evidence", context),
      ] };
  });
}

/** Keep lifecycle, decision scope and implementation as separate source facts. */
export function projectDecisions(value: unknown, context: EndpointProjectionContext): readonly EndpointRecord[] {
  return admittedRows(value, "decisions", context, false).map(({ row, entity }): EndpointRecord => {
    requireInput(entity.kind === "architecture_decision" && decisionStates.has(entity.state));
    const scope = optionalText(row["decision_scope"], 128);
    const implementation = optionalText(row["implementation_status"], 128);
    requireInput(scope === null || scope === "repository" || scope === "organization" || scope === "unknown");
    requireInput(implementation === null || implementations.has(implementation));
    return { ...entity, details: [
      { label: "Decision lifecycle", value: entity.state },
      { label: "Decision scope", value: scope ?? "Not projected" },
      { label: "Implementation status", value: implementation ?? "Not projected" },
      { label: "Canonical source repository", value: entity.repository },
      { label: "Consumer projection", value: context.repository },
      { label: "Human approval evidence", value: "Not projected by this normalized view; inspect the canonical decision" },
    ], relations: [
      ...relations(row["supersedes"], "Supersedes", context),
      ...relations(row["superseded_by"], "Superseded by", context),
      ...relations(row["informs"], "Informs roadmap", context),
      ...relations(row["tracked_by"], "Tracked by", context),
      ...relations(row["evidence"], "Source evidence", context),
      ...relations(row["verified_by"], "Verification evidence", context),
    ] };
  });
}
