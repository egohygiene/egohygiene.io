import { describe, expect, it } from "vitest";

import { cn, createSlug, isBrowser } from "./index";

describe("utilities", () => {
  it("joins class names", () => {
    expect(cn("alpha", false, "beta", undefined, "gamma")).toBe("alpha beta gamma");
  });

  it("creates stable slugs", () => {
    expect(createSlug("Ego Hygiene / Balance & Growth")).toBe("ego-hygiene-balance-growth");
  });

  it("detects the browser under jsdom", () => {
    expect(isBrowser()).toBe(true);
  });
});
