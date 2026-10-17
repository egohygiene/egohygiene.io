import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const artistPath = "/store/preview/artists/demo-artist";

function card(page: Page, title: string): Locator {
  return page.getByRole("article").filter({
    has: page.getByRole("heading", { name: title, exact: true }),
  });
}

test.beforeEach(async ({ context }) => {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:4174") await route.continue();
    else await route.abort("blockedbyclient");
  });
});

test("fictional artist search is limited to the selected view and preserves URL state", async ({
  page,
}) => {
  await page.goto(`${artistPath}?source=preview`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demo artist");
  await expect(
    page.getByRole("heading", { name: "Fictional artist preview", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(3);
  const search = page.getByRole("searchbox", { name: "Search standalone designs and worlds" });
  await search.fill("signal heart");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(card(page, "Signal Heart Hoodie")).toBeVisible();
  await page.reload();
  await expect(search).toHaveValue("signal heart");
  await page.getByRole("link", { name: "Shop by song", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No matches in this view." })).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page).toHaveURL(`${artistPath}?source=preview&view=songs`);
  await expect(card(page, "The Static Bloom Collection")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("standalone and song browsing reach the same product and support deep links and Back", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${artistPath}?source=shared&q=static`);
  const standaloneProduct = card(page, "Static Bloom Mug").getByRole("link");
  const canonicalProductPath = "/store/products/static-bloom-mug";
  await expect(standaloneProduct).toHaveAttribute("href", canonicalProductPath);
  await standaloneProduct.click();
  await expect(page).toHaveURL(canonicalProductPath);
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("searchbox", { name: "Search standalone designs and worlds" }),
  ).toHaveValue("static");
  await page.getByRole("link", { name: "Shop by song", exact: true }).click();
  const artistSongUrl = page.url();
  const collection = card(page, "The Static Bloom Collection").getByRole("link");
  const canonicalCollectionPath = "/store/collections/static-bloom-collection";
  await expect(collection).toHaveAttribute("href", canonicalCollectionPath);
  await collection.click();
  await expect(page).toHaveURL(canonicalCollectionPath);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Static Bloom Collection");
  const songProduct = card(page, "Static Bloom Mug").getByRole("link");
  await expect(songProduct).toHaveAttribute("href", canonicalProductPath);
  await songProduct.click();
  await expect(page).toHaveURL(canonicalProductPath);
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL(artistSongUrl);
  await expect(page.getByRole("searchbox", { name: "Search song collections" })).toHaveValue(
    "static",
  );
  await expect(page.getByRole("link", { name: "Shop by song", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(errors).toEqual([]);
});

test("populated artist views fit a phone and retain canonical destinations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(artistPath);
  for (const view of ["Standalone & worlds", "Shop by song"]) {
    await page.getByRole("link", { name: view, exact: true }).click();
    await expect(page.getByRole("article").first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
  await card(page, "The Static Bloom Collection").getByRole("link").click();
  await expect(page).toHaveURL("/store/collections/static-bloom-collection");
  await card(page, "Static Bloom Mug").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Mug");
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
});
