import assert from "node:assert/strict";
import { SYNTHETIC_STORE_DISCLOSURES } from "./fixtures/readiness.ts";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";

import {
  filterStoreEntries,
  getStoreEntryContent,
  storeEntryPath,
} from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  type StoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import { inspectStoreTranslations } from "../../packages/schemas/src/store-localization.ts";
import {
  defaultCheckoutRoutesFile,
  defaultProvidersFile,
  loadCatalog,
  readCatalogJson,
} from "../../scripts/store-catalog.mts";
import {
  CATALOG_LOCALIZATION_FIXTURE as fixture,
  createCatalogLocalizationCatalog,
  createCatalogLocalizationFixture,
  createCatalogLocalizationInputs,
} from "../catalog-localization/fixture.ts";
import {
  CHECKOUT_HANDOFF_FIXTURE as handoff,
  createCheckoutHandoffCatalog,
} from "../checkout-handoff/fixture.ts";
import { decideHandoffRequest } from "../checkout-handoff/network.ts";

function entry(catalog: StoreCatalog, id: string) {
  const result = catalog.entries.find((candidate) => candidate.id === id);
  assert.ok(result, `Expected fixture entry ${id}`);
  return result;
}

test("the reusable bilingual fixture validates before excluding drafts and stale review fields", () => {
  const inputs = createCatalogLocalizationInputs();
  const before = structuredClone(inputs);
  const raw = parseStoreCatalog(inputs.sources, inputs.routes);
  const diagnostics = raw.entries.flatMap((value) => inspectStoreTranslations(value));
  assert.ok(diagnostics.some((value) => value.status === "reviewed"));
  assert.ok(diagnostics.some((value) => value.status === "draft"));
  assert.ok(diagnostics.some((value) => value.status === "stale"));
  const published = toPublicStoreCatalog(raw);
  assert.deepEqual(published, createCatalogLocalizationCatalog());
  assert.equal(published.entries.length, 5);
  assert.ok(!published.entries.some((value) => value.id === handoff.draftId));
  assert.ok(!JSON.stringify(published).includes(fixture.draftMarker));
  assert.ok(!JSON.stringify(published).includes(fixture.staleMarker));
  assert.ok(published.entries.every((value) => value.attribution.status === "unknown"));
  assert.deepEqual(inputs, before);
});

test("regional and pseudolocalized selections use explicit field fallback and preserve a creative name", () => {
  const catalog = createCatalogLocalizationCatalog();
  const selected = { locale: "fr-CA", fallbackLocales: ["fr", "en"] };
  const live = getStoreEntryContent(entry(catalog, handoff.live.id), selected);
  assert.deepEqual(live.title, { value: fixture.regionalTitle, locale: "fr-CA" });
  assert.deepEqual(live.description, { value: fixture.liveDescription, locale: "fr" });
  assert.deepEqual(getStoreEntryContent(entry(catalog, handoff.designId), selected).artworkAlt, {
    value: fixture.artworkAlt,
    locale: "fr",
  });
  const collection = getStoreEntryContent(entry(catalog, fixture.collection.id), selected);
  assert.deepEqual(collection.title, { value: fixture.collection.title, locale: "en" });
  assert.deepEqual(collection.description, {
    value: fixture.collection.translatedDescription,
    locale: "fr",
  });
  assert.deepEqual(
    getStoreEntryContent(entry(catalog, handoff.live.id), {
      locale: "qps-Ploc",
      fallbackLocales: ["fr", "en"],
    }).title,
    { value: fixture.liveTitle, locale: "fr" },
  );
  assert.deepEqual(getStoreEntryContent(entry(catalog, handoff.preview.id), selected).title, {
    value: handoff.preview.title,
    locale: "en",
  });
  assert.deepEqual(
    getStoreEntryContent(entry(catalog, handoff.unavailable.id), selected).unavailableReason,
    {
      value: "Fictional test item is unavailable.",
      locale: "en",
    },
  );
});

test("localized and Unicode searches return canonical entries and never index rejected text", () => {
  const catalog = createCatalogLocalizationCatalog();
  const selected = { locale: "fr" };
  for (const query of ["e\u0301clat", "ÉCLAT", "métadonnées"]) {
    const results = filterStoreEntries(catalog, query, "product", "all", selected);
    assert.equal(results.length, 1);
    assert.strictEqual(results[0], entry(catalog, handoff.live.id));
  }
  assert.deepEqual(filterStoreEntries(catalog, "ÉCLAT", "product", "all", { locale: "en" }), []);
  for (const query of ["Cafe\u0301", "ＭＯＯＮ", "星の庭"]) {
    const results = filterStoreEntries(catalog, query, "collection", "all", selected);
    assert.equal(results.length, 1);
    assert.strictEqual(results[0], entry(catalog, fixture.collection.id));
    assert.equal(storeEntryPath(results[0]!), fixture.collection.path);
  }
  for (const query of [fixture.draftMarker, fixture.staleMarker]) {
    assert.deepEqual(filterStoreEntries(catalog, query, "all", "all", selected), []);
  }
  const sourceAlias = filterStoreEntries(catalog, handoff.live.title, "product", "all", selected);
  assert.strictEqual(sourceAlias[0], entry(catalog, handoff.live.id));
});

test("all selected languages retain the original exact handoff, variants, currency and disabled states", () => {
  const catalog = createCatalogLocalizationCatalog();
  const original = createCheckoutHandoffCatalog();
  const originalProduct = entry(original, handoff.live.id);
  const live = entry(catalog, handoff.live.id);
  assert.ok(live.kind === "product" && live.purchase.state === "live");
  assert.ok(originalProduct.kind === "product" && originalProduct.purchase.state === "live");
  assert.deepEqual(
    catalog.checkoutRoutes.map(({ qualification, ...route }) => route),
    original.checkoutRoutes.map(({ qualification, ...route }) => route),
  );
  assert.equal(catalog.checkoutRoutes[0]?.qualification.status, "reviewed");
  assert.deepEqual(live.purchase.variants, originalProduct.purchase.variants);
  const before = structuredClone(catalog);
  for (const locale of ["en", "fr", "fr-CA", "qps-Ploc"]) {
    const content = getStoreEntryContent(live, { locale, fallbackLocales: ["fr", "en"] });
    assert.equal(content.variantLabels[0]?.variantId, live.purchase.variants[0]?.id);
    assert.equal(storeEntryPath(live), handoff.live.path);
    assert.deepEqual(live.purchase.displayPrice, fixture.price);
    const action = getStorePurchaseAction(catalog, live.id);
    assert.deepEqual(action, {
      kind: "external",
      label: "Shop on Fourthwall",
      href: handoff.checkoutUrl,
      disclosures: SYNTHETIC_STORE_DISCLOSURES,
    });
    assert.ok(action.kind === "external");
    // Exercise the retained request policy only. Actual network interception is a deferred browser check.
    assert.equal(
      decideHandoffRequest(
        {
          url: action.href,
          method: "GET",
          resourceType: "document",
          isMainFrameNavigation: true,
        },
        "http://127.0.0.1:4173",
      ),
      "destination",
    );
    assert.equal(
      decideHandoffRequest(
        {
          url: `${action.href}?lang=${locale}`,
          method: "GET",
          resourceType: "document",
          isMainFrameNavigation: true,
        },
        "http://127.0.0.1:4173",
      ),
      "block",
    );
    for (const product of [handoff.preview, handoff.unavailable]) {
      assert.equal(getStorePurchaseAction(catalog, product.id).kind, "disabled");
    }
  }
  assert.deepEqual(catalog, before);
});

test("a changed source invalidates the fixture review without changing identity or granting new approval", () => {
  const inputs = createCatalogLocalizationInputs();
  const source = inputs.sources.find((candidate) => candidate.value.id === handoff.live.id);
  assert.ok(source);
  source.value.description = "Updated fictional source awaiting translation review.";
  const raw = parseStoreCatalog(inputs.sources, inputs.routes);
  const changed = entry(raw, handoff.live.id);
  assert.ok(
    inspectStoreTranslations(changed).some(
      (value) => value.locale === "fr" && value.field === "description" && value.status === "stale",
    ),
  );
  const projected = toPublicStoreCatalog(raw);
  const content = getStoreEntryContent(entry(projected, handoff.live.id), { locale: "fr" });
  assert.deepEqual(content.description, { value: source.value.description, locale: "en" });
  assert.deepEqual(content.title, { value: fixture.liveTitle, locale: "fr" });
  assert.equal(getStorePurchaseAction(projected, handoff.live.id).kind, "external");
});

test("temporary bilingual inputs use the real file boundary and leave shipped catalog/providers untouched", async (t) => {
  const originalCatalog = await loadCatalog();
  const originalRoutes = await readFile(defaultCheckoutRoutesFile);
  const originalProviders = await readFile(defaultProvidersFile);
  const temporary = await createCatalogLocalizationFixture();
  t.after(temporary.cleanup);
  assert.equal(temporary.curationFile, null);
  const loaded = await loadCatalog(
    temporary.directory,
    await readCatalogJson(temporary.routesFile),
    temporary.publicDirectory,
    temporary.curationFile,
  );
  assert.deepEqual(toPublicStoreCatalog(loaded), createCatalogLocalizationCatalog());
  assert.deepEqual(temporary.catalog, createCatalogLocalizationCatalog());
  assert.deepEqual(temporary.rawCatalog, loaded);
  assert.deepEqual(await loadCatalog(), originalCatalog);
  assert.deepEqual(await readFile(defaultCheckoutRoutesFile), originalRoutes);
  assert.deepEqual(await readFile(defaultProvidersFile), originalProviders);
  await temporary.cleanup();
  await assert.rejects(stat(temporary.root), { code: "ENOENT" });
});
