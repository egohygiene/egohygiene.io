import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 20; count += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  await expect(target, "Shared controls must remain reachable by Tab").toBeFocused();
}

/** These selected components have opaque flat backgrounds; reject unsupported surfaces. */
async function opaqueTextContrast(target: Locator) {
  return target.evaluate((element) => {
    const style = getComputedStyle(element);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    function color(value: string) {
      if (!context) throw new Error("Color parser is unavailable");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data);
    }
    const foreground = color(style.color);
    const background = color(style.backgroundColor);
    if (style.backgroundImage !== "none" || style.opacity !== "1" || background[3] !== 255) {
      throw new Error("This contrast sample requires a fully opaque, flat surface");
    }
    if (foreground[3] !== 255) throw new Error("This contrast sample requires opaque text");
    function luminance(rgb: number[]) {
      const linear = rgb.slice(0, 3).map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
    }
    const front = luminance(foreground);
    const back = luminance(background);
    return {
      text: element.textContent?.trim(),
      foreground,
      background,
      ratio: (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05),
    };
  });
}

test("playground app loads shared components", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Playground/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Visualization" })).toBeVisible();
});

// #49: this consumer imports the shared styles without the public website's overrides.
// Keep browser execution deferred to the final local pass; listing these tests is not a pass.
for (const theme of ["light", "dark", "high-contrast"]) {
  test(`shared action text and changing motion preferences work independently in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.getByLabel("Theme", { exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const primary = page.getByRole("button", { name: "Primary", exact: true });
    const secondary = page.getByRole("button", { name: "Secondary", exact: true });
    const ghost = page.getByRole("button", { name: "Ghost", exact: true });
    const spinner = page.getByRole("status", { name: "Loading", exact: true });
    const evidence = [];
    for (const sample of [primary, secondary, page.locator(".eh-orbit__core")]) {
      const measured = await opaqueTextContrast(sample);
      expect(measured.ratio, measured.text).toBeGreaterThanOrEqual(4.5);
      evidence.push(measured);
    }
    await expect(spinner).toBeVisible();
    await expect(spinner).not.toHaveCSS("animation-name", "none");
    const initialTransitions = await primary.evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(",")
        .map((value) => Number.parseFloat(value)),
    );
    expect(initialTransitions.some((duration) => duration > 0)).toBe(true);

    // Simulate a downstream scrolling preference after the package CSS has loaded.
    // Reduced motion must still win without the main website's application override.
    await page.addStyleTag({ content: "html { scroll-behavior: smooth; }" });
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await expect(spinner).toHaveCSS("animation-name", "none");
    await expect(spinner).toHaveAccessibleName("Loading");
    for (const target of [primary, secondary, ghost]) {
      await target.hover();
      await expect(target).toHaveCSS("transition-duration", "0s");
      await expect(target).toHaveCSS("transform", "none");
      await tabTo(page, target);
      await expect(target).toBeFocused();
      await expect(target).toHaveCSS("outline-style", "solid");
      const width = await target.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).outlineWidth),
      );
      expect(width).toBeGreaterThanOrEqual(3);
    }
    await page.keyboard.press("Shift+Tab");
    await expect(secondary).toBeFocused();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(spinner).not.toHaveCSS("animation-name", "none");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
    await testInfo.attach("shared-opaque-text-contrast", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });
}

test("forced colors preserve shared controls, loading status and readable visualization text", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/");
  const themeControl = page.getByLabel("Theme", { exact: true });
  for (const theme of ["light", "dark", "high-contrast"]) {
    await themeControl.selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await themeControl.blur();
    for (const target of [
      themeControl,
      page.getByRole("button", { name: "Primary", exact: true }),
      page.getByRole("button", { name: "Secondary", exact: true }),
      page.getByRole("button", { name: "Ghost", exact: true }),
    ]) {
      await tabTo(page, target);
      await expect(target).toBeFocused();
      await expect(target).toHaveCSS("outline-style", "solid");
      const width = await target.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).outlineWidth),
      );
      expect(width).toBeGreaterThanOrEqual(3);
    }
    const spinner = page.getByRole("status", { name: "Loading", exact: true });
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveCSS("animation-name", "none");
    await expect(spinner).toHaveCSS("border-top-style", "solid");
    const spinnerWidth = await spinner.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).borderTopWidth),
    );
    expect(spinnerWidth).toBeGreaterThan(0);
    for (const label of ["available", "development", "planned", "balance"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  }
});
