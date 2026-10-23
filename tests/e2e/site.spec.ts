import type { Locator, Page } from "@playwright/test";
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
    "The production shell uses only successful local GET requests",
  ).toEqual([]);
});

test("primary site loads, navigates, and supports theming", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /A little more human/i })).toBeVisible();
  const logo = page.getByRole("banner").locator(".site-wordmark img");
  await expect(logo).toHaveAttribute("src", "/icons/icon-192x192.png");
  await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(192);
  const identity = page.getByRole("img", {
    name: "Ego Hygiene’s cyan and magenta yin-yang symbol",
  });
  await expect(identity).toHaveAttribute("src", "/icons/icon-512x512.png");
  await expect
    .poll(() => identity.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBe(512);
  await page.getByRole("link", { name: /Discover Ego Hygiene/i }).click();
  await expect(page.getByRole("heading", { level: 1, name: /About Ego Hygiene/i })).toBeVisible();
  await page.goto("/ecosystem");
  await expect(
    page.getByRole("heading", { level: 1, name: /The Ego Hygiene ecosystem/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Mindcap" })).toBeVisible();
  await page.getByLabel("Theme").selectOption("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await page.goto("/missing-route");
  await expect(page.getByRole("heading", { level: 1, name: /Page not found/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await page.getByRole("link", { name: "Return home", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A little more human.");
});

test("mobile navigation closes with Escape and follows the store route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Store" })
    .focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Store" })
    .click();
  await expect(page).toHaveURL(/\/store$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("short mobile navigation keeps the theme control reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 300 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const theme = page.getByRole("combobox", { name: "Theme" });
  await theme.focus();
  const bounds = await theme.boundingBox();
  expect(bounds).not.toBeNull();
  expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(300);
  await theme.selectOption("high-contrast");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "high-contrast");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});

test("skip link closes the menu and reveals the start of the main content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  const header = await page.getByRole("banner").boundingBox();
  const start = await page.locator(".landing-hero__copy > .landing-kicker").boundingBox();
  expect(header).not.toBeNull();
  expect(start).not.toBeNull();
  expect(start?.y).toBeGreaterThanOrEqual((header?.y ?? 0) + (header?.height ?? 0));
});

// The normal production runner includes these journeys with the local-only request guard above.
// Client metadata and local SPA reloads do not qualify generated HTML or the deployed host.
const essentials = [
  {
    path: "/help",
    title: "Help",
    description: /website help, accessibility feedback, store guidance and policy information/,
  },
  {
    path: "/about",
    title: "About Ego Hygiene",
    description: /ideas behind Ego Hygiene/,
  },
  {
    path: "/accessibility",
    title: "Accessibility",
    description: /accessibility information, review limitations/,
  },
  {
    path: "/store/help",
    title: "Store help",
    description: /product previews, hosted checkout, delivery information/,
  },
  {
    path: "/privacy",
    title: "Privacy draft",
    description: /provisional explanation.*privacy practices/,
  },
  {
    path: "/terms",
    title: "Terms draft",
    description: /Provisional terms.*public website/,
  },
] as const;

async function expectEssential(page: Page, route: (typeof essentials)[number]) {
  const heading = page.getByRole("main").getByRole("heading", { level: 1 });
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText(route.title);
  await expect(heading).toBeVisible();
  await expect(page).toHaveTitle(route.title);
  const description = page.locator('head meta[name="description"]');
  await expect(description).toHaveCount(1);
  await expect(description).toHaveAttribute("content", route.description);
}

async function tabToEssential(page: Page, target: Locator) {
  for (let count = 0; count < 30; count += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  await expect(target, "The essential link must be reachable using Tab").toBeFocused();
}

test.describe("website essentials", () => {
  for (const route of essentials) {
    test(`${route.path} loads directly, reloads and returns to Help through the footer`, async ({
      page,
    }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expectEssential(page, route);
      const reloaded = await page.reload();
      expect(reloaded?.status()).toBe(200);
      await expect(page).toHaveURL(route.path);
      await expectEssential(page, route);
      const footer = page.getByRole("navigation", { name: "Footer", exact: true });
      await footer.getByRole("link", { name: "Help", exact: true }).click();
      await expect(page).toHaveURL("/help");
      await expectEssential(page, essentials[0]);
    });
  }

  test("the Help hub and return links preserve the language URL across every essential destination", async ({
    page,
  }) => {
    await page.goto("/help?lang=en");
    for (const route of essentials.slice(1)) {
      const label = route.path === "/accessibility" ? "Accessibility information" : route.title;
      const destination = page.getByRole("main").getByRole("link", { name: label, exact: true });
      await expect(destination).toHaveAttribute("href", `${route.path}?lang=en`);
      await destination.click();
      await expect(page).toHaveURL(`${route.path}?lang=en`);
      await expectEssential(page, route);

      const back = route.path === "/about"
        ? page.getByRole("navigation", { name: "Footer", exact: true }).getByRole("link", {
            name: "Help",
            exact: true,
          })
        : page.getByRole("main").getByRole("link", { name: "More website help", exact: true });
      await expect(back).toHaveAttribute("href", "/help?lang=en");
      await back.click();
      await expect(page).toHaveURL("/help?lang=en");
      await expectEssential(page, essentials[0]);
    }
  });

  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    test(`keyboard journeys at ${viewport.width}px separate public feedback from order help`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const path of ["/help", "/accessibility", "/store/help"]) {
        await page.goto(`${path}?lang=en`);
        const main = page.getByRole("main");
        await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
        await page.keyboard.press("Tab");
        const skip = page.getByRole("link", { name: "Skip to content", exact: true });
        await expect(skip).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(main).toBeFocused();

        const feedback = main.getByRole("link", { name: /problem on GitHub/ });
        await tabToEssential(page, feedback);
        await expect(feedback).toBeFocused();
        await expect(feedback).toBeInViewport();
        await expect(feedback).toHaveAttribute(
          "href",
          "https://github.com/egohygiene/egohygiene.io/issues/new",
        );
        await expect(feedback).toHaveAccessibleDescription(
          /GitHub issues are public.*require a GitHub account.*Do not include order details.*private website-feedback channel is not published/,
        );
        // Focusing the public report link does not follow it or submit any information.
        await expect(main.locator("form, input, textarea")).toHaveCount(0);
        if (path !== "/accessibility") {
          const orders = main.getByRole("region", { name: "Help with an order", exact: true });
          await expect(orders).toContainText("Public website feedback is not an order-support channel");
          await expect(orders.getByRole("link")).toHaveCount(path === "/help" ? 1 : 0);
          if (path === "/help") {
            await expect(orders.getByRole("link")).toHaveAttribute("href", "/store/help?lang=en");
          }
        }

        const nextPath = path === "/help" ? "/store/help" : "/help";
        const nextTitle = path === "/help" ? "Store help" : "Help";
        const nextLink = main.getByRole("link", {
          name: path === "/help" ? "Read store help" : "More website help",
          exact: true,
        });
        await tabToEssential(page, nextLink);
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(`${nextPath}?lang=en`);
        await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toHaveText(nextTitle);
      }
    });
  }
});
