import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const digest = (value) => createHash("sha256").update(value).digest("hex");
const query = "?q=heart%20burst&lang=en&literal=a%2Fb&empty=";
const mediaTypes = {
  ".css": ["text/css"],
  ".ico": ["image/vnd.microsoft.icon", "image/x-icon"],
  ".js": ["text/javascript", "application/javascript"],
  ".json": ["application/json"],
  ".png": ["image/png"],
  ".svg": ["image/svg+xml"],
  ".txt": ["text/plain"],
  ".webmanifest": ["application/manifest+json"],
  ".webp": ["image/webp"],
  ".woff": ["font/woff", "application/font-woff"],
  ".woff2": ["font/woff2"],
  ".xml": ["application/xml", "text/xml"],
};

function loopbackOrigin(baseUrl) {
  const base = new URL(baseUrl);
  assert.ok(
    base.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname),
    "Static serving inspection is loopback-only",
  );
  assert.ok(
    !base.username && !base.password && base.pathname === "/" && !base.search && !base.hash,
    "Static serving inspection requires an uncredentialed loopback origin",
  );
  return base;
}

async function artifactFiles(directory) {
  const files = [];
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      assert.ok(!entry.isSymbolicLink(), "Static serving inspection refuses artifact symlinks");
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(full);
      else {
        assert.ok(entry.isFile(), "Static serving inspection requires ordinary artifact files");
        files.push(path.relative(directory, full).split(path.sep).join("/"));
      }
    }
  }
  await visit(directory);
  return files.sort();
}

/**
 * HTTP acceptance against the same artifact already checked by inspectPublicArtifact.
 * The caller owns build/image/source identity and server lifetime. No browser runs,
 * redirects are never followed, and no remote host can be selected.
 */
export async function inspectStaticResponses(artifactRoot, publicReport, baseUrl) {
  const base = loopbackOrigin(baseUrl);
  assert.equal(publicReport.result, "pass", "Raw public artifact inspection must pass first");
  assert.ok(Array.isArray(publicReport.pages) && publicReport.pages.length > 0);
  const responses = [];
  const request = async (category, pathname, method = "GET") => {
    const url = new URL(pathname, base);
    assert.equal(url.origin, base.origin, "An inspection path must stay on the loopback origin");
    const response = await fetch(url, {
      method,
      redirect: "manual",
      headers: { "accept-encoding": "identity" },
      signal: AbortSignal.timeout(10_000),
    });
    const body = Buffer.from(await response.arrayBuffer());
    const recorded = {
      category,
      pathname,
      method,
      status: response.status,
      contentType: response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "",
      location: response.headers.get("location"),
      bytes: body.byteLength,
      sha256: digest(body),
    };
    responses.push(recorded);
    if (method === "HEAD") assert.equal(body.byteLength, 0, `HEAD body: ${pathname}`);
    return { ...recorded, body, allow: response.headers.get("allow") };
  };
  const verifyFile = async (category, pathname, bytes, expectedStatus, types) => {
    for (const method of ["GET", "HEAD"]) {
      const response = await request(category, pathname, method);
      assert.equal(response.status, expectedStatus, `${method} status: ${pathname}`);
      assert.ok(
        types.includes(response.contentType),
        `${method} MIME: ${pathname} (${response.contentType || "missing"})`,
      );
      assert.equal(response.location, null, `Unexpected redirect: ${pathname}`);
      if (method === "GET")
        assert.equal(
          response.sha256,
          digest(bytes),
          `HTTP bytes differ from artifact: ${pathname}`,
        );
    }
  };
  const verifyAliases = async (page) => {
    const aliases =
      page.pathname === "/" ? ["/index.html"] : [`${page.pathname}/`, `/${page.file}`];
    for (const alias of aliases) {
      for (const suffix of ["", query]) {
        for (const method of ["GET", "HEAD"]) {
          const response = await request("alias", `${alias}${suffix}`, method);
          assert.equal(response.status, 308, `Canonical alias status: ${alias}`);
          assert.equal(
            response.location,
            `${page.pathname}${suffix}`,
            `Canonical alias must preserve query and use a relative destination: ${alias}`,
          );
        }
      }
    }
  };
  for (const page of publicReport.pages) {
    const bytes = await readFile(path.join(artifactRoot, page.file));
    assert.equal(digest(bytes), page.htmlSha256, `Raw inspection became stale: ${page.file}`);
    await verifyFile("page", page.pathname, bytes, 200, ["text/html"]);
    await verifyFile("page-query", `${page.pathname}${query}`, bytes, 200, ["text/html"]);
    await verifyAliases(page);
  }
  for (const file of await artifactFiles(artifactRoot)) {
    if (file.endsWith(".html")) continue;
    const bytes = await readFile(path.join(artifactRoot, file));
    const pathname = `/${file.split("/").map(encodeURIComponent).join("/")}`;
    const types = mediaTypes[path.extname(file)] ?? ["text/plain", "application/octet-stream"];
    await verifyFile("asset", pathname, bytes, 200, types);
  }
  await verifyFile("health", "/healthz", Buffer.from("ok"), 200, ["text/plain"]);
  const missing = await readFile(path.join(artifactRoot, "404.html"));
  assert.equal(
    digest(missing),
    publicReport.notFound.htmlSha256,
    "Raw 404 inspection became stale",
  );
  for (const pathname of [
    "/missing-route-57",
    "/missing-route-57/",
    "/missing-route-57.html",
    "/store/products/missing-product-57",
    "/store/products/*",
    "/store/products/%2A",
    "/store/products/[a-z]*",
    "/store/preview/fourthwall",
    "/404.html",
  ]) {
    await verifyFile("missing-page", pathname, missing, 404, ["text/html"]);
  }
  for (const pathname of [
    "/assets",
    "/assets/",
    "/fonts/",
    "/icons/",
    "/assets/missing-57.js",
    "/assets/missing-57.css",
    "/icons/missing-57.png",
    "/fonts/missing-57.woff",
    "/store/heartburst/missing-57.webp",
    "/missing-57.svg",
  ]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await request("missing-asset", pathname, method);
      assert.equal(response.status, 404, `Missing asset status: ${pathname}`);
      assert.equal(response.contentType, "text/plain", `Missing asset MIME: ${pathname}`);
      assert.equal(response.location, null, `Missing asset must not redirect: ${pathname}`);
      if (method === "GET")
        assert.ok(
          !/<(?:!doctype|html|main)\b/i.test(response.body.toString()),
          "Missing asset returned HTML",
        );
    }
  }
  for (const pathname of ["/", "/store/", "/healthz", "/assets/missing-57.js"]) {
    const response = await request("method", pathname, "POST");
    assert.equal(response.status, 405, `Unsupported method status: ${pathname}`);
    assert.equal(response.allow, "GET, HEAD", `Unsupported method Allow: ${pathname}`);
    assert.equal(response.location, null, `Unsupported method must not redirect: ${pathname}`);
  }
  return {
    result: "pass",
    scope:
      "Loopback HTTP status, MIME, GET/HEAD artifact identity, canonical aliases, query preservation, health and missing-resource/method handling. No browser hydration, accessibility, deployment or production-host qualification.",
    requestCount: responses.length,
    responses,
  };
}
