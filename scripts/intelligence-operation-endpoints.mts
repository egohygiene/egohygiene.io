import type {
  EndpointRecord,
  EndpointRelation,
} from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import {
  list,
  optionalText,
  plain,
  record,
  reference,
  type EndpointProjectionContext,
} from "./intelligence-endpoint-input.mts";

/**
 * Project only supplied compact Health check references. Native execution and
 * policy findings are independent records; aggregate counters and scores never
 * become site-owned health claims.
 */
export function projectHealth(
  value: unknown,
  context: EndpointProjectionContext,
): readonly EndpointRecord[] {
  const view = plain(value);
  if (view["score"] !== null) throw new TypeError("ENDPOINT_INPUT");
  const records: EndpointRecord[] = [];
  const identifiers = new Set<string>();
  for (const candidate of list(view["checks"])) {
    // record() checks visibility and authorized repository before reading IDs,
    // titles, states or URLs. Protected entries never affect public counters.
    const check = record(candidate, context);
    if (!check) continue;
    if (check.kind !== "check" || identifiers.has(check.id)) throw new TypeError("ENDPOINT_INPUT");
    identifiers.add(check.id);
    records.push({
      ...check,
      summary:
        "Supplied check evidence. Execution outcomes and policy findings retain their separate source records.",
      details: [{ label: "Check identity", value: check.key }],
    });
  }
  return records;
}

function related(
  value: unknown,
  context: EndpointProjectionContext,
  label: string,
  allowedKinds: ReadonlySet<string>,
): readonly EndpointRelation[] {
  const relations: EndpointRelation[] = [];
  const identifiers = new Set<string>();
  for (const candidate of list(value)) {
    const target = reference(candidate, context);
    if (!target) continue;
    if (!allowedKinds.has(target.kind)) throw new TypeError("ENDPOINT_INPUT");
    if (identifiers.has(target.id)) continue;
    identifiers.add(target.id);
    relations.push({ label, target, assertion: target.assertion, freshness: target.freshness });
  }
  return relations;
}

const includedKinds: ReadonlySet<string> = new Set([
  "roadmap_step",
  "issue",
  "pull_request",
  "commit",
]);
const deploymentKinds: ReadonlySet<string> = new Set(["deployment"]);

/** Release publication, included work and deployment observations stay separate. */
export function projectReleases(
  value: unknown,
  context: EndpointProjectionContext,
): readonly EndpointRecord[] {
  const view = plain(value);
  const records: EndpointRecord[] = [];
  const identifiers = new Set<string>();
  for (const candidate of list(view["releases"])) {
    const release = plain(candidate);
    // Withhold the entire wrapper before touching its publication time or
    // related work when the owning release is outside the public projection.
    const entity = record(release["entity"], context);
    if (!entity) continue;
    if (entity.kind !== "release" || identifiers.has(entity.id))
      throw new TypeError("ENDPOINT_INPUT");
    identifiers.add(entity.id);
    const publishedAt = optionalText(release["published_at"], 64);
    if (publishedAt !== null) {
      if (
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(publishedAt) ||
        !Number.isFinite(Date.parse(publishedAt)) ||
        new Date(publishedAt).toISOString().slice(0, 19) !== publishedAt.slice(0, 19)
      )
        throw new TypeError("ENDPOINT_INPUT");
    }
    records.push({
      ...entity,
      summary:
        "Release publication evidence with separately supplied work and deployment links. Installation verification is unavailable in this source model.",
      details: [
        {
          label: "Publication timestamp",
          value: publishedAt ?? "Unavailable in the normalized release record",
        },
      ],
      relations: [
        ...related(release["includes"], context, "Included work", includedKinds),
        ...related(release["deployments"], context, "Deployment observation", deploymentKinds),
      ],
    });
  }
  return records;
}
