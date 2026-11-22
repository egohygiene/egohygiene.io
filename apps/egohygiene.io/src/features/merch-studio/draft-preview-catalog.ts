import { parseStoreCatalog, STORE_SCHEMA_VERSION } from "@egohygiene/schemas";

import type { MerchDraft } from "./draft-store";

/** Build a temporary catalog graph using the same validator as storefront data. */
export function createDraftPreviewCatalog(draft: MerchDraft) {
  const designId = `local-draft-design-${draft.id}`;
  const productId = `local-draft-product-${draft.id}`;
  const common = {
    schemaVersion: STORE_SCHEMA_VERSION,
    sourceLocale: "en",
    visibility: "draft",
  } as const;

  const catalog = parseStoreCatalog([
    {
      source: "local draft artwork",
      value: {
        ...common,
        kind: "design",
        id: designId,
        slug: designId,
        title: "Draft artwork study",
        description: "Placeholder artwork for the local product preview.",
        artworkRevision: 1,
        artwork: { kind: "placeholder", label: "Local artwork study" },
      },
    },
    {
      source: "local draft product",
      value: {
        ...common,
        kind: "product",
        id: productId,
        slug: productId,
        title: draft.title,
        description: draft.description,
        designIds: [designId],
        purchase: { state: "unavailable", reason: "Purchasing disabled" },
      },
    },
  ]);

  const [design, product] = catalog.entries;
  if (design?.kind !== "design" || product?.kind !== "product") {
    throw new Error("The local preview requires a linked design and product.");
  }

  return { catalog, design, product };
}
