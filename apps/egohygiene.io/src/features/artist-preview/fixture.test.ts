import { getStorePurchaseAction } from "@egohygiene/schemas";
import { describe, expect, it } from "vitest";

import { storeCatalog, storefrontCuration } from "../../content/store";
import { getCuratedStoreArtist, getEntryDesigns, storeEntryPath } from "../store/domain/index.ts";
import { createArtistPreview } from "./fixture";

describe("isolated artist preview fixture", () => {
  it("demonstrates standalone, song and overlapping entries without assigning them to .play()", () => {
    const before = JSON.stringify(storeCatalog);
    const preview = createArtistPreview(storeCatalog);
    const demo = getCuratedStoreArtist(preview.catalog, preview.curation, "demo-artist");
    expect(demo).toBeDefined();
    expect(demo?.standaloneEntries.map((entry) => entry.id)).toEqual([
      "product-demo-signal-heart-hoodie",
      "design-demo-static-bloom",
      "product-demo-static-bloom-mug",
    ]);
    const songCollection = demo?.songCollections[0];
    expect(songCollection).toBeDefined();
    if (!songCollection) throw new Error("Fixture song collection missing");
    expect(storeEntryPath(songCollection)).toBe("/store/collections/static-bloom-collection");
    expect(getEntryDesigns(preview.catalog, songCollection).map((design) => design.id)).toContain(
      "design-demo-static-bloom",
    );
    const sharedProduct = demo?.standaloneEntries.find(
      (entry) => entry.kind === "product" && songCollection.productIds.includes(entry.id),
    );
    expect(sharedProduct?.id).toBe("product-demo-static-bloom-mug");
    if (!sharedProduct) throw new Error("Shared fixture product missing");
    expect(storeEntryPath(sharedProduct)).toBe("/store/products/static-bloom-mug");
    expect(getStorePurchaseAction(preview.catalog, sharedProduct.id).kind).toBe("disabled");
    expect(getCuratedStoreArtist(preview.catalog, preview.curation, "play")).toBeUndefined();
    expect(
      getCuratedStoreArtist(storeCatalog, storefrontCuration, "play")?.standaloneEntries,
    ).toEqual([]);
    expect(JSON.stringify(storeCatalog)).toBe(before);
  });

  it("fails clearly when a required public demo record is missing rather than fabricating merchandise", () => {
    expect(() =>
      createArtistPreview({
        ...storeCatalog,
        entries: storeCatalog.entries.filter(
          (entry) => entry.id !== "collection-demo-static-bloom",
        ),
      }),
    ).toThrow(/artist-preview-curation.*songCollectionIds/);
  });
});
