import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { TestContext } from "node:test";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import type { InlineConfig } from "vite";
import { build, createServer } from "vite";
import type { StoreCatalog } from "../../packages/schemas/src/store.ts";
import { getStorePurchaseAction, parseStoreCatalog } from "../../packages/schemas/src/store.ts";
import { emptyStorefrontCuration } from "../../packages/schemas/src/storefront-curation.ts";
import { loadPublicStoreSnapshot, publicStoreCatalog } from "../../scripts/vite-store-catalog.mts";
import { qualifySyntheticRoute } from "./fixtures/readiness.ts";

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
const browserEntry = fileURLToPath(
  new URL("../../apps/egohygiene.io/src/content/store/index.ts", import.meta.url),
);
const base = (id: string, visibility = "public") => ({
  schemaVersion: 3,
  sourceLocale: "en",
  id,
  slug: id,
  title: id,
  description: `MARKER_${id}`,
  visibility,
});
const design = (id: string, visibility = "public") => ({
  ...base(id, visibility),
  kind: "design",
  contextIds: ["context-public"],
  artworkRevision: 1,
  artwork: { kind: "image", src: "/store/approved.webp", alt: "Public fixture artwork" },
});
const product = (id: string, visibility = "public") => ({
  ...base(id, visibility),
  kind: "product",
  designIds: ["design-public"],
  contextIds: [],
  purchase: {
    state: "live",
    provider: "fourthwall",
    routeId: `route-${id}`,
    variants: [{ id: "variant-small", label: "Small", providerVariantId: "provider-small" }],
  },
});
const route = (id: string) => qualifySyntheticRoute({
  id: `route-${id}`,
  provider: "fourthwall",
  productId: id,
  checkoutUrl: `https://synthetic-test.fourthwall.com/products/${id}`,
  providerVariantIds: ["provider-small"],
  artworkRevisions: [{ designId: "design-public", revision: 1 }],
}, product(id), [design("design-public")]);

async function writeJson(file: string, value: unknown) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function fixture(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), "public-store-build-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, "catalog", "entries");
  const routesFile = join(root, "catalog", "checkout-routes.json");
  const publicDirectory = join(root, "public");
  const values = [
    { ...base("context-public"), kind: "context", contextType: "song" },
    design("design-public"),
    product("product-public"),
    {
      ...base("collection-public"),
      kind: "collection",
      designIds: ["design-public"],
      productIds: ["product-public"],
      contextIds: ["context-public"],
    },
    { ...product("product-preview"), purchase: { state: "preview" } },
    { ...base("context-draft", "draft"), kind: "context", contextType: "song" },
    design("design-draft", "draft"),
    product("product-draft", "draft"),
    { ...base("collection-draft", "draft"), kind: "collection" },
  ];
  for (const value of values) await writeJson(join(directory, "nested", `${value.id}.json`), value);
  await writeJson(routesFile, [
    route("product-public"),
    route("product-preview"),
    route("product-draft"),
  ]);
  await mkdir(join(publicDirectory, "store"), { recursive: true });
  // File-existence validation only; these tests do not claim to decode or approve an image.
  await writeFile(join(publicDirectory, "store", "approved.webp"), "PUBLIC_ART_FIXTURE");
  await writeFile(
    join(root, "index.html"),
    '<!doctype html><html><body><script type="module" src="/main.ts"></script></body></html>',
  );
  // Exercise the application's real import boundary, not a second fixture-only browser adapter.
  await writeFile(
    join(root, "main.ts"),
    `import { storeCatalog } from ${JSON.stringify(browserEntry)};\ndocument.body.textContent = JSON.stringify(storeCatalog);\n`,
  );
  const configuration = (curationFile?: string): InlineConfig => ({
    root,
    configFile: false,
    logLevel: "silent",
    publicDir: publicDirectory,
    plugins: [
      publicStoreCatalog({
        directory,
        routesFile,
        publicDirectory,
        ...(curationFile ? { curationFile } : {}),
      }),
    ],
    optimizeDeps: { noDiscovery: true, include: [] },
    build: { outDir: join(root, "dist"), sourcemap: true, modulePreload: false },
    server: { host: "127.0.0.1", port: 0, fs: { allow: [root, repositoryRoot] } },
  });
  return {
    root,
    directory,
    routesFile,
    publicDirectory,
    configuration,
    entry: (id: string) => join(directory, "nested", `${id}.json`),
  };
}

async function emittedFiles(root: string): Promise<Record<string, string>> {
  const directory = join(root, "dist");
  const result: Record<string, string> = {};
  for (const path of (await readdir(directory, { recursive: true })).sort()) {
    if (/\.(?:html|js|json|map)$/.test(path))
      result[path] = await readFile(join(directory, path), "utf8");
  }
  return result;
}

test("paired builds consume one immutable validated public snapshot even if authoring inputs change", async (t) => {
  const f = await fixture(t);
  const inputs = { directory: f.directory, routesFile: f.routesFile, publicDirectory: f.publicDirectory };
  const snapshot = await loadPublicStoreSnapshot(inputs);
  assert.ok(Object.isFrozen(snapshot));
  assert.match(snapshot.digest, /^[a-f0-9]{64}$/);
  assert.ok(!snapshot.moduleCode.includes("design-draft"));
  const configuration = { ...f.configuration(), plugins: [publicStoreCatalog({ ...inputs, snapshot })] };
  await build(configuration);
  const first = await emittedFiles(f.root);
  await writeJson(f.entry("design-public"), { ...design("design-public"), title: "CHANGED_AFTER_SNAPSHOT" });
  await build(configuration);
  assert.deepEqual(await emittedFiles(f.root), first);
  assert.notEqual((await loadPublicStoreSnapshot(inputs)).digest, snapshot.digest);
  await writeJson(f.entry("design-public"), { ...design("design-public"), unknownPrivateField: "PRIVATE_MARKER" });
  await assert.rejects(loadPublicStoreSnapshot(inputs), /unknownPrivateField/);
});

test("production artifacts exclude all draft kinds and unused routes while preserving the public live graph", async (t) => {
  const f = await fixture(t);
  await build(f.configuration());
  const files = await emittedFiles(f.root);
  assert.ok(Object.keys(files).some((path) => path.endsWith(".html")));
  assert.ok(Object.keys(files).some((path) => path.endsWith(".js")));
  assert.ok(Object.keys(files).some((path) => path.endsWith(".map")));
  const output = Object.values(files).join("\n");
  for (const marker of [
    "design-draft",
    "product-draft",
    "collection-draft",
    "context-draft",
    "route-product-preview",
    "/products/product-preview",
  ]) {
    assert.ok(!output.includes(marker), `Excluded marker leaked: ${marker}`);
  }
  for (const marker of [
    "MARKER_design-public",
    "MARKER_product-public",
    "MARKER_product-preview",
    "MARKER_collection-public",
    "MARKER_context-public",
    "/products/product-public",
  ]) {
    assert.ok(output.includes(marker), `Public control missing: ${marker}`);
  }
  const document = { body: { textContent: "" } };
  for (const [path, code] of Object.entries(files))
    if (path.endsWith(".js")) runInNewContext(code, { document });
  const serialized = JSON.parse(document.body.textContent) as StoreCatalog;
  const catalog = parseStoreCatalog(
    serialized.entries.map((value) => ({ source: value.id, value })),
    serialized.checkoutRoutes,
  );
  assert.equal(catalog.entries.length, 5);
  assert.equal(catalog.checkoutRoutes.length, 1);
  assert.equal(getStorePurchaseAction(catalog, "product-public").kind, "external");
  assert.equal(getStorePurchaseAction(catalog, "product-preview").kind, "disabled");
  assert.equal(getStorePurchaseAction(catalog, "product-draft").kind, "disabled");
  await build(f.configuration());
  assert.deepEqual(await emittedFiles(f.root), files, "Repeated builds must be byte-identical");
});

test("emitted catalog includes only current reviewed translation fields", async (t) => {
  const f = await fixture(t);
  await writeJson(f.entry("design-public"), {
    ...design("design-public"),
    translations: [{
      locale: "fr",
      fields: {
        title: {
          value: "PUBLIC_REVIEWED_TRANSLATION",
          review: {
            status: "reviewed", locale: "fr", reviewedBy: "synthetic-reviewer",
            reviewedAt: "2026-10-20", source: { locale: "en", value: "design-public" },
            value: "PUBLIC_REVIEWED_TRANSLATION",
          },
        },
        description: { value: "DRAFT_TRANSLATION_SENTINEL", review: { status: "draft" } },
        artworkAlt: {
          value: "STALE_TRANSLATION_SENTINEL",
          review: {
            status: "reviewed", locale: "fr", reviewedBy: "synthetic-reviewer",
            reviewedAt: "2026-10-20",
            source: { locale: "en", value: "OLD_SOURCE_SENTINEL", artworkRevision: 1 },
            value: "STALE_TRANSLATION_SENTINEL",
          },
        },
      },
    }],
  });
  await build(f.configuration());
  const output = Object.values(await emittedFiles(f.root)).join("\n");
  assert.ok(output.includes("PUBLIC_REVIEWED_TRANSLATION"));
  for (const marker of ["DRAFT_TRANSLATION_SENTINEL", "STALE_TRANSLATION_SENTINEL", "OLD_SOURCE_SENTINEL"]) {
    assert.ok(!output.includes(marker), `Unpublished translation leaked: ${marker}`);
  }
});

test("build failures preserve source diagnostics and reject public-to-draft references and stale live approvals", async (t) => {
  const f = await fixture(t);
  const file = f.entry("design-public");
  await writeJson(file, design("design-public", "draft"));
  await assert.rejects(
    build(f.configuration()),
    /product-public.json:designIds.0: Public entries cannot reference draft/,
  );
  await writeJson(file, { ...design("design-public"), artworkRevision: 2 });
  await assert.rejects(
    build(f.configuration()),
    /product-public.json:designIds.0: Live products require image artwork at the reviewed revision/,
  );
  await writeJson(file, design("design-public"));
  await writeJson(f.routesFile, []);
  await assert.rejects(
    build(f.configuration()),
    /product-public.json:purchase.routeId: Live products require a reviewed route/,
  );
  await writeFile(f.routesFile, "{broken");
  await assert.rejects(build(f.configuration()), /checkout-routes.json: invalid JSON/);
});

test("invalid draft authoring data still blocks the build before projection", async (t) => {
  const f = await fixture(t);
  await writeJson(f.entry("design-draft"), {
    ...design("design-draft", "draft"),
    supplierCost: 25,
  });
  await assert.rejects(build(f.configuration()), /design-draft.json:\$:.*supplierCost/);
  await writeFile(f.entry("design-draft"), "{broken");
  await assert.rejects(build(f.configuration()), /design-draft.json: invalid JSON/);
});

test("the browser boundary exports only validated ordered curation and fails closed on invalid selection", async (t) => {
  const f = await fixture(t);
  const curationFile = join(f.root, "catalog", "storefront-curation.json");
  const curation = {
    ...emptyStorefrontCuration(),
    incomprisEntryIds: ["product-preview", "design-public"],
    featuredIncomprisEntryIds: ["design-public", "product-preview"],
  };
  await writeJson(curationFile, curation);
  await writeFile(
    join(f.root, "main.ts"),
    `import { storeCatalog, storefrontCuration } from ${JSON.stringify(browserEntry)};\ndocument.body.textContent = JSON.stringify({ storeCatalog, storefrontCuration });\n`,
  );
  await build(f.configuration(curationFile));
  const files = await emittedFiles(f.root);
  const document = { body: { textContent: "" } };
  for (const [path, code] of Object.entries(files))
    if (path.endsWith(".js")) runInNewContext(code, { document });
  const serialized = JSON.parse(document.body.textContent);
  assert.deepEqual(serialized.storefrontCuration, curation);
  assert.ok(!Object.values(files).join("\n").includes("MARKER_design-draft"));

  await writeJson(curationFile, { ...curation, incomprisEntryIds: ["design-draft"] });
  await assert.rejects(
    build(f.configuration(curationFile)),
    /storefront-curation.json:incomprisEntryIds.0: Storefront curation cannot reference draft/,
  );
  await writeJson(curationFile, { ...curation, privateNotes: "UNAPPROVED_PRIVATE_MARKER" });
  await assert.rejects(
    build(f.configuration(curationFile)),
    /storefront-curation.json:\$:.*privateNotes/,
  );
});

async function waitUntil(predicate: () => boolean | Promise<boolean>) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await delay(25);
  }
  assert.fail("Timed out waiting for Vite's file watcher to refresh the public catalog");
}

test("the dev server refreshes edits, nested additions, removals, visibility, routes, and error recovery", {
  timeout: 20000,
}, async (t) => {
  const f = await fixture(t);
  const curationFile = join(f.root, "catalog", "storefront-curation.json");
  await writeJson(curationFile, emptyStorefrontCuration());
  const server = await createServer(f.configuration(curationFile));
  t.after(() => server.close());
  const messages: unknown[] = [];
  t.mock.method(server.ws, "send", (message: unknown) => {
    messages.push(message);
  });
  await server.listen();
  const origin = server.resolvedUrls?.local[0];
  assert.ok(origin);
  const transform = async () => {
    const response = await fetch(new URL("/@id/__x00__virtual:store-catalog", origin));
    const code = await response.text();
    if (!response.ok) throw new Error(code);
    return code;
  };
  assert.ok((await transform()).includes("MARKER_product-public"));
  const mutate = async (write: () => Promise<void>, check: () => Promise<boolean>) => {
    // Chokidar coalesces writes within 50 ms; model separate author saves, not one write burst.
    await delay(100);
    const before = messages.length;
    await write();
    await waitUntil(() =>
      messages
        .slice(before)
        .some(
          (message) =>
            typeof message === "object" &&
            message !== null &&
            "type" in message &&
            message.type === "full-reload",
        ),
    );
    await waitUntil(check);
  };
  const added = join(f.directory, "new-subdirectory", "fresh.json");
  const fresh = {
    ...base("design-new"),
    kind: "design",
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "New design" },
    contextIds: [],
  };
  await mutate(
    () => writeJson(added, fresh),
    async () => (await transform()).includes("MARKER_design-new"),
  );
  await mutate(
    () => writeJson(added, { ...fresh, title: "UPDATED_PUBLIC_TITLE" }),
    async () => (await transform()).includes("UPDATED_PUBLIC_TITLE"),
  );
  await mutate(
    () => writeJson(added, { ...fresh, visibility: "draft" }),
    async () => !(await transform()).includes("design-new"),
  );
  await mutate(
    () => writeJson(added, fresh),
    async () => (await transform()).includes("design-new"),
  );
  await mutate(
    () => rm(added),
    async () => !(await transform()).includes("design-new"),
  );
  const refreshedRoute = qualifySyntheticRoute({
    ...route("product-public"),
    checkoutUrl: "https://synthetic-test.fourthwall.com/products/updated-destination",
  }, product("product-public"), [design("design-public")]);
  await mutate(
    () => writeJson(f.routesFile, [refreshedRoute, route("product-draft")]),
    async () => (await transform()).includes("updated-destination"),
  );
  await mutate(
    () => writeFile(f.routesFile, "{broken"),
    async () => {
      await assert.rejects(transform(), /checkout-routes.json: invalid JSON/);
      return true;
    },
  );
  await mutate(
    () => writeJson(f.routesFile, [route("product-public"), route("product-draft")]),
    async () => (await transform()).includes("/products/product-public"),
  );
  const curation = {
    ...emptyStorefrontCuration(),
    incomprisEntryIds: ["design-public"],
    featuredIncomprisEntryIds: ["design-public"],
  };
  await mutate(
    () => writeJson(curationFile, curation),
    async () => (await transform()).includes(JSON.stringify(curation)),
  );
  await mutate(
    () => writeJson(curationFile, { ...curation, incomprisEntryIds: ["design-draft"] }),
    async () => {
      await assert.rejects(transform(), /Storefront curation cannot reference draft/);
      return true;
    },
  );
  await mutate(
    () => writeJson(curationFile, emptyStorefrontCuration()),
    async () => (await transform()).includes(JSON.stringify(emptyStorefrontCuration())),
  );
  assert.ok(!(await transform()).includes("MARKER_design-draft"));
});
