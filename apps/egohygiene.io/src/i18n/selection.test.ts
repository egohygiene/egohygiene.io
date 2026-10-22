import { createLocaleRegistry } from "@egohygiene/i18n";
import { describe, expect, it, vi } from "vitest";

import { defaultLocale, localePreferenceKey, localeRegistry } from "./config";
import { persistLocalePreference, resolveLocaleSelection, withLocaleSearch } from "./selection";

const fixtures = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en", direction: "ltr", label: "English fixture" },
    { id: "fr", formatLocale: "fr", direction: "ltr", label: "French fixture" },
    { id: "ar", formatLocale: "ar", direction: "rtl", label: "RTL fixture" },
  ],
});

describe("website locale selection contract", () => {
  it("registers only English publicly and keeps storage in a dedicated key", () => {
    expect(localeRegistry.locales.map((locale) => locale.id)).toEqual(["en"]);
    expect(defaultLocale).toBe("en");
    expect(localePreferenceKey).toBe("egohygiene.locale");
    expect(resolveLocaleSelection(localeRegistry, "?lang=ar").id).toBe("en");
  });

  it("prefers an explicit registered URL locale without reading storage", () => {
    const read = vi.fn(() => "ar");
    expect(resolveLocaleSelection(fixtures, "?q=heart&lang=FR", read).id).toBe("fr");
    expect(read).not.toHaveBeenCalled();
    expect(resolveLocaleSelection(fixtures, "?lang=en", read).id).toBe("en");
  });

  it.each(["", "?lang=", "?lang=de", "?lang=fr_FR", "?lang=%FF", "?lang=fr&lang=ar"])(
    "ignores absent, ambiguous or unsupported URL selection %s and tries a saved preference",
    (search) => {
      expect(resolveLocaleSelection(fixtures, search, () => "AR").id).toBe("ar");
    },
  );

  it.each([null, "", "de", "fr-FR", "not a locale", "constructor"])(
    "uses the source locale when saved preference %s is not registered",
    (saved) => {
      expect(resolveLocaleSelection(fixtures, "", () => saved).id).toBe("en");
    },
  );

  it("survives denied storage access and does not consult browser language", () => {
    expect(
      resolveLocaleSelection(fixtures, "", () => {
        throw new DOMException("Storage denied", "SecurityError");
      }).id,
    ).toBe("en");
    expect(resolveLocaleSelection(fixtures, "").id).toBe("en");
  });

  it("writes only the language parameter, preserving filters and repeated unrelated values", () => {
    const before = new URL(
      "https://example.test/store/catalog?q=heart&view=product&tag=a&tag=b#designs",
    );
    before.search = withLocaleSearch(fixtures, before.search, "AR");
    expect(before.pathname).toBe("/store/catalog");
    expect(before.hash).toBe("#designs");
    expect(before.searchParams.get("q")).toBe("heart");
    expect(before.searchParams.get("view")).toBe("product");
    expect(before.searchParams.getAll("tag")).toEqual(["a", "b"]);
    expect(before.searchParams.getAll("lang")).toEqual(["ar"]);
    expect(before.searchParams.has("currency")).toBe(false);
    expect(before.searchParams.has("country")).toBe(false);
  });

  it("keeps a source-language choice explicit and collapses duplicate language parameters", () => {
    const search = withLocaleSearch(fixtures, "?lang=ar&lang=fr&q=hello", "en");
    expect(new URLSearchParams(search).getAll("lang")).toEqual(["en"]);
    expect(resolveLocaleSelection(fixtures, search, () => "ar").id).toBe("en");
    expect(() => withLocaleSearch(fixtures, "?q=hello", "de")).toThrow("not registered");
  });

  it("canonicalizes valid preferences and never writes unsupported ones", () => {
    const write = vi.fn();
    expect(persistLocalePreference(fixtures, "FR", write)).toBe(true);
    expect(write).toHaveBeenCalledWith("fr");
    expect(persistLocalePreference(fixtures, "de", write)).toBe(false);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("reports denied preference writes without rejecting the selected locale", () => {
    expect(
      persistLocalePreference(fixtures, "ar", () => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }),
    ).toBe(false);
    expect(resolveLocaleSelection(fixtures, "?lang=ar").id).toBe("ar");
  });
});
