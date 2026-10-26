import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import { build, loadEnv, mergeConfig } from "vite";

import { createWebsiteConfig } from "../apps/egohygiene.io/vite.config.ts";
import { type PublicRenderer, writePublicSite } from "./public-site-output.mts";
import { loadPublicStoreSnapshot, type PublicStoreCatalogSnapshot } from "./vite-store-catalog.mts";

const appRoot = fileURLToPath(new URL("../apps/egohygiene.io/", import.meta.url));

export async function buildPublicSite(arguments_: string[] = []) {
  const { values } = parseArgs({
    args: arguments_,
    options: { outDir: { type: "string" }, mode: { type: "string", default: "production" } },
  });
  const mode = values.mode!;
  const preview =
    (process.env["VITE_STORE_PREVIEW"] ?? loadEnv(mode, appRoot, "VITE_")["VITE_STORE_PREVIEW"]) ===
    "true";
  const expectedDirectory = preview ? "dist-preview" : "dist";
  const outDir = values.outDir ?? expectedDirectory;
  // These two supported artifacts stay isolated, including failed-build cleanup.
  if (outDir !== expectedDirectory)
    throw new Error(
      `This ${preview ? "isolated preview" : "normal"} build requires --outDir ${expectedDirectory}.`,
    );
  const outputDirectory = join(appRoot, outDir);
  const configuration = (snapshot: PublicStoreCatalogSnapshot) =>
    mergeConfig(createWebsiteConfig({ snapshot }), {
      configFile: false,
      root: appRoot,
      mode,
      build: { outDir: outputDirectory, emptyOutDir: true },
    });
  if (preview) {
    await build(configuration(await loadPublicStoreSnapshot()));
    return;
  }

  const temporaryDirectory = await mkdtemp(join(tmpdir(), "egohygiene-render-"));
  try {
    const snapshot = await loadPublicStoreSnapshot();
    await build(configuration(snapshot));
    await build(
      mergeConfig(configuration(snapshot), {
        publicDir: false,
        ssr: { noExternal: true },
        build: {
          outDir: temporaryDirectory,
          ssr: join(appRoot, "src/entry-server.tsx"),
          sourcemap: false,
          minify: false,
          rolldownOptions: { output: { entryFileNames: "entry-server.mjs" } },
        },
      }),
    );
    const renderer = (await import(
      pathToFileURL(join(temporaryDirectory, "entry-server.mjs")).href
    )) as PublicRenderer;
    const result = await writePublicSite(outputDirectory, renderer, snapshot.digest);
    console.log(
      `Public rendering: ${result.pages} pages, ${result.sitemapEntries} sitemap entries and a noindex 404 artifact.`,
    );
  } catch (error) {
    // A failed normal build must not leave a client-only shell or half-generated site.
    await rm(outputDirectory, { recursive: true, force: true });
    throw error;
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildPublicSite(process.argv.slice(2));
}
