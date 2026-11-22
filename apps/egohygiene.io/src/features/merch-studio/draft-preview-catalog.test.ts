import {
  getStorePurchaseAction,
  STORE_SCHEMA_VERSION,
  toPublicStoreCatalog,
} from "@egohygiene/schemas";
import { describe, expect, it } from "vitest";

import { createDraftPreviewCatalog } from "./draft-preview-catalog";
import type { MerchDraft } from "./draft-store";

const draft: MerchDraft = {
  id: "mock-tote",
  title: "Mock tote",
  description: "A sample draft for the product preview.",
  productType: "Tote bag",
};

describe("local merchandise draft preview", () => {
  it("validates the design and product without publishing them or enabling checkout", () => {
    const { catalog, design, product } = createDraftPreviewCatalog(draft);

    expect(catalog.schemaVersion).toBe(STORE_SCHEMA_VERSION);
    expect(product).toMatchObject({
      title: draft.title,
      description: draft.description,
      designIds: [design.id],
      visibility: "draft",
      purchase: { state: "unavailable" },
    });
    expect(design).toMatchObject({ visibility: "draft", artwork: { kind: "placeholder" } });
    expect(getStorePurchaseAction(catalog, product.id).kind).toBe("disabled");
    expect(toPublicStoreCatalog(catalog)).toEqual({
      schemaVersion: STORE_SCHEMA_VERSION,
      entries: [],
      checkoutRoutes: [],
    });
  });

  it("derives preview identities from the draft ID while keeping editable copy", () => {
    const original = createDraftPreviewCatalog(draft);
    const renamed = createDraftPreviewCatalog({ ...draft, title: "Updated title" });
    const other = createDraftPreviewCatalog({ ...draft, id: "another-tote" });

    expect(renamed.product.id).toBe(original.product.id);
    expect(renamed.design.id).toBe(original.design.id);
    expect(renamed.product.title).toBe("Updated title");
    expect(other.product.id).not.toBe(original.product.id);
    expect(other.design.id).not.toBe(original.design.id);
  });
});
