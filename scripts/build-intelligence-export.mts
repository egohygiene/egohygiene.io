import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, parse, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { build } from "vite";

import { intelligenceEndpointRoutes, intelligencePathFile } from "../apps/egohygiene.io/src/content/intelligence-routes.ts";
import { decodeReviewJson } from "./intelligence-review-json.mts";
import { loadOrganizationIntelligence } from "./vite-organization-intelligence.mts";
import type { OrganizationIntelligenceOptions } from "./vite-organization-intelligence.mts";
import { createIntelligenceExportConfig } from "../apps/egohygiene.io/vite.intelligence-export.config.ts";

type RecordValue = Record<string, unknown>;
interface Target { readonly origin: string; readonly base_path: string }
interface ExportRoute { readonly id: string; readonly path: string; readonly file: string; readonly canonical_path: string }
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const entryRoot = join(repositoryRoot, "apps/egohygiene.io/src/features/intelligence/export");
const contractRoot = join(repositoryRoot, "contracts/organization-intelligence");
const version = "1.0.0-alpha.1";
const maximumFile = 16 * 1024 * 1024;
const maximumTotal = 64 * 1024 * 1024;
const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'">`;
const sha = /^[a-f0-9]{64}$/;
const requireInput: (condition: unknown) => asserts condition = (condition) => { if (!condition) throw new Error("Intelligence export input is incompatible"); };
const object = (value: unknown): RecordValue => {
  requireInput(value !== null && typeof value === "object" && !Array.isArray(value)); return value as RecordValue;
};
const closed = (value: unknown, keys: readonly string[]): RecordValue => {
  const result = object(value); requireInput(Object.keys(result).length === keys.length && keys.every((key) => Object.hasOwn(result, key))); return result;
};
const text = (value: unknown): string => { requireInput(typeof value === "string" && value.length <= 4096 && !/[\u0000-\u001f\u007f]/.test(value)); return value; };
const hash = (content: string | Uint8Array): string => createHash("sha256").update(content).digest("hex");
const sorted = (value: unknown): unknown => Array.isArray(value) ? value.map(sorted)
  : value !== null && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([key, item]) => [key, sorted(item)])) : value;
const bytes = (value: unknown): string => `${JSON.stringify(sorted(value), null, 2)}\n`;
const escape = (value: string): string => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const inside = (path: string, root: string): boolean => { const child = relative(root, path); return child === "" || !child.startsWith("..") && !isAbsolute(child); };

async function noSymlinks(path: string, existing = true): Promise<void> {
  let current = existing ? resolve(path) : dirname(resolve(path));
  while (current !== parse(current).root) { requireInput(!(await lstat(current)).isSymbolicLink()); current = dirname(current); }
}
async function readBounded(path: string, maximum = maximumFile): Promise<Buffer> {
  await noSymlinks(path); const stat = await lstat(path); requireInput(stat.isFile() && stat.size <= maximum);
  const content = await readFile(path); requireInput(content.length <= maximum); return content;
}
function relativeInput(value: unknown): string {
  const path = text(value);
  requireInput(/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(path) && path.length <= 240
    && path.split("/").every((part) => part && ![".", "..", ".git"].includes(part)));
  return path;
}
function targetInput(value: unknown): Target {
  const target = closed(value, ["origin", "base_path"]); const origin = text(target["origin"]); const basePath = text(target["base_path"]);
  const url = new URL(origin); const host = url.hostname;
  requireInput(url.protocol === "https:" && url.origin === origin && !url.username && !url.password && !url.port
    && origin.length <= 256 && /^[a-z0-9.-]+$/.test(host) && host.includes(".") && !host.endsWith(".")
    && host.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))
    && !/(?:^|\.)(?:localhost|local|internal|test|invalid|example|onion|home|lan|corp|intranet|home\.arpa)$/.test(host)
    && isIP(host) === 0 && !/(?:^|\.)(?:[0-9]+|0x[a-f0-9]+)$/i.test(host));
  requireInput((basePath === "/.github/" || /^\/(?:[a-z0-9][a-z0-9._-]*\/)*$/.test(basePath))
    && basePath.split("/").every((part) => ![".", "..", ".git"].includes(part)));
  return { origin, base_path: basePath };
}
const mounted = (target: Target, path: string): string => `${target.base_path.replace(/\/$/, "")}${path}`;
function routes(): ExportRoute[] {
  return [
    { id: "home", path: "/", file: "index.html", canonical_path: "/intelligence/" },
    { id: "intelligence", path: "/intelligence/", file: "intelligence/index.html", canonical_path: "/intelligence/" },
    ...intelligenceEndpointRoutes.flatMap((route) => [route.path, ...route.aliases].map((path) => ({
      id: route.id, path, file: intelligencePathFile(path), canonical_path: route.path,
    }))),
  ].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}

async function inputs(request: RecordValue, inputRoot: string): Promise<OrganizationIntelligenceOptions> {
  const models = closed(request["models"], ["core", "audits", "sanity"]);
  const clocks = request["module_as_of"] === undefined ? null
    : closed(request["module_as_of"], ["core", "audits", "sanity"]);
  if (clocks) for (const id of ["core", "audits", "sanity"] as const) {
    const clock = clocks[id];
    requireInput(models[id] === null ? clock === null : typeof clock === "string"
      && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(clock)
      && new Date(clock).toISOString().replace(".000Z", "Z") === clock
      && clock <= text(request["as_of"]));
  }
  const options: Record<string, unknown> = { asOf: clocks?.["core"] ?? text(request["as_of"]), filename: "", expectedSha256: "",
    artifactManifestFilename: "", artifactManifestExpectedSha256: "", publicationsFilename: "", publicationsExpectedSha256: "",
    auditsFilename: "", auditsExpectedSha256: "", sanityFilename: "", sanityExpectedSha256: "" };
  if (clocks) {
    options["auditsAsOf"] = clocks["audits"] ?? text(request["as_of"]);
    options["sanityAsOf"] = clocks["sanity"] ?? text(request["as_of"]);
  }
  const bind = async (value: unknown): Promise<readonly [string, string]> => {
    const binding = closed(value, ["path", "sha256"]); const path = resolve(inputRoot, relativeInput(binding["path"]));
    const checksum = text(binding["sha256"]); requireInput(inside(path, inputRoot) && sha.test(checksum));
    const content = await readBounded(path); requireInput(hash(content) === checksum); decodeReviewJson(content);
    return [path, checksum];
  };
  if (models["core"] !== null) {
    const core = closed(models["core"], ["fleet", "manifest", "publications"]);
    [options["filename"], options["expectedSha256"]] = await bind(core["fleet"]);
    if (core["manifest"] !== null) [options["artifactManifestFilename"], options["artifactManifestExpectedSha256"]] = await bind(core["manifest"]);
    if (core["publications"] !== null) [options["publicationsFilename"], options["publicationsExpectedSha256"]] = await bind(core["publications"]);
  }
  for (const id of ["audits", "sanity"] as const) if (models[id] !== null)
    [options[`${id}Filename`], options[`${id}ExpectedSha256`]] = await bind(models[id]);
  return options as OrganizationIntelligenceOptions;
}

function head(title: string, description: string, canonical: string): string {
  return `<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${escape(canonical)}">`;
}
function redirect(target: Target, canonicalPath: string): string {
  const destination = `${target.origin}${mounted(target, canonicalPath)}`;
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8">${policy}${head("Organization Intelligence", "Open the canonical organization Intelligence view.", destination)}<meta http-equiv="refresh" content="0; url=${escape(destination)}"></head><body><p>This route moved to <a href="${escape(destination)}">Organization Intelligence</a>.</p></body></html>\n`;
}
async function inventory(site: string): Promise<{ path: string; sha256: string; size_bytes: number }[]> {
  const files: { path: string; sha256: string; size_bytes: number }[] = []; let total = 0;
  const visit = async (directory: string) => {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      requireInput(!item.isSymbolicLink()); const path = join(directory, item.name);
      if (item.isDirectory()) await visit(path);
      else {
        requireInput(item.isFile() && files.length < 256); const content = await readBounded(path); total += content.length;
        requireInput(total <= maximumTotal);
        files.push({ path: relative(site, path).split("\\").join("/"), sha256: hash(content), size_bytes: content.length });
      }
    }
  };
  await visit(site); return files.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
}

/** Explicit local producer API. This builds review bytes, never publishes. */
export async function buildIntelligenceExport(arguments_: string[] = []): Promise<void> {
  const { values } = parseArgs({ args: arguments_, options: {
    request: { type: "string" }, "request-sha256": { type: "string" }, "input-root": { type: "string" }, output: { type: "string" },
    "selection-evidence": { type: "string" },
  } });
  requireInput(values.request && values["request-sha256"] && sha.test(values["request-sha256"]) && values.output);
  const requestPath = resolve(values.request); const rawRequest = await readBounded(requestPath, 65536);
  requireInput(hash(rawRequest) === values["request-sha256"]);
  const parsed = object(decodeReviewJson(rawRequest));
  const request = closed(parsed, ["schema", "contract_version", "target", "as_of", "models",
    ...(Object.hasOwn(parsed, "module_as_of") ? ["module_as_of"] : [])]);
  requireInput(request["schema"] === "egohygiene.website.organization-intelligence-export-request/v1" && request["contract_version"] === version);
  const target = targetInput(request["target"]); const asOf = text(request["as_of"]);
  requireInput(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(asOf) && new Date(asOf).toISOString().replace(".000Z", "Z") === asOf);
  const inputRoot = resolve(values["input-root"] ?? dirname(requestPath)); await noSymlinks(inputRoot);
  const output = resolve(values.output); await noSymlinks(output, false);
  requireInput(!inside(output, repositoryRoot) && !inside(repositoryRoot, output)
    && !inside(requestPath, output) && !inside(inputRoot, output));
  try { await lstat(output); throw new Error("Output already exists"); } catch (error) { requireInput((error as NodeJS.ErrnoException).code === "ENOENT"); }
  const selectionEvidence = values["selection-evidence"] ? resolve(values["selection-evidence"]) : null;
  if (selectionEvidence) {
    await noSymlinks(selectionEvidence, false);
    requireInput(!inside(selectionEvidence, output) && !inside(selectionEvidence, repositoryRoot) && selectionEvidence !== requestPath);
    try { await lstat(selectionEvidence); throw new Error("Selection evidence already exists"); }
    catch (error) { requireInput((error as NodeJS.ErrnoException).code === "ENOENT"); }
  }
  const producerRevision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" }).trim();
  requireInput(/^[a-f0-9]{40}$/.test(producerRevision)
    && execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: repositoryRoot, encoding: "utf8" }).trim() === "");
  const lock = object(decodeReviewJson(await readBounded(join(contractRoot, "reviews/input-lock.json"))));
  const catalogPin = object(object(lock["sources"])["catalog"]);
  const catalogRaw = await readBounded(join(contractRoot, "reviews", text(catalogPin["file"])));
  requireInput(hash(catalogRaw) === catalogPin["sha256"]);
  const catalog = object(decodeReviewJson(catalogRaw)); requireInput(Array.isArray(catalog["repositories"]));
  const publicRows = new Map<string, RecordValue>();
  for (const raw of catalog["repositories"]) if (raw && typeof raw === "object" && !Array.isArray(raw) && (raw as RecordValue)["visibility"] === "public") {
    const row = object(raw); publicRows.set(text(row["full_name"]), row);
  }
  const routeInventory = routes(); const fixture = object(decodeReviewJson(await readBounded(join(contractRoot, "export/organization-routes.v1.json"))));
  requireInput(bytes(routeInventory) === bytes(fixture["routes"]));
  const snapshot = await loadOrganizationIntelligence({ ...await inputs(request, inputRoot), allowedRepositories: new Set(publicRows.keys()) });
  const data = snapshot.presentation;
  const selectedNames = [...new Set([...data.repositories.map((row) => row.name), ...Object.values(data.endpoints ?? {}).flatMap((endpoint) => endpoint.groups.map((group) => group.repository))])].sort();
  requireInput(selectedNames.every((name) => publicRows.has(name)));
  const selected = selectedNames.map((name) => publicRows.get(name)!);
  const model = (id: "core" | "audits" | "sanity") => {
    const source = id === "core" ? null : data.endpoints?.[id]?.source;
    const checksum = id === "core" ? data.snapshotId ? data.artifactSha256 : null : source?.presentationSha256 ?? null;
    return { state: checksum ? "available" : "unavailable", schema: id === "core" ? "egohygiene.observatory.repository-intelligence-fleet/v1" : `egohygiene.observatory.fleet-${id}/v1`,
      contract_version: id === "core" ? "1.0.0-alpha.2" : version, presentation_sha256: checksum };
  };
  const temporary = await mkdtemp(join(tmpdir(), "intelligence-export-render-"));
  let ownsOutput = false;
  try {
    await mkdir(output); ownsOutput = true; const site = join(output, "site");
    await build(createIntelligenceExportConfig(target, snapshot, site));
    await build({ ...createIntelligenceExportConfig(target, snapshot, site), ssr: { noExternal: true }, build: {
      outDir: temporary, ssr: join(entryRoot, "server.tsx"), sourcemap: false, assetsInlineLimit: 0,
      rolldownOptions: { output: { entryFileNames: "entry-server.mjs" } },
    } });
    const renderer = await import(pathToFileURL(join(temporary, "entry-server.mjs")).href) as { renderIntelligenceExport(path: string): string };
    const template = (await readBounded(join(site, "index.html"))).toString("utf8");
    requireInput(template.includes("<!-- intelligence-export-head -->") && template.includes('<div id="root"></div>'));
    for (const route of routeInventory) {
      const destination = join(site, route.file); await mkdir(dirname(destination), { recursive: true });
      if (route.path !== route.canonical_path) await writeFile(destination, redirect(target, route.canonical_path));
      else {
        const entry = intelligenceEndpointRoutes.find((item) => item.id === route.id);
        const title = entry?.title ?? "Organization Intelligence";
        const description = entry?.question ?? "Explore admitted public repository evidence and its canonical owners.";
        const markup = renderer.renderIntelligenceExport(route.path);
        const html = template.replace("<!-- intelligence-export-head -->", head(title, description, `${target.origin}${mounted(target, route.path)}`))
          .replace('<div id="root"></div>', `<div id="root" data-intelligence-export-path="${escape(mounted(target, route.path))}">${markup}</div>`);
        requireInput(Buffer.byteLength(html) <= maximumFile); await writeFile(destination, html);
      }
    }
    await writeFile(join(site, "404.html"), `<!doctype html><html lang="en"><head><meta charset="UTF-8">${policy}<title>Intelligence route unavailable</title><meta name="robots" content="noindex,follow"></head><body><h1>Intelligence route unavailable</h1><p><a href="${escape(`${target.origin}${mounted(target, "/intelligence/")}`)}">Open Organization Intelligence</a>.</p></body></html>\n`);
    await writeFile(join(site, ".nojekyll"), "");
    const manifest = { schema: "egohygiene.website.organization-intelligence-export/v1", contract_version: version, visibility: "public",
      producer: { repository: "egohygiene/egohygiene.io", revision: producerRevision }, target, as_of: asOf,
      scope: { kind: "organization", repositories: selectedNames, admission: { ...object(lock["admission"]), selected_sha256: hash(bytes(selected)) } },
      models: { core: model("core"), audits: model("audits"), sanity: model("sanity") }, routes: routeInventory, files: await inventory(site), publication: "review-only" };
    await writeFile(join(output, "export-manifest.json"), bytes(manifest));
    if (selectionEvidence) {
      const states = new Set(["available", "partial", "stale", "unavailable", "incompatible", "error"]);
      const models = Object.fromEntries((["core", "audits", "sanity"] as const).map((id) => {
        const state = id === "core" ? manifest.models.core.state === "available" ? data.state : "unavailable"
          : data.endpoints?.[id]?.state ?? "unavailable";
        return [id, { presentation_state: states.has(state) ? state : "unavailable" }];
      }));
      await writeFile(selectionEvidence, bytes({ export_manifest_sha256: hash(bytes(manifest)), models }), { flag: "wx" });
    }
  } catch (error) { if (ownsOutput) await rm(output, { recursive: true, force: true }); throw error; }
  finally { await rm(temporary, { recursive: true, force: true }); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildIntelligenceExport(process.argv.slice(2));
