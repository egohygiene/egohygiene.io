/** Isolated bilingual catalog qualification. --build-only never opens a server or browser. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import { build, loadConfigFromFile, preview } from "vite";
import { publicStoreCatalog } from "../../scripts/vite-store-catalog.mts";
import { CHECKOUT_HANDOFF_FIXTURE } from "../checkout-handoff/fixture.ts";
import { CATALOG_LOCALIZATION_FIXTURE, createCatalogLocalizationFixture } from "./fixture.ts";
import { catalogJourneyNames, runCatalogLocalizationJourneys } from "./journeys.ts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const app = join(repository, "apps/egohygiene.io");
const { values } = parseArgs({
  options: {
    "output-dir": { type: "string", default: "test-results/catalog-localization" },
    "build-only": { type: "boolean", default: false },
    list: { type: "boolean", default: false },
  },
});

if (values.list) {
  process.stdout.write(
    `${catalogJourneyNames.join("\n")}\nAuthored definitions only; no browser run.\n`,
  );
} else {
  const output = resolve(repository, values["output-dir"]);
  assert.ok(
    output.startsWith(`${join(repository, "test-results")}${sep}`),
    "Evidence must stay under test-results/",
  );
  await mkdir(output, { recursive: true });
  const fixture = await createCatalogLocalizationFixture();
  const outDir = join(fixture.root, "dist");
  let server: Awaited<ReturnType<typeof preview>> | undefined;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  const report = {
    startedAt: new Date().toISOString(),
    sourceCommit: spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: repository,
      encoding: "utf8",
    }).stdout.trim(),
    sourceStatus: spawnSync("git", ["status", "--porcelain"], {
      cwd: repository,
      encoding: "utf8",
    }).stdout.trim(),
    node: process.version,
    mode: values["build-only"] ? "build-only" : "browser",
    authoredJourneys: [...catalogJourneyNames],
    status: "running",
    scope:
      "Synthetic catalog and review records, actual app router/providers/pages, isolated temporary Vite build, reused intercepted checkout boundary. No production catalog or public locale activation.",
    limits:
      "Build-only proves module/projection integration, not browser behavior. Browser mode uses local Chromium emulation, not physical devices, native zoom, screen readers, crawler-visible output or real checkout. Canonical provider/variant mappings are retained; no cart or selected-variant transfer is claimed. No real provider request or order.",
  };
  try {
    await mkdir(join(fixture.publicDirectory, "icons"), { recursive: true });
    await copyFile(
      join(app, "public/icons/icon-192x192.png"),
      join(fixture.publicDirectory, "icons/icon-192x192.png"),
    );
    const loaded = await loadConfigFromFile(
      { command: "build", mode: "production" },
      join(app, "vite.config.ts"),
    );
    assert.ok(loaded, "The actual application Vite configuration must load");
    let replacements = 0;
    const plugins = (loaded.config.plugins ?? []).filter((plugin) => {
      if (
        plugin &&
        typeof plugin === "object" &&
        "name" in plugin &&
        plugin.name === "public-store-catalog"
      ) {
        replacements += 1;
        return false;
      }
      return true;
    });
    assert.equal(replacements, 1, "Replace exactly the catalog adapter");
    const entry = relative(app, join(repository, "tests/catalog-localization/host.tsx"))
      .split(sep)
      .join("/");
    await build({
      ...loaded.config,
      configFile: false,
      root: app,
      publicDir: fixture.publicDirectory,
      plugins: [
        ...plugins,
        publicStoreCatalog(fixture),
        {
          name: "catalog-localization-test-entry",
          transformIndexHtml: {
            order: "pre",
            handler(html) {
              assert.equal(
                html.split('src="/src/main.tsx"').length,
                2,
                "Replace exactly the website entry",
              );
              return html.replace('src="/src/main.tsx"', `src="${entry}"`);
            },
          },
        },
      ],
      define: {
        ...loaded.config.define,
        "import.meta.env.VITE_STORE_PREVIEW": JSON.stringify("false"),
      },
      build: { ...loaded.config.build, outDir, emptyOutDir: true },
    });
    const emitted = await readdir(outDir, { recursive: true });
    const textFiles = emitted.filter((file) => /\.(html|js|json|map)$/.test(file));
    const text = (
      await Promise.all(textFiles.map((file) => readFile(join(outDir, file), "utf8")))
    ).join("\n");
    const required = [
      CHECKOUT_HANDOFF_FIXTURE.live.id,
      CATALOG_LOCALIZATION_FIXTURE.collection.id,
      CATALOG_LOCALIZATION_FIXTURE.liveTitle,
      CATALOG_LOCALIZATION_FIXTURE.regionalTitle,
      "qps-Ploc",
    ];
    const excluded = [
      CHECKOUT_HANDOFF_FIXTURE.draftId,
      CATALOG_LOCALIZATION_FIXTURE.draftMarker,
      CATALOG_LOCALIZATION_FIXTURE.staleMarker,
    ];
    for (const marker of required)
      assert.ok(text.includes(marker), `Test artifact must include ${marker}`);
    for (const marker of excluded)
      assert.ok(!text.includes(marker), `Public projection must exclude ${marker}`);
    const artifact = {
      files: emitted.length,
      textFiles: textFiles.length,
      required,
      excluded,
      publicEntryCount: fixture.catalog.entries.length,
      checkoutRoutes: fixture.catalog.checkoutRoutes,
    };

    if (values["build-only"]) {
      report.status = "built-browser-not-run";
      await writeFile(
        join(output, "build.json"),
        `${JSON.stringify({ ...report, artifact, completedBrowserJourneys: 0, finishedAt: new Date().toISOString() }, null, 2)}\n`,
      );
      process.stdout.write(
        `Isolated catalog host built; ${textFiles.length} text artifacts checked. Zero browser journeys executed.\n`,
      );
    } else {
      server = await preview({
        root: app,
        configFile: false,
        build: { outDir },
        preview: { host: "127.0.0.1", port: 0, strictPort: true },
      });
      const address = server.httpServer.address();
      assert.ok(address && typeof address !== "string");
      const origin = `http://127.0.0.1:${address.port}`;
      const { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath } = process.env;
      browser = await chromium.launch({
        headless: true,
        ...(executablePath ? { executablePath } : {}),
      });
      const journeys = await runCatalogLocalizationJourneys(
        browser,
        origin,
        output,
        fixture.catalog,
      );
      report.status = "passed";
      await writeFile(
        join(output, "journeys.json"),
        `${JSON.stringify(
          {
            ...report,
            artifact,
            browser: browser.version(),
            journeys,
            completedBrowserJourneys: journeys.length,
            finishedAt: new Date().toISOString(),
          },
          null,
          2,
        )}\n`,
      );
    }
  } catch (error) {
    report.status = "failed-or-environment-blocked";
    await writeFile(
      join(output, "failure.json"),
      `${JSON.stringify({ ...report, error: String(error), finishedAt: new Date().toISOString() }, null, 2)}\n`,
    );
    throw error;
  } finally {
    try {
      await browser?.close();
    } finally {
      try {
        if (server) {
          const httpServer = server.httpServer;
          if ("closeAllConnections" in httpServer) httpServer.closeAllConnections();
          await new Promise<void>((resolveClose, reject) =>
            httpServer.close((error) => (error ? reject(error) : resolveClose())),
          );
        }
      } finally {
        await fixture.cleanup();
      }
    }
  }
}
