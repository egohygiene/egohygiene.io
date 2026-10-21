import { createLocaleRegistry, useI18n } from "@egohygiene/i18n";
import { storeEntrySchema } from "@egohygiene/schemas";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { localeRegistry } from "../../i18n/config";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { resources } from "../../i18n/resources";
import { useStoreContent } from "./useStoreContent";

// Synthetic review records exercise selection; they approve no public language.
const translatedTitle = (locale: string, value: string) => ({
  locale,
  fields: {
    title: {
      value,
      review: {
        status: "reviewed",
        locale,
        reviewedBy: "synthetic-reviewer",
        reviewedAt: "2026-10-20",
        source: { locale: "en", value: "Original creative name" },
        value,
      },
    },
  },
});
const entry = storeEntrySchema.parse({
  schemaVersion: 2,
  sourceLocale: "en",
  kind: "context",
  contextType: "artist",
  id: "artist-synthetic",
  slug: "synthetic",
  title: "Original creative name",
  description: "Untranslated source description",
  visibility: "public",
  translations: [
    translatedTitle("fr", "French fixture name"),
    translatedTitle("de", "German fixture name"),
  ],
});
const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en", direction: "ltr", label: "Source" },
    { id: "fr", formatLocale: "fr", direction: "ltr", label: "French fixture" },
    {
      id: "fr-CA",
      formatLocale: "de-DE",
      direction: "ltr",
      label: "Mixed fixture",
      fallbacks: ["fr"],
    },
  ],
});

function Probe() {
  const { content, formatLocale } = useStoreContent();
  const { formatNumber, formatDate } = useI18n();
  const text = content(entry);
  return (
    <>
      <h1 lang={text.title.locale}>{text.title.value}</h1>
      <p lang={text.description.locale}>{text.description.value}</p>
      <output aria-label="number">{formatNumber(1234.5)}</output>
      <output aria-label="date">{formatDate(new Date("2026-10-20T12:00:00Z"))}</output>
      <output aria-label="format locale">{formatLocale}</output>
    </>
  );
}

afterEach(() => window.localStorage.clear());

describe("catalog selection bridge", () => {
  it("takes the content fallback chain from the site registry while keeping number/date formatting separate", () => {
    const original = JSON.stringify(entry);
    const view = (search: string) => (
      <LocaleProvider
        registry={registry}
        catalogs={{ en: resources }}
        search={search}
        onSearchChange={() => undefined}
      >
        <Probe />
      </LocaleProvider>
    );
    const { getByRole, getByText, rerender } = render(view("?lang=fr-CA"));
    expect(getByRole("heading")).toHaveTextContent("French fixture name");
    expect(getByRole("heading")).toHaveAttribute("lang", "fr");
    expect(getByText("Untranslated source description")).toHaveAttribute("lang", "en");
    expect(getByRole("status", { name: "number" })).toHaveTextContent(
      new Intl.NumberFormat("de-DE").format(1234.5),
    );
    expect(getByRole("status", { name: "date" })).toHaveTextContent(
      new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(
        new Date("2026-10-20T12:00:00Z"),
      ),
    );
    expect(getByRole("status", { name: "format locale" })).toHaveTextContent("de-DE");
    rerender(view("?lang=en"));
    expect(getByRole("heading")).toHaveTextContent("Original creative name");
    expect(getByRole("heading")).toHaveAttribute("lang", "en");
    expect(JSON.stringify(entry)).toBe(original);
  });

  it("does not enable catalog translations just because an unregistered language is requested", () => {
    const { getByRole } = render(
      <LocaleProvider
        registry={localeRegistry}
        catalogs={{ en: resources }}
        search="?lang=fr"
        onSearchChange={() => undefined}
      >
        <Probe />
      </LocaleProvider>,
    );
    expect(getByRole("heading")).toHaveTextContent("Original creative name");
    expect(getByRole("heading")).toHaveAttribute("lang", "en");
  });
});
