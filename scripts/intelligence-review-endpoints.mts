import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { isIP } from "node:net";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { endpointFragment } from "../apps/egohygiene.io/src/features/intelligence/endpoints/fragment.ts";
import type { EndpointData, EndpointGroup, EndpointRecord } from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";
import { decodeReviewJson } from "./intelligence-review-json.mts";

type Value = Record<string, unknown>;
type ReviewId = "audits" | "sanity";
const root = fileURLToPath(new URL("../contracts/organization-intelligence/reviews/", import.meta.url));
const hex = /^[a-f0-9]{64}$/;
const revision = /^[a-f0-9]{40}$/;
const unsafe = /(?:github_pat_|gh[pousr]_|(?:token|password|secret)\s*[:=]|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\/(?:home|Users|workspace|tmp)\/|[A-Za-z]:\\|\\\\)/i;
const requireInput: (value: unknown) => asserts value = (value) => { if (!value) throw new Error("Review input is incompatible"); };
const object = (value: unknown): Value => {
  requireInput(value !== null && typeof value === "object" && !Array.isArray(value));
  return value as Value;
};
const list = (value: unknown, maximum = 4096): unknown[] => {
  requireInput(Array.isArray(value) && value.length <= maximum); return value;
};
const text = (value: unknown, maximum = 2048): string => {
  requireInput(typeof value === "string" && value.length <= maximum && !/[\u0000-\u001f\u007f]/.test(value) && !unsafe.test(value));
  return value;
};
const prose = (value: unknown, maximum = 12000): string => {
  requireInput(typeof value === "string" && Array.from(value).length <= maximum
    && !/[\u0000-\u0008\u000b-\u001f\u007f]/.test(value) && !unsafe.test(value));
  return value;
};
const instant = (value: unknown): string => {
  const result = text(value, 20);
  requireInput(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result)
    && new Date(result).toISOString().replace(".000Z", "Z") === result);
  return result;
};
const hash = (value: string | Uint8Array): string => createHash("sha256").update(value).digest("hex");
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical((value as Value)[key])}`).join(",")}}`;
  return JSON.stringify(value);
};
const catalogSelectionSha256 = (row: Value): string => hash(`${JSON.stringify(JSON.parse(canonical([row])), null, 2)}\n`);

async function boundedFile(filename: string, maximum = 16 * 1024 * 1024): Promise<Buffer> {
  const absolute = resolve(filename);
  let current = absolute;
  while (current !== parse(current).root) {
    requireInput(!(await lstat(current)).isSymbolicLink()); current = dirname(current);
  }
  const info = await lstat(absolute);
  requireInput(info.isFile() && info.size <= maximum);
  const bytes = await readFile(absolute); requireInput(bytes.length <= maximum); return bytes;
}

function supportedSchema(value: unknown, depth = 0): void {
  requireInput(depth <= 64);
  if (typeof value === "boolean") return;
  const schema = object(value);
  const supported = new Set(["$schema", "$id", "$comment", "$defs", "$ref", "title", "description", "type", "const", "enum",
    "properties", "required", "additionalProperties", "propertyNames", "items", "minItems", "maxItems", "uniqueItems",
    "minLength", "maxLength", "pattern", "format", "minimum", "maximum", "allOf", "anyOf", "oneOf", "if", "then", "else"]);
  requireInput(Object.keys(schema).every((key) => supported.has(key)));
  if (schema["format"] !== undefined) requireInput(["date-time", "uri"].includes(String(schema["format"])));
  for (const name of ["properties", "$defs"]) if (schema[name] !== undefined)
    for (const child of Object.values(object(schema[name]))) supportedSchema(child, depth + 1);
  for (const name of ["items", "additionalProperties", "propertyNames", "if", "then", "else"])
    if (schema[name] !== undefined) supportedSchema(schema[name], depth + 1);
  for (const name of ["allOf", "anyOf", "oneOf"])
    for (const child of list(schema[name] ?? [], 32)) supportedSchema(child, depth + 1);
}

/** A bounded structural intersection of the exact owner schemas. Semantic
 * qualification remains with Observatory and its pinned Aether/Hygiene owners. */
function shape(value: unknown, schemaValue: unknown, document: Value, depth = 0): void {
  requireInput(depth <= 64);
  if (schemaValue === true) return;
  requireInput(schemaValue !== false);
  const schema = object(schemaValue);
  if (schema["$ref"] !== undefined) {
    const ref = text(schema["$ref"], 256); requireInput(/^#\/\$defs\/[A-Za-z0-9_-]+$/.test(ref));
    shape(value, object(document["$defs"])[ref.slice(8)], document, depth + 1); return;
  }
  if (schema["const"] !== undefined) requireInput(canonical(value) === canonical(schema["const"]));
  if (schema["enum"] !== undefined) requireInput(list(schema["enum"]).some((item) => canonical(item) === canonical(value)));
  for (const candidate of list(schema["allOf"] ?? [], 32)) shape(value, candidate, document, depth + 1);
  if (schema["if"] !== undefined) {
    let matches = false;
    try { shape(value, schema["if"], document, depth + 1); matches = true; } catch { /* Select the explicit else branch. */ }
    const branch = matches ? schema["then"] : schema["else"];
    if (branch !== undefined) shape(value, branch, document, depth + 1);
  }
  for (const mode of ["anyOf", "oneOf"] as const) if (schema[mode] !== undefined) {
    let matches = 0;
    for (const candidate of list(schema[mode], 32)) {
      try { shape(value, candidate, document, depth + 1); matches += 1; } catch { /* Alternative structural branch. */ }
    }
    requireInput(mode === "oneOf" ? matches === 1 : matches > 0);
  }
  if (schema["type"] !== undefined) {
    const types = Array.isArray(schema["type"]) ? schema["type"] : [schema["type"]];
    requireInput(types.some((type) => type === "null" ? value === null : type === "array" ? Array.isArray(value)
      : type === "object" ? value !== null && typeof value === "object" && !Array.isArray(value)
      : type === "integer" ? Number.isSafeInteger(value) : typeof value === type));
  }
  if (typeof value === "string") {
    requireInput((schema["minLength"] === undefined || Array.from(value).length >= Number(schema["minLength"]))
      && (schema["maxLength"] === undefined || Array.from(value).length <= Number(schema["maxLength"])));
    if (schema["pattern"] !== undefined) requireInput(new RegExp(text(schema["pattern"])).test(value));
    if (schema["format"] === "date-time") instant(value);
    if (schema["format"] === "uri") { const uri = new URL(value); requireInput(uri.protocol === "https:" && !uri.username && !uri.password); }
  }
  if (typeof value === "number") requireInput(Number.isFinite(value)
    && (schema["minimum"] === undefined || value >= Number(schema["minimum"]))
    && (schema["maximum"] === undefined || value <= Number(schema["maximum"])));
  if (Array.isArray(value)) {
    requireInput(value.length <= 16384 && (schema["minItems"] === undefined || value.length >= Number(schema["minItems"]))
      && (schema["maxItems"] === undefined || value.length <= Number(schema["maxItems"])));
    if (schema["uniqueItems"] === true) requireInput(new Set(value.map(canonical)).size === value.length);
    if (schema["items"] !== undefined) for (const item of value) shape(item, schema["items"], document, depth + 1);
  } else if (value !== null && typeof value === "object") {
    const record = object(value); const properties = object(schema["properties"] ?? {});
    for (const key of list(schema["required"] ?? [])) requireInput(Object.hasOwn(record, String(key)));
    for (const [key, item] of Object.entries(record)) {
      if (schema["propertyNames"] !== undefined) shape(key, schema["propertyNames"], document, depth + 1);
      if (Object.hasOwn(properties, key)) shape(item, properties[key], document, depth + 1);
      else {
        requireInput(schema["additionalProperties"] !== false);
        if (schema["additionalProperties"] !== undefined && schema["additionalProperties"] !== true)
          shape(item, schema["additionalProperties"], document, depth + 1);
      }
    }
  }
}

/** Inspect only source ownership until the entire repository projection is
 * admitted. Hidden owners cannot affect public IDs, counts or semantic hashes. */
function admitted(value: unknown, allowed: ReadonlySet<string>): boolean {
  let nodes = 0;
  const publicNames = new Set([...allowed].map((name) => name.toLowerCase()));
  const urlAdmitted = (value: string, authorityReference: boolean): boolean => {
    if (/%|\\|[\u0000-\u0020\u007f]/.test(value)) return false;
    try {
      const url = new URL(value); const host = url.hostname.toLowerCase().replace(/\.+$/, "");
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.search
        || !host.includes(".") || /(?:^|\.)(?:localhost|local|internal|test|invalid|example|onion|lan|home|corp|intranet|home\.arpa)$/.test(host)
        || isIP(host.replace(/^\[|\]$/g, "")) !== 0 || /(?:^|\.)(?:[0-9]+|0x[a-f0-9]+)$/i.test(host)) return false;
      if (["github.com", "api.github.com", "raw.githubusercontent.com"].includes(host)) {
        const parts = url.pathname.slice(1).split("/");
        if (parts.some((part) => part === "." || part === "..")) return false;
        if (host === "github.com" && parts.length === 1 && !url.hash) {
          return parts[0]?.toLowerCase() === "egohygiene"
            || authorityReference && /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(parts[0] ?? "");
        }
        if (host === "api.github.com" && parts.shift() !== "repos") return false;
        return parts.length >= 2 && publicNames.has(`${parts[0]}/${parts[1]}`.toLowerCase());
      }
      return true;
    } catch { return false; }
  };
  const visit = (item: unknown, depth: number, authorityReference = false): boolean => {
    nodes += 1;
    if (depth > 64 || nodes > 100000) return false;
    if (typeof item === "string") {
      if (unsafe.test(item) || /%[a-f0-9]{2}/i.test(item)) return false;
      for (const match of item.matchAll(/egohygiene\/[A-Za-z0-9_.-]+/gi)) {
        const name = match[0].replace(/\.+$/, "").replace(/\.git$/i, "").toLowerCase();
        if (!publicNames.has(name)) return false;
      }
      for (const match of item.matchAll(/https?:\/\/[^\s<>"'`\)\]]+/gi)) {
        if (!urlAdmitted(match[0].replace(/[.,;]+$/, ""), authorityReference)) return false;
      }
      return true;
    }
    if (Array.isArray(item)) return item.length <= 16384 && item.every((child) => visit(child, depth + 1));
    if (item !== null && typeof item === "object") {
      const row = item as Value;
      if (Object.hasOwn(row, "visibility") && row["visibility"] !== "public") return false;
      if (Object.hasOwn(row, "full_name") && !allowed.has(String(row["full_name"]))) return false;
      if (typeof row["repository"] === "string" && !allowed.has(row["repository"])) return false;
      return Object.entries(row).every(([key, child]) => visit(key, depth + 1)
        && visit(child, depth + 1, key === "reference" && row["kind"] === "human"));
    }
    return true;
  };
  return visit(value, 0);
}

function evidenceUrl(value: unknown, allowed: ReadonlySet<string>): string | null {
  if (typeof value !== "string" || value.length > 2048 || /[%\\\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password || url.search || url.href !== value) return null;
    const segments = url.pathname.split("/").slice(1);
    if (!allowed.has(segments.slice(0, 2).join("/")) || segments.some((part) => !part || part === "." || part === "..")
      || (url.hash && !/^#[A-Za-z0-9._:-]+$/.test(url.hash))) return null;
    if (segments.length === 2 && !url.hash) return value;
    return /^(?:(?:issues|pull)\/[1-9]\d*|commit\/[a-f0-9]{40}|(?:blob|tree)\/[a-f0-9]{40}\/[A-Za-z0-9._/-]+)$/.test(segments.slice(2).join("/")) ? value : null;
  } catch { return null; }
}

const detail = (label: string, value: unknown) => {
  const full = typeof value === "string" ? prose(value, 16 * 1024 * 1024) : canonical(value);
  const points = Array.from(full);
  return { label, value: points.length <= 12000 ? full : `${points.slice(0, 12000).join("")}… (presentation bounded)` };
};
const strings = (value: unknown, maximum = 256): string => list(value, maximum).map((item) => prose(item)).join("; ");
const profile = (value: unknown): string => { const row = object(value); return `${text(row["id"])}@${text(row["version"])}`; };
const sourceUrl = (value: unknown, allowed: ReadonlySet<string>): string | null => evidenceUrl(object(value)["uri"], allowed);

function record(repository: string, id: string, title: string, kind: string, state: string, assertion: string,
  freshness: string, url: string | null, details: EndpointRecord["details"], summary?: string): EndpointRecord {
  return { repository, id, key: id, title, kind, state, assertion, freshness, url, details, relations: [],
    anchorId: endpointFragment(id), ...(summary ? { summary } : {}) };
}

function auditRecords(value: Value, repository: string, allowed: ReadonlySet<string>): EndpointRecord[] {
  const records: EndpointRecord[] = [];
  for (const raw of list(value["runs"], 256)) {
    const run = object(raw); const audit = text(run["id"], 128); const id = `${repository}:audit:${audit}`;
    const scope = object(run["scope"]); const completion = object(run["completion"]);
    const profiles = object(run["profiles"]); const source = object(run["source"]);
    const url = sourceUrl(source["canonical_report"], allowed); const freshness = text(run["freshness"]);
    records.push(record(repository, id, audit, "audit run", text(completion["state"]), "authored scope completion", freshness, url, [
      detail("Requested profiles", list(profiles["requested"]).map(profile).join(", ")),
      detail("Resolved leaf profiles", list(profiles["resolved"]).map(profile).join(", ")),
      detail("Started", run["started_at"]), detail("Completed", run["completed_at"] ?? "unavailable"),
      detail("Represented revision", value["represented_commit"]), detail("Revision match", run["revision_status"]),
      detail("Scope", `${text(scope["kind"])}: ${list(scope["repositories"], 128).map((item) => text(object(item)["full_name"])).join(", ")}`),
      detail("Inspected", strings(scope["inspected"])), detail("Uninspected", strings(scope["uninspected"])),
      detail("Completion reason", completion["reason"]), detail("Continuation", completion["continuation"] ?? "none declared"),
      detail("Command states", run["command_states"]), detail("Limitations", strings(run["limitations"])),
      detail("Owner report SHA-256", source["owner_report_sha256"]),
      detail("Canonical report", source["canonical_report"]), detail("Normalized input provenance", source["input"]),
      detail("Prior audit references", run["prior_audits"]),
    ]));
    for (const rawFinding of list(run["findings"])) {
      const finding = object(rawFinding); const history = object(finding["history"]);
      records.push(record(repository, `${id}:finding:${text(finding["id"], 128)}`, prose(finding["title"]), text(finding["nature"]),
        text(finding["status"]), text(finding["evidence_classification"]), freshness, url, [
          detail("Audit", audit), detail("Classification", finding["classification"]), detail("Source profile", profile(finding["source_profile"])),
          detail("Severity", finding["severity"]), detail("Confidence", finding["confidence"]), detail("Area", finding["area"]),
          detail("Effort", finding["effort"]), detail("Impact", finding["impact"]),
          detail("Reported history delta", history["delta"]), detail("History evidence classification", history["evidence_classification"]),
          detail("Prior audit", history["prior_audit_id"] ?? "not compared"),
          detail("History proof references", finding["history_evidence"]),
          ...list(finding["evidence"], 128).map((item) => { const ref = object(item); return detail(`Evidence ${text(ref["id"])} (${text(ref["classification"])})`,
            `${text(ref["kind"])} · ${text(ref["repository"] ?? "unavailable")} · ${text(ref["revision"] ?? "unavailable")} · ${text(ref["uri"] ?? ref["path"] ?? "source reference unavailable")}`); }),
        ]));
    }
    for (const rawCandidate of list(run["candidate_issues"], 256)) {
      const candidate = object(rawCandidate); const candidateId = text(candidate["id"], 128);
      records.push(record(repository, `${id}:candidate:${candidateId}`, candidateId, "candidate issue", "suggested", "recommendation", freshness, url, [
        detail("Audit", audit), detail("Priority", candidate["priority"]), detail("Findings", strings(candidate["finding_ids"])),
        detail("Projection", candidate["projection"]), detail("Issue materialization", candidate["materialization"]),
      ]));
    }
  }
  return records;
}

function sanityRecords(value: Value, repository: string, allowed: ReadonlySet<string>): EndpointRecord[] {
  const records: EndpointRecord[] = [];
  const governanceDetails = (raw: unknown) => {
    const governance = object(raw);
    // This serializable Observatory profile never has authenticated human
    // source context. A JSON marker cannot become trusted ratification here.
    requireInput(governance["human_disposition"] === null && governance["human_evidence"] !== "verified"
      && governance["applicability_evidence"] !== "verified"
      && !["ratified", "ratified-with-notes", "revision-required", "rejected", "deferred", "not-applicable"].includes(String(governance["state"])));
    return [detail("Human governance state", governance["state"]), detail("Human evidence", governance["human_evidence"]),
      detail("Claimed human disposition", governance["claimed_human_disposition"] ?? "none supplied"),
      detail("Authenticated human disposition", "unavailable in this serializable source profile"),
      detail("Applicability", governance["applicability"]), detail("Claimed applicability", governance["claimed_applicability"]),
      detail("Applicability evidence", governance["applicability_evidence"]), detail("Progress", governance["progress"]),
      detail("Change inventory", governance["change_inventory"]), detail("Material changes", strings(governance["material_change_ids"], 1024)),
      detail("Unverified changes", strings(governance["unverified_change_ids"], 1024)), detail("Review due triggers", strings(governance["due_trigger_ids"], 1024))];
  };
  for (const raw of list(value["reviews"], 256)) {
    const review = object(raw); const reviewId = text(review["id"], 128); const id = `${repository}:sanity:${reviewId}`;
    const assessment = object(review["assessment"]); const execution = object(review["execution"]);
    const governance = object(review["governance"]); const recommendation = object(assessment["recommendation"]);
    const source = object(review["source"]); const input = object(source["input"]);
    const artifact = input["artifact"] === null ? null : object(input["artifact"]);
    const url = artifact ? evidenceUrl(artifact["url"], allowed) : null;
    const freshness = text(governance["freshness"]);
    const scope = object(review["scope"]);
    const references = new Map(list(review["sources"], 256).map((rawSource) => {
      const ref = object(rawSource); const sourceId = text(ref["id"], 128); const sourceRepository = text(ref["repository"], 200);
      return [sourceId, { label: `${text(ref["kind"])} source · ${text(ref["revision"])}`, target: {
        id: `${id}:source:${sourceId}`, repository: sourceRepository, key: sourceId, title: prose(ref["path"]),
        kind: text(ref["kind"]), state: "declared source", assertion: text(ref["origin"]), freshness: "unknown",
        url: evidenceUrl(ref["url"], allowed),
      } }] as const;
    }));
    const reviewRecord = record(repository, id, reviewId, "architecture review", text(execution["status"]), "reviewer assessment", freshness, url, [
      detail("Scope", `${text(scope["kind"])}: ${text(scope["key"])} (${strings(scope["repositories"])})`),
      detail("Generated", review["generated_at"]), detail("Completed", review["completed_at"] ?? "unavailable"),
      detail("Represented revision", value["represented_commit"]), detail("Revision match", review["revision_status"]),
      detail("Reviewer", review["reviewer"]), detail("Execution", execution),
      detail("Reviewer recommendation", recommendation["disposition"]), detail("Recommendation reason", recommendation["reason"]),
      ...governanceDetails(governance), detail("Assessment SHA-256 (source claim)", source["assessment_sha256"]),
      detail("Normalized input provenance", source["input"]),
    ], prose(assessment["explanation_summary"]));
    records.push({ ...reviewRecord, relations: [...references.values()] });
    for (const category of ["components", "relationships", "dimensions", "assumptions", "strengths", "concerns", "questions", "alternatives"] as const) {
      for (const rawItem of list(assessment[category], 256)) {
        const item = object(rawItem); const itemId = text(item["id"], 128);
        const title = prose(item["name"] ?? item["summary"] ?? item["statement"] ?? item["question"] ?? itemId, 6000);
        const state = text(item["status"] ?? item["category"] ?? item["basis"] ?? "authored");
        const details = Object.entries(item).filter(([key]) => !["id", "name", "summary", "statement", "question"].includes(key))
          .map(([key, field]) => detail(key.replaceAll("_", " "), field));
        const itemRecord = record(repository, `${id}:${category}:${itemId}`, title, `review ${category}`, state,
          "reviewer assessment", freshness, url, [detail("Review", reviewId), ...details]);
        const refs = list(item["evidence"], 64).map((key) => {
          const ref = references.get(text(key, 128)); requireInput(ref); return ref;
        });
        records.push({ ...itemRecord, relations: refs });
      }
    }
  }
  for (const raw of list(value["governance_records"], 256)) {
    const entry = object(raw); const governance = object(entry["governance"]);
    const source = object(entry["source"]); const artifact = source["artifact"] === null ? null : object(source["artifact"]);
    records.push(record(repository, `${repository}:sanity:governance:${text(entry["id"], 128)}`, text(entry["id"], 128),
      "independent governance source", text(governance["state"]), "source claim; human verification unavailable", text(governance["freshness"]),
      artifact ? evidenceUrl(artifact["url"], allowed) : null, [detail("Revision match", entry["revision_status"]), ...governanceDetails(governance),
        detail("Normalized input provenance", source)]));
  }
  return records;
}

export interface ReviewInputOptions {
  readonly auditsFilename?: string;
  readonly auditsExpectedSha256?: string;
  readonly sanityFilename?: string;
  readonly sanityExpectedSha256?: string;
  readonly asOf?: string;
}

/** Optional independent models never extend the nine-domain fleet contract. */
export async function loadReviewEndpoints(options: ReviewInputOptions): Promise<Partial<Record<ReviewId, EndpointData>>> {
  const result: Partial<Record<ReviewId, EndpointData>> = {};
  for (const id of ["audits", "sanity"] as const) {
    const filename = options[`${id}Filename`] ?? process.env[`EGOHYGIENE_INTELLIGENCE_${id.toUpperCase()}_FLEET`];
    const expected = options[`${id}ExpectedSha256`] ?? process.env[`EGOHYGIENE_INTELLIGENCE_${id.toUpperCase()}_SHA256`];
    if (!filename && !expected) continue;
    try {
      const asOf = instant(options.asOf ?? process.env["EGOHYGIENE_INTELLIGENCE_AS_OF"]);
      requireInput(filename && expected && hex.test(expected));
      const lock = object(decodeReviewJson(await boundedFile(`${root}/input-lock.json`, 65536)));
      requireInput(lock["schema"] === "egohygiene.website.review-input-lock/v1" && lock["contract_version"] === "1.0.0-alpha.1");
      const sources = object(lock["sources"]);
      const resource = async (name: string): Promise<Value> => {
        const pin = object(sources[name]); const file = text(pin["file"], 128);
        requireInput(/^[a-z0-9.-]+\.json$/.test(file) && hex.test(text(pin["sha256"])) && revision.test(text(pin["revision"])));
        const bytes = await boundedFile(`${root}/${file}`); requireInput(hash(bytes) === pin["sha256"]);
        return object(decodeReviewJson(bytes));
      };
      const catalog = await resource("catalog"); const rows = new Map<string, Value>();
      requireInput(catalog["schema"] === "egohygiene.repository-public-catalog/v1" && catalog["organization"] === "egohygiene");
      for (const item of list(catalog["repositories"], 1024)) {
        if (item === null || typeof item !== "object" || Array.isArray(item) || (item as Value)["visibility"] !== "public") continue;
        const row = object(item); rows.set(text(row["full_name"], 128), row);
      }
      const allowed = new Set(rows.keys()); const schema = await resource(id);
      supportedSchema(schema);
      const pin = object(sources[id]);
      const ownerPin = object(sources[`${id}-owner`]); const ownerLock = await resource(`${id}-owner`);
      const expectedOwner = object(pin["source_owner"]);
      requireInput(expectedOwner["owner"] === ownerLock["owner"] && expectedOwner["revision"] === ownerLock["revision"]
        && expectedOwner["lock_sha256"] === ownerPin["sha256"]);
      const bytes = await boundedFile(filename); requireInput(hash(bytes) === expected);
      const fleet = object(decodeReviewJson(bytes));
      requireInput(fleet["visibility"] === "public" && fleet["schema"] === `egohygiene.observatory.fleet-${id}/v1`
        && fleet["contract_version"] === "1.0.0-alpha.1" && instant(fleet["as_of"]) === asOf);
      const repositorySchema = object(object(schema["$defs"])[id === "audits" ? "repositoryModel" : "repository_model"]);
      const groups: EndpointGroup[] = []; const seen = new Set<string>();
      for (const raw of list(fleet["repositories"], 1024)) {
        if (raw === null || typeof raw !== "object" || Array.isArray(raw) || (raw as Value)["visibility"] !== "public") continue;
        const value = raw as Value; const identity = value["repository"];
        if (identity === null || typeof identity !== "object" || Array.isArray(identity) || (identity as Value)["visibility"] !== "public") continue;
        const repository = (identity as Value)["full_name"];
        if (typeof repository !== "string" || !allowed.has(repository) || !admitted(value, allowed)) continue;
        // Only now may this public repository's IDs, counts and digest be read.
        requireInput(!seen.has(repository)); seen.add(repository);
        shape(value, repositorySchema, schema);
        requireInput(canonical(value["source_owner"]) === canonical(pin["source_owner"]));
        const row = rows.get(repository)!;
        requireInput((identity as Value)["repository_id"] === row["repository_id"]
          && (identity as Value)["source_url"] === `https://github.com/${repository}`
          && instant(value["as_of"]) === asOf && revision.test(text(value["represented_commit"])));
        requireInput(canonical(value["admission"]) === canonical({ ...object(lock["admission"]), selected_sha256: catalogSelectionSha256(row) }));
        const { digest: seal, ...unsealed } = value;
        requireInput(typeof seal === "string" && hex.test(seal) && hash(canonical(unsealed)) === seal);
        const records = id === "audits" ? auditRecords(value, repository, allowed) : sanityRecords(value, repository, allowed);
        const stale = records.some((item) => item.freshness === "stale");
        groups.push({ repository, state: records.length ? stale ? "stale" : "available" : "unavailable",
          reason: records.length ? "Independent normalized authored evidence. Completion and recommendations do not establish approval or conformance."
            : "The admitted model supplies no authored evidence for this repository; no healthy or ratified state is inferred.",
          coverage: [], records: records.slice(0, 1024), truncated: records.length > 1024 });
      }
      groups.sort((left, right) => left.repository.localeCompare(right.repository, "en"));
      const projection = { id, groups };
      result[id] = { ...projection, state: groups.some((group) => group.records.length) ? groups.some((group) => group.state === "stale") ? "stale" : "available" : "unavailable",
        source: { schema: `egohygiene.observatory.fleet-${id}/v1`, contractVersion: "1.0.0-alpha.1", asOf,
          repository: text(pin["repository"]), revision: text(pin["revision"]), schemaSha256: text(pin["sha256"]),
          presentationSha256: hash(canonical(projection)), owner: canonical(pin["source_owner"]) } };
    } catch {
      // Isolate the two independent input boundaries. Diagnostics and rejected
      // raw IDs/hashes are acquisition details and never browser data.
      result[id] = { id, state: "incompatible", groups: [] };
    }
  }
  return result;
}
