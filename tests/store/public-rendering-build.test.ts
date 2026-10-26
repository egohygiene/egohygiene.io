import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  type PublicPage,
  type PublicRenderer,
  renderMetadataHead,
  renderPageDocument,
  renderSitemap,
  validatePublicPages,
  writePublicSite,
} from "../../scripts/public-site-output.mts";

const origin = "https://egohygiene.io";
const template =
  '<!doctype html><html><head><!-- public-page-head:start --><title>Old</title><!-- public-page-head:end --><script type="module" src="/assets/index-hash.js"></script></head><body><div id="root"></div></body></html>';
const page = (pathname: string, indexable = true): PublicPage => ({
  pathname,
  metadata: {
    title: `Title for ${pathname}`,
    description: `Description for ${pathname}`,
    canonical: new URL(pathname, origin).href,
    robots: indexable ? "index,follow" : "noindex,follow",
    indexable,
    reason: indexable ? "Reviewed public page" : "Fictional example",
    ogType: "website",
  },
});
const missing = {
  title: "Page not found",
  description: "This page does not exist.",
  robots: "noindex,follow" as const,
  indexable: false,
  reason: "Missing route",
  ogType: "website" as const,
};

test("static metadata escapes text and attributes and keeps one consistent public identity", () => {
  const metadata = {
    ...page("/").metadata,
    title: '</title><script>"& bad</script>',
    description: 'A "quote" & <tag>',
    image: { url: `${origin}/store/approved.webp`, alt: '" onload="bad & artwork' },
  };
  const head = renderMetadataHead(metadata);
  assert.ok(!head.includes("<script>"));
  assert.ok(head.includes("&lt;/title&gt;&lt;script&gt;&quot;&amp; bad&lt;/script&gt;"));
  assert.ok(head.includes('content="A &quot;quote&quot; &amp; &lt;tag&gt;"'));
  assert.ok(head.includes('property="og:url" content="https://egohygiene.io/"'));
  assert.ok(head.includes('name="twitter:card" content="summary"'));
  assert.ok(!renderMetadataHead(missing).includes('rel="canonical"'));
  assert.ok(!renderMetadataHead(missing).includes('property="og:url"'));
  const document = renderPageDocument(template, "/", {
    markup: "<main>Keep $& literally</main>",
    metadata,
    status: 200,
  });
  assert.ok(document.includes('data-prerendered-path="/"'));
  assert.ok(document.includes("<main>Keep $& literally</main>"));
  assert.ok(document.includes("/assets/index-hash.js"));
  assert.equal((document.match(/<title\b/g) ?? []).length, 1);
});

test("generation rejects empty, unresolved and structurally ambiguous renderings", () => {
  const rendered = { markup: "<main>Content</main>", metadata: page("/").metadata, status: 200 };
  assert.throws(
    () => renderPageDocument(template, "/", { ...rendered, markup: "" }),
    /meaningful page/,
  );
  for (const markup of [
    "<main><!--$!-->Fallback<!--/$--></main>",
    "<main><!--$?-->Loading<!--/$--></main>",
  ]) {
    assert.throws(
      () => renderPageDocument(template, "/", { ...rendered, markup }),
      /suspended or failed/,
    );
  }
  assert.throws(
    () => renderPageDocument(template + '<div id="root"></div>', "/", rendered),
    /exactly one/,
  );
  assert.throws(
    () =>
      renderPageDocument(template.replace("<!-- public-page-head:start -->", ""), "/", rendered),
    /exactly one/,
  );
});

test("route publication fails closed on invalid paths, duplicates and inconsistent metadata", () => {
  for (const pathname of [
    "/../private",
    "/a%2fb",
    "//other",
    "/about/",
    "/ABOUT",
    "/?q=x",
    "/store/:slug",
    "/assets",
    "/store/preview/fourthwall",
  ]) {
    assert.throws(
      () => validatePublicPages([page("/"), page(pathname)], origin),
      /(?:Invalid|Reserved) static route/,
    );
  }
  assert.throws(() => validatePublicPages([page("/"), page("/")], origin), /Duplicate/);
  assert.throws(() => validatePublicPages([page("/about")], origin), /homepage/);
  assert.throws(
    () =>
      validatePublicPages(
        [{ ...page("/"), metadata: { ...page("/").metadata, canonical: `${origin}/wrong` } }],
        origin,
      ),
    /Canonical identity/,
  );
  assert.throws(
    () =>
      validatePublicPages(
        [{ ...page("/"), metadata: { ...page("/").metadata, description: " " } }],
        origin,
      ),
    /Missing page metadata/,
  );
  assert.throws(
    () =>
      validatePublicPages(
        [{ ...page("/"), metadata: { ...page("/").metadata, robots: "noindex,follow" } }],
        origin,
      ),
    /Conflicting publication/,
  );
  assert.throws(
    () =>
      validatePublicPages(
        [
          {
            ...page("/"),
            metadata: {
              ...page("/").metadata,
              image: { url: "https://elsewhere.invalid/art.webp", alt: "Art" },
            },
          },
        ],
        origin,
      ),
    /Invalid approved social/,
  );
  const pages = validatePublicPages([page("/z", false), page("/help"), page("/")], origin);
  assert.deepEqual(
    pages.map(({ pathname }) => pathname),
    ["/", "/help", "/z"],
  );
  assert.ok(!renderSitemap(pages).includes(`${origin}/z`));
  assert.ok(!renderSitemap(pages).includes("lastmod"));
  assert.equal(
    renderSitemap([page("/help"), page("/"), page("/help")]),
    renderSitemap([page("/"), page("/help")]),
  );
});

test("static output is deterministic, shares eligibility, and includes an explicitly noindex 404", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "public-render-output-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const pages = [page("/fictional", false), page("/help"), page("/")];
  const renderer: PublicRenderer = {
    publicOrigin: origin,
    listPublicPages: () => pages,
    renderPublicPage: async (pathname) => {
      const match = pages.find((item) => item.pathname === pathname);
      return {
        markup: `<main>${match ? pathname : "Page not found"}</main>`,
        metadata: match?.metadata ?? missing,
        status: match ? 200 : 404,
      };
    },
  };
  const capture = async (name: string) => {
    const output = join(root, name);
    await mkdir(output);
    await writeFile(join(output, "index.html"), template);
    assert.deepEqual(await writePublicSite(output, renderer, "a".repeat(64)), {
      pages: 3,
      sitemapEntries: 2,
    });
    const files: Record<string, string> = {};
    for (const file of await readdir(output, { recursive: true, withFileTypes: true })) {
      if (file.isFile()) {
        const fullPath = join(file.parentPath, file.name);
        files[fullPath.slice(output.length + 1)] = await readFile(fullPath, "utf8");
      }
    }
    return files;
  };
  const first = await capture("first");
  assert.deepEqual(await capture("second"), first);
  assert.ok(first["fictional/index.html"]?.includes('content="noindex,follow"'));
  assert.ok(!first["sitemap.xml"]?.includes("fictional"));
  assert.ok(!first["llms.txt"]?.includes(`${origin}/fictional`));
  assert.ok(first["llms.txt"]?.includes(`${origin}/help`));
  assert.ok(first["404.html"]?.includes('content="noindex,follow"'));
  assert.ok(!first["404.html"]?.includes('rel="canonical"'));
  const receipt = JSON.parse(first["public-routes.json"]!);
  assert.equal(receipt.publicInputSha256, "a".repeat(64));
  assert.equal(receipt.routes.length, 3);
  assert.equal(receipt.notFound.status, "requires-host-configuration");
});

test("failed routes and copied-file collisions do not replace the client shell with partial output", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "public-render-failure-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, "index.html"), template);
  const pages = [page("/"), page("/help")];
  const renderer: PublicRenderer = {
    publicOrigin: origin,
    listPublicPages: () => pages,
    renderPublicPage: async (pathname) => ({
      markup: "<main>Content</main>",
      metadata: pages.find((item) => item.pathname === pathname)!.metadata,
      status: pathname === "/" ? 200 : 500,
    }),
  };
  await assert.rejects(
    writePublicSite(root, renderer, "a".repeat(64)),
    /Known static route did not succeed/,
  );
  assert.equal(await readFile(join(root, "index.html"), "utf8"), template);
  await mkdir(join(root, "help"));
  await writeFile(join(root, "help/index.html"), "public collision");
  await assert.rejects(
    writePublicSite(
      root,
      {
        ...renderer,
        renderPublicPage: async (pathname) => ({
          markup: "<main>Content</main>",
          metadata: pages.find((item) => item.pathname === pathname)!.metadata,
          status: 200,
        }),
      },
      "a".repeat(64),
    ),
    /collides with a copied public file/,
  );
  assert.equal(await readFile(join(root, "help/index.html"), "utf8"), "public collision");
  for (const file of ["sitemap.xml", "public-routes.json"]) {
    await writeFile(join(root, file), "copied discovery collision");
    await assert.rejects(
      writePublicSite(root, renderer, "a".repeat(64)),
      /Generated discovery output collides/,
    );
    assert.equal(await readFile(join(root, file), "utf8"), "copied discovery collision");
    await rm(join(root, file));
  }
});
