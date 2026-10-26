import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { PageMetadataValue } from "../apps/egohygiene.io/src/content/publication-types.ts";

export interface PublicPage {
  readonly pathname: string;
  readonly metadata: PageMetadataValue;
}

export interface RenderedPage {
  readonly markup: string;
  readonly metadata: PageMetadataValue;
  readonly status: number;
}

export interface PublicRenderer {
  readonly publicOrigin: string;
  readonly listPublicPages: () => readonly PublicPage[];
  readonly renderPublicPage: (pathname: string) => Promise<RenderedPage>;
}

const headStart = "<!-- public-page-head:start -->";
const headEnd = "<!-- public-page-head:end -->";
const rootPlaceholder = '<div id="root"></div>';
const missingPath = "/__not-found__";

export function escapeMarkup(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

function absolutePublicUrl(value: string, origin: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.origin === origin &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.href === value
    );
  } catch {
    return false;
  }
}

export function validatePublicPages(pages: readonly PublicPage[], origin: string): PublicPage[] {
  if (new URL(origin).origin !== origin || !origin.startsWith("https://"))
    throw new Error("Public rendering requires the configured HTTPS origin without a path.");
  const paths = new Set<string>();
  for (const page of pages) {
    const { pathname, metadata } = page;
    if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(pathname))
      throw new Error(`Invalid static route path: ${pathname}`);
    if (/^\/(?:assets(?:\/|$)|store\/preview(?:\/|$))/.test(pathname))
      throw new Error(`Reserved static route path: ${pathname}`);
    if (paths.has(pathname)) throw new Error(`Duplicate static route path: ${pathname}`);
    paths.add(pathname);
    if (!metadata.title.trim() || !metadata.description.trim() || !metadata.reason.trim())
      throw new Error(`Missing page metadata: ${pathname}`);
    if (
      metadata.canonical !== new URL(pathname, origin).href ||
      !absolutePublicUrl(metadata.canonical, origin)
    )
      throw new Error(`Canonical identity does not match route: ${pathname}`);
    if (metadata.robots !== (metadata.indexable ? "index,follow" : "noindex,follow"))
      throw new Error(`Conflicting publication metadata: ${pathname}`);
    if (metadata.ogType !== "website") throw new Error(`Unsupported social type: ${pathname}`);
    if (
      metadata.image &&
      (!absolutePublicUrl(metadata.image.url, origin) || !metadata.image.alt.trim())
    )
      throw new Error(`Invalid approved social image: ${pathname}`);
  }
  if (!paths.has("/")) throw new Error("Static route inventory must include the homepage.");
  return [...pages].sort((left, right) =>
    left.pathname < right.pathname ? -1 : left.pathname > right.pathname ? 1 : 0,
  );
}

export function renderMetadataHead(metadata: PageMetadataValue): string {
  const meta = (attribute: "name" | "property", name: string, value: string) =>
    `<meta data-page-metadata ${attribute}="${name}" content="${escapeMarkup(value)}">`;
  return [
    `<title data-page-metadata>${escapeMarkup(metadata.title)}</title>`,
    meta("name", "description", metadata.description),
    meta("name", "robots", metadata.robots),
    ...(metadata.canonical
      ? [`<link data-page-metadata rel="canonical" href="${escapeMarkup(metadata.canonical)}">`]
      : []),
    meta("property", "og:type", metadata.ogType),
    meta("property", "og:site_name", "Ego Hygiene"),
    meta("property", "og:title", metadata.title),
    meta("property", "og:description", metadata.description),
    ...(metadata.canonical ? [meta("property", "og:url", metadata.canonical)] : []),
    meta("name", "twitter:card", "summary"),
    meta("name", "twitter:title", metadata.title),
    meta("name", "twitter:description", metadata.description),
    ...(metadata.image
      ? [
          meta("property", "og:image", metadata.image.url),
          meta("property", "og:image:alt", metadata.image.alt),
          meta("name", "twitter:image", metadata.image.url),
          meta("name", "twitter:image:alt", metadata.image.alt),
        ]
      : []),
  ].join("\n    ");
}

export function renderPageDocument(
  template: string,
  pathname: string,
  rendered: RenderedPage,
): string {
  if (!rendered.markup.trim() || !/<main\b/.test(rendered.markup))
    throw new Error(`Static route produced no meaningful page: ${pathname}`);
  if (/<!--\$(?:!|\?)-->/.test(rendered.markup))
    throw new Error(`Static route suspended or failed while rendering: ${pathname}`);
  for (const marker of [headStart, headEnd, rootPlaceholder]) {
    if (template.split(marker).length !== 2)
      throw new Error(`Expected exactly one static template marker: ${marker}`);
  }
  const start = template.indexOf(headStart);
  const end = template.indexOf(headEnd);
  if (end <= start) throw new Error("Static head template markers are reversed.");
  const withHead = `${template.slice(0, start)}${headStart}\n    ${renderMetadataHead(rendered.metadata)}\n    ${template.slice(end)}`;
  return withHead.replace(
    rootPlaceholder,
    () =>
      `<div id="root" data-prerendered-path="${escapeMarkup(pathname)}">${rendered.markup}</div>`,
  );
}

export function renderSitemap(pages: readonly PublicPage[]): string {
  const urls = [
    ...new Set(
      pages.filter(({ metadata }) => metadata.indexable).map(({ metadata }) => metadata.canonical!),
    ),
  ].sort();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeMarkup(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

function markdownText(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[\\[\]()*_`<>]/g, "\\$&");
}

export function renderLlmsSummary(pages: readonly PublicPage[]): string {
  const links = pages
    .filter(({ metadata }) => metadata.indexable)
    .map(
      ({ metadata }) =>
        `- [${markdownText(metadata.title)}](${metadata.canonical}): ${markdownText(metadata.description)}`,
    );
  return [
    "# Ego Hygiene",
    "",
    "> Tools, ideas, and practices for moving toward balance and harmony.",
    "",
    "This website is the Ego Hygiene gateway and storefront. The store includes an Incompris feature and the .play() artist collection. Current public artwork previews do not establish approved garments, downloadable artwork sales, or active purchasing. Real artist merchandise selections remain intentionally empty.",
    "",
    "## Public pages",
    "",
    ...links,
    "",
    "## Limits",
    "",
    "The public catalog browser contains fictional examples. Reserved ecosystem gateways and provisional policies are not launch or deployment evidence. This summary does not grant artwork rights, publish a new AI-use policy, or authorize agents to purchase anything.",
    "",
  ].join("\n");
}

async function exists(file: string): Promise<boolean> {
  try {
    await stat(file);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

/** Validate all output before replacing the client shell with generated pages. */
export async function writePublicSite(
  outputDirectory: string,
  renderer: PublicRenderer,
  publicInputDigest: string,
) {
  const pages = validatePublicPages(renderer.listPublicPages(), renderer.publicOrigin);
  const template = await readFile(join(outputDirectory, "index.html"), "utf8");
  for (const file of ["sitemap.xml", "public-routes.json"]) {
    if (await exists(join(outputDirectory, file)))
      throw new Error(`Generated discovery output collides with a copied public file: ${file}`);
  }
  const outputs = new Map<string, string>();
  const receipt = [];
  for (const page of pages) {
    const rendered = await renderer.renderPublicPage(page.pathname);
    if (rendered.status !== 200)
      throw new Error(`Known static route did not succeed: ${page.pathname} (${rendered.status})`);
    if (JSON.stringify(rendered.metadata) !== JSON.stringify(page.metadata))
      throw new Error(`Static metadata changed while rendering: ${page.pathname}`);
    const relativeFile =
      page.pathname === "/" ? "index.html" : `${page.pathname.slice(1)}/index.html`;
    if (relativeFile !== "index.html" && (await exists(join(outputDirectory, relativeFile))))
      throw new Error(`Generated route collides with a copied public file: ${relativeFile}`);
    const html = renderPageDocument(template, page.pathname, rendered);
    outputs.set(relativeFile, html);
    receipt.push({
      pathname: page.pathname,
      file: relativeFile,
      canonical: page.metadata.canonical,
      robots: page.metadata.robots,
      indexable: page.metadata.indexable,
      reason: page.metadata.reason,
      htmlSha256: createHash("sha256").update(html).digest("hex"),
    });
  }
  const missing = await renderer.renderPublicPage(missingPath);
  if (
    missing.status !== 404 ||
    missing.metadata.indexable ||
    missing.metadata.canonical ||
    missing.metadata.robots !== "noindex,follow"
  )
    throw new Error("Missing-page renderer must return 404/noindex without a canonical URL.");
  if (await exists(join(outputDirectory, "404.html")))
    throw new Error("Generated 404 collides with a copied public file.");
  outputs.set("404.html", renderPageDocument(template, missingPath, missing));
  outputs.set("sitemap.xml", renderSitemap(pages));
  outputs.set("llms.txt", renderLlmsSummary(pages));
  outputs.set(
    "public-routes.json",
    `${JSON.stringify(
      {
        schemaVersion: 1,
        publicOrigin: renderer.publicOrigin,
        publicInputSha256: publicInputDigest,
        routes: receipt,
        notFound: {
          file: "404.html",
          status: "requires-host-configuration",
          robots: "noindex,follow",
        },
      },
      null,
      2,
    )}\n`,
  );
  for (const [file, contents] of outputs) {
    await mkdir(dirname(join(outputDirectory, file)), { recursive: true });
    await writeFile(join(outputDirectory, file), contents);
  }
  return {
    pages: pages.length,
    sitemapEntries: pages.filter(({ metadata }) => metadata.indexable).length,
  };
}
