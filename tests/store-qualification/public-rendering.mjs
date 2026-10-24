import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { JSDOM } from "jsdom";

const publicOrigin = "https://egohygiene.io";
const digest = (value) => createHash("sha256").update(value).digest("hex");
const sorted = (values) => [...values].sort();

// Parse only: scripts and resource loading are intentionally never enabled.
export function inspectPublicDocument(html, route) {
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    const one = (selector) => {
      const matches = document.querySelectorAll(selector);
      assert.equal(matches.length, 1, `Expected one ${selector} in ${route.pathname}`);
      return matches[0];
    };
    const meta = (selector) => one(selector).getAttribute("content");
    assert.equal(one("html").lang, "en");
    assert.equal(one("#root").getAttribute("data-prerendered-path"), route.pathname);
    const main = one("#root main");
    assert.ok(main.textContent.trim().length > 20, `Empty primary content: ${route.pathname}`);
    const heading = one("main h1").textContent.trim();
    assert.ok(heading.length > 0);
    assert.ok(document.querySelector("#root nav a[href]"), "Initial navigation is missing");
    const title = one("title").textContent.trim();
    const description = meta('meta[name="description"]');
    assert.ok(title && description?.trim(), "Missing title/description");
    assert.equal(meta('meta[name="robots"]'), route.robots);
    assert.equal(meta('meta[property="og:title"]'), title);
    assert.equal(meta('meta[property="og:description"]'), description);
    assert.equal(meta('meta[property="og:type"]'), "website");
    assert.equal(meta('meta[property="og:site_name"]'), "Ego Hygiene");
    assert.equal(meta('meta[name="twitter:title"]'), title);
    assert.equal(meta('meta[name="twitter:description"]'), description);
    assert.equal(meta('meta[name="twitter:card"]'), "summary");
    if (route.canonical) {
      assert.equal(one('link[rel="canonical"]').getAttribute("href"), route.canonical);
      assert.equal(meta('meta[property="og:url"]'), route.canonical);
    } else {
      assert.equal(
        document.querySelectorAll('link[rel="canonical"], meta[property="og:url"]').length,
        0,
      );
    }
    const image = document.querySelector('meta[property="og:image"]');
    if (image) {
      const url = new URL(meta('meta[property="og:image"]'));
      assert.equal(url.origin, publicOrigin);
      assert.ok(meta('meta[property="og:image:alt"]')?.trim());
      assert.equal(meta('meta[name="twitter:image"]'), url.href);
      assert.equal(meta('meta[name="twitter:image:alt"]'), meta('meta[property="og:image:alt"]'));
    } else {
      assert.equal(
        document.querySelectorAll(
          'meta[property="og:image:alt"], meta[name="twitter:image"], meta[name="twitter:image:alt"]',
        ).length,
        0,
      );
    }
    assert.equal(
      document.querySelectorAll('script[type="application/ld+json"]').length,
      0,
      "No Product/Offer structured data is approved by #91",
    );
    assert.ok(!/<!--\$(?:!|\?)-->/.test(html), "Unresolved rendering fallback");
    return {
      title,
      description,
      heading,
      mainTextCharacters: main.textContent.trim().length,
      htmlSha256: digest(html),
    };
  } finally {
    dom.window.close();
  }
}

/** Verify emitted receipt, documents and discovery against each other, without executing JS. */
export async function inspectPublicArtifact(artifactRoot) {
  const htmlFiles = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      assert.ok(!entry.isSymbolicLink(), "Artifact symlinks are not followed");
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(full);
      else if (entry.name.endsWith(".html"))
        htmlFiles.push(path.relative(artifactRoot, full).split(path.sep).join("/"));
    }
  }
  await visit(artifactRoot);
  const receipt = JSON.parse(await readFile(path.join(artifactRoot, "public-routes.json"), "utf8"));
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.publicOrigin, publicOrigin);
  assert.match(receipt.publicInputSha256, /^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(receipt.routes) && receipt.routes.length > 0);
  const paths = receipt.routes.map((route) => route.pathname);
  assert.equal(new Set(paths).size, paths.length, "Duplicate receipt paths");
  assert.deepEqual(paths, sorted(paths), "Receipt paths must be ordered");
  assert.ok(paths.includes("/"));
  const pages = [];
  for (const route of receipt.routes) {
    assert.match(
      route.pathname,
      /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/,
    );
    assert.ok(!route.pathname.startsWith("/store/preview"), "Isolated preview route leaked");
    assert.equal(
      route.file,
      route.pathname === "/" ? "index.html" : `${route.pathname.slice(1)}/index.html`,
    );
    assert.equal(route.canonical, new URL(route.pathname, publicOrigin).href);
    assert.equal(typeof route.indexable, "boolean");
    assert.equal(route.robots, route.indexable ? "index,follow" : "noindex,follow");
    assert.ok(typeof route.reason === "string" && route.reason.trim());
    const html = await readFile(path.join(artifactRoot, route.file), "utf8");
    assert.equal(digest(html), route.htmlSha256, `Receipt hash drift: ${route.file}`);
    pages.push({ ...route, ...inspectPublicDocument(html, route) });
  }
  assert.deepEqual(
    sorted(htmlFiles),
    sorted([...pages.map((page) => page.file), "404.html"]),
    "Uninventoried or missing HTML",
  );
  assert.deepEqual(receipt.notFound, {
    file: "404.html",
    status: "requires-host-configuration",
    robots: "noindex,follow",
  });
  const missing = inspectPublicDocument(
    await readFile(path.join(artifactRoot, "404.html"), "utf8"),
    {
      pathname: "/__not-found__",
      robots: "noindex,follow",
    },
  );
  const xml = new JSDOM(await readFile(path.join(artifactRoot, "sitemap.xml"), "utf8"), {
    contentType: "text/xml",
  });
  let sitemapUrls;
  try {
    const document = xml.window.document;
    assert.equal(document.documentElement.localName, "urlset");
    assert.equal(
      document.documentElement.namespaceURI,
      "http://www.sitemaps.org/schemas/sitemap/0.9",
    );
    assert.equal(document.querySelectorAll("lastmod, changefreq, priority").length, 0);
    sitemapUrls = [...document.querySelectorAll("urlset > url > loc")].map(
      (node) => node.textContent,
    );
    assert.equal(document.querySelectorAll("urlset > url").length, sitemapUrls.length);
    assert.deepEqual(
      sitemapUrls,
      sorted(pages.filter((page) => page.indexable).map((page) => page.canonical)),
    );
  } finally {
    xml.window.close();
  }
  const robots = await readFile(path.join(artifactRoot, "robots.txt"), "utf8");
  assert.deepEqual(
    [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]),
    [`${publicOrigin}/sitemap.xml`],
  );
  const llms = await readFile(path.join(artifactRoot, "llms.txt"), "utf8");
  const llmsUrls = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  assert.deepEqual(
    sorted(llmsUrls),
    sitemapUrls,
    "llms summary differs from eligible public routes",
  );
  return {
    result: "pass",
    publicInputSha256: receipt.publicInputSha256,
    pages,
    sitemapUrls,
    notFound: missing,
  };
}

/** Known-path HTTP evidence only; no browser execution or production-host claim. */
export async function inspectLocalResponses(artifactRoot, report, baseUrl) {
  const base = new URL(baseUrl);
  assert.ok(
    base.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname),
    "HTTP inspection is loopback-only",
  );
  assert.ok(
    !base.username && !base.password && base.pathname === "/" && !base.search && !base.hash,
  );
  const request = async (pathname) => {
    const response = await fetch(new URL(pathname, base), {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.text();
    return {
      pathname,
      status: response.status,
      contentType: response.headers.get("content-type"),
      location: response.headers.get("location"),
      htmlSha256: digest(body),
      body,
    };
  };
  const pages = [];
  for (const page of report.pages) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const { body, ...response } = await request(page.pathname);
      assert.equal(response.status, 200, `HTTP status: ${page.pathname}`);
      assert.match(response.contentType ?? "", /text\/html/i);
      assert.equal(
        response.htmlSha256,
        page.htmlSha256,
        `HTTP body differs from generated route: ${page.pathname}`,
      );
      inspectPublicDocument(body, page);
      pages.push({ ...response, attempt });
    }
  }
  const discovery = [];
  for (const file of ["sitemap.xml", "robots.txt", "llms.txt", "public-routes.json"]) {
    const { body, ...response } = await request(`/${file}`);
    assert.equal(response.status, 200);
    assert.equal(body, await readFile(path.join(artifactRoot, file), "utf8"));
    discovery.push(response);
  }
  const observations = [];
  for (const pathname of [
    "/store/catalog?q=heart&lang=en",
    "/store/",
    "/missing-route-91c",
    "/store/products/missing-product-91c",
    "/assets/missing-91c.js",
    "/404.html",
  ]) {
    const { body, ...response } = await request(pathname);
    const dom = new JSDOM(body);
    observations.push({
      ...response,
      prerenderedPath:
        dom.window.document.querySelector("#root")?.getAttribute("data-prerendered-path") ?? null,
    });
    dom.window.close();
  }
  return {
    result: "pass",
    scope:
      "Known pages requested twice and compared byte-for-byte, plus discovery output. Repeated HTTP requests are not browser reload/hydration. Extra fallback/alias observations are not acceptance assertions; #57/#89 own server behavior.",
    pages,
    discovery,
    observations,
  };
}

async function main() {
  const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
  const { values } = parseArgs({
    options: { output: { type: "string" }, "base-url": { type: "string" } },
  });
  const outputRoot = path.join(repoRoot, "test-results/store-qualification");
  const output = path.resolve(
    repoRoot,
    values.output ?? "test-results/store-qualification/public-rendering.json",
  );
  assert.ok(
    output.startsWith(`${outputRoot}${path.sep}`),
    "Output must remain under test-results/store-qualification/",
  );
  const artifactRoot = path.join(repoRoot, "apps/egohygiene.io/dist");
  const report = {
    capturedAt: new Date().toISOString(),
    sourceHead: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim(),
    sourceStatus: execFileSync("git", ["status", "--porcelain"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim(),
    scope:
      "Raw generated documents and discovery consistency. Receipt is a build output, not independent source-route coverage; source route tests and review remain required. No scripts/resources execute. Private/fixture/asset/size checks remain in artifacts.mts.",
    result: "fail",
  };
  try {
    Object.assign(report, await inspectPublicArtifact(artifactRoot));
    if (values["base-url"])
      report.http = await inspectLocalResponses(artifactRoot, report, values["base-url"]);
  } catch (error) {
    report.result = "fail";
    report.failure = error instanceof Error ? error.message : String(error);
    process.exitCode = 1;
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `Public rendering inspection: ${report.result}; ${report.pages?.length ?? 0} pages. Report: ${path.relative(repoRoot, output)}`,
  );
  if (report.failure) console.error(report.failure);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
