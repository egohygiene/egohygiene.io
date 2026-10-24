import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { installHandoffBoundary } from "../checkout-handoff/network";

const observed = new WeakMap<
  Page,
  {
    boundary: Awaited<ReturnType<typeof installHandoffBoundary>>;
    errors: string[];
  }
>();

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ context, page, baseURL }) => {
  const origin = new URL(baseURL ?? "http://127.0.0.1:4173").origin;
  const boundary = await installHandoffBoundary(context, origin);
  const errors: string[] = [];
  observed.set(page, { boundary, errors });
  page.on("pageerror", (error) => errors.push(error.message));
  // Production React reports recoverable hydration failures to console.error.
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  const result = observed.get(page);
  expect(result, "The local-only browser boundary must be installed").toBeDefined();
  expect(result?.boundary.blocked).toEqual([]);
  expect(result?.boundary.blockedWebSockets).toEqual([]);
  expect(result?.boundary.intercepted, "These journeys never activate a provider link").toEqual([]);
  expect(result?.errors, "No page errors or recoverable hydration errors").toEqual([]);
});

async function expectIdentity(page: Page, path: string, robots = "index,follow") {
  const canonical = page.locator('head link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute("href", `https://egohygiene.io${path}`);
  const socialUrl = page.locator('head meta[property="og:url"]');
  await expect(socialUrl).toHaveCount(1);
  await expect(socialUrl).toHaveAttribute("content", `https://egohygiene.io${path}`);
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", robots);
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute("content", /\S/);
  await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
    "content",
    await page.title(),
  );
  await expect(page.locator('head meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    await page.title(),
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
}

const rawDestinations = [
  {
    path: "/",
    heading: "A little more human.",
    title: "Ego Hygiene — A little more human",
    indexable: true,
  },
  {
    path: "/store",
    heading: "The Ego Hygiene store.",
    title: "The community store · Ego Hygiene",
    indexable: true,
  },
  {
    path: "/store/incompris/artists/play",
    heading: ".play()",
    title: ".play() · Artist collection · Ego Hygiene",
    indexable: true,
  },
  {
    path: "/store/designs/heartburst",
    heading: "heartburst",
    title: "heartburst · Ego Hygiene",
    indexable: true,
  },
  {
    path: "/store/products/static-bloom-mug",
    heading: "Static Bloom Mug",
    title: "Static Bloom Mug · Ego Hygiene",
    indexable: false,
  },
  {
    path: "/store/collections/static-bloom-collection",
    heading: "The Static Bloom Collection",
    title: "The Static Bloom Collection · Ego Hygiene",
    indexable: false,
  },
  { path: "/help", heading: "Help", title: "Help", indexable: true },
  { path: "/privacy", heading: "Privacy draft", title: "Privacy draft", indexable: false },
] as const;

test.describe("generated content without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const destination of rawDestinations) {
    test(`${destination.path} serves meaningful route HTML and identity before scripts`, async ({
      page,
    }) => {
      for (const navigate of [() => page.goto(destination.path), () => page.reload()]) {
        const response = await navigate();
        expect(response?.status()).toBe(200);
        expect(await response?.text()).toContain(`data-prerendered-path="${destination.path}"`);
        await expect(page.locator("#root")).toHaveAttribute(
          "data-prerendered-path",
          destination.path,
        );
        await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(
          destination.heading,
        );
        await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page).toHaveTitle(destination.title);
        await expectIdentity(
          page,
          destination.path,
          destination.indexable ? "index,follow" : "noindex,follow",
        );
        await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
        await expect(
          page.getByRole("link", { name: /buy now|checkout|purchase|order now/i }),
        ).toHaveCount(0);
      }
    });
  }
});

test("catalog hydration reuses raw content before restoring theme, language and query state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("egohygiene-theme", "high-contrast");
    window.localStorage.setItem("egohygiene.locale", "en");
  });
  let releaseScripts = () => {};
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route("**/assets/*.js", async (route) => {
    await scriptsReady;
    await route.fallback();
  });
  const destination =
    "/store/catalog?source=rendering&q=static&view=product&story=connected&lang=en#catalog";
  try {
    // Commit does not wait for the deliberately delayed module scripts.
    const response = await page.goto(destination, { waitUntil: "commit" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("#root")).toHaveAttribute("data-prerendered-path", "/store/catalog");
    const catalog = page.getByRole("region", { name: "Find your frequency." });
    const search = page.getByRole("searchbox", { name: "Search the store" });
    await expect(search).toHaveValue("");
    await expect(catalog.getByRole("article")).toHaveCount(8);
    const initialMain = await page.getByRole("main").elementHandle();
    expect(initialMain).not.toBeNull();

    releaseScripts();
    await expect(search).toHaveValue("static");
    await expect(page.getByRole("button", { name: "Objects", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("combobox", { name: "Browse by story" })).toHaveValue("connected");
    await expect(catalog.getByRole("article")).toHaveCount(1);
    await expect(
      catalog.getByRole("heading", { name: "Static Bloom Mug", exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Theme", { exact: true })).toHaveValue("high-contrast");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
    await expect(page.getByLabel("Language", { exact: true })).toHaveValue("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveURL(destination);
    expect(await initialMain?.evaluate((main) => main === document.querySelector("main"))).toBe(
      true,
    );
    expect(await page.evaluate(() => window.localStorage.getItem("egohygiene-theme"))).toBe(
      "high-contrast",
    );
    expect(await page.evaluate(() => window.localStorage.getItem("egohygiene.locale"))).toBe("en");
    await initialMain?.dispose();
    await expectIdentity(page, "/store/catalog", "noindex,follow");

    await catalog.getByRole("article").getByRole("link").click();
    await expect(page).toHaveURL("/store/products/static-bloom-mug?lang=en");
    await expectIdentity(page, "/store/products/static-bloom-mug", "noindex,follow");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Static Bloom Mug");
    await page.goBack();
    await expect(page).toHaveURL(destination);
    await expect(search).toHaveValue("static");
    await expect(catalog.getByRole("article")).toHaveCount(1);
    await expectIdentity(page, "/store/catalog", "noindex,follow");
  } finally {
    releaseScripts();
  }
});

test("artist song selection hydrates without assigning merchandise and survives reload", async ({
  page,
}) => {
  const path = "/store/incompris/artists/play";
  const destination = `${path}?view=songs&q=future&lang=en`;
  await page.goto(destination);
  const search = page.getByRole("searchbox", { name: "Search song collections" });
  await expect(search).toHaveValue("future");
  await expect(page.getByRole("link", { name: "Shop by song", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("article")).toHaveCount(0);
  await expectIdentity(page, path);
  await page.reload();
  await expect(page).toHaveURL(destination);
  await expect(search).toHaveValue("future");
  await expectIdentity(page, path);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page).toHaveURL(`${path}?view=songs&lang=en`);
  await expect(
    page.getByRole("heading", { name: "The first song collection is on its way." }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("client navigation and history replace canonical, indexing and artwork social metadata", async ({
  page,
}) => {
  const path = "/store/designs/heartburst";
  await page.goto(path);
  await expectIdentity(page, path);
  await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://egohygiene.io/store/heartburst/heartburst-light.webp",
  );
  await page
    .getByRole("navigation", { name: "Legal", exact: true })
    .getByRole("link", { name: "Privacy", exact: true })
    .click();
  await expect(page).toHaveURL("/privacy");
  await expect(page).toHaveTitle("Privacy draft");
  await expectIdentity(page, "/privacy", "noindex,follow");
  await expect(
    page.locator('head meta[property="og:image"], head meta[name="twitter:image"]'),
  ).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(path);
  await expectIdentity(page, path);
  await expect(page.locator('head meta[property="og:image"]')).toHaveCount(1);
  await page.goForward();
  await expectIdentity(page, "/privacy", "noindex,follow");
  await expect(page.locator('head meta[property="og:image"]')).toHaveCount(0);
});

test("unknown and isolated-preview paths replace fallback metadata and recover", async ({
  page,
}) => {
  // The Vite preview's SPA fallback may return 200 here. HTTP 404/redirect
  // qualification belongs to #57/#89; this checks the browser fallback adapter.
  for (const destination of [
    {
      path: "/store/products/rendering-missing",
      heading: "This object isn’t here.",
      recovery: "Back to the store",
      target: "/store",
    },
    {
      path: "/store/incompris/artists/rendering-missing",
      heading: "This artist collection isn’t here.",
      recovery: "Back to Incompris",
      target: "/store/incompris",
    },
    {
      path: "/store/preview/fourthwall",
      heading: "Page not found",
      recovery: "Return home",
      target: "/",
    },
  ]) {
    await page.goto(destination.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(destination.heading);
    await expect(
      page.locator(
        'head link[rel="canonical"], head meta[property="og:url"], head meta[property="og:image"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(destination.heading);
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(0);
    await page.getByRole("link", { name: destination.recovery, exact: true }).click();
    await expect(page).toHaveURL(destination.target);
    await expectIdentity(page, destination.target);
  }
});

test("legacy catalog URLs forward after hydration while preserving query, language and fragment", async ({
  page,
}) => {
  const search = "?q=heartburst&lang=en&source=rendering#catalog";
  await page.goto(`/store${search}`);
  await expect(page).toHaveURL(`/store/catalog${search}`);
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue("heartburst");
  await expect(
    page.getByRole("region", { name: "Find your frequency." }).getByRole("article"),
  ).toHaveCount(1);
  await expectIdentity(page, "/store/catalog", "noindex,follow");
  await page.reload();
  await expect(page).toHaveURL(`/store/catalog${search}`);
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue("heartburst");
  await expectIdentity(page, "/store/catalog", "noindex,follow");
});
