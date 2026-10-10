import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

function catalog(page: Page): Locator {
  return page.getByRole("region", { name: "Find your frequency." });
}

function card(page: Page, title: string): Locator {
  return page.getByRole("article").filter({
    has: page.getByRole("heading", { level: 3, name: title, exact: true }),
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
  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  await expect(target).toBeFocused();
}

test.beforeEach(async ({ context }) => {
  // The mock catalog never needs a provider, payment service, or third-party request.
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:4173") await route.continue();
    else await route.abort("blockedbyclient");
  });
});

test("the production store presents a labeled preview and all public catalog entries", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/store");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Objects with\s*a world inside\./);
  await expect(page).toHaveTitle("Objects with a world inside · Ego Hygiene");
  await expect(page.getByRole("complementary", { name: "Store preview" })).toContainText("nothing is available to purchase yet");
  await expect(catalog(page).getByRole("article")).toHaveCount(7);
  await expect(catalog(page).getByRole("status")).toHaveText("7 entries to explore");
  await expect(card(page, "Signal Heart Hoodie")).toContainText("Preview");
  await expect(card(page, "Unwritten Realm Comic")).toContainText("Unavailable");
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
  const screenshotPath = testInfo.outputPath("store-desktop.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach("store-desktop", { path: screenshotPath, contentType: "image/png" });
});

test("search and type filters compose, survive reload, and recover from empty results", async ({ page }) => {
  await page.goto("/store");
  const search = page.getByRole("searchbox", { name: "Search the store" });
  await search.fill("static bloom");
  await expect(catalog(page).getByRole("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Objects", exact: true }).click();
  await expect(catalog(page).getByRole("article")).toHaveCount(1);
  await expect(card(page, "Static Bloom Mug")).toBeVisible();
  await page.reload();
  await expect(search).toHaveValue("static bloom");
  await expect(page.getByRole("button", { name: "Objects", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(catalog(page).getByRole("article")).toHaveCount(1);
  await search.fill("a search that cannot match any current entry");
  await expect(catalog(page).getByRole("article")).toHaveCount(0);
  await expect(catalog(page).getByRole("status")).toContainText("0 entries");
  await page.getByRole("button", { name: "Reset search and filters" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("button", { name: "Everything", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(catalog(page).getByRole("article")).toHaveCount(7);
});

test("a collection leads to its product, shared design, and the collection again", async ({ page }) => {
  await page.goto("/store?view=collection");
  await card(page, "The Static Bloom Collection").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Static Bloom Collection");
  await card(page, "Static Bloom Mug").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Mug");
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Static Bloom Artwork", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Artwork");
  await expect(card(page, "Static Bloom Mug")).toBeVisible();
  await card(page, "The Static Bloom Collection").getByRole("link").click();
  await expect(page).toHaveURL(/\/store\/collections\/static-bloom-collection$/);
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Store", exact: true }).click();
  await expect(catalog(page).getByRole("article")).toHaveCount(7);
});

test("product, design, and collection deep links survive a full page reload", async ({ page }) => {
  const destinations = [
    ["/store/products/signal-heart-hoodie", "Signal Heart Hoodie"],
    ["/store/designs/signal-heart", "Signal Heart"],
    ["/store/collections/static-bloom-collection", "The Static Bloom Collection"],
  ] as const;
  for (const [path, title] of destinations) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} · Ego Hygiene`);
  }
});

test("detail navigation resets scrolling, Back restores it, and section links remain usable", async ({ page }) => {
  await page.goto("/store");
  await page.getByRole("link", { name: "Explore the collection", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Find your frequency.", exact: true })).toBeInViewport();
  const hoodie = card(page, "Signal Heart Hoodie").getByRole("link");
  await hoodie.scrollIntoViewIfNeeded();
  const catalogScroll = await page.evaluate(() => window.scrollY);
  expect(catalogScroll).toBeGreaterThan(100);
  await hoodie.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Signal Heart Hoodie");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.goBack();
  await expect(catalog(page).getByRole("article")).toHaveCount(7);
  await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - catalogScroll)).toBeLessThan(3);
  await page.goto("/store/designs/signal-heart#design-objects");
  await expect(page.getByRole("heading", { name: "Where this design lives.", exact: true })).toBeInViewport();
});

test("unknown and mismatched slugs provide a usable route back to the catalog", async ({ page }) => {
  const destinations = [
    ["/store/products/missing-object", "This object isn’t here."],
    ["/store/designs/signal-heart-hoodie", "This design isn’t here."],
    ["/store/collections/missing-collection", "This collection isn’t here."],
  ] as const;
  for (const [path, heading] of destinations) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await page.getByRole("link", { name: "Back to the store" }).click();
    await expect(catalog(page).getByRole("article")).toHaveCount(7);
  }
});

test("every mock product is explicit about availability and offers no purchase action", async ({ page }) => {
  for (const slug of ["signal-heart-hoodie", "static-bloom-mug", "unwritten-realm-comic"]) {
    await page.goto(`/store/products/${slug}`);
    const shell = page.locator(".store-shell");
    const expectedStatus = slug === "unwritten-realm-comic" ? "Not available to purchase" : "Preview — not for sale yet";
    await expect(shell.getByText(expectedStatus, { exact: true })).toBeVisible();
    await expect(shell.getByRole("link", { name: /buy|checkout|purchase|order now/i })).toHaveCount(0);
    await expect(shell.getByRole("button", { name: /buy|checkout|purchase|order now/i })).toHaveCount(0);
    const destinations = await shell.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(destinations.every((href) => href?.startsWith("/store") || href?.startsWith("#"))).toBe(true);
    await expect(shell.getByText("Concept artwork · placeholder", { exact: true }).first()).toBeVisible();
  }
});

test("keyboard browsing exposes focus and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/store");
  const everything = page.getByRole("button", { name: "Everything", exact: true });
  await tabTo(page, everything);
  await expect(everything).toBeFocused();
  await expect(everything).toHaveCSS("outline-style", "solid");
  await expect(everything).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Tab");
  const objects = page.getByRole("button", { name: "Objects", exact: true });
  await expect(objects).toBeFocused();
  await page.keyboard.press("Space");
  await expect(objects).toHaveAttribute("aria-pressed", "true");
  await expect(catalog(page).getByRole("article")).toHaveCount(3);
  const firstCard = catalog(page).getByRole("article").first();
  await firstCard.getByRole("link").hover();
  await expect(firstCard.locator("svg").first()).toHaveCSS("transition-duration", "0s");
  await expect(firstCard.locator("svg").first()).toHaveCSS("transform", "none");
});

test.describe("mobile store", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("navigation, search, and product detail work on a narrow screen", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Store", exact: true }).click();
    await expect(page).toHaveURL(/\/store$/);
    await expect(page.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);
    const screenshotPath = testInfo.outputPath("store-mobile.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach("store-mobile", { path: screenshotPath, contentType: "image/png" });
    await page.getByRole("searchbox", { name: "Search the store" }).fill("signal heart");
    await page.getByRole("button", { name: "Objects", exact: true }).click();
    await expect(catalog(page).getByRole("article")).toHaveCount(1);
    await card(page, "Signal Heart Hoodie").getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Signal Heart Hoodie");
    await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("all themes and detail layouts fit mobile without horizontal scrolling", async ({ page }) => {
    await page.goto("/store");
    for (const theme of ["light", "dark", "high-contrast"]) {
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await page.getByLabel("Theme", { exact: true }).selectOption(theme);
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expectNoHorizontalOverflow(page);
      await expect(catalog(page).getByRole("button", { name: "Objects", exact: true })).toBeVisible();
    }
    for (const path of ["/store/designs/signal-heart", "/store/collections/static-bloom-collection", "/store/products/unwritten-realm-comic"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
});
