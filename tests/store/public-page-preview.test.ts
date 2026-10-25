import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { preview } from "vite";

import {
  loadPreviewPageRewrites,
  publicPagePreview,
  publicPagePreviewUrl,
} from "../../scripts/vite-public-pages.mts";

async function fixture(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), "public-page-preview-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "dist");
  const routes = [];
  for (const pathname of ["/", "/about", "/store/designs/heartburst"]) {
    const file = pathname === "/" ? "index.html" : `${pathname.slice(1)}/index.html`;
    const html = `<!doctype html><html><body><div id="root" data-prerendered-path="${pathname}"><main><h1>Page ${pathname}</h1></main></div></body></html>`;
    await mkdir(dirname(join(directory, file)), { recursive: true });
    await writeFile(join(directory, file), html);
    routes.push({ pathname, file, htmlSha256: createHash("sha256").update(html).digest("hex") });
  }
  const receipt = { schemaVersion: 1, routes };
  await writeFile(join(directory, "public-routes.json"), JSON.stringify(receipt));
  return { root, directory, receipt };
}

test("preview rewrites only exact generated GET/HEAD paths and preserves query bytes", async (t) => {
  const { directory } = await fixture(t);
  const rewrites = await loadPreviewPageRewrites(directory);
  assert.equal(
    publicPagePreviewUrl("/about?lang=en&q=a%20b&source=x%2Fy", "GET", rewrites),
    "/about/index.html?lang=en&q=a%20b&source=x%2Fy",
  );
  assert.equal(
    publicPagePreviewUrl("/store/designs/heartburst", "HEAD", rewrites),
    "/store/designs/heartburst/index.html",
  );
  assert.equal(publicPagePreviewUrl("/", "GET", rewrites), "/index.html");
  for (const path of [
    "/missing",
    "/about/",
    "/about/index.html",
    "/ABOUT",
    "/%61bout",
    "/assets/site.js",
    "/store/preview/fourthwall",
    "//about",
  ]) {
    assert.equal(publicPagePreviewUrl(path, "GET", rewrites), path);
  }
  for (const method of ["POST", "PUT", "OPTIONS", undefined]) {
    assert.equal(publicPagePreviewUrl("/about?lang=en", method, rewrites), "/about?lang=en");
  }
});

test("preview refuses absent, malformed, duplicate and unsafe route receipts", async (t) => {
  const { root, directory, receipt } = await fixture(t);
  await assert.rejects(loadPreviewPageRewrites(join(root, "missing")), /successful normal build/);
  const invalid: unknown[] = [
    null,
    { ...receipt, schemaVersion: 2 },
    { ...receipt, routes: [] },
    { ...receipt, routes: [...receipt.routes, receipt.routes[0]] },
    { ...receipt, routes: [{ ...receipt.routes[0], pathname: "/../private" }] },
    { ...receipt, routes: [{ ...receipt.routes[0], pathname: "/store/preview/fourthwall" }] },
    { ...receipt, routes: [{ ...receipt.routes[0], file: "../private.html" }] },
    { ...receipt, routes: [{ ...receipt.routes[0], htmlSha256: "invalid" }] },
  ];
  for (const value of invalid) {
    await writeFile(join(directory, "public-routes.json"), JSON.stringify(value));
    await assert.rejects(loadPreviewPageRewrites(directory), /successful normal build/);
  }
  await writeFile(join(directory, "public-routes.json"), "not json");
  await assert.rejects(loadPreviewPageRewrites(directory), /successful normal build/);
});

test("preview rejects stale, missing or wrong-route generated HTML", async (t) => {
  const { directory, receipt } = await fixture(t);
  await writeFile(join(directory, "about/index.html"), "stale artifact");
  await assert.rejects(loadPreviewPageRewrites(directory), /successful normal build/);
  const wrong = '<div id="root" data-prerendered-path="/"><main>Wrong route</main></div>';
  receipt.routes[1]!.htmlSha256 = createHash("sha256").update(wrong).digest("hex");
  await writeFile(join(directory, "public-routes.json"), JSON.stringify(receipt));
  await writeFile(join(directory, "about/index.html"), wrong);
  await assert.rejects(loadPreviewPageRewrites(directory), /successful normal build/);
  await rm(join(directory, "about/index.html"));
  await assert.rejects(loadPreviewPageRewrites(directory), /successful normal build/);
});

test("normal Vite preview fails startup when its generated receipt is missing", async (t) => {
  const { root, directory } = await fixture(t);
  await rm(join(directory, "public-routes.json"));
  await assert.rejects(
    preview({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [publicPagePreview()],
      build: { outDir: "dist" },
      preview: { host: "127.0.0.1", port: 0, strictPort: true },
    }),
    /successful normal build/,
  );
});

test("Vite preview returns each clean route's actual bytes, retaining unknown fallback", async (t) => {
  const { root, directory } = await fixture(t);
  const server = await preview({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [publicPagePreview()],
    build: { outDir: "dist" },
    preview: { host: "127.0.0.1", port: 0, strictPort: true },
  });
  t.after(() => server.close());
  const address = server.httpServer.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  for (const [path, file] of [
    ["/", "index.html"],
    ["/about?lang=en", "about/index.html"],
    ["/store/designs/heartburst", "store/designs/heartburst/index.html"],
  ]) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/);
    assert.equal(await response.text(), await readFile(join(directory, file!), "utf8"));
  }
  const head = await fetch(`${origin}/about?lang=en`, { method: "HEAD", redirect: "manual" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const unknown = await fetch(`${origin}/missing`, { redirect: "manual" });
  assert.equal(unknown.status, 200);
  assert.equal(await unknown.text(), await readFile(join(directory, "index.html"), "utf8"));
});

test("the explicitly isolated preview remains a receipt-free SPA and dev has no rewrite hook", async (t) => {
  const { root } = await fixture(t);
  const directory = join(root, "dist-preview");
  await mkdir(directory);
  const html = '<!doctype html><html><body><div id="root"></div></body></html>';
  await writeFile(join(directory, "index.html"), html);
  const plugin = publicPagePreview();
  assert.equal(plugin.configureServer, undefined);
  const server = await preview({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [plugin],
    build: { outDir: "dist-preview" },
    preview: { host: "127.0.0.1", port: 0, strictPort: true },
  });
  t.after(() => server.close());
  const address = server.httpServer.address();
  assert.ok(address && typeof address !== "string");
  const response = await fetch(`http://127.0.0.1:${address.port}/store/preview/fourthwall`, {
    redirect: "manual",
  });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), html);
});
