/** Browser journeys exercise the production AppProviders/router/LocaleProvider binding. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { installHostBoundary } from "./browser-host.mjs";

const selector = ".site-language-selector select";
const localeIds = ["en", "qps-Ploc", "ar"];
const formattingLocales = { en: "en", "qps-Ploc": "en", ar: "ar-u-nu-arab" };

function expectedPlural(count, id) {
  const locale = formattingLocales[id];
  const number = new Intl.NumberFormat(locale).format(count);
  const suffix =
    id === "ar"
      ? `synthetic ${new Intl.PluralRules(locale).select(count)}`
      : `source item${count === 1 ? "" : "s"}`;
  return `${number} ${suffix}`;
}

async function expectLocale(page, id) {
  await page.waitForFunction((expected) => document.documentElement.lang === expected, id);
  assert.equal(await page.locator(selector).inputValue(), id);
  assert.equal(await page.locator("html").getAttribute("dir"), id === "ar" ? "rtl" : "ltr");
}

async function chooseLocale(page, id) {
  // Open the real native select with a pointer, then choose using actual keyboard events.
  await page.locator(selector).click();
  await page.keyboard.press("Home");
  for (let index = 0; index < localeIds.indexOf(id); index += 1) {
    await page.keyboard.press("ArrowDown");
  }
  await page.keyboard.press("Enter");
  await expectLocale(page, id);
  assert.ok(await page.locator(selector).evaluate((element) => element === document.activeElement));
}

async function fitsViewport(page, width) {
  await page.evaluate(() => document.fonts.ready);
  const actualWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(actualWidth <= width + 1, `Document width ${actualWidth} exceeds ${width}`);
  return actualWidth;
}

export async function runLocaleJourneys(browser, { origin, entry, output }) {
  const results = [];
  async function run(name, exercise, options = {}) {
    const page = await browser.newPage({
      viewport: { width: options.width ?? 1440, height: 1000 },
      reducedMotion: "reduce",
      colorScheme: "light",
      serviceWorkers: "block",
    });
    const boundary = await installHostBoundary(page, { origin, entry });
    const screenshots = [];
    async function capture(file) {
      await page.screenshot({
        path: path.join(output, file),
        type: "jpeg",
        quality: 82,
        fullPage: true,
      });
      const bytes = await readFile(path.join(output, file));
      screenshots.push({
        file,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        bytes: bytes.length,
        manipulation: "none",
      });
    }
    try {
      const evidence = await exercise(page, capture);
      boundary.assertClean();
      results.push({
        name,
        status: "passed",
        evidence,
        screenshots,
        errors: boundary.errors,
        blockedRequests: boundary.blockedRequests,
        blockedWebSockets: boundary.blockedWebSockets,
      });
      await writeFile(
        path.join(output, "locale-journeys.json"),
        `${JSON.stringify(results, null, 2)}\n`,
      );
      process.stdout.write(`locale-${name}: pass\n`);
    } finally {
      await page.close();
    }
  }
  const visit = (page, route) =>
    page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });

  await run("filters-links-reload-history", async (page) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("qualification-seeded")) {
        localStorage.setItem("egohygiene.locale", "ar");
        sessionStorage.setItem("qualification-seeded", "true");
      }
    });
    await visit(page, "/store/catalog?view=product&story=standalone&q=Signal&lang=en#catalog");
    await expectLocale(page, "en");
    assert.equal(
      await page.evaluate(() => localStorage.getItem("egohygiene.locale")),
      "ar",
      "A shared URL must not overwrite the saved preference",
    );
    const before = new URL(page.url());
    const title = await page.locator(".store-grid .store-card h3").innerText();
    await chooseLocale(page, "qps-Ploc");
    const after = new URL(page.url());
    for (const key of ["view", "story", "q"])
      assert.equal(after.searchParams.get(key), before.searchParams.get(key));
    assert.equal(after.hash, before.hash);
    assert.equal(await page.getByRole("searchbox").inputValue(), "Signal");
    assert.equal(await page.locator(".store-grid .store-card h3").innerText(), title);
    assert.equal(await page.locator(".store-grid .store-card").count(), 1);
    const href = await page.locator(".store-grid .store-card a").getAttribute("href");
    assert.equal(new URL(href, origin).pathname, "/store/products/signal-heart-hoodie");
    assert.equal(new URL(href, origin).searchParams.get("lang"), "qps-Ploc");
    await page.locator(".store-grid .store-card a").click();
    await page.waitForURL((url) => url.pathname === "/store/products/signal-heart-hoodie");
    await expectLocale(page, "qps-Ploc");
    assert.equal(await page.locator("h1").innerText(), title);
    await page.reload({ waitUntil: "networkidle" });
    await expectLocale(page, "qps-Ploc");
    await page.goBack({ waitUntil: "networkidle" });
    await expectLocale(page, "qps-Ploc");
    assert.equal(await page.getByRole("searchbox").inputValue(), "Signal");
    await chooseLocale(page, "en");
    assert.equal(new URL(page.url()).searchParams.get("lang"), "en");
    await page.goBack({ waitUntil: "networkidle" });
    await expectLocale(page, "qps-Ploc");
    await page.goForward({ waitUntil: "networkidle" });
    await expectLocale(page, "en");
    await page.reload({ waitUntil: "networkidle" });
    await expectLocale(page, "en");
    return {
      title,
      canonicalHref: href,
      retained: ["q", "view", "story", "hash"],
      explicitSourcePersists: true,
      directReload: true,
      backForward: true,
    };
  });

  await run("saved-preference-invalid-urls-and-link-policy", async (page) => {
    await visit(page, "/qualification/messages");
    await expectLocale(page, "en");
    await chooseLocale(page, "ar");
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).searchParams.has("lang"), false);
    await expectLocale(page, "ar");
    await page.goForward({ waitUntil: "networkidle" });
    await expectLocale(page, "ar");
    for (const search of ["?lang=fr", "?lang=not_a_locale", "?lang=en&lang=ar", "?lang="]) {
      await visit(page, `/qualification/messages${search}`);
      await expectLocale(page, "ar");
      assert.equal(
        new URL(page.url()).search,
        search,
        "Fallback does not silently rewrite the URL",
      );
    }
    const internal = new URL(
      await page.locator('[data-probe="internal"]').getAttribute("href"),
      origin,
    );
    assert.equal(internal.searchParams.get("lang"), "ar");
    assert.equal(internal.searchParams.get("view"), "product");
    assert.equal(internal.hash, "#catalog");
    assert.equal(
      await page.locator('[data-probe="explicit"]').getAttribute("href"),
      "/store?lang=en#catalog",
    );
    assert.equal(
      await page.locator('[data-probe="external"]').getAttribute("href"),
      "https://example.invalid/never-follow",
    );
    await page.locator('[data-probe="explicit"]').click();
    await expectLocale(page, "en");
    assert.equal(await page.evaluate(() => localStorage.getItem("egohygiene.locale")), "ar");
    return {
      invalidRequests: 4,
      unqualifiedHistoryUsesCurrentSavedPreference: true,
      externalLinkUnchangedAndNeverFollowed: true,
    };
  });

  for (const width of [320, 390]) {
    await run(
      `mobile-selector-${width}`,
      async (page, capture) => {
        await visit(page, "/store/incompris/artists/demo-artist?lang=en&q=Signal#artist-results");
        await expectLocale(page, "en");
        const widths = {};
        for (const id of ["qps-Ploc", "ar"]) {
          await page.locator(".site-nav-toggle").click();
          await chooseLocale(page, id);
          assert.equal(
            await page.locator(".site-nav-toggle").getAttribute("aria-expanded"),
            "true",
          );
          assert.equal(await page.getByRole("searchbox").inputValue(), "Signal");
          assert.equal(new URL(page.url()).hash, "#artist-results");
          widths[id] = await fitsViewport(page, width);
          if ((width === 320 && id === "qps-Ploc") || (width === 390 && id === "ar"))
            await capture(`locale-${id}-${width}-navigation.jpg`);
          await page.keyboard.press("Escape");
          assert.equal(
            await page.locator(".site-nav-toggle").getAttribute("aria-expanded"),
            "false",
          );
          assert.ok(
            await page
              .locator(".site-nav-toggle")
              .evaluate((element) => element === document.activeElement),
          );
          await fitsViewport(page, width);
        }
        return {
          widths,
          disclosureRetained: true,
          selectorFocusRetained: true,
          escapeRestoresToggleFocus: true,
        };
      },
      { width },
    );
  }

  await run("partial-missing-dictionaries-and-safe-messages", async (page) => {
    const messages = {};
    for (const id of localeIds) {
      await visit(page, `/qualification/messages?lang=${id}`);
      await expectLocale(page, id);
      const read = (name) => page.locator(`[data-probe="${name}"]`).innerText();
      assert.equal(await read("source"), "Source fallback stays readable");
      assert.equal(await read("missing"), "qualification.missing");
      assert.equal(await read("object"), "qualification.object");
      assert.equal(
        await read("interpolation"),
        `${id === "qps-Ploc" ? "Expanded" : "Hello"} <strong>Sky</strong> / {{missing}}`,
      );
      assert.equal(await page.locator('[data-probe="interpolation"] strong').count(), 0);
      const counts = [0, 1, 2, 3, 11, 100];
      const values = await Promise.all(counts.map((count) => read(`plural-${count}`)));
      const locale = formattingLocales[id];
      for (const [index, count] of counts.entries()) {
        assert.equal(values[index], expectedPlural(count, id));
      }
      assert.equal(await read("format-locale"), locale);
      messages[id] = values;
    }
    await visit(page, "/qualification/messages?lang=ar&qaMissingCatalog=1");
    await expectLocale(page, "ar");
    assert.equal(
      await page.locator('[data-probe="plural-2"]').innerText(),
      "٢ source items",
      "Source dictionary uses English grammar with selected-locale number formatting",
    );
    assert.equal(
      await page.locator('[data-probe="source"]').innerText(),
      "Source fallback stays readable",
    );
    return {
      messages,
      missingDictionary: true,
      objectAndMissingKeySafety: true,
      interpolationEscaped: true,
      unresolvedParameterVisible: true,
    };
  });

  for (const denial of ["getter", "getItem", "setItem"]) {
    await run(`storage-denied-${denial}`, async (page) => {
      await page.addInitScript((method) => {
        const denied = () => {
          throw new DOMException("Synthetic denied storage", "SecurityError");
        };
        if (method === "getter")
          Object.defineProperty(window, "localStorage", { configurable: true, get: denied });
        else {
          const original = Storage.prototype[method];
          Object.defineProperty(Storage.prototype, method, {
            configurable: true,
            value(...args) {
              if (this === window.localStorage) denied();
              return original.apply(this, args);
            },
          });
        }
      }, denial);
      await visit(page, "/qualification/messages");
      await expectLocale(page, "en");
      await chooseLocale(page, "ar");
      assert.equal(new URL(page.url()).searchParams.get("lang"), "ar");
      await page.reload({ waitUntil: "networkidle" });
      await expectLocale(page, "ar");
      return {
        deniedOperation: denial,
        sourceFallback: true,
        explicitSelectionAndReloadWork: true,
      };
    });
  }

  await run("gallery-errors-and-empty-states", async (page, capture) => {
    const states = [];
    for (const id of ["qps-Ploc", "ar"]) {
      await visit(page, `/qualification/gallery?lang=${id}`);
      await expectLocale(page, id);
      await page.locator(".store-artwork-gallery__thumbnail").nth(1).click();
      assert.equal(
        await page.locator(".store-artwork-gallery__thumbnail").nth(1).getAttribute("aria-pressed"),
        "true",
      );
      const caption = await page.locator(".store-artwork-gallery__caption").innerText();
      assert.ok(caption.includes(id === "ar" ? "٢" : "2"));
      const open = page.locator(".store-artwork-gallery__open");
      await open.click();
      assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), true);
      assert.ok(
        await page
          .locator(".store-artwork-viewer__close")
          .evaluate((element) => element === document.activeElement),
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").count(), 0);
      assert.ok(await open.evaluate((element) => element === document.activeElement));
      await open.click();
      await page.locator(".store-artwork-viewer__close").click();
      assert.equal(await page.locator("dialog").count(), 0);
      await visit(page, `/qualification/error?lang=${id}`);
      await expectLocale(page, id);
      assert.ok((await page.locator("h1").innerText()).includes("This page could not load"));
      assert.ok((await page.title()).includes("This page could not load"));
      await page.getByRole("button", { name: /Try again/ }).click();
      await expectLocale(page, id);
      assert.ok((await page.locator("h1").innerText()).includes("This page could not load"));
      await visit(page, `/store/catalog?lang=${id}&q=does-not-exist`);
      await expectLocale(page, id);
      assert.equal(await page.locator(".store-empty").count(), 1);
      const empty = await page.locator(".store-result-count").innerText();
      assert.ok(empty.includes(id === "ar" ? "٠" : "0"));
      await page.locator(".store-empty button").click();
      await page.locator(".store-grid .store-card").first().waitFor();
      assert.equal(new URL(page.url()).searchParams.get("lang"), id);
      states.push({ id, galleryCaption: caption, emptyCount: empty, reloadableError: true });
    }
    await capture("locale-rtl-catalog.jpg");
    return states;
  });

  await run("inert-preview-currency-and-selection-invariance", async (page) => {
    await visit(page, "/qualification/fourthwall?lang=en");
    await expectLocale(page, "en");
    assert.equal(await page.locator(".fourthwall-preview__cta").isDisabled(), true);
    await page.locator(".fourthwall-preview__sizes button").filter({ hasText: /^L$/ }).click();
    assert.equal(
      await page
        .locator(".fourthwall-preview__sizes button")
        .filter({ hasText: /^XL$/ })
        .isDisabled(),
      true,
    );
    await page.locator(".fourthwall-preview__quantity select").selectOption("3");
    await page.locator(".fourthwall-preview__cta").click();
    const values = {};
    for (const id of localeIds) {
      if (id !== "en") await chooseLocale(page, id);
      const rows = await page.locator(".fourthwall-preview__handoff dd").allInnerTexts();
      const locale = formattingLocales[id];
      assert.deepEqual(rows, [
        "Signal Heart Hoodie",
        "Black / L",
        new Intl.NumberFormat(locale).format(3),
        new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(135),
      ]);
      assert.equal(await page.locator(".fourthwall-preview__quantity select").inputValue(), "3");
      assert.equal(
        await page
          .locator(".fourthwall-preview__sizes button")
          .filter({ hasText: /^L$/ })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.ok((await page.locator(".fourthwall-preview__price").innerText()).includes("USD"));
      const href = new URL(
        await page.locator(".fourthwall-preview__catalog-link").getAttribute("href"),
        origin,
      );
      assert.equal(href.pathname, "/store/products/signal-heart-hoodie");
      assert.equal(href.searchParams.get("lang"), id);
      values[id] = rows;
    }
    return {
      values,
      currency: "USD",
      amount: 135,
      canonicalProduct: "product-demo-signal-heart-hoodie",
      selectedVariant: "mock-fourthwall-signal-heart-l",
      quantity: 3,
      providerCalls: 0,
    };
  });
  return results;
}
