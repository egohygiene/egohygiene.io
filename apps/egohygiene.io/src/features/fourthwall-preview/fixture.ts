import type { StoreProduct } from "@egohygiene/schemas";

import { fourthwallProductSchema } from "./contract";

/** Synthetic provider data layered over a canonical preview item, never an offer. */
export function createFourthwallFixture(product: StoreProduct) {
  return fourthwallProductSchema.parse({
    type: "PRODUCT",
    id: "mock-fourthwall-signal-heart",
    name: product.title,
    slug: product.slug,
    state: { type: "AVAILABLE" },
    access: { type: "PUBLIC" },
    variants: [
      { size: "S", value: 42, inStock: 5 },
      { size: "M", value: 42, inStock: 5 },
      { size: "L", value: 45, inStock: 5 },
      { size: "XL", value: 45, inStock: 0 },
    ].map(({ size, value, inStock }) => ({
      id: `mock-fourthwall-signal-heart-${size.toLowerCase()}`,
      name: `Black / ${size}`,
      unitPrice: { value, currency: "USD" },
      attributes: { color: { name: "Black" }, size: { name: size } },
      stock: { type: "LIMITED", inStock },
    })),
  });
}
