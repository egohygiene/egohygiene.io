import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { isAbsolute, join, relative } from "node:path";
import { test } from "node:test";
import { inflateSync } from "node:zlib";

import {
  getStorePurchaseAction,
  parseStoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import {
  defaultCatalogDirectory,
  defaultCheckoutRoutesFile,
  defaultProvidersFile,
  defaultPublicDirectory,
  loadCatalog,
  readCatalogJson,
} from "../../scripts/store-catalog.mts";
import {
  CHECKOUT_HANDOFF_FIXTURE,
  createCheckoutHandoffCatalog,
  createCheckoutHandoffFixture,
  createCheckoutHandoffInputs,
} from "../checkout-handoff/fixture.ts";
import { SYNTHETIC_STORE_DISCLOSURES } from "./fixtures/readiness.ts";

test("handoff fixtures project one fictional live product and two disabled purchase states", () => {
  const fixture = CHECKOUT_HANDOFF_FIXTURE;
  const inputs = createCheckoutHandoffInputs();
  const before = structuredClone(inputs);
  const catalog = toPublicStoreCatalog(parseStoreCatalog(inputs.sources, inputs.routes));
  assert.deepEqual(catalog, createCheckoutHandoffCatalog());
  assert.equal(catalog.entries.length, 4);
  assert.equal(catalog.checkoutRoutes.length, 1);
  assert.ok(catalog.entries.every((entry) => entry.id.startsWith(fixture.prefix)));
  assert.ok(catalog.entries.every((entry) => entry.title.startsWith("Fictional")));
  assert.ok(!catalog.entries.some((entry) => entry.id === fixture.draftId));
  assert.deepEqual(getStorePurchaseAction(catalog, fixture.live.id), {
    kind: "external",
    label: "Shop on Fourthwall",
    href: fixture.checkoutUrl,
    disclosures: SYNTHETIC_STORE_DISCLOSURES,
  });
  for (const product of [fixture.preview, fixture.unavailable]) {
    assert.equal(getStorePurchaseAction(catalog, product.id).kind, "disabled");
  }
  assert.deepEqual(inputs, before);
  inputs.routes.length = 0;
  assert.equal(createCheckoutHandoffInputs().routes.length, 1);
});

test("handoff inputs use the existing route, revision and variant review guards", () => {
  const fixture = CHECKOUT_HANDOFF_FIXTURE;
  const cases = [
    {
      change: { productId: fixture.preview.id },
      error: /Live products require a reviewed route for this product/,
    },
    {
      change: { artworkRevisions: [{ designId: fixture.designId, revision: 2 }] },
      error: /Live products require image artwork at the reviewed revision/,
    },
    {
      change: { providerVariantIds: ["test-handoff-37a-unreviewed-variant"] },
      error: /Variant is not on the reviewed route/,
    },
  ];
  for (const { change, error } of cases) {
    const { sources, routes } = createCheckoutHandoffInputs();
    assert.throws(
      () =>
        toPublicStoreCatalog(
          parseStoreCatalog(
            sources,
            routes.map((route) => ({ ...route, ...change })),
          ),
        ),
      error,
    );
  }
});

test("temporary fixture validates its PNG and never modifies the shipped catalog or providers", async (t) => {
  const shippedBefore = await loadCatalog();
  const routesBefore = await readFile(defaultCheckoutRoutesFile);
  const providersBefore = await readFile(defaultProvidersFile);
  const fixture = await createCheckoutHandoffFixture();
  t.after(fixture.cleanup);
  assert.notEqual(fixture.directory, defaultCatalogDirectory);
  assert.notEqual(fixture.publicDirectory, defaultPublicDirectory);
  for (const path of [fixture.directory, fixture.routesFile, fixture.publicDirectory]) {
    const child = relative(fixture.root, path);
    assert.ok(!isAbsolute(child) && child !== ".." && !child.startsWith("../"));
  }
  assert.equal(fixture.curationFile, null);
  assert.equal((await readdir(fixture.directory)).length, 5);
  const catalog = toPublicStoreCatalog(
    await loadCatalog(
      fixture.directory,
      await readCatalogJson(fixture.routesFile),
      fixture.publicDirectory,
      fixture.curationFile,
    ),
  );
  assert.deepEqual(catalog, fixture.catalog);
  assert.deepEqual(catalog, createCheckoutHandoffCatalog());
  const png = await readFile(
    join(fixture.publicDirectory, CHECKOUT_HANDOFF_FIXTURE.artworkPath.slice(1)),
  );
  assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(png.readUInt32BE(16), 1);
  assert.equal(png.readUInt32BE(20), 1);
  assert.deepEqual(inflateSync(png.subarray(41, 54)), Buffer.from([0, 124, 58, 237, 255]));
  assert.deepEqual(await loadCatalog(), shippedBefore);
  assert.deepEqual(await readFile(defaultCheckoutRoutesFile), routesBefore);
  assert.deepEqual(await readFile(defaultProvidersFile), providersBefore);
  assert.ok(
    !shippedBefore.entries.some((entry) => entry.id.startsWith(CHECKOUT_HANDOFF_FIXTURE.prefix)),
  );
  await fixture.cleanup();
  await fixture.cleanup();
  await assert.rejects(stat(fixture.root), { code: "ENOENT" });
});
