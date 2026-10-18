/** Isolated checkout-handoff boundary and keyboard/touch journey checks. */
import assert from "node:assert/strict";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium, expect } from "@playwright/test";
import { build, loadConfigFromFile, preview } from "vite";

import { publicStoreCatalog } from "../../scripts/vite-store-catalog.mts";
import { CHECKOUT_HANDOFF_FIXTURE, createCheckoutHandoffFixture } from "./fixture.ts";
import { runHandoffJourneys } from "./journeys.ts";
import { installHandoffBoundary } from "./network.ts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const app = join(repository, "apps/egohygiene.io");
const { values } = parseArgs({
  options: { "output-dir": { type: "string", default: "test-results/checkout-handoff" } },
});
const output = resolve(repository, values["output-dir"]);
const { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath } = process.env;
const fixture = await createCheckoutHandoffFixture();
const outDir = join(fixture.root, "dist");
let server: Awaited<ReturnType<typeof preview>> | undefined;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

try {
  // Keep the shared shell's approved logo in the isolated build, without copying store assets.
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
  assert.equal(
    replacements,
    1,
    "Replace exactly the catalog adapter, preserving other app plugins",
  );
  await build({
    ...loaded.config,
    configFile: false,
    root: app,
    publicDir: fixture.publicDirectory,
    plugins: [...plugins, publicStoreCatalog(fixture)],
    define: {
      ...loaded.config.define,
      "import.meta.env.VITE_STORE_PREVIEW": JSON.stringify("false"),
    },
    build: { ...loaded.config.build, outDir, emptyOutDir: true },
  });
  const emitted = await readdir(outDir, { recursive: true });
  const text = (
    await Promise.all(
      emitted
        .filter((file) => /\.(html|js|json|map)$/.test(file))
        .map((file) => readFile(join(outDir, file), "utf8")),
    )
  ).join("\n");
  assert.ok(
    text.includes(CHECKOUT_HANDOFF_FIXTURE.live.id),
    "Fixture must reach the test artifact",
  );
  assert.ok(
    !text.includes(CHECKOUT_HANDOFF_FIXTURE.draftId),
    "Public projection must exclude the draft",
  );
  server = await preview({
    root: app,
    configFile: false,
    build: { outDir },
    preview: { host: "127.0.0.1", port: 0, strictPort: true },
    plugins: [
      {
        name: "handoff-redirect-probe",
        configurePreviewServer(previewServer) {
          previewServer.middlewares.use("/__test_handoff_redirect", (_request, response) => {
            response.writeHead(302, { location: CHECKOUT_HANDOFF_FIXTURE.checkoutUrl });
            response.end();
          });
        },
      },
    ],
  });
  const address = server.httpServer.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({
    serviceWorkers: "block",
    viewport: { width: 1280, height: 800 },
  });
  const boundary = await installHandoffBoundary(context, origin);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const renderedStates: string[] = [];
  for (const [state, product] of [
    ["live", CHECKOUT_HANDOFF_FIXTURE.live],
    ["preview", CHECKOUT_HANDOFF_FIXTURE.preview],
    ["unavailable", CHECKOUT_HANDOFF_FIXTURE.unavailable],
  ] as const) {
    await page.goto(origin + product.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(product.title);
    const action = page.getByRole("link", { name: "Shop on Fourthwall", exact: true });
    if (state === "live") {
      await expect(action).toHaveAttribute("href", CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
      await expect(action).toBeVisible();
    } else {
      await expect(action).toHaveCount(0);
      await expect(page.locator("a[rel=external]")).toHaveCount(0);
    }
    const image = page
      .getByRole("img", { name: "Fictional test color swatch; not merchandise artwork" })
      .first();
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBe(1);
    renderedStates.push(state);
  }
  assert.deepEqual(boundary.blocked, [], "Fixture rendering must make no unexpected requests");
  assert.deepEqual(boundary.intercepted, [], "Rendering alone must not open a destination");

  // Probe the boundary directly before the separate product-activation journeys.
  const probes = await page.evaluate(async (destination) => {
    const rejected: boolean[] = [];
    for (const [url, method] of [
      [destination, "POST"],
      [`${destination}?unreviewed=1`, "GET"],
    ] as const) {
      try {
        await fetch(url, { method, mode: "no-cors" });
        rejected.push(false);
      } catch {
        rejected.push(true);
      }
    }
    rejected.push(
      await new Promise<boolean>((resolveProbe) => {
        const image = new Image();
        image.onload = () => resolveProbe(false);
        image.onerror = () => resolveProbe(true);
        image.src = destination;
      }),
    );
    return rejected;
  }, CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
  assert.deepEqual(probes, [true, true, true]);
  assert.equal(boundary.blocked.length, 3);
  const redirectProbe = await context.newPage();
  await assert.rejects(
    redirectProbe.goto(`${origin}/__test_handoff_redirect`),
    /ERR_BLOCKED_BY_CLIENT/,
  );
  await redirectProbe.close();
  assert.equal(boundary.blocked.length, 4);
  assert.deepEqual(boundary.intercepted, [], "A loopback redirect must not reach the provider");
  await page.goto(CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
  await expect(
    page.getByRole("heading", { name: "Intercepted checkout destination" }),
  ).toBeVisible();
  assert.deepEqual(boundary.intercepted, [CHECKOUT_HANDOFF_FIXTURE.checkoutUrl]);
  assert.equal(
    await page.locator("form, input, button").count(),
    0,
    "Local destination cannot collect payment or submit an order",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(boundary.blockedWebSockets, [], "No unexpected WebSocket may be attempted");
  const report = {
    checkpoint: "37 handoff 1 — fixture and interception baseline",
    capturedAt: new Date().toISOString(),
    browser: browser.version(),
    node: process.versions.node,
    fixture: CHECKOUT_HANDOFF_FIXTURE.prefix,
    renderedStates,
    decodedImage: { width: 1, authoredTestSwatch: true },
    interceptedDestinations: boundary.intercepted,
    blockedProbes: boundary.blocked,
    blockedWebSockets: boundary.blockedWebSockets,
    pageErrors: errors,
    limits:
      "Test-only temporary production build. Direct interception probes; no product-link activation, keyboard/mobile journey, Back/reload, real provider, order or print qualification.",
  };
  await mkdir(output, { recursive: true });
  await writeFile(join(output, "baseline.json"), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(
    `Handoff foundation passed in Chromium ${report.browser}: three states, decoded swatch, exact intercepted destination and four denied probes.\n`,
  );
  await context.close();
  const journeys = await runHandoffJourneys(browser, origin, output);
  await writeFile(join(output, "journeys.json"), `${JSON.stringify(journeys, null, 2)}\n`);
  process.stdout.write("Handoff keyboard and touch journeys passed with Back/reload guards.\n");
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
