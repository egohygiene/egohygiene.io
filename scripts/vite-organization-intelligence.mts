import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

import type {
  EvidenceState,
  IntelligenceClaim,
  IntelligenceData,
  IntelligenceItem,
  IntelligenceModule,
  IntelligenceRepository,
} from "../apps/egohygiene.io/src/features/intelligence/types.ts";

const root = fileURLToPath(new URL("../contracts/organization-intelligence/", import.meta.url));
const moduleId = "virtual:organization-intelligence";
const resolvedModuleId = `\0${moduleId}`;
const fleetSchema = "egohygiene.observatory.repository-intelligence-fleet/v1";
const version = "1.0.0-alpha.2";
const domains = ["roadmap", "decisions", "git", "issues", "pull_requests", "checks", "releases", "deployments", "history"] as const;
const sha = /^[a-f0-9]{64}$/;
const revision = /^[a-f0-9]{40}$/;
const repositoryName = /^egohygiene\/(?:\.github|[a-z0-9][a-z0-9.-]*)$/;
const unsafeText = /(?:github_pat_|gh[pousr]_|(?:token|password|secret)\s*[:=]|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\/(?:home|Users|workspace|tmp)\/)/i;
const snapshotBrand = Symbol("admitted-organization-intelligence");

type RecordValue = Record<string, unknown>;
type InputCode = IntelligenceData["code"];

class FleetInputError extends Error {
  readonly code: InputCode;
  constructor(code: InputCode) { super(code); this.code = code; }
}

function requireInput(condition: unknown, code: InputCode = "INPUT_INVALID"): asserts condition {
  if (!condition) throw new FleetInputError(code);
}

function object(value: unknown): RecordValue {
  requireInput(value !== null && typeof value === "object" && !Array.isArray(value));
  return value as RecordValue;
}

function declaredPublic(value: unknown): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    && (value as RecordValue)["visibility"] === "public";
}

function array(value: unknown, maximum = 1024): unknown[] {
  requireInput(Array.isArray(value) && value.length <= maximum);
  return value;
}

function text(value: unknown, maximum = 512): string {
  requireInput(typeof value === "string" && value.length > 0 && value.length <= maximum && !/[\u0000-\u001f\u007f]/.test(value) && !unsafeText.test(value));
  return value;
}

function instant(value: unknown): string {
  const result = text(value, 20);
  requireInput(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result));
  const date = new Date(result);
  requireInput(Number.isFinite(date.getTime()) && date.toISOString().replace(".000Z", "Z") === result);
  return result;
}

function exactKeys(value: RecordValue, expected: readonly string[]) {
  requireInput(Object.keys(value).length === expected.length && expected.every((key) => Object.hasOwn(value, key)));
}

function hash(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

async function boundedFile(filename: string, maximum = 16 * 1024 * 1024): Promise<Buffer> {
  const absolute = resolve(filename);
  let current = absolute;
  while (current !== parse(current).root) {
    requireInput(!(await lstat(current)).isSymbolicLink(), "INPUT_UNAVAILABLE");
    current = dirname(current);
  }
  const info = await lstat(absolute);
  requireInput(info.isFile() && info.size <= maximum, "INPUT_UNAVAILABLE");
  const content = await readFile(absolute);
  requireInput(content.byteLength <= maximum, "INPUT_UNAVAILABLE");
  return content;
}

/** Only literal same-repository GitHub evidence paths are navigable. */
export function safeIntelligenceEvidenceUrl(value: unknown, repository: string): string | null {
  if (typeof value !== "string" || value.length > 1024 || /[%\\\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password || url.search || url.href !== value) return null;
    if (url.pathname.split("/").some((part) => part === "." || part === "..")) return null;
    if (url.hash && !/^#L\d+(?:-L\d+)?$/.test(url.hash)) return null;
    const prefix = `/${repository}`;
    if (url.pathname === prefix && !url.hash) return value;
    if (!url.pathname.startsWith(`${prefix}/`)) return null;
    const path = url.pathname.slice(prefix.length + 1);
    if (path.split("/").some((part) => !part || part === "." || part === "..")) return null;
    return /^(?:(?:issues|pull)\/[1-9]\d*|commit\/[a-f0-9]{40}|(?:blob|tree)\/[a-f0-9]{40}\/[A-Za-z0-9._/-]+|releases(?:\/tag\/[A-Za-z0-9._-]+)?)$/.test(path) ? value : null;
  } catch { return null; }
}

const moduleIssues: Readonly<Record<string, number>> = {
  intelligence: 15, roadmap: 29, sanity: 28, status: 33, hygiene: 34, audits: 35,
  decisions: 36, identity: 37, dependencies: 38, releases: 39, distribution: 39, health: 40,
};

async function contracts() {
  const lock = object(JSON.parse((await boundedFile(`${root}/input-lock.json`, 16384)).toString("utf8")));
  requireInput(lock["schema"] === "egohygiene.website.organization-intelligence-input-lock/v1" && lock["contract_version"] === version, "INPUT_INCOMPATIBLE");
  const sources = object(lock["sources"]);
  const pins = new Map<string, RecordValue>();
  let registry: RecordValue | undefined;
  for (const name of ["fleet", "routes"] as const) {
    const pin = object(sources[name]);
    const filename = text(pin["file"]);
    requireInput(/^[a-z0-9.-]+\.json$/.test(filename) && sha.test(text(pin["sha256"])) && revision.test(text(pin["revision"])), "INPUT_INCOMPATIBLE");
    const raw = await boundedFile(`${root}/${filename}`);
    requireInput(hash(raw) === pin["sha256"], "INPUT_INCOMPATIBLE");
    if (name === "routes") registry = object(JSON.parse(raw.toString("utf8")));
    pins.set(name, pin);
  }
  requireInput(registry?.["schema"] === "egohygiene.public-site-surface-registry/v1", "INPUT_INCOMPATIBLE");
  const surfaces = array(registry["surfaces"]);
  const modules: IntelligenceModule[] = Object.entries(moduleIssues).map(([id, issue]) => {
    const surface = surfaces.map(object).find((item) => item["id"] === id);
    requireInput(surface, "INPUT_INCOMPATIBLE");
    const path = text(object(object(surface["route_bindings"])["organization"])["canonical_route"]);
    requireInput(/^\/[a-z-]+\/$/.test(path) && (id !== "intelligence" || path === "/intelligence/"), "INPUT_INCOMPATIBLE");
    return { id, title: text(surface["title"]), description: text(surface["description"], 2048), path,
      issueUrl: `https://github.com/egohygiene/.github/issues/${issue}`, implemented: id === "intelligence" };
  });
  const fleet = pins.get("fleet")!;
  const routes = pins.get("routes")!;
  return { modules, provenance: { schema: fleetSchema, contractVersion: version,
    observatoryRevision: text(fleet["revision"]), schemaSha256: text(fleet["sha256"]),
    registryRevision: text(routes["revision"]), registrySha256: text(routes["sha256"]),
    registryUrl: `https://github.com/egohygiene/hygiene/blob/${text(routes["revision"])}/catalog/public-site-surface-registry.json` } };
}

function coverage(value: unknown, observation: string): IntelligenceClaim[] {
  const claims = object(value);
  exactKeys(claims, domains);
  const rules: Record<string, readonly [readonly string[], readonly string[], boolean]> = {
    uncollected: [["not_requested"], ["unknown"], false],
    unavailable: [["access_denied", "provider_unavailable", "legacy_unspecified"], ["unknown"], false],
    failed: [["collection_failed"], ["unknown"], false],
    partial: [["filtered", "truncated", "incomplete"], ["current", "stale"], true],
    observed_empty: [["complete"], ["current", "stale"], true],
    observed: [["complete"], ["current", "stale"], true],
    not_applicable: [["explicit_not_applicable"], ["not_applicable"], true],
  };
  return domains.map((domain) => {
    const claim = object(claims[domain]);
    exactKeys(claim, ["collection", "freshness", "reason", "observed_at"]);
    const collection = text(claim["collection"]);
    const freshness = text(claim["freshness"]);
    const reason = text(claim["reason"]);
    const rule = rules[collection];
    requireInput(rule && rule[0].includes(reason) && rule[1].includes(freshness));
    const observedAt = rule[2] ? instant(claim["observed_at"]) : null;
    requireInput(rule[2] ? observedAt! <= observation : claim["observed_at"] === null);
    return { domain, collection, freshness, reason, observedAt };
  });
}

function evidenceState(claims: readonly IntelligenceClaim[], stale: boolean): EvidenceState {
  if (claims.some((claim) => claim.collection === "failed")) return "error";
  if (stale || claims.some((claim) => claim.freshness === "stale")) return "stale";
  if (claims.every((claim) => claim.collection === "not_applicable")) return "not_applicable";
  if (claims.every((claim) => ["uncollected", "unavailable"].includes(claim.collection))) return "unknown";
  if (claims.some((claim) => ["partial", "uncollected", "unavailable"].includes(claim.collection))) return "partial";
  return "current";
}

function nowItem(raw: unknown, repository: string, kind: "entity" | "relationship"): IntelligenceItem {
  const value = object(raw);
  const subject = kind === "entity" ? value : object(value["source"]);
  requireInput(subject["repository"] === repository && subject["visibility"] === "public");
  const title = subject["title"] == null ? text(subject["key"]) : text(subject["title"]);
  const state = kind === "entity" ? text(subject["state"]) : text(value["type"]);
  const assertion = text(kind === "entity" ? subject["assertion"] : value["assertion"]);
  const freshness = text(value["freshness"]);
  requireInput(["authoritative", "inferred", "unknown"].includes(assertion) && ["current", "stale", "unknown", "not_applicable"].includes(freshness));
  if (kind === "relationship") {
    const target = object(value["target"]);
    requireInput(target["repository"] === repository && target["visibility"] === "public");
  }
  return { id: text(value["id"]), title, state, assertion, freshness,
    url: safeIntelligenceEvidenceUrl(subject["canonical_url"], repository) };
}

function nowView(value: unknown, repository: string, claims: readonly IntelligenceClaim[]): IntelligenceRepository["now"] {
  try {
    const view = object(value);
    const nested = coverage(view["collection_coverage"], "9999-12-31T23:59:59Z");
    requireInput(JSON.stringify(nested) === JSON.stringify(claims));
    const entities = (items: unknown) => {
      const selected = array(items, 100000).filter(declaredPublic);
      requireInput(selected.length <= 256);
      return selected.map((item) => nowItem(item, repository, "entity"));
    };
    const blockers = array(view["blockers"], 100000).filter((raw) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
      const relationship = raw as RecordValue;
      return declaredPublic(relationship["source"]) && declaredPublic(relationship["target"]);
    });
    requireInput(blockers.length <= 256);
    return { state: "available", currentFocus: entities(view["current_focus"]),
      nextReady: entities(view["next_ready"]),
      blockers: blockers.map((item) => nowItem(item, repository, "relationship")) };
  } catch { return { state: "unavailable", currentFocus: [], nextReady: [], blockers: [] }; }
}

/** A defensive presentation projection; upstream normalization remains Observatory's authority. */
function projectFleet(value: unknown, asOf: string, maximumAge: number): Pick<IntelligenceData, "state" | "code" | "snapshotId" | "observationWindow" | "repositories"> {
  const fleet = object(value);
  requireInput(fleet["schema"] === fleetSchema && fleet["contract_version"] === version, "INPUT_INCOMPATIBLE");
  requireInput(fleet["visibility"] === "public", "PUBLIC_REQUIRED");
  exactKeys(fleet, ["schema", "contract_version", "snapshot_id", "generator", "observation_window", "coverage", "repositories", "views", "extensions", "visibility"]);
  requireInput(Object.keys(object(fleet["extensions"])).length === 0);
  // Apply visibility before identities, counts, freshness windows or lookup.
  // Whole-fleet aggregates and digests can include excluded rows and are never
  // copied into this separately identified public presentation projection.
  const rawRows = array(fleet["repositories"], 100000).filter((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
    const reference = (raw as RecordValue)["repository"];
    return reference !== null && typeof reference === "object" && !Array.isArray(reference)
      && (reference as RecordValue)["visibility"] === "public";
  });
  requireInput(rawRows.length <= 1024);
  const occurrences = new Map<string, number>();
  for (const raw of rawRows) {
    const name = object(object(raw)["repository"])["repository"];
    if (typeof name === "string") occurrences.set(name, (occurrences.get(name) ?? 0) + 1);
  }
  const views = object(fleet["views"]);
  const publicNames = new Set([...occurrences.keys()].filter((name) => repositoryName.test(name)));
  const nowGroups = new Map<string, unknown>();
  try {
    for (const raw of array(object(views["now"])["repositories"], 100000)) {
      try {
        const group = object(raw);
        const rawName = group["repository"];
        if (typeof rawName !== "string" || !publicNames.has(rawName)) continue;
        const name = text(rawName);
        nowGroups.set(name, nowGroups.has(name) ? null : group["data"]);
      } catch { /* A malformed public module cannot remove unrelated groups. */ }
    }
  } catch { nowGroups.clear(); }
  let degraded = false;
  const repositories: IntelligenceRepository[] = [];
  for (const raw of rawRows) {
    try {
    const row = object(raw);
    const reference = object(row["repository"]);
    const name = text(reference["repository"]);
    requireInput(repositoryName.test(name) && reference["key"] === name && reference["kind"] === "repository" && reference["visibility"] === "public", "PUBLIC_REQUIRED");
    requireInput(occurrences.get(name) === 1);
    const sourceUrl = `https://github.com/${name}`;
    requireInput(reference["canonical_url"] === sourceUrl);
    const representedCommit = text(row["represented_commit"]);
    requireInput(revision.test(representedCommit));
    requireInput(row["snapshot_id"] === `${name}@${representedCommit}`);
    const snapshotDigest = text(row["snapshot_digest"]);
    requireInput(/^sha256:[a-f0-9]{64}$/.test(snapshotDigest));
    const observedAt = instant(row["observed_at"]);
    requireInput(observedAt <= asOf);
    const claims = coverage(object(row["coverage"])["domains"], observedAt);
    const stale = (Date.parse(asOf) - Date.parse(observedAt)) / 1000 > maximumAge;
    repositories.push({ name, title: reference["title"] == null ? name : text(reference["title"]), sourceUrl,
      commitUrl: `${sourceUrl}/commit/${representedCommit}`, representedCommit,
      snapshotId: text(row["snapshot_id"]), snapshotDigest, observedAt, coverage: claims,
      evidenceState: evidenceState(claims, stale), now: nowView(nowGroups.get(name), name, claims) });
    } catch { degraded = true; }
  }
  if (!repositories.length) return { state: "unavailable", code: "INPUT_INVALID", snapshotId: null,
    observationWindow: null, repositories: [] };
  const stale = repositories.some((row) => row.evidenceState === "stale");
  const publicTimes = repositories.map((row) => row.observedAt).sort();
  // This is explicitly the website's admitted presentation identity/window;
  // discarded rows and unused views never enter those public metadata values.
  const snapshotId = `sha256:${hash(JSON.stringify(repositories))}`;
  return { state: degraded ? "partial" : stale ? "stale" : "available", code: degraded ? "PARTIAL" : stale ? "STALE" : "READY", snapshotId,
    observationWindow: { earliest: publicTimes[0]!, latest: publicTimes.at(-1)! }, repositories };
}

export interface OrganizationIntelligenceOptions {
  readonly filename?: string;
  readonly expectedSha256?: string;
  readonly asOf?: string;
  readonly maximumAgeSeconds?: number;
  readonly snapshot?: OrganizationIntelligenceSnapshot;
}

export interface OrganizationIntelligenceSnapshot {
  readonly [snapshotBrand]: true;
  readonly moduleCode: string;
  readonly digest: string;
}

/** No VITE_ variable contains raw input paths or credentials. Missing input stays unavailable. */
export async function loadOrganizationIntelligence(options: Omit<OrganizationIntelligenceOptions, "snapshot"> = {}): Promise<OrganizationIntelligenceSnapshot> {
  const contract = await contracts();
  let data: IntelligenceData = { ...contract, state: "unavailable", code: "NOT_CONFIGURED", asOf: null,
    snapshotId: null, artifactSha256: null, observationWindow: null, repositories: [] };
  const filename = options.filename ?? process.env["EGOHYGIENE_INTELLIGENCE_FLEET"];
  if (filename) {
    try {
      const expected = options.expectedSha256 ?? process.env["EGOHYGIENE_INTELLIGENCE_SHA256"];
      const clock = options.asOf ?? process.env["EGOHYGIENE_INTELLIGENCE_AS_OF"];
      requireInput(expected && sha.test(expected) && clock, "REVIEW_BINDING_REQUIRED");
      const asOf = instant(clock);
      const maximumAge = options.maximumAgeSeconds ?? 86400;
      requireInput(Number.isSafeInteger(maximumAge) && maximumAge >= 1 && maximumAge <= 31536000);
      const content = await boundedFile(filename);
      requireInput(hash(content) === expected, "INPUT_INCOMPATIBLE");
      const projected = projectFleet(JSON.parse(content.toString("utf8")), asOf, maximumAge);
      // The local review checksum binds acquisition only. Unused view payloads
      // cannot perturb browser output through a raw whole-file checksum.
      data = { ...data, ...projected, asOf, artifactSha256: hash(JSON.stringify(projected)) };
    } catch (error) {
      const code = error instanceof FleetInputError ? error.code : "INPUT_UNAVAILABLE";
      data = { ...data, state: code === "INPUT_INCOMPATIBLE" ? "incompatible" : "error", code };
    }
  }
  // JSON text is data inside a trusted generated JS module, never literal HTML.
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  const moduleCode = `export const intelligenceData = ${serialized};\n`;
  return Object.freeze({ [snapshotBrand]: true as const, moduleCode, digest: hash(moduleCode) });
}

export function organizationIntelligence(options: OrganizationIntelligenceOptions = {}): Plugin {
  if (options.snapshot && options.snapshot[snapshotBrand] !== true) throw new Error("Intelligence snapshots must come from the admitted loader.");
  let snapshot = options.snapshot;
  return { name: "organization-intelligence", resolveId: (id) => id === moduleId ? resolvedModuleId : undefined,
    async load(id) {
      if (id !== resolvedModuleId) return undefined;
      snapshot ??= await loadOrganizationIntelligence(options);
      return { code: snapshot.moduleCode, map: { mappings: "" } };
    } };
}
