import { describe, expect, it } from "vitest";

import { products } from "./products";

describe("products", () => {
  it("uses unique identifiers and paths", () => {
    expect(new Set(products.map((product) => product.identifier)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.path)).size).toBe(products.length);
  });
});
