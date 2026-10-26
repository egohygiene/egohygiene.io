import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const consumerOrigin = "http://127.0.0.1:4186";
const storybookOrigin = "http://127.0.0.1:4187";
const failures = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page, context }) => {
  const errors: string[] = [];
  failures.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  await context.routeWebSocket("**/*", (socket) => {
    errors.push(`Unexpected WebSocket: ${socket.url()}`);
    socket.close();
  });
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (
      ![consumerOrigin, storybookOrigin].includes(new URL(request.url()).origin) ||
      request.method() !== "GET"
    ) {
      errors.push(`Unexpected request: ${request.method()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    const response = await route.fetch({ maxRedirects: 0 });
    if (response.status() >= 300)
      errors.push(`Unexpected HTTP ${response.status()}: ${request.url()}`);
    return route.fulfill({ response });
  });
});

test.afterEach(async ({ page }) => {
  expect(failures.get(page)).toEqual([]);
});

/** These label backgrounds are deliberately opaque/flat; reject unsupported rendering. */
async function labelContrast(target: Locator) {
  const ratio = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    function luminance(value: string) {
      if (!context) throw new Error("Color parser is unavailable");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const rgba = context.getImageData(0, 0, 1, 1).data;
      if (rgba[3] !== 255) throw new Error("Contrast sample must be opaque");
      return [0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
        const channel = (rgba[index] ?? 0) / 255;
        return (
          sum + weight * (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
        );
      }, 0);
    }
    if (style.backgroundImage !== "none" || style.opacity !== "1")
      throw new Error("Contrast sample requires flat styling");
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
  return ratio;
}

async function styledOrbit(page: Page) {
  const orbit = page.locator(".eh-orbit");
  await expect(orbit).toBeVisible();
  await expect(orbit).toHaveCSS("display", "grid");
  await expect(orbit).toHaveCSS("position", "relative");
  const bounds = await orbit.boundingBox();
  expect(bounds?.width).toBeCloseTo(220, 0);
  expect(bounds?.height).toBeCloseTo(220, 0);
  const core = orbit.locator(".eh-orbit__core");
  await expect(core).toHaveText("balance");
  await expect(core).toHaveCSS("display", "grid");
  await expect(orbit.locator(".eh-orbit__ring--outer")).toHaveCSS("border-top-style", "solid");
  return labelContrast(core);
}

function storyUrl(id: string, theme: string) {
  return `${storybookOrigin}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
}

for (const theme of ["light", "dark", "high-contrast"]) {
  test(`declared consumer and representative stories have real styles in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/?theme=${theme}`);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const standaloneRatio = await styledOrbit(page);
    await page.goto(storyUrl("components-button--primary", theme));
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const button = page.getByRole("button", { name: "Explore the ecosystem", exact: true });
    await expect(button).toBeVisible();
    await expect(button).toHaveCSS("display", "inline-flex");
    const padding = await button.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingInlineStart),
    );
    expect(padding).toBeGreaterThanOrEqual(12);
    const buttonRatio = await labelContrast(button);
    await button.focus();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expect(button).toHaveCSS("transition-duration", "0s");
    await page.goto(storyUrl("visualizations-orbit--default", theme));
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const storyRatio = await styledOrbit(page);
    await testInfo.attach("computed-component-style-samples", {
      body: JSON.stringify({ theme, standaloneRatio, buttonRatio, storyRatio }, null, 2),
      contentType: "application/json",
    });
  });
}

test("provider-owned ThemeToggle and toolbar-owned stories do not compete", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("egohygiene-theme", "high-contrast"));
  await page.goto(storyUrl("components-themetoggle--default", "light"));
  const control = page.getByLabel("Theme", { exact: true });
  await expect(control).toHaveValue("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await control.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(control).toHaveValue("dark");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("egohygiene-theme")))
    .toBe("dark");
  // A non-provider story must obey its explicit toolbar selection even with stored preference.
  await page.goto(storyUrl("components-button--primary", "light"));
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
});
