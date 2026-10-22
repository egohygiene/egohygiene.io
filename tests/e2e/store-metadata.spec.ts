import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const failures = new WeakMap<Page, string[]>();

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ context, page, baseURL }) => {
  const observed: string[] = [];
  failures.set(page, observed);
  const origin = new URL(baseURL ?? "http://127.0.0.1:4173").origin;
  page.on("pageerror", (error) => observed.push(error.message));
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || request.method() !== "GET") {
      observed.push(`Blocked request: ${request.method()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    const response = await route.fetch({ maxRedirects: 0 });
    if (response.status() >= 300) {
      observed.push(`Unexpected response: ${response.status()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    return route.fulfill({ response });
  });
  await context.routeWebSocket("**/*", (socket) => {
    observed.push(`Blocked WebSocket: ${socket.url()}`);
    socket.close();
  });
});

test.afterEach(async ({ page }) => {
  expect(
    failures.get(page),
    "Metadata journeys must not request providers or broken assets",
  ).toEqual([]);
});

async function expectMetadata(page: Page, title: string, description: string) {
  await expect(page).toHaveTitle(title);
  const descriptions = page.locator('head meta[name="description"]');
  await expect(descriptions).toHaveCount(1);
  await expect(descriptions).toHaveAttribute("content", description);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
}

const home = {
  title: "Ego Hygiene — A little more human",
  description:
    "A growing home for self-awareness, creative expression, and thoughtful tools. Explore Ego Hygiene and its community store.",
};
const shop = {
  title: "The community store · Ego Hygiene",
  description:
    "The Ego Hygiene community store, with a growing collection of merchandise and selected artwork from Incompris.",
};
const incompris = {
  title: "Incompris collection · Ego Hygiene",
  description: "Explore the Incompris creative collection within the Ego Hygiene community store.",
};
const heartburst = {
  path: "/store/designs/heartburst",
  title: "heartburst · Ego Hygiene",
  heading: "heartburst",
  description:
    "An electric fuchsia heart surrounded by black ink splashes, long drips and scattered pastel marks. A standalone design study; garment ideas are still taking shape.",
};

test("SPA navigation and history replace route metadata without duplicate descriptions", async ({
  page,
}) => {
  await page.goto("/");
  await expectMetadata(page, home.title, home.description);
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Store" })
    .click();
  await expect(page).toHaveURL("/store");
  await expectMetadata(page, shop.title, shop.description);
  await page.getByRole("link", { name: "Explore Incompris", exact: true }).click();
  await expect(page).toHaveURL("/store/incompris");
  await expectMetadata(page, incompris.title, incompris.description);
  await page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "heartburst", exact: true }) })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(heartburst.path);
  await expectMetadata(page, heartburst.title, heartburst.description);
  const artwork = page.locator('img[src="/store/heartburst/heartburst-light.webp"]').first();
  await expect(artwork).toBeVisible();
  await expect
    .poll(() => artwork.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBe(1200);
  await page.goBack();
  await expectMetadata(page, incompris.title, incompris.description);
  await page.goForward();
  await expectMetadata(page, heartburst.title, heartburst.description);
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Home" })
    .click();
  await expect(page).toHaveURL("/");
  await expectMetadata(page, home.title, home.description);
});

test("direct and reloaded catalog routes expose their own title and description", async ({
  page,
}) => {
  const routes = [
    heartburst,
    {
      path: "/store/products/static-bloom-mug",
      title: "Static Bloom Mug · Ego Hygiene",
      heading: "Static Bloom Mug",
      description:
        "Fictional mug preview featuring the demo song artwork. Materials, price, and fulfillment have not been selected.",
    },
    {
      path: "/store/collections/static-bloom-collection",
      title: "The Static Bloom Collection · Ego Hygiene",
      heading: "The Static Bloom Collection",
      description:
        "Fictional collection showing how one song can bring together related artwork and merchandise.",
    },
    {
      path: "/store/incompris/artists/play?view=songs",
      title: ".play() · Artist collection · Ego Hygiene",
      heading: ".play()",
      description:
        "Explore an Incompris artist’s standalone designs and collections inspired by individual songs.",
    },
  ];
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    await expectMetadata(page, route.title, route.description);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await page.reload();
    await expect(page).toHaveURL(route.path);
    await expectMetadata(page, route.title, route.description);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page.getByRole("link", { name: /buy|checkout|purchase|order now/i })).toHaveCount(
      0,
    );
  }
});

test("missing product and artist routes reset metadata when their recovery links are followed", async ({
  page,
}) => {
  await page.goto("/store/products/qualification-missing-product");
  await expectMetadata(
    page,
    "Nothing here yet · Ego Hygiene",
    "This store page could not be found. Explore the current Ego Hygiene catalog.",
  );
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This object isn’t here.");
  await page.getByRole("link", { name: "Back to the store", exact: true }).click();
  await expect(page).toHaveURL("/store");
  await expectMetadata(page, shop.title, shop.description);

  await page.goto("/store/incompris/artists/qualification-missing-artist");
  await expectMetadata(
    page,
    "Artist collection not found · Ego Hygiene",
    "The link may have changed, or the collection may not be ready to share. Explore Incompris to find the available artist collections.",
  );
  await page.getByRole("link", { name: "Back to Incompris", exact: true }).click();
  await expect(page).toHaveURL("/store/incompris");
  await expectMetadata(page, incompris.title, incompris.description);
});
