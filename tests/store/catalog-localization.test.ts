import assert from "node:assert/strict";
import { test } from "node:test";

import { storeEntryPath } from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import { inspectStoreTranslations } from "../../packages/schemas/src/store-localization.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  type StoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import { qualifySyntheticRoute, SYNTHETIC_STORE_DISCLOSURES } from "./fixtures/readiness.ts";

// Engineering data only. These records do not approve a real translation or rights claim.
const base = (id: string) => ({
  schemaVersion: 3,
  sourceLocale: "en",
  id,
  slug: id,
  title: `Synthetic ${id}`,
  description: "Synthetic source description",
  visibility: "public",
});
const design = () => ({
  ...base("design-fixture"),
  kind: "design",
  contextIds: [],
  artworkRevision: 1,
  artwork: { kind: "image", src: "/store/synthetic.webp", alt: "Synthetic artwork" },
});
const product = () => ({
  ...base("product-fixture"),
  kind: "product",
  designIds: ["design-fixture"],
  purchase: { state: "preview" },
});
const party = (id: string, contextType = "artist") => ({
  ...base(id),
  kind: "context",
  contextType,
});
const reviewed = (source: string, value: string, artworkRevision?: number, variantId?: string) => ({
  value,
  review: {
    status: "reviewed",
    locale: "fr",
    reviewedBy: "synthetic-test-reviewer",
    reviewedAt: "2026-10-20",
    source: {
      locale: "en",
      value: source,
      ...(artworkRevision === undefined ? {} : { artworkRevision }),
      ...(variantId === undefined ? {} : { variantId }),
    },
    value,
  },
});
const draft = (value: string) => ({ value, review: { status: "draft" } });
const parse = (...values: unknown[]) =>
  parseStoreCatalog(values.map((value, index) => ({ source: `synthetic-${index}.json`, value })));
const first = (catalog: StoreCatalog) => {
  const entry = catalog.entries[0];
  assert.ok(entry);
  return entry;
};

function liveFixture() {
  const item = {
    ...product(),
    purchase: {
      state: "live",
      provider: "fourthwall",
      routeId: "route-fixture",
      variants: [{ id: "variant-small", label: "Small", providerVariantId: "provider-small" }],
      displayPrice: { amountMinor: 2500, currency: "USD", authority: "provider-checkout" },
    },
  };
  const route = qualifySyntheticRoute(
    {
      id: "route-fixture",
      provider: "fourthwall",
      productId: item.id,
      checkoutUrl: "https://synthetic-fixture.fourthwall.com/products/synthetic-item",
      providerVariantIds: ["provider-small"],
      artworkRevisions: [{ designId: "design-fixture", revision: 1 }],
    },
    item,
    [design()],
  );
  const parseItem = (value: unknown = item, reviewedRoute = route) =>
    parseStoreCatalog(
      [
        { source: "synthetic-art.json", value: design() },
        { source: "synthetic-item.json", value },
      ],
      [reviewedRoute],
    );
  return { item, route, parseItem };
}

test("v3 retains explicit source locale and defaults to no translations or inferred attribution", () => {
  const source = design();
  const entry = first(parse(source));
  assert.equal(entry.schemaVersion, 3);
  assert.equal(entry.sourceLocale, "en");
  assert.deepEqual(entry.translations, []);
  assert.deepEqual(entry.attribution, { status: "unknown" });
  assert.throws(() => parse({ ...source, sourceLocale: undefined }), /sourceLocale/);
  assert.throws(() => parse({ ...source, sourceLocale: "en-us" }), /sourceLocale/);
  assert.throws(() => parse({ ...source, sourceLocale: "not_a_locale" }), /sourceLocale/);
  assert.throws(() => parse({ ...source, schemaVersion: 1 }), /schemaVersion/);
  assert.throws(() => parse({ ...source, schemaVersion: 99 }), /schemaVersion/);
});

test("public projection retains reviewed partial copy and source creative names without copying drafts", () => {
  const source = design();
  const title = reviewed(source.title, "[Synthetic alternate title]");
  const catalog = parse({
    ...source,
    translations: [{ locale: "fr", fields: { title, description: draft("DRAFT-COPY-MARKER") } }],
  });
  const before = structuredClone(catalog);
  const entry = first(toPublicStoreCatalog(catalog));
  assert.deepEqual(entry.translations, [{ locale: "fr", fields: { title } }]);
  assert.equal(entry.title, source.title);
  assert.equal(entry.description, source.description);
  assert.equal(JSON.stringify(entry).includes("DRAFT-COPY-MARKER"), false);
  assert.deepEqual(catalog, before, "Projection must not rewrite authoring records");
  assert.deepEqual(
    toPublicStoreCatalog(toPublicStoreCatalog(catalog)),
    toPublicStoreCatalog(catalog),
  );
});

test("source and translated text changes invalidate only the affected reviewed field", () => {
  const source = design();
  const title = reviewed(source.title, "[Synthetic title]");
  const description = reviewed(source.description, "[Synthetic description]");
  const fields = { title, description };
  for (const input of [
    { ...source, title: "Changed source title", translations: [{ locale: "fr", fields }] },
    {
      ...source,
      translations: [
        { locale: "fr", fields: { ...fields, title: { ...title, value: "Changed translation" } } },
      ],
    },
  ]) {
    const entry = first(toPublicStoreCatalog(parse(input)));
    assert.deepEqual(entry.translations, [{ locale: "fr", fields: { description } }]);
  }
  const staleOnly = parse({
    ...source,
    title: "Changed source title",
    translations: [{ locale: "fr", fields: { title } }],
  });
  assert.deepEqual(first(toPublicStoreCatalog(staleOnly)).translations, []);
});

test("review diagnostics and public copy become stale when either source or target locale changes", () => {
  const source = design();
  const title = reviewed(source.title, "[Synthetic title]");
  const fields = { title, description: draft("Synthetic draft description") };
  const current = first(parse({ ...source, translations: [{ locale: "fr", fields }] }));
  assert.deepEqual(inspectStoreTranslations(current), [
    { locale: "fr", field: "title", status: "reviewed" },
    { locale: "fr", field: "description", status: "draft" },
  ]);
  for (const input of [
    { ...source, sourceLocale: "de", translations: [{ locale: "fr", fields }] },
    { ...source, translations: [{ locale: "de", fields }] },
  ]) {
    const catalog = parse(input);
    const entry = first(catalog);
    assert.deepEqual(
      inspectStoreTranslations(entry).map(({ field, status }) => ({ field, status })),
      [
        { field: "title", status: "stale" },
        { field: "description", status: "draft" },
      ],
    );
    assert.deepEqual(first(toPublicStoreCatalog(catalog)).translations, []);
  }
});

test("artwork text approval is bound to its text and artwork revision", () => {
  const source = design();
  const title = reviewed(source.title, "[Synthetic title]");
  const artworkAlt = reviewed(source.artwork.alt, "[Synthetic alt]", 1);
  for (const changed of [
    { ...source, artworkRevision: 2 },
    { ...source, artwork: { ...source.artwork, alt: "Changed source alt" } },
  ]) {
    const projected = first(
      toPublicStoreCatalog(
        parse({
          ...changed,
          translations: [{ locale: "fr", fields: { title, artworkAlt } }],
        }),
      ),
    );
    assert.deepEqual(projected.translations, [{ locale: "fr", fields: { title } }]);
  }
  assert.throws(
    () =>
      parse({
        ...source,
        translations: [
          { locale: "fr", fields: { artworkAlt: reviewed(source.artwork.alt, "No revision") } },
        ],
      }),
    /artworkRevision/,
  );
  assert.throws(
    () =>
      parse({
        ...source,
        translations: [
          { locale: "fr", fields: { title: reviewed(source.title, "Wrong revision binding", 1) } },
        ],
      }),
    /artworkRevision/,
  );
});

test("placeholder labels and unavailable reasons use reviewed source bindings", () => {
  const art = { ...design(), artwork: { kind: "placeholder", label: "Synthetic placeholder" } };
  const artworkLabel = reviewed(art.artwork.label, "[Synthetic placeholder label]", 1);
  const unavailable = {
    ...product(),
    purchase: { state: "unavailable", reason: "Synthetic source reason" },
  };
  const unavailableReason = reviewed(unavailable.purchase.reason, "[Synthetic unavailable reason]");
  const catalog = toPublicStoreCatalog(
    parse(
      { ...art, translations: [{ locale: "fr", fields: { artworkLabel } }] },
      { ...unavailable, translations: [{ locale: "fr", fields: { unavailableReason } }] },
    ),
  );
  assert.deepEqual(first(catalog).translations, [{ locale: "fr", fields: { artworkLabel } }]);
  assert.equal(getStorePurchaseAction(catalog, unavailable.id).kind, "disabled");
  assert.deepEqual(catalog.entries[1]?.translations, [
    { locale: "fr", fields: { unavailableReason } },
  ]);
});

test("locale records reject ambiguous IDs, duplicate locales and source-language translations", () => {
  const source = design();
  const fields = { title: draft("Synthetic candidate") };
  for (const locale of ["en", "fr-fr", "not_a_locale", ""]) {
    assert.throws(() => parse({ ...source, translations: [{ locale, fields }] }), /locale|Locale/);
  }
  assert.throws(
    () =>
      parse({
        ...source,
        translations: [
          { locale: "fr", fields },
          { locale: "fr", fields },
        ],
      }),
    /[Dd]uplicate/,
  );
});

test("translation records cannot rewrite stable identity, purchase eligibility, assets or provider fields", () => {
  const source = design();
  for (const field of [
    "id",
    "slug",
    "visibility",
    "purchase",
    "currency",
    "src",
    "providerVariantId",
  ]) {
    assert.throws(
      () =>
        parse({
          ...source,
          translations: [{ locale: "fr", fields: { [field]: draft("Forbidden value") } }],
        }),
      /translations/,
    );
  }
  assert.throws(
    () =>
      parse({
        ...source,
        translations: [
          { locale: "fr", fields: { title: { ...draft("Candidate"), supplierCost: 10 } } },
        ],
      }),
    /supplierCost/,
  );
});

test("invalid draft translations fail before public filtering, including private review fields", () => {
  const source = design();
  const title = reviewed(source.title, "Synthetic reviewed title");
  for (const value of [
    { ...draft("Synthetic draft"), privateNotes: "UNPUBLISHED-PRIVATE-MARKER" },
    { ...title, review: { ...title.review, evidenceUrl: "https://example.invalid/private" } },
    { ...title, review: { ...title.review, reviewedBy: "" } },
    { ...title, review: { ...title.review, reviewedAt: "2026-02-30" } },
  ]) {
    assert.throws(
      () =>
        parse({
          ...source,
          visibility: "draft",
          translations: [{ locale: "fr", fields: { title: value } }],
        }),
      /translations/,
    );
  }
});

test("empty and undefined-only translation fields fail even on draft entries before publication", () => {
  for (const fields of [{}, { title: undefined }]) {
    assert.throws(
      () =>
        parse({
          ...design(),
          visibility: "draft",
          translations: [{ locale: "fr", fields }],
        }),
      /translations/,
    );
  }
});

test("translated fields must exist on the source entry and match its artwork or purchase kind", () => {
  assert.throws(
    () =>
      parse({
        ...design(),
        translations: [{ locale: "fr", fields: { artworkLabel: draft("Wrong artwork kind") } }],
      }),
    /artworkLabel/,
  );
  for (const field of ["artworkAlt", "artworkLabel", "unavailableReason", "variantLabels"]) {
    const value =
      field === "variantLabels"
        ? [{ variantId: "variant-small", ...draft("Small") }]
        : draft("Wrong target");
    assert.throws(
      () =>
        parse(design(), {
          ...product(),
          translations: [{ locale: "fr", fields: { [field]: value } }],
        }),
      new RegExp(field),
    );
  }
});

test("reviewed variant labels preserve amount, currency, canonical product and checkout mapping", () => {
  const fixture = liveFixture();
  const label = {
    variantId: "variant-small",
    ...reviewed("Small", "[Synthetic small]", undefined, "variant-small"),
  };
  const catalog = fixture.parseItem({
    ...fixture.item,
    translations: [
      {
        locale: "fr",
        fields: {
          title: reviewed(fixture.item.title, "[Synthetic product]"),
          variantLabels: [label],
        },
      },
    ],
  });
  const projected = toPublicStoreCatalog(catalog);
  const item = projected.entries.find((entry) => entry.id === fixture.item.id);
  assert.ok(item?.kind === "product");
  assert.equal(storeEntryPath(item), "/store/products/product-fixture");
  assert.deepEqual(item.purchase, fixture.item.purchase);
  assert.deepEqual(projected.checkoutRoutes, [fixture.route]);
  assert.deepEqual(getStorePurchaseAction(projected, item.id), {
    kind: "external",
    label: "Shop on Fourthwall",
    href: fixture.route.checkoutUrl,
    disclosures: SYNTHETIC_STORE_DISCLOSURES,
  });
  assert.deepEqual(item.translations[0]?.fields.variantLabels, [label]);
  const changed = {
    ...fixture.item,
    purchase: {
      ...fixture.item.purchase,
      variants: [{ ...fixture.item.purchase.variants[0], label: "Changed source variant" }],
    },
  };
  const stale = toPublicStoreCatalog(
    fixture.parseItem(
      {
        ...changed,
        translations: [{ locale: "fr", fields: { variantLabels: [label] } }],
      },
      qualifySyntheticRoute(fixture.route, changed, [design()]),
    ),
  );
  assert.deepEqual(stale.entries[1]?.translations, []);
});

test("variant review bindings cannot move approval to a different variant with identical source wording", () => {
  const fixture = liveFixture();
  const label = {
    variantId: "variant-renamed",
    ...reviewed("Small", "[Synthetic small]", undefined, "variant-small"),
  };
  const item = {
    ...fixture.item,
    purchase: {
      ...fixture.item.purchase,
      variants: [{ id: "variant-renamed", label: "Small", providerVariantId: "provider-small" }],
    },
    translations: [{ locale: "fr", fields: { variantLabels: [label] } }],
  };
  const catalog = fixture.parseItem(item, qualifySyntheticRoute(fixture.route, item, [design()]));
  const source = catalog.entries[1];
  assert.ok(source);
  assert.deepEqual(inspectStoreTranslations(source), [
    { locale: "fr", field: "variantLabels.variant-renamed", status: "stale" },
  ]);
  assert.deepEqual(toPublicStoreCatalog(catalog).entries[1]?.translations, []);
  assert.throws(
    () =>
      fixture.parseItem({
        ...fixture.item,
        translations: [
          {
            locale: "fr",
            fields: {
              variantLabels: [
                { variantId: "variant-small", ...reviewed("Small", "Unbound variant") },
              ],
            },
          },
        ],
      }),
    /variantId/,
  );
  assert.throws(
    () =>
      parse({
        ...design(),
        translations: [
          {
            locale: "fr",
            fields: {
              title: reviewed(design().title, "Wrong variant binding", undefined, "variant-small"),
            },
          },
        ],
      }),
    /variantId/,
  );
});

test("translated variant references cannot invent or duplicate a provider selection", () => {
  const fixture = liveFixture();
  for (const variantLabels of [
    [{ variantId: "variant-missing", ...draft("Missing") }],
    [
      { variantId: "variant-small", ...draft("Small") },
      { variantId: "variant-small", ...draft("Duplicate") },
    ],
  ]) {
    assert.throws(
      () =>
        fixture.parseItem({
          ...fixture.item,
          translations: [{ locale: "fr", fields: { variantLabels } }],
        }),
      /variantLabels/,
    );
  }
});

test("context membership does not confer authorship or ownership; declared artist and brand references are separate", () => {
  const artist = party("artist-fixture");
  const brand = party("brand-fixture", "brand");
  const art = { ...design(), contextIds: [artist.id] };
  const unknown = parse(artist, brand, art).entries[2];
  assert.deepEqual(unknown?.attribution, { status: "unknown" });
  const attribution = { status: "declared", creatorIds: [artist.id], rightsHolderIds: [brand.id] };
  const declared = parse(artist, brand, { ...art, attribution });
  assert.deepEqual(declared.entries[2]?.attribution, attribution);
  const attributed = declared.entries[2];
  assert.ok(attributed && "contextIds" in attributed);
  assert.deepEqual(attributed.contextIds, [artist.id]);
});

test("declared attribution rejects missing, wrong-kind, duplicate and public-to-draft references", () => {
  const artist = party("artist-fixture");
  const song = party("song-fixture", "song");
  for (const creatorIds of [["artist-missing"], [song.id], [artist.id, artist.id]]) {
    assert.throws(
      () =>
        parse(artist, song, {
          ...design(),
          attribution: { status: "declared", creatorIds, rightsHolderIds: [] },
        }),
      /attribution/,
    );
  }
  assert.throws(
    () =>
      parse(
        { ...artist, visibility: "draft" },
        {
          ...design(),
          attribution: { status: "declared", creatorIds: [], rightsHolderIds: [artist.id] },
        },
      ),
    /attribution/,
  );
  assert.throws(
    () =>
      parse({
        ...design(),
        attribution: { status: "declared", creatorIds: [], rightsHolderIds: [] },
      }),
    /attribution/,
  );
});
