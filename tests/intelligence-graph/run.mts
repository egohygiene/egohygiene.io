/** Real pointer/keyboard/mobile regression on the production graph component. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import react from "@vitejs/plugin-react-swc";
import { createServer } from "vite";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const output = join(repository, "test-results/intelligence-graph");
await mkdir(output, { recursive: true });
const cache = await mkdtemp(join(tmpdir(), "intelligence-graph-cache-"));
const report = {
  startedAt: new Date().toISOString(),
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).trim(),
  sourceStatus: execFileSync("git", ["status", "--porcelain"], {
    cwd: repository,
    encoding: "utf8",
  }).trim(),
  scope:
    "Synthetic two-node fixture using the actual graph/URL/CSS component at /.github/. No models, providers or publication.",
  node: process.version,
  browser: "",
  status: "running",
  checks: [] as string[],
  errors: [] as string[],
};
let server: Awaited<ReturnType<typeof createServer>> | undefined;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("./", import.meta.url)),
    publicDir: false,
    base: "/.github/",
    cacheDir: cache,
    plugins: [react()],
    resolve: { dedupe: ["react", "react-dom", "react-router-dom", "react-router"] },
    server: { host: "127.0.0.1", port: 0, fs: { allow: [repository] } },
  });
  await server.listen();
  const address = server.httpServer?.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    headless: true,
  });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  const name =
    "Synthetic finding with a deliberately long label to constrain the mobile node selector, entity, confirmed. Open view.";
  await page.goto(`${origin}/.github/intelligence/`);
  const link = page.getByRole("link", { name, exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(`${origin}/.github/audits/#synthetic-finding`);
  await expect(page.getByRole("heading", { name: "Synthetic audit destination" })).toBeVisible();
  report.checks.push("First pointer click opens the declared finding URL and anchor.");
  await page.screenshot({ path: join(output, "pointer-destination.png") });

  await page.goto(`${origin}/.github/intelligence/`);
  await expect(page.getByRole("button", { name: "Fit graph", exact: true })).toBeEnabled();
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let attempt = 0; attempt < 32; attempt += 1) {
    await page.keyboard.press("Tab");
    if (await link.evaluate((node) => node === document.activeElement)) break;
  }
  await expect(link).toBeFocused();
  await expect(page).toHaveURL(/graph=entity-synthetic-finding$/);
  await expect(page.locator('[data-graph-node][data-selected="true"]')).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(`${origin}/.github/audits/#synthetic-finding`);
  report.checks.push(
    "Keyboard Tab still selects/recenters the node; Enter follows its destination.",
  );

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on("pageerror", (error) => report.errors.push(error.message));
  await mobilePage.goto(`${origin}/.github/intelligence/`);
  await expect(mobilePage.getByRole("button", { name: "Fit graph", exact: true })).toBeEnabled();
  const dimensions = await mobilePage.evaluate(() => ({
    viewport: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.equal(
    dimensions.viewport,
    390,
    "Long node labels must not expand the mobile layout viewport",
  );
  assert.ok(
    dimensions.scroll <= dimensions.viewport,
    "Graph controls must not cause horizontal overflow",
  );
  await mobilePage.screenshot({ path: join(output, "mobile-graph.png"), fullPage: true });
  await mobilePage.getByRole("link", { name, exact: true }).tap();
  await expect(mobilePage).toHaveURL(`${origin}/.github/audits/#synthetic-finding`);
  report.checks.push(
    "390px mobile selector stays bounded and the first touch activation opens its destination.",
  );
  assert.deepEqual(report.errors, []);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.errors.push(error instanceof Error ? error.message : String(error));
  throw error;
} finally {
  await writeFile(
    join(output, "verification.json"),
    `${JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  await browser?.close();
  await server?.close();
  await rm(cache, { recursive: true, force: true });
}
