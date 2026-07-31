import { expect, test } from "@playwright/test";

test("primary site loads, navigates, and supports theming", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Tools, ideas, and practices/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Learn what Ego Hygiene means/i }).click();
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
