import type { BrowserContext, Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const origin = "http://127.0.0.1:4173";
const unexpected = new WeakMap<BrowserContext, string[]>();
test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ context, page }) => {
  const problems: string[] = [];
  unexpected.set(context, problems);
  page.on("pageerror", (error) => problems.push(error.message));
  await context.routeWebSocket("**/*", (socket) => {
    problems.push(`Unexpected WebSocket: ${socket.url()}`);
    socket.close();
  });
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || request.method() !== "GET") {
      problems.push(`Unexpected request: ${request.method()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    const response = await route.fetch({ maxRedirects: 0 });
    if (response.status() >= 300) {
      problems.push(`Unexpected HTTP ${response.status()}: ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    return route.fulfill({ response });
  });
});

test.afterEach(async ({ context }) => {
  expect(unexpected.get(context)).toEqual([]);
});

async function tabTo(page: Page, locator: Locator) {
  for (let count = 0; count < 60; count += 1) {
    await page.keyboard.press("Tab");
    if (await locator.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error("Expected control was not reachable by Tab");
}

async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);
}

/** Selected flat surfaces only: resolve CSS colors and composite translucent ancestors. */
async function contrast(locator: Locator, focus = false) {
  return locator.evaluate((element, checkFocus) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    type Rgb = [number, number, number];
    type Rgba = [number, number, number, number];
    function rgba(value: string): Rgba {
      if (!context) throw new Error("Color parser is unavailable");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [red = 0, green = 0, blue = 0, alpha = 0] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255];
    }
    function over(front: Rgba, back: Rgb): Rgb {
      const alpha = front[3];
      return [
        front[0] * alpha + back[0] * (1 - alpha),
        front[1] * alpha + back[1] * (1 - alpha),
        front[2] * alpha + back[2] * (1 - alpha),
      ];
    }
    function composedBackground(start: Element | null): Rgb {
      if (!start) throw new Error("No opaque contrast background");
      const style = getComputedStyle(start);
      if (style.backgroundImage !== "none" || style.opacity !== "1") {
        throw new Error("Selected contrast surface requires visual background review");
      }
      const color = rgba(style.backgroundColor);
      if (color[3] === 1) return [color[0], color[1], color[2]];
      return over(color, composedBackground(start.parentElement));
    }

    const background = composedBackground(checkFocus ? element.parentElement : element);
    const style = getComputedStyle(element);
    const foreground = over(rgba(checkFocus ? style.outlineColor : style.color), background);
    function luminance(color: Rgb) {
      function linear(value: number) {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      }
      return linear(color[0]) * 0.2126 + linear(color[1]) * 0.7152 + linear(color[2]) * 0.0722;
    }
    const foregroundLuminance = luminance(foreground);
    const backgroundLuminance = luminance(background);
    return {
      text: element.textContent?.trim().slice(0, 100),
      foreground,
      background,
      ratio:
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
      outline: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  }, focus);
}

for (const theme of ["light", "dark", "high-contrast"]) {
  test(`selected shell, status and purchase text have measured contrast in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript((value) => localStorage.setItem("egohygiene-theme", value), theme);
    const evidence = [];
    for (const path of ["/", "/ecosystem", "/store/products/signal-heart-hoodie"]) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (path === "/ecosystem") {
        await expect(page.locator(".eh-badge--planned").first()).toBeVisible();
        await expect(page.locator(".eh-badge--development").first()).toBeVisible();
      }
      if (path.startsWith("/store/products/")) {
        await expect(page.locator(".store-purchase-status")).toHaveText(
          "Preview — not for sale yet",
        );
        await expect(page.locator(".store-purchase-panel > p").first()).toBeVisible();
      }
      const samples = page.locator(
        ".site-header .site-wordmark, .site-footer__identity p, .site-footer__legal a, .eh-badge, .store-badge, .store-purchase-status, .store-purchase-panel > p",
      );
      expect(await samples.count()).toBeGreaterThan(3);
      for (const sample of await samples.all()) {
        const measured = await contrast(sample);
        expect(measured.ratio, `${path}: ${measured.text}`).toBeGreaterThanOrEqual(4.5);
        evidence.push({ path, ...measured });
      }
    }
    await testInfo.attach("computed-text-contrast", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });

  test(`keyboard focus is visible on the shell and store in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript((value) => localStorage.setItem("egohygiene-theme", value), theme);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/store/catalog");
    const evidence = [];
    for (const target of [
      page.locator(".site-header .site-wordmark"),
      page.getByLabel("Theme", { exact: true }),
      page.getByRole("button", { name: "Everything", exact: true }),
    ]) {
      await tabTo(page, target);
      await expect(target).toBeFocused();
      const measured = await contrast(target, true);
      expect(measured.outline).toBe("solid");
      expect(measured.outlineWidth).toBeGreaterThanOrEqual(3);
      expect(measured.ratio).toBeGreaterThanOrEqual(3);
      evidence.push(measured);
    }
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await testInfo.attach("computed-focus-contrast", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });
}

test("forced colors preserve shell and store focus and the modal's semantic controls", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/store/designs/heartburst");
  const brand = page.locator(".site-header .site-wordmark");
  await tabTo(page, brand);
  await expect(brand).toHaveCSS("outline-style", "solid");
  const opener = page.getByRole("button", { name: "View artwork: heartburst", exact: true });
  await tabTo(page, opener);
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "heartburst", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close artwork viewer" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

// #70 CSS-pixel reference samples, plus either side of the actual 360/368/620/640/896/900px breakpoints.
const viewports = [
  [320, 568],
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [820, 1180],
  [1024, 768],
  [1280, 720],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
  [359, 800],
  [361, 800],
  [367, 800],
  [369, 800],
  [619, 800],
  [621, 800],
  [639, 800],
  [641, 800],
  [895, 800],
  [897, 800],
  [899, 800],
  [901, 800],
] as const;
const details = [
  "/store/products/signal-heart-hoodie",
  "/store/designs/heartburst",
  "/store/collections/static-bloom-collection",
  "/store/incompris/artists/play?view=songs",
];

for (const [index, [width, height]] of viewports.entries()) {
  test(`store surfaces reflow at ${width} × ${height} CSS pixels`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const path of [
      index % 2 ? "/store/catalog" : "/store",
      details[index % details.length] ?? details[0] ?? "/store",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await noOverflow(page);
    }
  });
}

for (const mode of ["root-text-200-percent", "400-percent-equivalent-reflow"] as const) {
  test(`${mode} preserves menu, filters, purchase status and artwork controls`, async ({
    page,
  }, testInfo) => {
    // Root font resizing and 320×256 CSS-pixel reflow are separate probes, not native browser zoom.
    await page.setViewportSize(
      mode === "root-text-200-percent" ? { width: 768, height: 1024 } : { width: 320, height: 256 },
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    if (mode === "root-text-200-percent") {
      await page.addInitScript(() => {
        addEventListener("DOMContentLoaded", () => {
          document.documentElement.style.fontSize = "200%";
        });
      });
    }
    await page.goto("/store/catalog");
    if (mode === "root-text-200-percent") {
      await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    }
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await page.getByRole("button", { name: "Close navigation" }).click();
    await page.getByRole("searchbox", { name: "Search the store" }).fill("signal heart");
    await page.getByRole("button", { name: "Objects", exact: true }).click();
    await noOverflow(page);
    await page
      .getByRole("article")
      .filter({ has: page.getByRole("heading", { name: "Signal Heart Hoodie", exact: true }) })
      .getByRole("link")
      .click();
    await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
    await noOverflow(page);
    await page
      .getByRole("button", { name: "View artwork: Signal Heart Hoodie", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Signal Heart Hoodie", exact: true });
    const close = dialog.getByRole("button", { name: "Close artwork viewer" });
    await expect(close).toBeFocused();
    await expect(close).toBeInViewport();
    const dimensions = await dialog.evaluate((element) => ({
      width: element.clientWidth,
      content: element.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width + 1);
    const capture = testInfo.outputPath(`${mode}.png`);
    await page.screenshot({ path: capture, fullPage: true });
    await testInfo.attach(mode, { path: capture, contentType: "image/png" });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
}
