import type { StoreCatalog } from "@egohygiene/schemas";
import {
  emptyStorefrontCuration,
  parseStoreCatalog,
  parseStorefrontCuration,
} from "@egohygiene/schemas";

/** Synthetic discovery only. Reuse the public demo entries without assigning them to a real artist. */
export function createArtistPreview(catalog: StoreCatalog) {
  const previewCatalog = parseStoreCatalog(
    [
      ...catalog.entries.map((value) => ({ source: value.id, value })),
      {
        source: "artist-preview-fixture",
        value: {
          schemaVersion: 3,
          sourceLocale: "en",
          kind: "context",
          contextType: "artist",
          visibility: "public",
          id: "artist-preview-fictional",
          slug: "demo-artist",
          title: "Demo artist",
          description: "A fictional artist used only to try the local collection journey.",
        },
      },
    ],
    catalog.checkoutRoutes,
  );
  const curation = parseStorefrontCuration(
    {
      ...emptyStorefrontCuration(),
      artists: [
        {
          artistId: "artist-preview-fictional",
          standaloneEntryIds: [
            "product-demo-signal-heart-hoodie",
            "design-demo-static-bloom",
            "product-demo-static-bloom-mug",
          ],
          songCollectionIds: ["collection-demo-static-bloom"],
        },
      ],
    },
    previewCatalog,
    "artist-preview-curation",
  );
  return { catalog: previewCatalog, curation };
}
