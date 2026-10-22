import { describe, expect, it } from "vitest";

import { createLocaleRegistry, type LocaleDefinition } from "./locale-registry";

const english: LocaleDefinition = {
  id: "en",
  formatLocale: "en-US",
  direction: "ltr",
  label: "English",
};
const french: LocaleDefinition = {
  id: "fr",
  formatLocale: "fr-FR",
  direction: "ltr",
  label: "Français",
};

describe("createLocaleRegistry", () => {
  it("normalizes registered identifiers and resolves only explicit supported locales", () => {
    const registry = createLocaleRegistry({
      sourceLocale: "EN",
      locales: [english, { ...french, id: "fr-ca", formatLocale: "fr-ca" }],
    });
    expect(registry.sourceLocale).toBe("en");
    expect(registry.resolve("FR-ca")).toMatchObject({ id: "fr-CA", formatLocale: "fr-CA" });
    for (const value of [undefined, null, "", "fr", "de", "not_a_locale"]) {
      expect(registry.resolve(value).id).toBe("en");
    }
    expect(registry.getFallbacks("fr-ca").map((locale) => locale.id)).toEqual(["en"]);
    expect(registry.getFallbacks("de")).toEqual([]);
  });

  it("expands explicit fallbacks with stable deduplication and the source always last", () => {
    const registry = createLocaleRegistry({
      sourceLocale: "en",
      locales: [
        english,
        french,
        { ...french, id: "fr-CA", fallbacks: ["en", "fr", "fr"] },
        { ...french, id: "fr-BE", fallbacks: ["fr-CA", "fr", "en"] },
      ],
    });
    expect(registry.getFallbacks("fr-BE").map((locale) => locale.id)).toEqual([
      "fr-CA",
      "fr",
      "en",
    ]);
    expect(registry.getFallbacks("fr-CA").map((locale) => locale.id)).toEqual(["fr", "en"]);
    expect(registry.getFallbacks("en")).toEqual([]);
  });

  it("does not infer direction or formatting locale from the locale identifier", () => {
    const registry = createLocaleRegistry({
      sourceLocale: "en",
      locales: [
        english,
        { id: "ar", formatLocale: "ar-EG", direction: "rtl", label: "RTL fixture" },
      ],
    });
    expect(registry.resolve("ar")).toMatchObject({
      id: "ar",
      formatLocale: "ar-EG",
      direction: "rtl",
    });
  });

  it("rejects normalized duplicates and an unregistered source locale", () => {
    expect(() =>
      createLocaleRegistry({ sourceLocale: "en", locales: [english, { ...english, id: "EN" }] }),
    ).toThrow("Duplicate locale identifier: en");
    expect(() => createLocaleRegistry({ sourceLocale: "en", locales: [french] })).toThrow(
      "Source locale en is not registered",
    );
  });

  it("rejects malformed locale IDs and formatting locales", () => {
    expect(() =>
      createLocaleRegistry({ sourceLocale: "en", locales: [english, { ...french, id: "fr_CA" }] }),
    ).toThrow("Invalid locale identifier");
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [{ ...english, formatLocale: "en_US" }],
      }),
    ).toThrow("Invalid locale identifier");
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [{ ...english, formatLocale: "zz-ZZ" }],
      }),
    ).toThrow("Unsupported formatting locale");
  });

  it("allows a synthetic UI identifier when its formatting locale is supported", () => {
    const registry = createLocaleRegistry({
      sourceLocale: "en",
      locales: [english, { ...english, id: "qps-ploc", label: "Expanded fixture" }],
    });
    expect(registry.resolve("qps-ploc")).toMatchObject({ id: "qps-Ploc", formatLocale: "en-US" });
  });

  it("rejects missing fallback references, self-cycles and longer cycles", () => {
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [english, { ...french, fallbacks: ["de"] }],
      }),
    ).toThrow("Unknown fallback locale de for fr");
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [english, { ...french, fallbacks: ["fr"] }],
      }),
    ).toThrow("Locale fallback cycle");
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [
          english,
          { ...french, fallbacks: ["fr-CA"] },
          { ...french, id: "fr-CA", fallbacks: ["fr"] },
        ],
      }),
    ).toThrow("Locale fallback cycle");
  });

  it("rejects fallbacks on the source and blank labels", () => {
    expect(() =>
      createLocaleRegistry({
        sourceLocale: "en",
        locales: [{ ...english, fallbacks: ["fr"] }, french],
      }),
    ).toThrow("The source locale cannot declare fallbacks");
    expect(() =>
      createLocaleRegistry({ sourceLocale: "en", locales: [{ ...english, label: " " }] }),
    ).toThrow("requires a label");
  });

  it("isolates registry definitions from later mutation of caller-owned fallback arrays", () => {
    const fallbacks = ["en"];
    const registry = createLocaleRegistry({
      sourceLocale: "en",
      locales: [english, { ...french, fallbacks }],
    });
    fallbacks.push("de");
    expect(registry.resolve("fr").fallbacks).toEqual(["en"]);
    expect(Object.isFrozen(registry.locales)).toBe(true);
    expect(Object.isFrozen(registry.resolve("fr"))).toBe(true);
    expect(Object.isFrozen(registry.getFallbacks("fr"))).toBe(true);
  });
});
