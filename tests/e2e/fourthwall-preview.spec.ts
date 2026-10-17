import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 960 },
  { width: 390, height: 844 },
]) {
  test(`local Fourthwall tryout selects variants without leaving the site at ${viewport.width}px`, async ({
    page,
    context,
  }, testInfo) => {
    const externalRequests: string[] = [];
    const errors: string[] = [];
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === "http://127.0.0.1:4174") await route.continue();
      else {
        externalRequests.push(url.origin);
        await route.abort("blockedbyclient");
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("/store");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    await page.getByRole("link", { name: "Catalog preview", exact: true }).click();
    await page.getByRole("link", { name: "Try the Fourthwall demo" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("A signal you can wear.");
    await expect(page.getByText("Local tryout · fictional product")).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    const screenshot = testInfo.outputPath(`fourthwall-${viewport.width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach("Fourthwall local tryout", {
      path: screenshot,
      contentType: "image/png",
    });
    await expect(page.getByRole("button", { name: "Preview checkout handoff" })).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "XL — unavailable in this example" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "S", exact: true }).click();
    await page.getByRole("combobox", { name: "Quantity", exact: true }).selectOption("2");
    await page.getByRole("button", { name: "Preview checkout handoff" }).click();
    const handoff = page.getByRole("region", { name: "Checkout handoff preview" });
    await expect(handoff).toContainText("Signal Heart Hoodie");
    await expect(handoff).toContainText("$84.00");
    await expect(handoff).toContainText("This tryout sends nothing.");
    await expect(page).toHaveURL(/\/store\/preview\/fourthwall$/);
    await page.getByRole("button", { name: "M", exact: true }).click();
    await expect(handoff.getByRole("heading")).toHaveText("The art stays personal.");
    await page.reload();
    await expect(page.getByRole("button", { name: "Preview checkout handoff" })).toBeDisabled();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    expect(externalRequests).toEqual([]);
    expect(errors).toEqual([]);
    await page.getByRole("link", { name: "See the catalog concept" }).click();
    await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
  });
}
