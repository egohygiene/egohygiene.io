import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { isIP } from "node:net";
import { dirname, parse, resolve } from "node:path";
import type { IntelligencePublication, IntelligenceRepository } from "../apps/egohygiene.io/src/features/intelligence/types.ts";
import { unavailablePublication } from "../apps/egohygiene.io/src/features/intelligence/publication.ts";
import { instant, list, plain, text } from "./intelligence-endpoint-input.mts";

const schema = "egohygiene.website.repository-publications/v1";
const fullRevision = /^[a-f0-9]{40}$/;
const digest = /^[a-f0-9]{64}$/;

export interface RepositoryPublicationOptions {
  readonly filename?: string;
  readonly expectedSha256?: string;
  readonly asOf: string | null;
  /** Canonical repository-profile bindings from the already pinned Hygiene registry. */
  readonly surfaces: Readonly<Record<string, string>>;
}

function exact(value: Record<string, unknown>, required: readonly string[], optional: readonly string[] = []) {
  if (required.some((key) => !Object.hasOwn(value, key)) || Object.keys(value).some((key) => !required.includes(key) && !optional.includes(key))) throw new TypeError("PUBLICATION_INPUT");
}

async function boundedPublicationFile(filename: string): Promise<Buffer> {
  const absolute = resolve(filename);
  for (let current = absolute; current !== parse(current).root; current = dirname(current)) {
    if ((await lstat(current)).isSymbolicLink()) throw new TypeError("PUBLICATION_INPUT");
  }
  const info = await lstat(absolute);
  if (!info.isFile() || info.size > 1024 * 1024) throw new TypeError("PUBLICATION_INPUT");
  const content = await readFile(absolute);
  if (content.length > 1024 * 1024) throw new TypeError("PUBLICATION_INPUT");
  return content;
}

function publicationBase(value: unknown): URL {
  const input = text(value, 2048);
  if (/[%\\\s]/.test(input)) throw new TypeError("PUBLICATION_INPUT");
  const url = new URL(input);
  const hostname = url.hostname;
  if (url.protocol !== "https:" || url.port || url.username || url.password || url.search || url.hash || url.href !== input
      || isIP(hostname) || hostname.length > 253 || !hostname.includes(".")
      || hostname.split(".").some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))
      || /(?:^|\.)(?:localhost|local|internal|test|invalid|example)$/.test(hostname)
      || !/^\/(?:[A-Za-z0-9._-]+\/)*intelligence\/$/.test(url.pathname)
      || url.pathname.split("/").some((part) => part === "." || part === "..")
      || (url.origin === "https://egohygiene.io" && url.pathname === "/intelligence/")) throw new TypeError("PUBLICATION_INPUT");
  return url;
}

function provenanceUrl(value: unknown, repository: string, sourceCommit: string, configuration: boolean): string {
  const input = text(value, 2048);
  if (/[%\\\s]/.test(input)) throw new TypeError("PUBLICATION_INPUT");
  const url = new URL(input);
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password || url.search || url.hash || url.href !== input) throw new TypeError("PUBLICATION_INPUT");
  const prefix = `/${repository}/`;
  if (!url.pathname.startsWith(prefix)) throw new TypeError("PUBLICATION_INPUT");
  const path = url.pathname.slice(prefix.length);
  if (path.split("/").some((part) => !part || part === "." || part === "..")) throw new TypeError("PUBLICATION_INPUT");
  const immutable = path.startsWith(`blob/${sourceCommit}/`) && /^blob\/[a-f0-9]{40}\/[A-Za-z0-9._/-]+$/.test(path);
  if (!immutable && (configuration || !/^actions\/runs\/[1-9]\d*(?:\/attempts\/[1-9]\d*)?$/.test(path))) throw new TypeError("PUBLICATION_INPUT");
  return input;
}

function admit(value: Record<string, unknown>, repository: IntelligenceRepository, options: RepositoryPublicationOptions): IntelligencePublication {
  exact(value, ["repository", "visibility", "intelligence_base_url", "surfaces", "source_commit", "generator_commit", "observed_at", "configuration_url", "evidence_url"], ["cname_url"]);
  const sourceCommit = text(value["source_commit"], 40), generatorCommit = text(value["generator_commit"], 40);
  if (!fullRevision.test(sourceCommit) || !fullRevision.test(generatorCommit)) throw new TypeError("PUBLICATION_INPUT");
  const observedAt = instant(value["observed_at"]);
  if (!options.asOf || observedAt > options.asOf) throw new TypeError("PUBLICATION_INPUT");
  const base = publicationBase(value["intelligence_base_url"]);
  const requested = list(value["surfaces"], 64);
  const seen = new Set<string>();
  const routes: Record<string, string> = {};
  for (const raw of requested) {
    const surface = text(raw, 128);
    if (seen.has(surface)) throw new TypeError("PUBLICATION_INPUT");
    seen.add(surface);
    const canonical = options.surfaces[surface];
    if (!canonical || !canonical.startsWith("/intelligence/") || !/^\/intelligence\/(?:[a-z-]+\/)*$/.test(canonical)) throw new TypeError("PUBLICATION_INPUT");
    const destination = new URL(canonical.slice("/intelligence/".length), base);
    if (destination.origin !== base.origin || !destination.pathname.startsWith(base.pathname)) throw new TypeError("PUBLICATION_INPUT");
    routes[surface] = destination.href;
  }
  if (!routes["intelligence"] || routes["intelligence"] !== base.href) throw new TypeError("PUBLICATION_INPUT");
  return { state: "available", baseUrl: base.href, routes, sourceCommit, generatorCommit, observedAt,
    configurationUrl: provenanceUrl(value["configuration_url"], repository.name, sourceCommit, true),
    evidenceUrl: provenanceUrl(value["evidence_url"], repository.name, sourceCommit, false),
    cnameUrl: value["cname_url"] == null ? null : provenanceUrl(value["cname_url"], repository.name, sourceCommit, true),
    sourceMatchesSnapshot: sourceCommit === repository.representedCommit };
}

/** The existing admitted fleet roster is the only source of repository identity. */
export async function attachRepositoryPublications(repositories: readonly IntelligenceRepository[], options: RepositoryPublicationOptions): Promise<readonly IntelligenceRepository[]> {
  const unavailable = () => repositories.map((repository) => ({ ...repository, publication: unavailablePublication() }));
  if (!repositories.length || !options.filename) return unavailable();
  let rows: unknown[];
  try {
    if (!options.expectedSha256 || !digest.test(options.expectedSha256)) return unavailable();
    const content = await boundedPublicationFile(options.filename);
    // Raw checksums bind local acquisition only; excluded catalog entries never
    // influence a browser digest, count, diagnostic or canonical destination.
    if (createHash("sha256").update(content).digest("hex") !== options.expectedSha256) return unavailable();
    const value = plain(JSON.parse(content.toString("utf8")));
    exact(value, ["schema", "visibility", "publications"]);
    if (value["schema"] !== schema || value["visibility"] !== "public") return unavailable();
    rows = list(value["publications"], 100000);
  } catch { return unavailable(); }
  const allowed = new Set(repositories.map((repository) => repository.name));
  const selected = new Map<string, Record<string, unknown> | null>();
  for (const raw of rows) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const row = raw as Record<string, unknown>;
    if (row["visibility"] !== "public" || typeof row["repository"] !== "string" || !allowed.has(row["repository"])) continue;
    selected.set(row["repository"], selected.has(row["repository"]) ? null : row);
  }
  return repositories.map((repository) => {
    const value = selected.get(repository.name);
    if (value === undefined) return { ...repository, publication: unavailablePublication() };
    if (value === null) return { ...repository, publication: unavailablePublication("incompatible") };
    try { return { ...repository, publication: admit(value, repository, options) }; }
    catch { return { ...repository, publication: unavailablePublication("incompatible") }; }
  });
}
