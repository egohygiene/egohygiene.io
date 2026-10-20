/** Local-only layout stress check. Run with the repository's pinned Node runtime. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium } from "@playwright/test";
import { installHostBoundary } from "./browser-host.mjs";
import { runLocaleJourneys } from "./locale-journeys.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const app = path.join(root, "apps/egohygiene.io");
const entry = path.join(root, "tests/storefront-qualification/host.tsx");
const { values } = parseArgs({
  options: {
    "output-dir": { type: "string", default: "test-results/storefront-qualification" },
    port: { type: "string", default: "5182" },
  },
});
const output = path.resolve(root, values["output-dir"]);
assert.ok(
  output.startsWith(`${path.join(root, "test-results")}${path.sep}`),
  "Evidence must stay under test-results/",
);
const port = Number(values.port);
const origin = `http://127.0.0.1:${port}`;
// biome-ignore lint/suspicious/noUndeclaredEnvVars: Direct local check, not a cached Turbo task.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const routes = [
  { name: "shop", path: "/store", selector: ".storefront-row .store-card", count: 4 },
  {
    name: "incompris",
    path: "/store/incompris",
    selector: ".storefront-grid .store-card",
    count: 4,
  },
  {
    name: "standalone",
    path: "/store/incompris/artists/demo-artist",
    selector: ".storefront-grid .store-card",
    count: 4,
  },
  {
    name: "songs",
    path: "/store/incompris/artists/demo-artist?view=songs",
    selector: ".storefront-grid .store-card",
    count: 1,
  },
];
const captures = new Map([
  ["expanded-1440-shop", "expanded-shop-desktop.jpg"],
  ["expanded-820-incompris", "expanded-incompris-tablet.jpg"],
  ["rtl-390-standalone", "rtl-artist-phone.jpg"],
  ["rtl-320-songs", "rtl-songs-small-phone.jpg"],
]);

let server;
let browser;
let serverOutput = "";
const report = {
  capturedAt: new Date().toISOString(),
  source:
    "Actual repository React components in a local Vite development server. Test-only host replaces the document entry through Playwright; no production routes or catalog files are changed.",
  fixture:
    "Existing public fictional catalog records and the isolated Demo artist fixture, with validated test-only curation, longer titles/descriptions, and the existing expanded/synthetic RTL dictionary. No real .play() associations or supported translations are created.",
  format: "JPEG, quality 82, full page, no image manipulation",
  scope:
    "Chromium desktop/mobile viewport emulation with reduced motion. This is not physical-device, Safari, translation, or screen-reader qualification.",
  results: [],
  screens: [],
};

async function startServer() {
  server = spawn(
    process.execPath,
    [
      path.join(app, "node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: app,
      env: { ...process.env, VITE_STORE_PREVIEW: "false" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  for (const stream of [server.stdout, server.stderr])
    stream.on("data", (chunk) => {
      serverOutput += chunk.toString();
    });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Vite exited: ${serverOutput}`);
    try {
      if ((await fetch(origin)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Local Vite server did not become ready: ${serverOutput}`);
}

async function qualifyRegional(page, mode, width, route, options, key) {
  if (route.name !== "standalone" || width !== 390 || options.textScale) return;
  const selector = route.selector;
  const status = page.locator(".store-artist-results");
  const search = page.getByRole("searchbox");
  const initial = mode === "rtl" ? "٤" : "4";
  const one = mode === "rtl" ? "١" : "1";
  const zero = mode === "rtl" ? "٠" : "0";
  assert.ok((await status.innerText()).includes(initial), `${key}: locale-aware initial count`);
  await search.fill("Signal Heart Hoodie");
  await page.waitForFunction(
    (suffix) => document.querySelector(".store-artist-results").textContent.includes(suffix),
    one,
  );
  assert.equal(await page.locator(selector).count(), 1);
  const href = await page.locator(`${selector} a`).getAttribute("href");
  assert.equal(
    new URL(href, "http://local.invalid").pathname,
    "/store/products/signal-heart-hoodie",
  );
  assert.equal(
    new URL(href, "http://local.invalid").searchParams.get("lang"),
    mode === "rtl" ? "ar" : "qps-Ploc",
  );
  await search.fill("no-such-fictional-selection");
  await page.waitForFunction(
    (suffix) => document.querySelector(".store-artist-results").textContent.includes(suffix),
    zero,
  );
  assert.equal(await page.locator(selector).count(), 0);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await search.inputValue(), "no-such-fictional-selection");
  assert.ok((await status.innerText()).includes(zero));
  assert.equal(await page.locator(".storefront-empty").count(), 1);
  await page.locator(".store-artist-search button").click();
  await page.waitForFunction(
    (suffix) => document.querySelector(".store-artist-results").textContent.includes(suffix),
    initial,
  );
  assert.ok(await search.evaluate((element) => document.activeElement === element));
  return {
    locale: mode === "rtl" ? "ar-u-nu-arab" : "en",
    counts: [initial, one, zero],
    canonicalHref: href,
    emptyReload: true,
    clearRestoresFocus: true,
  };
}

async function qualify(mode, width, route, options = {}) {
  const key = `${mode}-${width}-${route.name}${options.textScale ? "-root-text-200-percent" : ""}`;
  const viewport = { width, height: width <= 390 ? 844 : 1000 };
  const page = await browser.newPage({
    viewport,
    reducedMotion: "reduce",
    colorScheme: "light",
    serviceWorkers: "block",
  });
  const boundary = await installHostBoundary(page, { origin, entry });
  const { errors, blockedRequests: externalRequests } = boundary;
  if (options.textScale) {
    await page.addInitScript(() => {
      addEventListener("DOMContentLoaded", () => {
        document.documentElement.style.fontSize = "200%";
      });
    });
  }
  try {
    const url = new URL(route.path, origin);
    url.searchParams.set("lang", mode === "rtl" ? "ar" : "qps-Ploc");
    await page.goto(url.href, { waitUntil: "networkidle" });
    assert.deepEqual(errors, [], `${key}: entry must render`);
    await page.locator(route.selector).first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator(route.selector).count(), route.count, key);
    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      direction: document.documentElement.dir,
      imageErrors: [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc),
    }));
    assert.ok(
      metrics.documentWidth <= width + 1,
      `${key}: document overflows ${width}px to ${metrics.documentWidth}px`,
    );
    assert.equal(metrics.direction, mode === "rtl" ? "rtl" : "ltr", key);
    assert.deepEqual(metrics.imageErrors, [], key);
    let scrolling;
    if (route.name === "shop") {
      const row = page.locator(".storefront-scroll");
      await row.focus();
      const before = await row.evaluate((element) => element.scrollLeft);
      await page.keyboard.press(mode === "rtl" ? "ArrowLeft" : "ArrowRight");
      await page.waitForFunction(
        (previous) =>
          Math.abs(document.querySelector(".storefront-scroll").scrollLeft - previous) > 0,
        before,
      );
      scrolling = await row.evaluate((element) => ({
        scrollLeft: element.scrollLeft,
        width: element.clientWidth,
        contentWidth: element.scrollWidth,
        focused: document.activeElement === element,
        outline: getComputedStyle(element).outlineStyle,
      }));
      assert.ok(
        scrolling.focused && scrolling.outline === "solid",
        `${key}: row focus must remain visible`,
      );
      await row.evaluate((element) => {
        element.scrollLeft = 0;
      });
    }
    const regional = await qualifyRegional(page, mode, width, route, options, key);
    let motion;
    if (route.name === "shared") {
      await page.locator(".eh-button").hover();
      motion = await page.evaluate(() => ({
        transition: getComputedStyle(document.querySelector(".eh-button")).transitionDuration,
        transform: getComputedStyle(document.querySelector(".eh-button")).transform,
        animation: getComputedStyle(document.querySelector(".eh-spinner")).animationName,
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
      }));
      assert.deepEqual(motion, {
        transition: "0s",
        transform: "none",
        animation: "none",
        scroll: "auto",
      });
    }
    assert.deepEqual(errors, [], key);
    boundary.assertClean();
    report.results.push({
      key,
      viewport,
      route: url.pathname + url.search,
      metrics,
      scrolling,
      regional,
      motion,
      ...(options.textScale
        ? {
            textResize:
              "200% root font size; synthetic CSS probe, not native browser zoom or text-only preference",
          }
        : {}),
      externalRequests,
      blockedWebSockets: boundary.blockedWebSockets,
      errors,
    });
    const file = captures.get(key);
    if (file) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(output, file),
        type: "jpeg",
        quality: 82,
        fullPage: true,
      });
      const bytes = await readFile(path.join(output, file));
      report.screens.push({
        file,
        key,
        viewport,
        route: url.pathname + url.search,
        synthetic: true,
        dimensions: { width: metrics.documentWidth, height: metrics.documentHeight },
        sha256: createHash("sha256").update(bytes).digest("hex"),
        bytes: bytes.length,
        errors,
        imageErrors: metrics.imageErrors,
      });
    }
    process.stdout.write(`${key}: pass\n`);
  } catch (error) {
    process.stderr.write(
      `${key}: ${JSON.stringify({ errors, body: await page.locator("body").innerText(), serverOutput })}\n`,
    );
    throw error;
  } finally {
    await page.close();
  }
}

try {
  await mkdir(output, { recursive: true });
  await startServer();
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  report.browser = browser.version();
  for (const mode of ["expanded", "rtl"]) {
    for (const width of [320, 390, 820, 1440]) {
      for (const route of routes) await qualify(mode, width, route);
    }
    await qualify(mode, 390, routes[2], { textScale: true });
  }
  await qualify("expanded", 390, {
    name: "shared",
    path: "/qualification/shared",
    selector: ".eh-button",
    count: 1,
  });
  report.localeJourneys = await runLocaleJourneys(browser, { origin, entry, output });
  await writeFile(path.join(output, "captures.json"), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(
    `${report.results.length} layout cases and ${report.localeJourneys.length} locale journeys passed; ${report.screens.length} layout captures saved.\n`,
  );
} catch (error) {
  await writeFile(
    path.join(output, "failure.json"),
    `${JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        status: "failed-or-environment-blocked",
        completedLayoutCases: report.results.length,
        error: String(error),
        serverOutput,
      },
      null,
      2,
    )}\n`,
  );
  throw error;
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}
