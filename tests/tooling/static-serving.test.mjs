import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { inspectStaticResponses } from "../store-qualification/static-serving.mjs";

const digest = (value) => createHash("sha256").update(value).digest("hex");

// These HTTP stubs test the verifier's ability to reject regressions. They do not
// execute Caddy and must never be reported as server/image qualification.
async function fixture(t, change = (_request, response) => response) {
  const root = await mkdtemp(path.join(tmpdir(), "static-serving-57-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pages = [
    { pathname: "/", file: "index.html", body: "<!doctype html><main>Home fixture</main>" },
    {
      pathname: "/store",
      file: "store/index.html",
      body: "<!doctype html><main>Store fixture</main>",
    },
  ].map((page) => ({ ...page, htmlSha256: digest(page.body) }));
  const missing = "<!doctype html><meta name=robots content=noindex><main>Missing fixture</main>";
  const files = new Map([
    ...pages.map((page) => [`/${page.file}`, { body: page.body, type: "text/html" }]),
    ["/404.html", { body: missing, type: "text/html" }],
    ["/assets/app.js", { body: "export const fixture = true;", type: "text/javascript" }],
    ["/assets/app.css", { body: "body { color: black; }", type: "text/css" }],
    ["/icons/example.png", { body: Buffer.from([137, 80, 78, 71]), type: "image/png" }],
    ["/robots.txt", { body: "User-agent: *\n", type: "text/plain" }],
  ]);
  for (const [file, { body }] of files) {
    const full = path.join(root, file.slice(1));
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, body);
  }
  const aliases = new Map([
    ["/index.html", "/"],
    ["/store/", "/store"],
    ["/store/index.html", "/store"],
  ]);
  const isAssetPath = (pathname) =>
    ["/assets", "/assets/", "/fonts/", "/icons/"].includes(pathname) ||
    (path.extname(pathname) && path.extname(pathname) !== ".html");
  let requests = 0;
  const server = createServer((request, response) => {
    requests++;
    const url = new URL(request.url, "http://127.0.0.1");
    const page = pages.find((candidate) => candidate.pathname === url.pathname);
    let answer;
    if (!["GET", "HEAD"].includes(request.method))
      answer = { status: 405, headers: { Allow: "GET, HEAD" }, body: "Method not allowed\n" };
    else if (url.pathname === "/healthz")
      answer = { status: 200, headers: { "content-type": "text/plain" }, body: "ok" };
    else if (aliases.has(url.pathname))
      answer = {
        status: 308,
        headers: { location: `${aliases.get(url.pathname)}${url.search}` },
        body: "",
      };
    else if (page)
      answer = { status: 200, headers: { "content-type": "text/html" }, body: page.body };
    else if (files.has(url.pathname) && url.pathname !== "/404.html") {
      const file = files.get(url.pathname);
      answer = { status: 200, headers: { "content-type": file.type }, body: file.body };
    } else if (isAssetPath(url.pathname))
      answer = { status: 404, headers: { "content-type": "text/plain" }, body: "Not found\n" };
    else answer = { status: 404, headers: { "content-type": "text/html" }, body: missing };
    answer = change(request, answer);
    response.writeHead(answer.status, answer.headers);
    response.end(request.method === "HEAD" ? undefined : answer.body);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );
  return {
    root,
    report: { result: "pass", pages, notFound: { htmlSha256: digest(missing) } },
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    requestCount: () => requests,
  };
}

test("static HTTP inspector exercises all supplied pages, emitted assets, aliases and failure paths", async (t) => {
  const { root, report, baseUrl, requestCount } = await fixture(t);
  const result = await inspectStaticResponses(root, report, baseUrl);
  assert.equal(result.result, "pass");
  assert.equal(result.requestCount, requestCount());
  assert.deepEqual(
    [...new Set(result.responses.map((response) => response.category))],
    ["page", "page-query", "alias", "asset", "health", "missing-page", "missing-asset", "method"],
  );
  assert.ok(result.responses.some((response) => response.pathname === "/store/products/%2A"));
  assert.ok(
    result.responses.some((response) => response.pathname.includes("literal=a%2Fb&empty=")),
  );
  assert.ok(
    result.responses.some(
      (response) => response.pathname === "/icons/example.png" && response.method === "HEAD",
    ),
  );
});

test("static HTTP inspector rejects concrete serving regressions", async (t) => {
  const cases = [
    [
      "wrong page bytes",
      "/store",
      "GET",
      (answer) => ({ ...answer, body: "wrong home shell" }),
      /HTTP bytes differ/,
    ],
    ["HEAD disagrees", "/store", "HEAD", (answer) => ({ ...answer, status: 404 }), /HEAD status/],
    [
      "alias loses query",
      "/store/?",
      "GET",
      (answer) => ({ ...answer, headers: { location: "/store" } }),
      /preserve query/,
    ],
    [
      "alias reflects external host",
      "/index.html",
      "GET",
      (answer) => ({ ...answer, headers: { location: "https://example.invalid/" } }),
      /relative destination/,
    ],
    [
      "asset has HTML MIME",
      "/assets/app.js",
      "GET",
      (answer) => ({ ...answer, headers: { "content-type": "text/html" } }),
      /MIME/,
    ],
    [
      "missing page succeeds",
      "/missing-route-57",
      "GET",
      (answer) => ({ ...answer, status: 200 }),
      /GET status/,
    ],
    [
      "missing asset becomes HTML",
      "/assets/missing-57.js",
      "GET",
      (answer) => ({
        ...answer,
        headers: { "content-type": "text/html" },
        body: "<!doctype html>home",
      }),
      /Missing asset MIME/,
    ],
    [
      "literal wildcard leaks a page",
      "/store/products/*",
      "GET",
      (answer) => ({ ...answer, status: 200 }),
      /GET status/,
    ],
    [
      "unsupported method succeeds",
      "/",
      "POST",
      (answer) => ({ ...answer, status: 200 }),
      /Unsupported method status/,
    ],
  ];
  for (const [name, pathname, method, mutate, expected] of cases) {
    await t.test(name, async (subtest) => {
      const { root, report, baseUrl } = await fixture(subtest, (request, answer) =>
        request.url.startsWith(pathname) && request.method === method ? mutate(answer) : answer,
      );
      await assert.rejects(inspectStaticResponses(root, report, baseUrl), expected);
    });
  }
});

test("static HTTP inspector rejects unsafe targets and stale/failed raw evidence before requests", async (t) => {
  const { root, report, baseUrl, requestCount } = await fixture(t);
  for (const target of [
    "https://127.0.0.1",
    "http://example.invalid",
    `${baseUrl}/path`,
    `${baseUrl}?query=yes`,
    `http://user:password@${baseUrl.slice(7)}`,
  ])
    await assert.rejects(inspectStaticResponses(root, report, target), /loopback/);
  await assert.rejects(
    inspectStaticResponses(root, { ...report, result: "fail" }, baseUrl),
    /must pass first/,
  );
  await writeFile(path.join(root, "index.html"), "changed after raw inspection");
  await assert.rejects(inspectStaticResponses(root, report, baseUrl), /became stale/);
  assert.equal(requestCount(), 0);
});
