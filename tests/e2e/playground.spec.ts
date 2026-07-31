import { expect, test } from "@playwright/test";

test("playground app loads shared components", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Playground/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Visualization" })).toBeVisible();
});
