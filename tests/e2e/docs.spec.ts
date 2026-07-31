import { expect, test } from "@playwright/test";

test("docs app loads and navigates", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Ego Hygiene Docs/i })).toBeVisible();
  await page.getByRole("link", { name: /Getting started/i }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Getting started/i })).toBeVisible();
});
