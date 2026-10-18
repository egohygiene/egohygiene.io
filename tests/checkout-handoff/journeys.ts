import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { Browser, Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { CHECKOUT_HANDOFF_FIXTURE } from "./fixture.ts";
import { installHandoffBoundary } from "./network.ts";

const scenarios = [
  {
    name: "desktop-keyboard",
    viewport: { width: 1280, height: 800 },
    isMobile: false,
    hasTouch: false,
    input: "Tab and Enter",
    screenshot: "desktop-keyboard-focused.png",
  },
  {
    name: "mobile-touch",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    input: "touch tap",
    screenshot: "mobile-touch-live.png",
  },
] as const;

const providerDisclosure =
  "Choose your options and confirm the current price, shipping, and returns at the provider’s checkout.";

async function assertLiveProduct(page: Page, origin: string) {
  await expect(page).toHaveURL(origin + CHECKOUT_HANDOFF_FIXTURE.live.path);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    CHECKOUT_HANDOFF_FIXTURE.live.title,
  );
  const action = page.getByRole("link", { name: "Shop on Fourthwall", exact: true });
  await expect(action).toBeVisible();
  await expect(action).toHaveAttribute("href", CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
  await expect(action).toHaveAttribute("rel", "external");
  await expect(page.getByText(providerDisclosure, { exact: true })).toBeVisible();
  const swatch = page
    .getByRole("img", { name: "Fictional test color swatch; not merchandise artwork" })
    .first();
  await expect
    .poll(() => swatch.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBe(1);
  const logo = page.locator('img[src="/icons/icon-192x192.png"]').first();
  await expect
    .poll(() => logo.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBe(192);
  return action;
}

async function assertDestination(page: Page) {
  await expect(page).toHaveURL(CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
  await expect(
    page.getByRole("heading", { name: "Intercepted checkout destination", exact: true }),
  ).toBeVisible();
  await expect(page.locator("form, input, button")).toHaveCount(0);
  assert.equal(page.context().pages().length, 1, "Checkout must stay in the original tab");
}

async function tabToLink(page: Page, link: Locator) {
  await expect(link).toHaveCount(1);
  await expect(link).toBeVisible();
  // Deliberately use browser keyboard traversal, never locator.focus() or DOM focus().
  for (let tabs = 0; tabs <= 80; tabs += 1) {
    if (await link.evaluate((element) => element === document.activeElement)) {
      await expect(link).toBeFocused();
      return tabs;
    }
    if (tabs < 80) await page.keyboard.press("Tab");
  }
  assert.fail("Expected link was not reachable within 80 Tab presses");
}

async function assertNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    contentWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(
    dimensions.contentWidth <= dimensions.viewportWidth + 1,
    `Unexpected horizontal overflow: ${JSON.stringify(dimensions)}`,
  );
  return dimensions;
}

/** Checkpoint 2: real product controls with a locally intercepted destination. */
export async function runHandoffJourneys(browser: Browser, origin: string, output: string) {
  await mkdir(output, { recursive: true });
  const results = [];
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      isMobile: scenario.isMobile,
      hasTouch: scenario.hasTouch,
      serviceWorkers: "block",
    });
    try {
      const boundary = await installHandoffBoundary(context, origin);
      const pageErrors: string[] = [];
      context.on("page", (opened) => {
        opened.on("pageerror", (error) => pageErrors.push(error.message));
      });
      const page = await context.newPage();
      const keyboardTabCounts: number[] = [];
      const activate = async (link: Locator, expectedUrl: string) => {
        if (scenario.hasTouch) {
          await Promise.all([page.waitForURL(expectedUrl), link.tap()]);
        } else {
          keyboardTabCounts.push(await tabToLink(page, link));
          await Promise.all([page.waitForURL(expectedUrl), page.keyboard.press("Enter")]);
        }
      };

      await page.goto(origin + CHECKOUT_HANDOFF_FIXTURE.live.path);
      await assertLiveProduct(page, origin);
      await page.reload();
      const action = await assertLiveProduct(page, origin);
      const dimensions = await assertNoHorizontalOverflow(page);
      assert.deepEqual(boundary.intercepted, [], "Loading a product must not start checkout");
      if (scenario.hasTouch) {
        await action.scrollIntoViewIfNeeded();
      } else {
        keyboardTabCounts.push(await tabToLink(page, action));
      }
      await expect(action).toBeInViewport();
      await page.screenshot({ path: join(output, scenario.screenshot) });

      await activate(action, CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
      await assertDestination(page);
      assert.equal(boundary.intercepted.length, 1);
      await page.reload();
      await assertDestination(page);
      assert.equal(boundary.intercepted.length, 2);
      await page.goBack();
      await assertLiveProduct(page, origin);
      await page.reload();
      await assertLiveProduct(page, origin);
      assert.equal(boundary.intercepted.length, 2, "Returning must not restart checkout");

      // A second real activation proves that Back/reload leaves the same reviewed action.
      await activate(action, CHECKOUT_HANDOFF_FIXTURE.checkoutUrl);
      await assertDestination(page);
      assert.equal(boundary.intercepted.length, 3);
      await page.goBack();
      await assertLiveProduct(page, origin);

      const guardedStates = [];
      for (const [state, product, status] of [
        ["preview", CHECKOUT_HANDOFF_FIXTURE.preview, "Preview — not for sale yet"],
        ["unavailable", CHECKOUT_HANDOFF_FIXTURE.unavailable, "Not available to purchase"],
      ] as const) {
        // Navigate through existing product/design links to exercise SPA state replacement.
        const designLink = page
          .locator(".store-detail-facts")
          .getByRole("link", { name: "Fictional handoff test swatch", exact: true });
        const designPath = `/store/designs/${CHECKOUT_HANDOFF_FIXTURE.designId}`;
        await activate(designLink, origin + designPath);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "Fictional handoff test swatch",
        );
        const productLink = page.locator(`a[href="${product.path}"]`);
        await activate(productLink, origin + product.path);
        for (const load of ["SPA navigation", "reload"] as const) {
          if (load === "reload") await page.reload();
          await expect(page).toHaveURL(origin + product.path);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(product.title);
          await expect(page.getByText(status, { exact: true })).toBeVisible();
          if (state === "unavailable") {
            await expect(
              page.getByText("Fictional test item is unavailable.", { exact: true }),
            ).toBeVisible();
          }
          await expect(page.locator("a[rel~=external]")).toHaveCount(0);
          await expect(
            page.locator(".store-purchase-panel a, .store-purchase-panel button, .store-price"),
          ).toHaveCount(0);
          await assertNoHorizontalOverflow(page);
        }
        guardedStates.push({ state, entry: product.id, loads: ["SPA navigation", "reload"] });
      }

      assert.deepEqual(boundary.intercepted, Array(3).fill(CHECKOUT_HANDOFF_FIXTURE.checkoutUrl));
      assert.deepEqual(boundary.blocked, [], "Journeys must not attempt unapproved requests");
      assert.deepEqual(boundary.blockedWebSockets, [], "Journeys must not attempt WebSockets");
      assert.deepEqual(pageErrors, []);
      assert.equal(context.pages().length, 1);
      results.push({
        ...scenario,
        keyboardTabCounts,
        liveProduct: CHECKOUT_HANDOFF_FIXTURE.live.id,
        canonicalProductPath: CHECKOUT_HANDOFF_FIXTURE.live.path,
        directProductLoad: true,
        productReloads: 2,
        actualLinkActivations: 2,
        destinationReloads: 1,
        backReturns: 2,
        sameTab: true,
        disclosureVisible: true,
        dimensions,
        guardedStates,
        interceptedDestinations: boundary.intercepted,
        blockedRequests: boundary.blocked,
        blockedWebSockets: boundary.blockedWebSockets,
        pageErrors,
      });
    } finally {
      await context.close();
    }
  }
  return {
    checkpoint: "37 handoff 2 — keyboard and touch customer journeys",
    capturedAt: new Date().toISOString(),
    browser: browser.version(),
    node: process.versions.node,
    fixture: CHECKOUT_HANDOFF_FIXTURE.prefix,
    scenarios: results,
    limits:
      "Local intercepted destination only. Mobile viewport and touch emulation, not a physical device. Bounded keyboard/layout checks, not full accessibility or browser-matrix qualification. No real provider, payment, cart/variant transfer, shipping/tax, order, print or fulfillment qualification.",
  };
}
