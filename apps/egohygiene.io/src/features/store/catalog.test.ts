import { parseStoreCatalog } from "@egohygiene/schemas";
import { describe, expect, it } from "vitest";

import { filterStoreEntries } from "./domain/index.ts";

const base = (id: string, title: string) => ({
  schemaVersion: 3,
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

  it("keeps empty and whitespace searches ordered, public and canonical across type/story filters", () => {
    for (const query of ["", "  ", "\u3000\t"]) {
      for (const story of ["all", "connected", "standalone"] as const) {
        const all = filterStoreEntries(catalog, query, "all", story);
        expect(ids(all)).toEqual(ids(filterStoreEntries(catalog, "", "all", story)));
        expect(all.every((entry) => catalog.entries.includes(entry))).toBe(true);
        const products = filterStoreEntries(catalog, query, "product", story);
        expect(products).toEqual(all.filter((entry) => entry.kind === "product"));
      }
    }
  });

  it("reflects catalog edits between searches without retaining stale lookup or context state", () => {
    const edited = structuredClone(catalog);
    const before = JSON.stringify(edited);
    expect(ids(filterStoreEntries(edited, "lunar", "product"))).toEqual(["product-orbit"]);
    expect(JSON.stringify(edited)).toBe(before);

    const heart = edited.entries.find((entry) => entry.id === "design-heart");
    if (heart?.kind !== "design") throw new Error("Missing design fixture");
    heart.contextIds.push("song-orbit");
    edited.entries.reverse();
    const after = JSON.stringify(edited);
    const found = filterStoreEntries(edited, "lunar", "product");
    expect(ids(found)).toEqual(["product-heart", "product-moss", "product-orbit"]);
    expect(found.every((entry) => edited.entries.includes(entry))).toBe(true);
    expect(JSON.stringify(edited)).toBe(after);

    const song = edited.entries.find((entry) => entry.id === "song-orbit");
    if (!song) throw new Error("Missing context fixture");
    song.visibility = "draft";
    expect(filterStoreEntries(edited, "lunar", "product")).toEqual([]);
  });

  it("still rejects malformed selection and fallback locales for a blank search", () => {
    expect(() => filterStoreEntries(catalog, "", "all", "all", { locale: "not_a_locale" }))
      .toThrow(RangeError);
    expect(() => filterStoreEntries(catalog, "  ", "all", "all", {
      locale: "en",
      fallbackLocales: ["not_a_locale"],
    })).toThrow(RangeError);
  });

});
