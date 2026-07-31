import { describe, expect, it } from "vitest";

import { createBrowserConfig, parseBrowserEnvironment } from "./index";

describe("config", () => {
  it("applies defaults", () => {
    expect(createBrowserConfig({})).toEqual({
      siteName: "Ego Hygiene",
      siteUrl: "https://egohygiene.io",
    });
  });

  it("rejects invalid urls", () => {
    expect(() => parseBrowserEnvironment({ VITE_SITE_URL: "notaurl" })).toThrow();
  });
});
