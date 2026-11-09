import { endpointFragment } from "../apps/egohygiene.io/src/features/intelligence/endpoints/fragment.ts";
import { intelligenceEndpointRoutes } from "../apps/egohygiene.io/src/content/intelligence-routes.ts";
import type { IntelligenceRepository, IntelligenceState } from "../apps/egohygiene.io/src/features/intelligence/types.ts";
import type { EndpointData, EndpointGroup, EndpointRecord } from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import { plain, list, text, type EndpointProjectionContext } from "./intelligence-endpoint-input.mts";
import { projectRoadmap, projectDecisions } from "./intelligence-intent-endpoints.mts";
import { projectHealth, projectReleases } from "./intelligence-operation-endpoints.mts";
import { projectDependencies, projectWork, projectJourney, projectSearch } from "./intelligence-support-endpoints.mts";

const domains: Readonly<Record<string, readonly string[]>> = {
  roadmap: ["roadmap"], decisions: ["decisions"], health: ["checks"], releases: ["releases", "deployments"],
  journey: ["history"], work: ["roadmap", "issues", "pull_requests"],
  dependencies: ["roadmap", "decisions", "git", "issues", "pull_requests", "checks", "releases", "deployments", "history"],
  search: ["roadmap", "decisions", "git", "issues", "pull_requests", "checks", "releases", "deployments", "history"],
};
const projectors: Readonly<Record<string, (value: unknown, context: EndpointProjectionContext) => readonly EndpointRecord[]>> = {
  roadmap: projectRoadmap, decisions: projectDecisions, health: projectHealth, releases: projectReleases,
  dependencies: projectDependencies, work: projectWork, journey: projectJourney, search: projectSearch,
};

/** Ignore protected/unadmitted groups before reading records or duplicate diagnostics. */
export function endpointViewGroups(value: unknown, name: string, allowed: ReadonlySet<string>): Map<string, unknown> {
  const result = new Map<string, unknown>();
  try {
    const rows = list(plain(plain(value)[name])["repositories"], 100000);
    for (const raw of rows) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      const row = raw as Record<string, unknown>;
      if (typeof row["repository"] !== "string" || !allowed.has(row["repository"])) continue;
      const repository = row["repository"];
      result.set(repository, result.has(repository) ? null : row["data"]);
    }
  } catch { /* The owning module is unavailable; other modules remain independent. */ }
  return result;
}

function searchViewGroups(value: unknown, allowed: ReadonlySet<string>): Map<string, unknown> {
  const result = new Map<string, unknown>();
  try {
    const view = plain(plain(value)["search"]);
    const coverageRows = list(view["collection_coverage"], 100000);
    for (const raw of coverageRows) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      const row = raw as Record<string, unknown>;
      const repository = row["repository"];
      if (typeof repository !== "string" || !allowed.has(repository)) continue;
      result.set(repository, result.has(repository) ? null : { records: [], collection_coverage: row["domains"] });
    }
    for (const raw of list(view["records"], 100000)) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      const item = raw as Record<string, unknown>;
      if (item["visibility"] !== "public" || typeof item["repository"] !== "string" || !allowed.has(item["repository"])) continue;
      const group = result.get(item["repository"]);
      if (!group) continue;
      const records = plain(group)["records"] as unknown[];
      records.push(item);
    }
  } catch { result.clear(); }
  return result;
}

function groupState(group: EndpointGroup): IntelligenceState {
  if (group.coverage.some((claim) => claim.collection === "failed")) return "error";
  if (group.sourceFreshness === "stale") return "stale";
  if (group.truncated) return "partial";
  if (group.coverage.some((claim) => claim.freshness === "stale")) return "stale";
  if (group.coverage.every((claim) => ["uncollected", "unavailable"].includes(claim.collection))) return group.records.length ? "partial" : "unavailable";
  if (group.coverage.some((claim) => ["partial", "uncollected", "unavailable"].includes(claim.collection))) return "partial";
  return "available";
}
function overall(groups: readonly EndpointGroup[]): IntelligenceState {
  if (!groups.length || groups.every((group) => group.state === "unavailable")) return "unavailable";
  if (groups.some((group) => ["error", "incompatible", "unavailable", "partial"].includes(group.state))) return "partial";
  return groups.some((group) => group.state === "stale") ? "stale" : "available";
}
function assertCoverage(value: unknown, repository: IntelligenceRepository, selected: readonly string[]) {
  const raw = plain(plain(value)["collection_coverage"]);
  if (Object.keys(raw).length !== selected.length || selected.some((name) => !Object.hasOwn(raw, name))) throw new TypeError("ENDPOINT_COVERAGE");
  for (const domain of selected) {
    const expected = repository.coverage.find((claim) => claim.domain === domain);
    const claim = plain(raw[domain]);
    if (!expected || Object.keys(claim).length !== 4 || claim["collection"] !== expected.collection || claim["freshness"] !== expected.freshness || claim["reason"] !== expected.reason || claim["observed_at"] !== expected.observedAt) throw new TypeError("ENDPOINT_COVERAGE");
  }
}

export function projectEndpointModules(views: unknown, repositories: readonly IntelligenceRepository[], staleSources: ReadonlySet<string> = new Set()): Readonly<Record<string, EndpointData>> {
  const result: Record<string, EndpointData> = Object.fromEntries(intelligenceEndpointRoutes.map((route) => [route.id, { id: route.id, state: "unavailable", groups: [] }]));
  const allowed = new Set(repositories.map((repository) => repository.name));
  const ordered = [...repositories].sort((left, right) => left.name.localeCompare(right.name, "en"));
  for (const [id, projector] of Object.entries(projectors)) {
    const selected = domains[id]!;
    const inputs = id === "search" ? searchViewGroups(views, allowed) : endpointViewGroups(views, id, allowed);
    let remaining = 800;
    const groups: EndpointGroup[] = ordered.map((repository) => {
      const coverage = repository.coverage.filter((claim) => selected.includes(claim.domain));
      const base: EndpointGroup = { repository: repository.name, state: "unavailable", reason: "Normalized view is unavailable at this source boundary.", sourceFreshness: staleSources.has(repository.name) ? "stale" : "current", coverage, records: [], truncated: false };
      const input = inputs.get(repository.name);
      if (input === undefined || input === null) return base;
      try {
        assertCoverage(input, repository, selected);
        const records = projector(input, { repository: repository.name, allowedRepositories: allowed });
        if (!Array.isArray(records) || records.length > 8192) throw new TypeError("ENDPOINT_INPUT");
        const admitted = records.slice(0, Math.min(120, remaining)).map((record) => ({ ...record, anchorId: endpointFragment(`${repository.name}\0${record.id}`) }));
        remaining -= admitted.length;
        const group: EndpointGroup = { ...base, records: admitted, truncated: admitted.length !== records.length,
          reason: "Pinned normalized evidence; collection scope remains independent from record state." };
        return { ...group, state: groupState(group) };
      } catch {
        return { ...base, state: "incompatible", reason: "This repository's normalized view is incompatible. Other sources remain available." };
      }
    });
    result[id] = { id, state: overall(groups), groups };
  }
  let nowRemaining = 800;
  const nowGroups: EndpointGroup[] = ordered.map((repository) => {
    const rows = [
      ...repository.now.currentFocus.map((item) => ({ item, lane: "Current focus" })),
      ...repository.now.blockers.map((item) => ({ item, lane: "Blocker" })),
      ...repository.now.nextReady.map((item) => ({ item, lane: "Next ready" })),
    ];
    const admitted = rows.slice(0, Math.min(120, nowRemaining));
    nowRemaining -= admitted.length;
    return ({ repository: repository.name,
    state: repository.now.state === "available" ? (staleSources.has(repository.name) ? "stale" : "available") : "unavailable",
    reason: "Source-owned attention lanes; readiness and human approval are distinct.", sourceFreshness: staleSources.has(repository.name) ? "stale" : "current", coverage: repository.coverage,
    truncated: admitted.length !== rows.length, records: admitted.map(({ item, lane }, index) => ({ ...item, id: `${item.id}:${lane}:${index}`, anchorId: endpointFragment(`${repository.name}\0${item.id}:${lane}:${index}`), key: item.id,
      kind: lane, repository: repository.name, details: [], relations: [] })) }); });
  result["now"] = { id: "now", state: overall(nowGroups), groups: nowGroups };
  return result;
}
