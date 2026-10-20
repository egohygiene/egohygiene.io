import { parseStoreCatalog } from "@egohygiene/schemas";
import { describe, expect, it } from "vitest";

import { filterStoreEntries } from "./domain/index.ts";

const base = (id: string, title: string) => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title,
  description: "Fictional catalog example",
  visibility: "public",
});

const catalog = parseStoreCatalog([
  {
    ...base("song-orbit", "Orbit"),
    kind: "context",
    contextType: "song",
    description: "An imagined lunar song",
  },
  { ...base("character-moss", "Moss"), kind: "context", contextType: "character" },
  {
    ...base("design-orbit", "Orbit circles"),
    kind: "design",
    contextIds: ["song-orbit"],
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "Circle artwork" },
  },
  {
    ...base("design-heart", "Glitched heart"),
    kind: "design",
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "Heart artwork" },
  },
  {
    ...base("product-orbit", "Orbit mug"),
    kind: "product",
    designIds: ["design-orbit"],
    purchase: { state: "preview" },
  },
  {
    ...base("product-moss", "Moss hoodie"),
    kind: "product",
    contextIds: ["character-moss"],
    designIds: ["design-heart"],
    purchase: { state: "preview" },
  },
  {
    ...base("product-heart", "Heart hoodie"),
    kind: "product",
    designIds: ["design-heart"],
    purchase: { state: "preview" },
  },
  {
    ...base("collection-orbit", "Lunar objects"),
    kind: "collection",
    productIds: ["product-orbit"],
  },
  {
    ...base("collection-heart", "Heart objects"),
    kind: "collection",
    designIds: ["design-heart"],
    productIds: ["product-heart"],
  },
  {
    ...base("design-unreleased", "Unreleased heart"),
    kind: "design",
    visibility: "draft",
    contextIds: ["song-orbit"],
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "Unreleased artwork" },
  },
].map((value) => ({ source: `${value.id}.json`, value })));

const ids = (entries: ReturnType<typeof filterStoreEntries>) => entries.map((entry) => entry.id);

describe("store story browsing", () => {
  it("preserves the three-argument browse API and its public entries", () => {
    expect(ids(filterStoreEntries(catalog, "", "all"))).toEqual([
      "design-orbit", "design-heart", "product-orbit", "product-moss", "product-heart",
      "collection-orbit", "collection-heart",
    ]);
  });

  it("finds direct stories and stories inherited through product and collection designs", () => {
    expect(ids(filterStoreEntries(catalog, "", "all", "connected"))).toEqual([
      "design-orbit", "product-orbit", "product-moss", "collection-orbit",
    ]);
  });

  it("keeps standalone designs, products, and collections available independently of their kind", () => {
    expect(ids(filterStoreEntries(catalog, "", "all", "standalone"))).toEqual([
      "design-heart", "product-heart", "collection-heart",
    ]);
  });

  it("combines story and type filters with case-insensitive search of inherited context text", () => {
    expect(ids(filterStoreEntries(catalog, " LUNAR   mug ", "product", "connected")))
      .toEqual(["product-orbit"]);
    expect(filterStoreEntries(catalog, "lunar mug", "product", "standalone")).toEqual([]);
    expect(ids(filterStoreEntries(catalog, "glitched hoodie", "product", "standalone")))
      .toEqual(["product-heart"]);
  });

  it("does not expose draft designs or their search matches through a story filter", () => {
    for (const story of ["all", "connected", "standalone"] as const) {
      expect(filterStoreEntries(catalog, "unreleased", "all", story)).toEqual([]);
    }
  });
});
