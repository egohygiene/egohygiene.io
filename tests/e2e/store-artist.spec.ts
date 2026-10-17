import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const artistPath = "/store/incompris/artists/play";

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

test("Incompris leads to the real artist with truthful empty collections", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/store/incompris");
  const artistLink = page.getByRole("link").filter({
    has: page.getByRole("heading", { name: ".play()", exact: true }),
  });
  await expect(artistLink).toHaveAttribute("href", artistPath);
  await artistLink.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(".play()");
  await expect(
    page.getByRole("heading", { name: "The first designs are still taking shape." }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "heartburst", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Shop by song", exact: true }).click();
  await expect(page).toHaveURL(`${artistPath}?view=songs`);
  await expect(
    page.getByRole("heading", { name: "The first song collection is on its way." }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(".play()");
  await expect(page.getByRole("link", { name: "Shop by song", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page).toHaveTitle(".play() · Artist collection · Ego Hygiene");
  await expect(page.getByRole("link", { name: /buy|checkout|purchase|order now/i })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("artist view and search survive reload and Back without discarding source parameters", async ({
  page,
}) => {
  await page.goto(`${artistPath}?source=soundcloud&view=unknown`);
  const standalone = page.getByRole("link", { name: "Standalone & worlds", exact: true });
  await expect(standalone).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("searchbox", { name: "Search standalone designs and worlds" })
    .fill("future design");
  await expect(page.getByRole("heading", { name: "No matches in this view." })).toBeVisible();
  await page.getByRole("link", { name: "Shop by song", exact: true }).click();
  await expect(page).toHaveURL(/source=soundcloud/);
  await expect(page).toHaveURL(/view=songs/);
  const songSearch = page.getByRole("searchbox", { name: "Search song collections" });
  await expect(songSearch).toHaveValue("future design");
  await page.reload();
  await expect(songSearch).toHaveValue("future design");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page).toHaveURL(`${artistPath}?source=soundcloud&view=songs`);
  await expect(
    page.getByRole("heading", { name: "The first song collection is on its way." }),
  ).toBeVisible();
  await page.goBack();
  await expect(standalone).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("searchbox", { name: "Search standalone designs and worlds" }),
  ).toHaveValue("future design");
  await expect(page).toHaveURL(/source=soundcloud/);
});

test("unknown artist routes recover through Incompris", async ({ page }) => {
  await page.goto("/store/incompris/artists/missing-artist");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This artist collection isn’t here.",
  );
  await page.getByRole("link", { name: "Back to Incompris", exact: true }).click();
  await expect(page).toHaveURL("/store/incompris");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Incompris");
});

test("the artist views support keyboard use and fit a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(artistPath);
  await expectNoHorizontalOverflow(page);
  const songs = page.getByRole("link", { name: "Shop by song", exact: true });
  await tabTo(page, songs);
  await expect(songs).toBeFocused();
  await expect(songs).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(songs).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Tab");
  const search = page.getByRole("searchbox", { name: "Search song collections" });
  await expect(search).toBeFocused();
  await search.fill("a future collection with a long name");
  await expectNoHorizontalOverflow(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Clear search", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(search).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "The first song collection is on its way." }),
  ).toBeVisible();
});
