/** Local HTTP qualification of an exact, sealed export. Does not publish or claim live hosting. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium, expect } from "@playwright/test";

const { values } = parseArgs({ options: { "export-root": { type: "string" } } });
assert.ok(values["export-root"], "Supply the new sealed export with --export-root");
const repository = fileURLToPath(new URL("../../", import.meta.url));
const root = resolve(values["export-root"]);
const output = join(repository, "test-results/intelligence-overview");
await mkdir(output, { recursive: true });
const manifestRaw = await readFile(join(root, "export-manifest.json"));
const manifest = JSON.parse(manifestRaw.toString("utf8")) as {
  producer: { revision: string };
  target: { base_path: string };
  files: { path: string; sha256: string; size_bytes: number }[];
  routes: { id: string; path: string; canonical_path: string }[];
};
const endpointCount = new Set(
  manifest.routes
    .filter((route) => !["home", "intelligence"].includes(route.id))
    .map((route) => route.id),
).size;
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: repository,
  encoding: "utf8",
}).trim();
assert.equal(manifest.producer.revision, revision, "Review the exact exported source");
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const content = new Map<string, Buffer>();
for (const file of manifest.files) {
  assert.ok(!file.path.split("/").some((part) => ["", ".", ".."].includes(part)));
  const bytes = await readFile(join(root, "site", file.path));
  assert.equal(sha(bytes), file.sha256);
  assert.equal(bytes.byteLength, file.size_bytes);
  content.set(file.path, bytes);
}
const report = {
  scope:
    "Local HTTP replay of the exact sealed export, not canonical HTTPS or publication. Synthetic repository/URL edge cases are separate unit tests.",
  sourceCommit: revision,
  exportManifestSha256: sha(manifestRaw),
  node: process.version,
  browser: "",
  status: "running",
  checks: [] as string[],
  layouts: [] as {
    width: number;
    document: number;
    graphOpen: boolean;
    direction: string;
    fontScale: string;
  }[],
  pageErrors: [] as string[],
  consoleErrors: [] as { text: string; url: string }[],
  startedAt: new Date().toISOString(),
};
const types: Record<string, string> = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  json: "application/json",
  svg: "image/svg+xml",
};
const base = manifest.target.base_path;
assert.equal(base, "/.github/", "This qualification covers the org project Pages mount");
const server = createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://localhost").pathname;
  const relative = path.startsWith(base) ? path.slice(base.length) : null;
  const file =
    relative === null ? null : relative.endsWith("/") ? `${relative}index.html` : relative;
  const body = file === null ? undefined : content.get(file);
  if (!body) {
    response.writeHead(404).end();
    return;
  }
  response
    .writeHead(200, {
      "content-type": types[file?.split(".").at(-1) ?? ""] ?? "application/octet-stream",
    })
    .end(body);
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const address = server.address();
assert.ok(address && typeof address !== "string");
const origin = `http://127.0.0.1:${address.port}`;
const url = `${origin}${base}intelligence/`;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    headless: true,
  });
  report.browser = browser.version();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      report.consoleErrors.push({ text: message.text(), url: message.location().url });
  });
  await page.goto(url);
  await expect(page.getByRole("combobox", { name: "Appearance" })).toBeEnabled();
  const graph = page.locator(".oi-map-disclosure");
  await expect(graph).not.toHaveAttribute("open");
  await expect(page.locator(".oi-view-group")).toHaveCount(4);
  await expect(page.locator(".oi-view-list > li")).toHaveCount(endpointCount);
  await expect(page.locator(".oi-graph-canvas")).not.toBeVisible();
  report.checks.push(
    `Default overview has four compact view groups, all ${endpointCount} endpoints and a closed optional graph.`,
  );

  const groups = page.locator(".oi-view-group .oi-view-scope");
  const summary = groups.first().locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(groups.first()).toHaveAttribute("open");
  const focus = await summary.evaluate((element) => ({
    active: element === document.activeElement,
    width: getComputedStyle(element).outlineWidth,
  }));
  assert.equal(focus.active, true);
  assert.notEqual(focus.width, "0px");
  await page.keyboard.press("Enter");
  await expect(groups.first()).not.toHaveAttribute("open");
  report.checks.push(
    "Native scope disclosures toggle with the keyboard and keep a visible focus outline.",
  );

  await page.goto(`${url}?q=repository&evidence=partial`);
  const audit = page.locator(".oi-view-list").getByRole("link", { name: "Audits", exact: true });
  await expect(audit).toHaveAttribute("href", `${base}audits/?q=repository&evidence=partial`);
  await audit.click();
  await expect(page).toHaveURL(`${origin}${base}audits/?q=repository&evidence=partial`);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Audits", exact: true })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Organization Intelligence", exact: true }),
  ).toBeVisible();
  report.checks.push(
    "A grouped view keeps URL filters across navigation, direct refresh and Back at the project mount.",
  );

  await page.goto(url);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const graphOpen of [false, true]) {
      if (graphOpen) await graph.locator(":scope > summary").click();
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
        direction: document.documentElement.dir,
        fontScale: getComputedStyle(document.documentElement).fontSize,
      }));
      report.layouts.push({ ...layout, graphOpen });
      assert.ok(
        layout.document <= width,
        `No horizontal overflow at ${width}px, graph ${graphOpen}`,
      );
      if (!graphOpen && [390, 1440].includes(width))
        await page.screenshot({ path: join(output, `overview-${width}.png`), fullPage: true });
      if (graphOpen) await graph.locator(":scope > summary").click();
    }
  }
  report.checks.push(
    "320/390/768/1440px layouts stay within the viewport with the graph closed and open.",
  );

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.style.fontSize = "200%";
  });
  const expanded = await page.evaluate(() => ({
    width: innerWidth,
    document: document.documentElement.scrollWidth,
    direction: document.documentElement.dir,
    fontScale: getComputedStyle(document.documentElement).fontSize,
  }));
  report.layouts.push({ ...expanded, graphOpen: false });
  assert.ok(expanded.document <= expanded.width);
  report.checks.push(
    "The overview also remains bounded at 390px with RTL flow and 200% root text size.",
  );

  await page.goto(url);
  await graph.locator(":scope > summary").click();
  const select = page.locator(".oi-graph-controls select").first();
  const node = await select.locator("option").nth(1).getAttribute("value");
  assert.ok(node);
  await select.selectOption(node);
  await expect(page).toHaveURL(/graph=/);
  await page.reload();
  await expect(graph).toHaveAttribute("open");
  report.checks.push(
    "Selecting a graph node writes shared graph state and reload reopens the optional map.",
  );

  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noScript.newPage();
  await staticPage.goto(url);
  await expect(staticPage.locator(".oi-view-list a")).toHaveCount(endpointCount);
  const nativeScope = staticPage.locator(".oi-view-group .oi-view-scope").first();
  await nativeScope.locator("summary").click();
  await expect(nativeScope.locator("dl")).toBeVisible();
  await staticPage.locator(".oi-map-disclosure > summary").click();
  await expect(staticPage.locator(".oi-graph-directories")).toBeVisible();
  report.checks.push(
    "Without JavaScript all view links, native scope disclosures and the map's text directory remain usable.",
  );
  await noScript.close();
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(
    report.consoleErrors.filter((error) => error.url !== `${origin}/favicon.ico`),
    [],
  );
  for (const file of manifest.files)
    assert.equal(sha(await readFile(join(root, "site", file.path))), file.sha256);
  assert.equal(
    sha(await readFile(join(root, "export-manifest.json"))),
    report.exportManifestSha256,
  );
  report.checks.push(
    "No page exceptions or application console errors; sealed manifest and all files remain byte-identical after review. An origin-root favicon404, if requested, is recorded separately in consoleErrors.",
  );
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  throw error;
} finally {
  await writeFile(
    join(output, "verification.json"),
    `${JSON.stringify({ ...report, finishedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  await browser?.close();
  await new Promise<void>((done) => server.close(() => done()));
}
