import { expect, test } from "@playwright/test";

for (const failure of ["storage getter", "getItem", "setItem"] as const) {
  test(`home and store remain usable when ${failure} is denied`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript((operation) => {
      const deny = () => {
        throw new DOMException("Storage is unavailable", "SecurityError");
      };
      if (operation === "storage getter") {
        Object.defineProperty(window, "localStorage", { configurable: true, get: deny });
      } else {
        Object.defineProperty(Storage.prototype, operation, { configurable: true, value: deny });
      }
    }, failure);

    for (const path of ["/", "/store"]) {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      const theme = page.getByLabel("Theme", { exact: true });
      await expect(theme).toHaveValue("system");
      await theme.selectOption("high-contrast");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
      await page.emulateMedia({ colorScheme: "dark" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
      await theme.selectOption("system");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await page.emulateMedia({ colorScheme: "light" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    }

    await page.getByRole("link", { name: "Catalog preview", exact: true }).click();
    await page.getByRole("searchbox", { name: "Search the store" }).fill("signal heart");
    await expect(
      page.getByRole("heading", { name: "Signal Heart Hoodie", exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("invalid persisted preferences fall back to the system theme", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => window.localStorage.setItem("egohygiene-theme", "invalid-theme"));
  await page.goto("/store");
  await expect(page.getByLabel("Theme", { exact: true })).toHaveValue("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});

test("manual preferences persist across reload and system mode resumes following the device", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/store");
  const theme = page.getByLabel("Theme", { exact: true });
  await theme.selectOption("high-contrast");
  await page.reload();
  await expect(theme).toHaveValue("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await theme.selectOption("light");
  await page.reload();
  await expect(theme).toHaveValue("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await theme.selectOption("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
