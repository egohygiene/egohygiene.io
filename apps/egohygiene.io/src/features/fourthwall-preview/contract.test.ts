import { describe, expect, it } from "vitest";

import { canPreviewVariant, fourthwallProductSchema, previewFourthwallHandoff } from "./contract";

const product = () => fourthwallProductSchema.parse({
  type: "PRODUCT", id: "mock-product", name: "Example", slug: "example",
  state: { type: "AVAILABLE" }, access: { type: "PUBLIC" },
  variants: [
    { id: "small", name: "Black / S", unitPrice: { value: 42, currency: "USD" }, stock: { type: "LIMITED", inStock: 5 } },
    { id: "large", name: "Black / L", unitPrice: { value: 45, currency: "USD" }, stock: { type: "LIMITED", inStock: 1 } },
    { id: "sold-out", name: "Black / XL", unitPrice: { value: 45, currency: "USD" }, stock: { type: "LIMITED", inStock: 0 } },
  ],
});

describe("Fourthwall local preview contract", () => {
  it("carries the selected variant and quantity into an inert handoff", () => {
    expect(previewFourthwallHandoff(product(), "small", 2)).toEqual({
      kind: "mock", productName: "Example", variantName: "Black / S",
      items: [{ variantId: "small", quantity: 2 }], currency: "USD", illustrativeSubtotal: 84,
    });
    expect(previewFourthwallHandoff(product(), "large")?.illustrativeSubtotal).toBe(45);
  });

  it("rejects unselected, unknown, sold-out, excessive, and invalid quantities", () => {
    for (const id of ["", "unknown", "sold-out"]) expect(previewFourthwallHandoff(product(), id)).toBeUndefined();
    for (const quantity of [0, -1, 1.5, 6, Number.NaN]) expect(previewFourthwallHandoff(product(), "small", quantity)).toBeUndefined();
    expect(previewFourthwallHandoff(product(), "large", 2)).toBeUndefined();
  });

  it("keeps private, unavailable, and unknown stock states out of the mock handoff", () => {
    const hidden = product();
    hidden.access.type = "PRIVATE";
    expect(canPreviewVariant(hidden, "small")).toBe(false);
    hidden.access.type = "PUBLIC";
    hidden.state.type = "SOLD_OUT";
    expect(canPreviewVariant(hidden, "small")).toBe(false);
    const unknown = product();
    unknown.variants[0]!.stock.type = "NEW_STATE";
    expect(canPreviewVariant(unknown, "small")).toBe(false);
  });

  it("validates provider fields and rejects bundles and duplicate variant identities", () => {
    expect(fourthwallProductSchema.safeParse({ ...product(), type: "BUNDLE" }).success).toBe(false);
    const duplicate = product();
    duplicate.variants.push(duplicate.variants[0]!);
    expect(fourthwallProductSchema.safeParse(duplicate).success).toBe(false);
    const badPrice = product();
    badPrice.variants[0]!.unitPrice.value = -1;
    expect(fourthwallProductSchema.safeParse(badPrice).success).toBe(false);
    expect(fourthwallProductSchema.parse({ ...product(), futureField: "additive" })).not.toHaveProperty("futureField");
  });
});
