import { describe, expect, it } from "vitest";
import { storeProductSchema } from "@egohygiene/schemas";

import {
  canPreviewStoreVariant,
  createStorePreviewOffer,
  previewStoreHandoff,
} from "../store/domain/index.ts";
import { fourthwallPreviewAdapter } from "./adapter.ts";
import { fourthwallProductSchema } from "./contract.ts";

const canonical = storeProductSchema.parse({
  schemaVersion: 1,
  kind: "product",
  id: "product-example",
  slug: "canonical-example",
  title: "Example",
  description: "Fictional example",
  visibility: "public",
  designIds: ["design-example"],
  purchase: { state: "preview" },
});

const offer = (input: unknown = product()) =>
  createStorePreviewOffer(canonical, fourthwallPreviewAdapter, input);

const product = () =>
  fourthwallProductSchema.parse({
    type: "PRODUCT",
    id: "mock-product",
    name: "Example",
    slug: "example",
    state: { type: "AVAILABLE" },
    access: { type: "PUBLIC" },
    variants: [
      {
        id: "small",
        name: "Black / S",
        unitPrice: { value: 42, currency: "USD" },
        stock: { type: "LIMITED", inStock: 5 },
      },
      {
        id: "large",
        name: "Black / L",
        unitPrice: { value: 45, currency: "USD" },
        stock: { type: "LIMITED", inStock: 1 },
      },
      {
        id: "sold-out",
        name: "Black / XL",
        unitPrice: { value: 45, currency: "USD" },
        stock: { type: "LIMITED", inStock: 0 },
      },
    ],
  });

describe("Fourthwall local preview contract", () => {
  it("carries the selected variant and quantity into an inert handoff", () => {
    expect(previewStoreHandoff(offer(), "small", 2)).toEqual({
      kind: "mock",
      productName: "Example",
      variantName: "Black / S",
      productId: "product-example",
      provider: "fourthwall",
      providerProductId: "mock-product",
      items: [{ variantId: "small", quantity: 2 }],
      currency: "USD",
      illustrativeSubtotal: 84,
    });
    expect(previewStoreHandoff(offer(), "large")?.illustrativeSubtotal).toBe(45);
  });

  it("rejects unselected, unknown, sold-out, excessive, and invalid quantities", () => {
    for (const id of ["", "unknown", "sold-out"])
      expect(previewStoreHandoff(offer(), id)).toBeUndefined();
    for (const quantity of [0, -1, 1.5, 6, Number.NaN, Number.POSITIVE_INFINITY])
      expect(previewStoreHandoff(offer(), "small", quantity)).toBeUndefined();
    expect(previewStoreHandoff(offer(), "large", 2)).toBeUndefined();
  });

  it("keeps private, unavailable, and unknown stock states out of the mock handoff", () => {
    const hidden = product();
    hidden.access.type = "PRIVATE";
    expect(canPreviewStoreVariant(offer(hidden), "small")).toBe(false);
    hidden.access.type = "PUBLIC";
    hidden.state.type = "SOLD_OUT";
    expect(canPreviewStoreVariant(offer(hidden), "small")).toBe(false);
    const unknown = product();
    unknown.variants[0]!.stock.type = "NEW_STATE";
    expect(canPreviewStoreVariant(offer(unknown), "small")).toBe(false);
    const missingStock = product();
    delete missingStock.variants[0]!.stock.inStock;
    expect(canPreviewStoreVariant(offer(missingStock), "small")).toBe(false);
    expect(previewStoreHandoff(offer({ ...product(), variants: [] }), "small")).toBeUndefined();
  });

  it("validates provider fields and rejects bundles and duplicate variant identities", () => {
    expect(() => offer({ ...product(), type: "BUNDLE" })).toThrow();
    const duplicate = product();
    duplicate.variants.push(duplicate.variants[0]!);
    expect(() => offer(duplicate)).toThrow();
    const badPrice = product();
    badPrice.variants[0]!.unitPrice.value = -1;
    expect(() => offer(badPrice)).toThrow();
    expect(offer({ ...product(), futureField: "additive" })).not.toHaveProperty("futureField");
  });

  it("uses canonical identity even when provider copy and paths differ", () => {
    const normalized = offer({ ...product(), name: "Provider copy", slug: "provider-slug" });
    expect(normalized).toMatchObject({
      productId: canonical.id,
      name: canonical.title,
      slug: canonical.slug,
    });
    expect(normalized).not.toHaveProperty("state");
    expect(normalized.variants[0]).not.toHaveProperty("unitPrice");
  });
});
