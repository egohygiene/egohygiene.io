import assert from "node:assert/strict";
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
} from "../../packages/schemas/src/store.ts";

// Synthetic language data only; no real copy or reviewer approval is introduced.
const base = (id: string) => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title: "Original Name",
  description: "Original source description",
  visibility: "public",
});
const design = (extra: Record<string, unknown> = {}) => ({
  ...base("design-presentation"),
  kind: "design",
  contextIds: [],
  artworkRevision: 1,
  artwork: { kind: "image", src: "/store/synthetic.webp", alt: "Original artwork description" },
  ...extra,
});
const reviewed = (
  locale: string,
  source: string,
  value: string,
  binding: { locale?: string; artworkRevision?: number; variantId?: string } = {},
) => ({
  value,
  review: {
    status: "reviewed",
    locale,
    reviewedBy: "synthetic-reviewer",
    reviewedAt: "2026-10-20",
    source: { locale: "en", value: source, ...binding },
    value,
  },
});
const draft = (value: string) => ({ value, review: { status: "draft" } });
const parse = (...values: unknown[]) =>
  parseStoreCatalog(values.map((value, index) => ({ source: `fixture-${index}.json`, value })));
const first = (catalog: StoreCatalog) => {
  const entry = catalog.entries[0];
  assert.ok(entry);
  return entry;
};
const ids = (entries: ReturnType<typeof filterStoreEntries>) => entries.map((entry) => entry.id);

function liveCatalog() {
  const item = {
    ...base("product-presentation"),
    kind: "product",
    designIds: ["design-presentation"],
    purchase: {
      state: "live",
      provider: "fourthwall",
      routeId: "route-presentation",
      variants: [
        { id: "variant-one", label: "Medium", providerVariantId: "provider-one" },
        { id: "variant-two", label: "Medium", providerVariantId: "provider-two" },
      ],
      displayPrice: { amountMinor: 3599, currency: "USD", authority: "provider-checkout" },
    },
    translations: [
      {
        locale: "fr",
        fields: {
          title: reviewed("fr", "Original Name", "Titre synthétique"),
          variantLabels: [
            {
              variantId: "variant-two",
              ...reviewed("fr", "Medium", "Stale moved approval", { variantId: "variant-one" }),
            },
            {
              variantId: "variant-one",
              ...reviewed("fr", "Medium", "Moyen", { variantId: "variant-one" }),
            },
          ],
        },
      },
    ],
  };
  return parseStoreCatalog(
    [
      { source: "art.json", value: design() },
      { source: "product.json", value: item },
    ],
    [
      {
        id: "route-presentation",
        provider: "fourthwall",
        productId: item.id,
        checkoutUrl: "https://synthetic-fixture.fourthwall.com/products/synthetic-item",
        providerVariantIds: ["provider-one", "provider-two"],
        artworkRevisions: [{ designId: "design-presentation", revision: 1 }],
      },
    ],
  );
}

test("presentation resolves each field through the declared chain and reports its actual language", () => {
  const entry = first(
    parse(
      design({
        translations: [
          {
            locale: "fr-CA",
            fields: {
              title: reviewed("fr-CA", "Original Name", "Titre canadien"),
              description: draft("Draft Canadian description"),
              artworkAlt: reviewed("fr-CA", "Old artwork description", "Stale Canadian alt", {
                artworkRevision: 1,
              }),
            },
          },
          {
            locale: "fr",
            fields: {
              description: reviewed("fr", "Original source description", "Description synthétique"),
              artworkAlt: reviewed("fr", "Original artwork description", "Image synthétique", {
                artworkRevision: 1,
              }),
            },
          },
        ],
      }),
    ),
  );
  const before = structuredClone(entry);
  assert.deepEqual(
    getStoreEntryContent(entry, { locale: "fr-CA", fallbackLocales: ["fr", "fr-CA", "fr", "en"] }),
    {
      title: { value: "Titre canadien", locale: "fr-CA" },
      description: { value: "Description synthétique", locale: "fr" },
      artworkAlt: { value: "Image synthétique", locale: "fr" },
      variantLabels: [],
    },
  );
  assert.deepEqual(entry, before);
});

test("missing regional content does not guess a fallback and a selected source takes precedence", () => {
  const entry = first(
    parse(
      design({
        translations: [
          {
            locale: "fr",
            fields: {
              title: reviewed("fr", "Original Name", "Titre synthétique"),
            },
          },
        ],
      }),
    ),
  );
  assert.deepEqual(getStoreEntryContent(entry, { locale: "fr-CA" }).title, {
    value: "Original Name",
    locale: "en",
  });
  assert.deepEqual(
    getStoreEntryContent(entry, { locale: "fr-CA", fallbackLocales: ["fr"] }).title,
    { value: "Titre synthétique", locale: "fr" },
  );
  assert.deepEqual(getStoreEntryContent(entry, { locale: "en", fallbackLocales: ["fr"] }).title, {
    value: "Original Name",
    locale: "en",
  });
  assert.deepEqual(
    getStoreEntryContent(entry, { locale: "de", fallbackLocales: ["en", "fr"] }).title,
    { value: "Original Name", locale: "en" },
  );
});

test("each entry's authored source can precede later site fallbacks in a mixed-language catalog", () => {
  const entry = first(
    parse(
      design({
        sourceLocale: "fr",
        title: "Nom original",
        translations: [
          {
            locale: "en",
            fields: {
              title: reviewed("en", "Nom original", "English rendering", { locale: "fr" }),
            },
          },
        ],
      }),
    ),
  );
  assert.deepEqual(
    getStoreEntryContent(entry, { locale: "de", fallbackLocales: ["fr", "en"] }).title,
    { value: "Nom original", locale: "fr" },
  );
  assert.deepEqual(getStoreEntryContent(entry, { locale: "en" }).title, {
    value: "English rendering",
    locale: "en",
  });
  assert.deepEqual(getStoreEntryContent(entry, { locale: "ja" }).title, {
    value: "Nom original",
    locale: "fr",
  });
});

test("draft and stale presentation never replace the current source fields", () => {
  const entry = first(
    parse(
      design({
        artworkRevision: 2,
        translations: [
          {
            locale: "fr",
            fields: {
              title: {
                ...reviewed("fr", "Original Name", "Previously reviewed"),
                value: "Changed translation",
              },
              description: draft("Draft description"),
              artworkAlt: reviewed("fr", "Original artwork description", "Old revision alt", {
                artworkRevision: 1,
              }),
            },
          },
        ],
      }),
    ),
  );
  const content = getStoreEntryContent(entry, { locale: "fr" });
  assert.deepEqual(content.title, { value: entry.title, locale: "en" });
  assert.deepEqual(content.description, { value: entry.description, locale: "en" });
  assert.deepEqual(content.artworkAlt, { value: "Original artwork description", locale: "en" });
  assert.equal(JSON.stringify(content).includes("Changed translation"), false);
  assert.equal(JSON.stringify(content).includes("Draft description"), false);
  assert.equal(JSON.stringify(content).includes("Old revision alt"), false);
});

test("placeholder labels and unavailable reasons resolve only for their applicable entry states", () => {
  const art = design({
    artwork: { kind: "placeholder", label: "Source concept" },
    translations: [
      {
        locale: "fr",
        fields: {
          artworkLabel: reviewed("fr", "Source concept", "Concept synthétique", {
            artworkRevision: 1,
          }),
        },
      },
    ],
  });
  const catalog = parse(art, {
    ...base("product-unavailable"),
    kind: "product",
    designIds: ["design-presentation"],
    purchase: { state: "unavailable", reason: "Source preparation" },
    translations: [
      {
        locale: "fr",
        fields: {
          unavailableReason: reviewed("fr", "Source preparation", "Préparation synthétique"),
        },
      },
    ],
  });
  const [designEntry, productEntry] = catalog.entries;
  assert.ok(designEntry && productEntry);
  const artContent = getStoreEntryContent(designEntry, { locale: "fr" });
  const productContent = getStoreEntryContent(productEntry, { locale: "fr" });
  assert.deepEqual(artContent.artworkLabel, { value: "Concept synthétique", locale: "fr" });
  assert.equal(artContent.artworkAlt, undefined);
  assert.equal(artContent.unavailableReason, undefined);
  assert.deepEqual(productContent.unavailableReason, {
    value: "Préparation synthétique",
    locale: "fr",
  });
  assert.equal(productContent.artworkLabel, undefined);
});

test("variant labels retain canonical variant order and reject moved approvals", () => {
  const entry = liveCatalog().entries[1];
  assert.ok(entry);
  assert.deepEqual(getStoreEntryContent(entry, { locale: "fr" }).variantLabels, [
    { variantId: "variant-one", value: "Moyen", locale: "fr" },
    { variantId: "variant-two", value: "Medium", locale: "en" },
  ]);
});

test("localized presentation and search preserve canonical object identity, paths and exact purchase actions", () => {
  const catalog = liveCatalog();
  const before = structuredClone(catalog);
  const entry = catalog.entries[1];
  assert.ok(entry?.kind === "product");
  const action = getStorePurchaseAction(catalog, entry.id);
  for (const locale of ["en", "fr", "ja", "ar"]) {
    getStoreEntryContent(entry, { locale });
    const result = filterStoreEntries(catalog, "Original Name", "product", "all", { locale });
    assert.strictEqual(result[0], entry);
    assert.equal(storeEntryPath(result[0]!), "/store/products/product-presentation");
    assert.deepEqual(getStorePurchaseAction(catalog, entry.id), action);
  }
  assert.equal(action.kind, "external");
  assert.deepEqual(catalog, before);
});

test("localized search follows displayed related content and preserves original creative-name aliases", () => {
  const catalog = parse(
    {
      ...base("song-presentation"),
      kind: "context",
      contextType: "song",
      title: "Original Song",
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("fr", "Original Song", "Chanson synthétique"),
          },
        },
      ],
    },
    design({
      description: "SOURCE_DESIGN_DESCRIPTION",
      contextIds: ["song-presentation"],
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("fr", "Original Name", "Cœur synthétique"),
            description: reviewed("fr", "SOURCE_DESIGN_DESCRIPTION", "Illustration florale"),
          },
        },
      ],
    }),
    {
      ...base("product-presentation"),
      title: "Original Product",
      description: "Product source description",
      kind: "product",
      designIds: ["design-presentation"],
      purchase: { state: "preview" },
    },
  );
  const selected = { locale: "fr" };
  assert.deepEqual(
    ids(filterStoreEntries(catalog, "CŒUR chanson", "product", "connected", selected)),
    ["product-presentation"],
  );
  assert.deepEqual(ids(filterStoreEntries(catalog, "Original Name", "product", "all", selected)), [
    "product-presentation",
  ]);
  assert.deepEqual(
    ids(filterStoreEntries(catalog, "Illustration florale", "design", "all", selected)),
    ["design-presentation"],
  );
  assert.deepEqual(
    filterStoreEntries(catalog, "SOURCE_DESIGN_DESCRIPTION", "design", "all", selected),
    [],
  );
  assert.deepEqual(filterStoreEntries(catalog, "chanson", "product", "standalone", selected), []);
  assert.deepEqual(ids(filterStoreEntries(catalog, "SOURCE_DESIGN_DESCRIPTION", "design")), [
    "design-presentation",
  ]);
});

test("search indexes selected fallback fields but not other languages, drafts or stale text", () => {
  const catalog = parse(
    design({
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("fr", "Original Name", "Courant"),
            description: draft("DRAFT_MARKER"),
          },
        },
        { locale: "de", fields: { title: reviewed("de", "Original Name", "UNSELECTED_MARKER") } },
        { locale: "fr-CA", fields: { title: reviewed("fr-CA", "Old source", "STALE_MARKER") } },
      ],
    }),
  );
  const selected = { locale: "fr-CA", fallbackLocales: ["fr", "en"] };
  assert.equal(filterStoreEntries(catalog, "Courant", "all", "all", selected).length, 1);
  for (const query of ["DRAFT_MARKER", "UNSELECTED_MARKER", "STALE_MARKER"]) {
    assert.deepEqual(filterStoreEntries(catalog, query, "all", "all", selected), []);
  }
  assert.deepEqual(filterStoreEntries(catalog, "Courant", "all"), []);
});

test("Unicode search matches composition and compatibility forms without erasing accents", () => {
  const catalog = parse(design({ title: "Café Ｍｏｏｎ 星の庭" }));
  for (const query of ["Cafe\u0301", "CAFÉ", "moon", "ＭＯＯＮ", "星の庭", "星"]) {
    assert.equal(filterStoreEntries(catalog, query, "all").length, 1, query);
  }
  assert.deepEqual(filterStoreEntries(catalog, "cafe", "all"), []);
});

test("case matching uses the explicit selected language or the authored source language", () => {
  const catalog = parse(design({ sourceLocale: "tr", title: "IŞIK İSTANBUL" }));
  assert.equal(filterStoreEntries(catalog, "ışık istanbul", "all").length, 1);
  assert.equal(
    filterStoreEntries(catalog, "ışık istanbul", "all", "all", { locale: "tr" }).length,
    1,
  );
  assert.deepEqual(filterStoreEntries(catalog, "ışık", "all", "all", { locale: "en" }), []);
});

test("locale aliases canonicalize while malformed caller configuration fails explicitly", () => {
  const entry = first(
    parse(
      design({
        translations: [
          {
            locale: "fr-CA",
            fields: {
              title: reviewed("fr-CA", "Original Name", "Titre canadien"),
            },
          },
        ],
      }),
    ),
  );
  assert.deepEqual(getStoreEntryContent(entry, { locale: "fr-ca" }).title, {
    value: "Titre canadien",
    locale: "fr-CA",
  });
  assert.throws(() => getStoreEntryContent(entry, { locale: "not_a_locale" }), RangeError);
});
