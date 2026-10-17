import { expect, test } from "@playwright/test";

test("primary site loads, navigates, and supports theming", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /A little more human/i })).toBeVisible();
  await page.getByRole("link", { name: /Discover Ego Hygiene/i }).click();
  await expect(page.getByRole("heading", { level: 1, name: /About Ego Hygiene/i })).toBeVisible();
  await page.goto("/ecosystem");
  await expect(
    page.getByRole("heading", { level: 1, name: /The Ego Hygiene ecosystem/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Mindcap" })).toBeVisible();
  await page.getByLabel("Theme").selectOption("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await page.goto("/missing-route");
  await expect(page.getByRole("heading", { level: 1, name: /Page not found/i })).toBeVisible();
});

test("mobile navigation closes with Escape and follows the store route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Store" })
    .focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Store" })
    .click();
  await expect(page).toHaveURL(/\/store$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("short mobile navigation keeps the theme control reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 300 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const theme = page.getByRole("combobox", { name: "Theme" });
  await theme.focus();
  const bounds = await theme.boundingBox();
  expect(bounds).not.toBeNull();
  expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(300);
  await theme.selectOption("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});

test("skip link closes the menu and reveals the start of the main content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  const header = await page.getByRole("banner").boundingBox();
  const start = await page.locator(".landing-hero__copy > .landing-kicker").boundingBox();
  expect(header).not.toBeNull();
  expect(start).not.toBeNull();
  expect(start?.y).toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0));
});
