import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

function card(page: Page, title: string): Locator {
  return page.getByRole("article").filter({
    has: page.getByRole("heading", { name: title, exact: true }),
  });
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:4173") await route.continue();
    else await route.abort("blockedbyclient");
  });
});

test("missing artwork preserves a usable card, design page and dismissible viewer", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/store/heartburst/heartburst-light.webp", (route) => route.abort("failed"));
  await page.goto("/store/incompris");
  const design = card(page, "heartburst");
  await expect(design.getByRole("img", { name: "Artwork preview unavailable" })).toBeVisible();
  await expect(design).toContainText("Design preview");
  await design.getByRole("link").click();
  await expect(page).toHaveURL("/store/designs/heartburst");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("heartburst");
  const opener = page.getByRole("button", { name: "View artwork: heartburst", exact: true });
  await expect(opener.getByRole("img", { name: "Artwork preview unavailable" })).toBeVisible();
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "heartburst", exact: true });
  await expect(viewer.getByRole("img", { name: "Artwork preview unavailable" })).toBeVisible();
  await viewer.getByRole("button", { name: "Close artwork viewer" }).click();
  await expect(viewer).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(
    page.getByText("This design has room to grow. No objects are connected yet."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /buy|checkout|purchase|order now/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /buy|checkout|purchase|order now/i })).toHaveCount(
    0,
  );
  await page.goBack();
  await expect(design.getByRole("img", { name: "Artwork preview unavailable" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("filtered catalog history survives a canonical product reload, Back and Forward", async ({
  page,
}) => {
  const catalogPath = "/store/catalog?source=soundcloud&q=static&view=product&story=connected";
  const productPath = "/store/products/static-bloom-mug";
  await page.goto(catalogPath);
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue("static");
  await expect(card(page, "Static Bloom Mug").getByRole("link")).toHaveAttribute(
    "href",
    productPath,
  );
  await card(page, "Static Bloom Mug").getByRole("link").click();
  await page.reload();
  await expect(page).toHaveURL(productPath);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Mug");
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(catalogPath);
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue("static");
  await expect(page.getByRole("button", { name: "Objects", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("combobox", { name: "Browse by story" })).toHaveValue("connected");
  await expect(
    page.getByRole("region", { name: "Find your frequency." }).getByRole("article"),
  ).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveURL(productPath);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Mug");
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
});

test("unknown nested routes and isolated preview routes recover in the normal build", async ({
  page,
}) => {
  for (const path of [
    "/store/not-a-collection/nothing-here",
    "/store/preview/artists/demo-artist",
    "/store/preview/fourthwall",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("heading", { name: "Demo artist", exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: "Return home", exact: true }).click();
    await expect(page).toHaveURL("/");
  }
});

test.describe("tablet touch journey", () => {
  test.use({ viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true });

  test("the shop hierarchy and canonical artwork remain usable with touch", async ({ page }) => {
    await page.goto("/store");
    await page.getByRole("link", { name: "Explore Incompris", exact: true }).tap();
    await page
      .getByRole("link")
      .filter({ has: page.getByRole("heading", { name: ".play()", exact: true }) })
      .tap();
    await page.getByRole("link", { name: "Shop by song", exact: true }).tap();
    await expect(page).toHaveURL("/store/incompris/artists/play?view=songs");
    await expect(
      page.getByRole("heading", { name: "The first song collection is on its way." }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("link", { name: "Back to Incompris", exact: true }).tap();
    await page.getByRole("link", { name: "Catalog preview", exact: true }).tap();
    await page.getByRole("searchbox", { name: "Search the store" }).fill("static bloom");
    await page.getByRole("button", { name: "Objects", exact: true }).tap();
    await card(page, "Static Bloom Mug").getByRole("link").tap();
    await expect(page).toHaveURL("/store/products/static-bloom-mug");
    await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "View artwork: Static Bloom Mug", exact: true }).tap();
    const viewer = page.getByRole("dialog", { name: "Static Bloom Mug", exact: true });
    await expect(viewer).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await viewer.getByRole("button", { name: "Close artwork viewer" }).tap();
    await expect(viewer).toHaveCount(0);
    await page.goBack();
    await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue(
      "static bloom",
    );
  });
});
