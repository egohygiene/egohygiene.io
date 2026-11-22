import { expect, type Page, test } from "@playwright/test";

const collectionPath = "/store/collections/static-bloom-collection";
const productPath = "/store/products/static-bloom-mug";
const artworkName = "store-product-art-static-bloom-mug";

function mugCard(page: Page) {
  return page
    .locator("#collection-entries")
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { name: "Static Bloom Mug", exact: true }),
    });
}

function productHeading(page: Page) {
  return page.getByRole("heading", { level: 1, name: "Static Bloom Mug", exact: true });
}

async function recordNativeTransitions(page: Page) {
  await page.addInitScript((name) => {
    if (typeof document.startViewTransition !== "function") return;
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (update) => {
      const transition = start(update);
      const root = document.documentElement;
      const call = String(Number(root.getAttribute("data-store-transition-calls")) + 1);
      root.setAttribute("data-store-transition-calls", call);
      void transition.ready.then(
        () => {
          const group = getComputedStyle(
            document.documentElement,
            `::view-transition-group(${name})`,
          );
          root.setAttribute("data-store-transition-duration", group.animationDuration);
        },
        () => {
          root.setAttribute("data-store-transition-duration", "skipped");
        },
      );
      void transition.finished.then(() => {
        root.setAttribute("data-store-transition-finished", call);
      });
      return transition;
    };
  }, artworkName);
}

test("collection artwork follows the keyboard-selected product and preserves history", async ({
  page,
}) => {
  await recordNativeTransitions(page);
  await page.goto(collectionPath);
  const link = mugCard(page).getByRole("link");
  await expect(link).toHaveAttribute("href", productPath);
  await expect(mugCard(page).locator(".store-card__visual")).toHaveCSS(
    "view-transition-name",
    artworkName,
  );
  await link.focus();
  await link.press("Enter");
  await expect(page).toHaveURL(productPath);
  await expect(productHeading(page)).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("data-store-transition-duration", "0.22s");
  await expect(page.locator("html")).toHaveAttribute("data-store-transition-finished", "1");
  await expect(page.getByText("Preview — not for sale yet", { exact: true })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(collectionPath);
  await expect(link).toBeVisible();
  await page.goForward();
  await expect(productHeading(page)).toBeVisible();
  await page.reload();
  await expect(productHeading(page)).toBeVisible();
  await expect(productHeading(page)).not.toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-store-transition-calls", /.+/);
});

test("reduced motion follows the product link without a native transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await recordNativeTransitions(page);
  await page.goto(collectionPath);
  await expect(mugCard(page).locator(".store-card__visual")).toHaveCSS(
    "view-transition-name",
    "none",
  );
  await mugCard(page).getByRole("link").click();
  await expect(productHeading(page)).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-store-transition-calls", /.+/);
});

test.describe("phone touch navigation", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  test("the same collection product works with and without the transition API", async ({
    page,
  }) => {
    await recordNativeTransitions(page);
    await page.goto(collectionPath);
    await mugCard(page).getByRole("link").tap();
    await expect(productHeading(page)).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-store-transition-duration", "0.22s");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);

    await page.addInitScript(() => {
      Object.defineProperty(document, "startViewTransition", { value: undefined });
    });
    await page.goto(collectionPath);
    await mugCard(page).getByRole("link").tap();
    await expect(page).toHaveURL(productPath);
    await expect(productHeading(page)).toBeFocused();
    await expect(page.locator("html")).not.toHaveAttribute("data-store-transition-calls", /.+/);
  });
});
