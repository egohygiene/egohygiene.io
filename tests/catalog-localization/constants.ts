/** Authored synthetic text, not a translation or merchandise approval. Browser-safe test data. */
export const CATALOG_LOCALIZATION_FIXTURE = {
  prefix: "test-localization-65c",
  locale: "fr",
  regionalLocale: "fr-CA",
  liveTitle: "Éclat café — vêtement fictif pour vérifier les longues présentations",
  liveDescription:
    "Vêtement fictif : description synthétique pour la recherche et les métadonnées.",
  regionalTitle: "Éclat canadien — vêtement fictif",
  artworkAlt: "Carré violet fictif, sans produit réel",
  variantLabel: "Taille fictive",
  collection: {
    id: "test-localization-65c-collection",
    slug: "test-localization-65c-collection",
    title: "Café Moon / 星の庭",
    description: "Fictional collection with an intentionally untranslated creative name.",
    translatedDescription: "Collection fictive : le nom créatif reste inchangé.",
    path: "/store/collections/test-localization-65c-collection",
  },
  draftMarker: "TEST_LOCALIZATION_65C_DRAFT",
  staleMarker: "TEST_LOCALIZATION_65C_STALE",
  price: { amountMinor: 3599, currency: "USD", authority: "provider-checkout" },
} as const;
