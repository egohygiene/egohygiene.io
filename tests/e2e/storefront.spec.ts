import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

function heartburstCard(page: Page): Locator {
  return page.getByRole("article").filter({
    has: page.getByRole("heading", { level: 3, name: "heartburst", exact: true }),
  });
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function tabTo(page: Page, target: Locator): Promise<void> {
  for (let index = 0; index < 35; index += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  await expect(target).toBeFocused();
}

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:4173") await route.continue();
    else await route.abort("blockedbyclient");
  });
});

test("the curated shop leads through Incompris to the same canonical design", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/store");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ego Hygiene");
  const primaryCollection = page.getByRole("region", {
    name: "Ego Hygiene merchandise",
    exact: true,
  });
  await expect(primaryCollection).toContainText("There are no Ego Hygiene products available yet.");
  await expect(primaryCollection.getByRole("article")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Featured from Incompris", exact: true }),
  ).toBeVisible();
  await expect(heartburstCard(page)).toHaveCount(1);
  const canonicalPath = "/store/designs/heartburst";
  await expect(heartburstCard(page).getByRole("link")).toHaveAttribute("href", canonicalPath);
  await expect(page.getByRole("heading", { name: "Signal Heart Hoodie", exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: /buy|checkout|purchase|order now/i })).toHaveCount(0);
  await expect(page.locator('a[href*="/artists/"]')).toHaveCount(0);

  await page.getByRole("link", { name: "Explore Incompris", exact: true }).click();
  await expect(page).toHaveURL(/\/store\/incompris$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Incompris");
  await expect(heartburstCard(page).getByRole("link")).toHaveAttribute("href", canonicalPath);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Incompris");
  await heartburstCard(page).getByRole("link").click();
  await expect(page).toHaveURL(canonicalPath);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("heartburst");
  await expect(
    page.getByText("This design has room to grow. No objects are connected yet."),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/store\/incompris$/);
  await expect(heartburstCard(page)).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/store$/);
  expect(errors).toEqual([]);
});

test("catalog examples stay available through their explicitly labeled preview entrance", async ({
  page,
}) => {
  await page.goto("/store");
  await page.getByRole("link", { name: "Catalog preview", exact: true }).click();
  await expect(page).toHaveURL(/\/store\/catalog$/);
  const catalog = page.getByRole("region", { name: "Find your frequency." });
  await expect(catalog.getByRole("article")).toHaveCount(8);
  await expect(
    page.getByRole("heading", { name: "Signal Heart Hoodie", exact: true }),
  ).toBeVisible();
  await expect(heartburstCard(page).getByRole("link")).toHaveAttribute(
    "href",
    "/store/designs/heartburst",
  );
});

test("existing filter and section links retain their state at the catalog destination", async ({
  page,
}) => {
  await page.goto("/store?source=shared&q=static%20bloom&view=product&story=connected#catalog");
  await expect(page).toHaveURL(
    "/store/catalog?source=shared&q=static%20bloom&view=product&story=connected#catalog",
  );
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue(
    "static bloom",
  );
  await expect(page.getByRole("button", { name: "Objects", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("combobox", { name: "Browse by story" })).toHaveValue("connected");
  await expect(
    page.getByRole("region", { name: "Find your frequency." }).getByRole("article"),
  ).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Static Bloom Mug", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue(
    "static bloom",
  );
  await page.goto("/store?source=shared#worlds");
  await expect(page).toHaveURL("/store/catalog?source=shared#worlds");
  await expect(
    page.getByRole("heading", { name: "Find a world. Or make your own.", exact: true }),
  ).toBeInViewport();
  await page.goto("/store?source=shared");
  await expect(page).toHaveURL("/store?source=shared");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ego Hygiene");
});

test("the shop and collection support keyboard navigation with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/store");
  const explore = page.getByRole("link", { name: "Explore Incompris", exact: true });
  await tabTo(page, explore);
  await expect(explore).toBeFocused();
  await expect(explore).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/store\/incompris$/);
  const artworkLink = heartburstCard(page).getByRole("link");
  await tabTo(page, artworkLink);
  await expect(artworkLink).toBeFocused();
  await artworkLink.hover();
  await expect(artworkLink.locator("img")).toHaveCSS("transition-duration", "0s");
  await expect(artworkLink.locator("img")).toHaveCSS("transform", "none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/store\/designs\/heartburst$/);
});

test("the shop and Incompris collection fit narrow, tablet and desktop screens", async ({
  page,
}) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/store", "/store/incompris"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(heartburstCard(page)).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
    }
  }
});
