import type { EndpointRecord, EndpointReference } from "../apps/egohygiene.io/src/features/intelligence/endpoints/types.ts";

export interface EndpointProjectionContext {
  readonly repository: string;
  readonly allowedRepositories: ReadonlySet<string>;
}
export function plain(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("ENDPOINT_INPUT");
  return value as Record<string, unknown>;
}
export function list(value: unknown, maximum = 4096): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new TypeError("ENDPOINT_INPUT");
  return value;
}
export function text(value: unknown, maximum = 2048): string {
  if (typeof value !== "string" || !value || value.length > maximum || /[\u0000-\u001f\u007f]/.test(value)
    || /(?:github_pat_|gh[pousr]_|(?:token|password|secret)\s*[:=]|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\/(?:home|Users|workspace|tmp)\/|[A-Za-z]:\\|\\\\)/i.test(value)) throw new TypeError("ENDPOINT_INPUT");
  return value;
}
export function optionalText(value: unknown, maximum = 2048): string | null {
  return value === null || value === undefined || value === "" ? null : text(value, maximum);
}
export function instant(value: unknown): string {
  const result = text(value, 20);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result) || new Date(result).toISOString().replace(".000Z", "Z") !== result) throw new TypeError("ENDPOINT_INPUT");
  return result;
}
export function evidenceUrl(value: unknown, repository: string): string | null {
  if (typeof value !== "string" || value.length > 1024 || /[%\\\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password || url.search || url.href !== value) return null;
    if (url.hash && !/^#(?:L\d+(?:-L\d+)?|[a-zA-Z0-9_-]+)$/.test(url.hash)) return null;
    if (url.pathname === `/${repository}` && !url.hash) return value;
    if (!url.pathname.startsWith(`/${repository}/`)) return null;
    const path = url.pathname.slice(repository.length + 2);
    if (path.split("/").some((part) => !part || part === "." || part === "..")) return null;
    return /^(?:(?:issues|pull)\/[1-9]\d*|commit\/[a-f0-9]{40}|(?:blob|tree)\/[a-f0-9]{40}\/[A-Za-z0-9._/-]+|releases(?:\/tag\/[A-Za-z0-9._-]+)?)$/.test(path) ? value : null;
  } catch { return null; }
}
/** Filter protected endpoints before inspecting titles, states, links or IDs. */
export function reference(value: unknown, context: EndpointProjectionContext): EndpointReference | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("ENDPOINT_INPUT");
  const item = value as Record<string, unknown>;
  if (item["visibility"] !== "public" || typeof item["repository"] !== "string" || !context.allowedRepositories.has(item["repository"])) return null;
  const repository = item["repository"];
  const assertion = text(item["assertion"]);
  const freshness = text(item["freshness"]);
  if (!["authoritative", "inferred", "unknown"].includes(assertion) || !["current", "stale", "unknown", "not_applicable"].includes(freshness)) throw new TypeError("ENDPOINT_INPUT");
  return { id: text(item["id"], 512), repository, key: text(item["key"], 512),
    title: optionalText(item["title"]) ?? text(item["key"], 512), kind: text(item["kind"], 128),
    state: text(item["state"], 128), assertion, freshness, url: evidenceUrl(item["canonical_url"], repository) };
}
export function record(value: unknown, context: EndpointProjectionContext): EndpointRecord | null {
  const item = reference(value, context);
  return item && item.repository === context.repository ? { ...item, details: [], relations: [] } : null;
}
