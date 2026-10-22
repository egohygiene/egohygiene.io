/** Authored browser coverage; importing this file never launches a browser. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { StoreCatalog } from "../../packages/schemas/src/store.ts";
import { getStorePurchaseAction } from "../../packages/schemas/src/store.ts";
import { CHECKOUT_HANDOFF_FIXTURE as handoff } from "../checkout-handoff/fixture.ts";
import { installHandoffBoundary } from "../checkout-handoff/network.ts";
import { CATALOG_LOCALIZATION_FIXTURE as fixture } from "./constants.ts";

export const catalogJourneyNames = [
  "language-switch-fallback-metadata-gallery",
  "unicode-search-source-alias-and-stable-links",
  "unpublished-copy-and-disabled-purchase-states",
  "exact-intercepted-checkout-across-languages",
  "expanded-catalog-layout-390",
  "expanded-catalog-layout-820",
  "expanded-catalog-layout-1440",
] as const;

const formats = { en: "en-US", fr: "fr-FR", "fr-CA": "fr-CA", "qps-Ploc": "en-GB" } as const;
type Locale = keyof typeof formats;
const locales = Object.keys(formats) as Locale[];
const languageSelector = ".site-language-selector select";

function expectedTitle(locale: Locale) {
  return locale === "en"
    ? handoff.live.title
    : locale === "fr-CA"
      ? fixture.regionalTitle
      : fixture.liveTitle;
}

async function visit(page: Page, origin: string, path: string, locale: Locale) {
  const url = new URL(path, origin);
  url.searchParams.set("lang", locale);
  await page.goto(url.href);
  await expect(page.locator("html")).toHaveAttribute("lang", locale);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

async function assertProduct(page: Page, locale: Locale) {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(expectedTitle(locale));
  await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute(
    "lang",
    locale === "qps-Ploc" ? "fr" : locale,
  );
  const description = page.locator(".store-detail__description");
  await expect(description).toHaveAttribute("lang", locale === "en" ? "en" : "fr");
  if (locale !== "en") {
    await expect(description).toHaveText(fixture.liveDescription);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      fixture.liveDescription,
    );
    await expect(page.locator(".store-artwork-gallery__open img")).toHaveAttribute(
      "alt",
      fixture.artworkAlt,
    );
  }
  await expect(page).toHaveTitle(new RegExp(expectedTitle(locale)));
  await expect(page.locator(".store-purchase-panel a.store-button[rel~=external]")).toHaveAttribute(
    "href",
    handoff.checkoutUrl,
  );
  const price = await page.evaluate(
    ({ formatLocale, amountMinor, currency }) =>
      new Intl.NumberFormat(formatLocale, { style: "currency", currency }).format(
        amountMinor / 100,
      ),
    {
      formatLocale: formats[locale],
      amountMinor: fixture.price.amountMinor,
      currency: fixture.price.currency,
    },
  );
  await expect
    .poll(() =>
      page.locator(".store-price").evaluate((element) => element.firstChild?.textContent?.trim()),
    )
    .toBe(price);
  assert.equal(new URL(page.url()).pathname, handoff.live.path);
}

export async function runCatalogLocalizationJourneys(
  browser: Browser,
  origin: string,
  output: string,
  catalog: StoreCatalog,
) {
  const results: { name: string; evidence: unknown; interceptedDestinations: string[] }[] = [];
  async function run(name: string, exercise: (page: Page) => Promise<unknown>, width = 1440) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
      isMobile: width === 390,
      hasTouch: width === 390,
      serviceWorkers: "block",
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    const boundary = await installHandoffBoundary(context, origin);
    const errors: string[] = [];
    context.on("page", (page) => page.on("pageerror", (error) => errors.push(error.message)));
    try {
      const page = await context.newPage();
      const evidence = await exercise(page);
      assert.deepEqual(errors, [], "No uncaught page errors");
      assert.deepEqual(boundary.blocked, [], "No unapproved request, method, or redirect");
      assert.deepEqual(boundary.blockedWebSockets, [], "No WebSocket connection");
      assert.equal(context.pages().length, 1, "Journey remains in the original tab");
      assert.deepEqual(
        boundary.intercepted,
        name === "exact-intercepted-checkout-across-languages"
          ? locales.map(() => handoff.checkoutUrl)
          : [],
      );
      results.push({ name, evidence, interceptedDestinations: boundary.intercepted });
      process.stdout.write(`${name}: pass\n`);
    } finally {
      await context.close();
    }
  }

  await run(catalogJourneyNames[0], async (page) => {
    await visit(page, origin, handoff.live.path, "en");
    for (const locale of locales) {
      await page.locator(languageSelector).selectOption(locale);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await assertProduct(page, locale);
      assert.equal(new URL(page.url()).searchParams.get("lang"), locale);
    }
    await page.locator(languageSelector).selectOption("fr-CA");
    await page.reload();
    await assertProduct(page, "fr-CA");
    await page.locator(".store-artwork-gallery__open").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".store-artwork-viewer__art img")).toHaveAttribute(
      "alt",
      fixture.artworkAlt,
    );
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    return {
      locales,
      sourceAndDeclaredFallbacks: true,
      staleArtworkAndDraftDescriptionExcluded: true,
      clientMetadataOnly: true,
      sourceCurrency: fixture.price.currency,
      galleryAndReload: true,
    };
  });

  await run(catalogJourneyNames[1], async (page) => {
    await visit(page, origin, "/store/catalog?view=product", "fr");
    const search = page.getByRole("searchbox");
    const cards = page.locator(".store-grid .store-card");
    await search.fill("e\u0301clat");
    await expect(cards).toHaveCount(1);
    const liveLink = cards.locator("a");
    await expect(liveLink).toHaveAttribute("href", `${handoff.live.path}?lang=fr`);
    await search.fill(handoff.live.title);
    await expect(cards).toHaveCount(1);
    await liveLink.click();
    await assertProduct(page, "fr");
    const collectionLink = page.locator(".store-detail-world");
    await expect(collectionLink).toHaveAttribute("href", `${fixture.collection.path}?lang=fr`);
    await collectionLink.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(fixture.collection.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute("lang", "en");
    await expect(page.locator(".store-collection-hero p[lang]")).toHaveText(
      fixture.collection.translatedDescription,
    );
    await page.locator(languageSelector).selectOption("fr-CA");
    assert.equal(new URL(page.url()).pathname, fixture.collection.path);
    const returnLink = page.locator(`.store-card a[href="${handoff.live.path}?lang=fr-CA"]`);
    await expect(returnLink).toHaveCount(1);
    await returnLink.click();
    await assertProduct(page, "fr-CA");
    return {
      normalizedQuery: "e\u0301clat",
      originalCreativeNameAlias: handoff.live.title,
      canonicalProductPath: handoff.live.path,
      canonicalCollectionPath: fixture.collection.path,
    };
  });

  await run(catalogJourneyNames[2], async (page) => {
    for (const locale of ["fr", "fr-CA"] as const) {
      for (const product of [handoff.preview, handoff.unavailable]) {
        await visit(page, origin, product.path, locale);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(product.title);
        await expect(
          page.locator(".store-purchase-panel a[rel~=external], .store-purchase-panel button, .store-price"),
        ).toHaveCount(0);
        await expect(
          page.locator(".store-purchase-panel a[href^='/store/help']"),
        ).toHaveAttribute("href", `/store/help?lang=${locale}`);
        if (product.id === handoff.unavailable.id) {
          await expect(page.locator(".store-purchase-panel p[lang]")).toHaveText(
            "Fictional test item is unavailable.",
          );
          await expect(page.locator(".store-purchase-panel p[lang]")).toHaveAttribute("lang", "en");
        }
      }
      for (const query of [fixture.draftMarker, fixture.staleMarker]) {
        await visit(page, origin, `/store/catalog?q=${encodeURIComponent(query)}`, locale);
        await expect(page.locator(".store-grid .store-card")).toHaveCount(0);
        await expect(page.locator(".store-empty")).toBeVisible();
      }
    }
    return {
      locales: ["fr", "fr-CA"],
      draftAndStaleSearchResults: 0,
      nonPurchasableStates: ["preview", "unavailable"],
    };
  });

  await run(catalogJourneyNames[3], async (page) => {
    const product = catalog.entries.find((entry) => entry.id === handoff.live.id);
    assert.ok(product?.kind === "product" && product.purchase.state === "live");
    const purchase = product.purchase;
    const route = catalog.checkoutRoutes.find((candidate) => candidate.id === purchase.routeId);
    assert.ok(route);
    assert.deepEqual(
      purchase.variants.map((variant) => variant.providerVariantId),
      route.providerVariantIds,
    );
    const action = getStorePurchaseAction(catalog, product.id);
    assert.equal(action.kind, "external");
    const destinations = [];
    for (const locale of locales) {
      await visit(page, origin, handoff.live.path, locale);
      await assertProduct(page, locale);
      await page.locator(".store-purchase-panel a.store-button[rel~=external]").click();
      await expect(page).toHaveURL(handoff.checkoutUrl);
      await expect(
        page.getByRole("heading", { name: "Intercepted checkout destination", exact: true }),
      ).toBeVisible();
      await expect(page.locator("form, input, button")).toHaveCount(0);
      destinations.push({ locale, url: page.url() });
    }
    return {
      productId: product.id,
      routeId: purchase.routeId,
      provider: purchase.provider,
      variants: purchase.variants,
      providerVariantIds: route.providerVariantIds,
      destinations,
      localeParameterAdded: false,
      variantTransferClaimed: false,
      qualification:
        "Canonical mappings validated locally; external checkout chooses options. No provider request or order.",
    };
  });

  for (const width of [390, 820, 1440]) {
    await run(
      `expanded-catalog-layout-${width}`,
      async (page) => {
        await visit(page, origin, handoff.live.path, "qps-Ploc");
        await assertProduct(page, "qps-Ploc");
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({
          viewportWidth: document.documentElement.clientWidth,
          contentWidth: document.documentElement.scrollWidth,
          imageErrors: Array.from(document.images)
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.currentSrc),
        }));
        assert.ok(
          dimensions.contentWidth <= dimensions.viewportWidth + 1,
          "Expanded copy fits viewport",
        );
        assert.deepEqual(dimensions.imageErrors, []);
        const file = `expanded-catalog-${width}.png`;
        await page.screenshot({ path: join(output, file), fullPage: true });
        const bytes = await readFile(join(output, file));
        return {
          width,
          dimensions,
          file,
          sha256: createHash("sha256").update(bytes).digest("hex"),
          bytes: bytes.length,
          syntheticViewport: true,
          physicalDeviceOrNativeZoom: false,
        };
      },
      width,
    );
  }
  assert.deepEqual(
    results.map((result) => result.name),
    [...catalogJourneyNames],
  );
  return results;
}
