import { describe, expect, it } from "vitest";

import { safeGraphHref } from "./IntelligenceGraph";

describe("admitted Intelligence graph destinations", () => {
  it("preserves declared local context and explicitly admitted repository destinations", () => {
    expect(safeGraphHref("/intelligence/work/?entity=issue-51#record-51")).toBe(
      "/intelligence/work/?entity=issue-51#record-51",
    );
    const route = "https://egohygiene.github.io/relay/intelligence/";
    expect(safeGraphHref(`${route}?entity=issue-51`, new Set([route]))).toBe(
      `${route}?entity=issue-51`,
    );
    expect(safeGraphHref(route)).toBeNull();
    expect(safeGraphHref("https://unadmitted.example.invalid/")).toBeNull();
  });

  it.each(["\0", "\t", "\n", "\x1f", "\x7f", "\\"])(
    "rejects unsafe literal and decoded query characters (%j)",
    (character) => {
      expect(safeGraphHref(`/intelligence/${character}`)).toBeNull();
      expect(safeGraphHref(`/intelligence/?entity=${encodeURIComponent(character)}`)).toBeNull();
    },
  );
});
