import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { writePublicSite } from "../../scripts/public-site-output.mts";
import {
  inspectLocalResponses,
  inspectPublicArtifact,
} from "../store-qualification/public-rendering.mjs";

const origin = "https://egohygiene.io";
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "rendering-inspection-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pages = ["/", "/fictional"].map((pathname) => ({
    pathname,
    metadata: {
      title: 'A "quoted" title & <tag>',
      description: 'Safe description </title><script>throw new Error("not executed")</script>',
      canonical: new URL(pathname, origin).href,
      robots: pathname === "/" ? "index,follow" : "noindex,follow",
      indexable: pathname === "/",
      reason: "Reviewed fixture policy",
      ogType: "website",
    },
  }));
  const missing = { ...pages[1].metadata, canonical: undefined };
  await writeFile(
    path.join(root, "index.html"),
    '<!doctype html><html lang="en"><head><!-- public-page-head:start --><!-- public-page-head:end --></head><body><div id="root"></div></body></html>',
  );
  await writeFile(
    path.join(root, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
  await writePublicSite(
    root,
    {
      publicOrigin: origin,
      listPublicPages: () => pages,
      renderPublicPage: async (pathname) => {
        const page = pages.find((candidate) => candidate.pathname === pathname);
        return {
          markup:
            '<nav><a href="/">Home</a></nav><main><h1>Test page</h1><p>Meaningful primary content without executing scripts.</p></main>',
          metadata: page?.metadata ?? missing,
          status: page ? 200 : 404,
        };
      },
    },
    "a".repeat(64),
  );
  return root;
}

async function changePage(root, transform, updateHash = true) {
  const file = path.join(root, "index.html");
  const html = transform(await readFile(file, "utf8"));
  await writeFile(file, html);
  if (updateHash) {
    const receiptFile = path.join(root, "public-routes.json");
    const receipt = JSON.parse(await readFile(receiptFile, "utf8"));
    receipt.routes[0].htmlSha256 = createHash("sha256").update(html).digest("hex");
    await writeFile(receiptFile, JSON.stringify(receipt));
  }
}

test("raw inspection parses escaped metadata and matching discovery without executing scripts", async (t) => {
  const root = await fixture(t);
  const report = await inspectPublicArtifact(root);
  assert.equal(report.result, "pass");
  assert.equal(report.pages.length, 2);
  assert.deepEqual(report.sitemapUrls, [`${origin}/`]);
  assert.equal(report.pages[0].title, 'A "quoted" title & <tag>');
  assert.ok(report.pages[0].description.includes("<script>"));
});

test("raw inspection rejects semantic damage even with a refreshed receipt hash", async (t) => {
  for (const [name, transform, expected] of [
    [
      "duplicate canonical",
      (html) => html.replace("</head>", `<link rel="canonical" href="${origin}/"></head>`),
      /Expected one link/,
    ],
    [
      "empty primary content",
      (html) => html.replace(/<main>.*?<\/main>/, "<main></main>"),
      /Empty primary content/,
    ],
    [
      "wrong indexing",
      (html) =>
        html.replace(
          'name="robots" content="index,follow"',
          'name="robots" content="noindex,follow"',
        ),
      /noindex,follow/,
    ],
    [
      "mismatched hydration path",
      (html) => html.replace('data-prerendered-path="/"', 'data-prerendered-path="/wrong"'),
      /wrong/,
    ],
  ]) {
    await t.test(name, async (subtest) => {
      const root = await fixture(subtest);
      await changePage(root, transform);
      await assert.rejects(inspectPublicArtifact(root), expected);
    });
  }
});

test("stale hashes and uninventoried HTML fail independently", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "extra.html"), "Unreviewed output");
  await assert.rejects(inspectPublicArtifact(root), /Uninventoried or missing HTML/);
  await rm(path.join(root, "extra.html"));
  await changePage(root, (html) => html.replace("Test page", "Changed page"), false);
  await assert.rejects(inspectPublicArtifact(root), /Receipt hash drift/);
});

test("sitemap, llms and robots drift fail rather than silently indexing fictional pages", async (t) => {
  for (const file of ["sitemap.xml", "llms.txt", "robots.txt"]) {
    await t.test(file, async (subtest) => {
      const root = await fixture(subtest);
      const destination = path.join(root, file);
      const text = await readFile(destination, "utf8");
      await writeFile(destination, text.replace(`${origin}/`, `${origin}/fictional`));
      await assert.rejects(inspectPublicArtifact(root));
    });
  }
});

test("receipt paths cannot escape the artifact or declare isolated previews", async (t) => {
  for (const pathname of ["/../outside", "/store/preview/fourthwall"]) {
    const root = await fixture(t);
    const destination = path.join(root, "public-routes.json");
    const receipt = JSON.parse(await readFile(destination, "utf8"));
    receipt.routes[1].pathname = pathname;
    await writeFile(destination, JSON.stringify(receipt));
    await assert.rejects(inspectPublicArtifact(root));
  }
});

test("artifact symlinks are rejected before parsing any receipt or page", async (t) => {
  const root = await fixture(t);
  await rm(path.join(root, "public-routes.json"));
  await symlink("index.html", path.join(root, "public-routes.json"));
  await assert.rejects(inspectPublicArtifact(root), /Artifact symlinks are not followed/);
});

test("HTTP inspection is loopback-only and rejects root fallback for a known deep route", async (t) => {
  const root = await fixture(t);
  const report = await inspectPublicArtifact(root);
  await assert.rejects(
    inspectLocalResponses(root, report, "https://example.invalid"),
    /loopback-only/,
  );
  const homepage = await readFile(path.join(root, "index.html"));
  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html" });
    response.end(homepage);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await assert.rejects(
    inspectLocalResponses(root, report, `http://127.0.0.1:${server.address().port}`),
    /differs from generated route/,
  );
});
