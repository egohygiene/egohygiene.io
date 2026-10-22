import { createLocaleRegistry } from "@egohygiene/i18n";
import { getStorePurchaseAction } from "@egohygiene/schemas";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { storeCatalog } from "../../content/store";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import fourthwallPreview from "../../i18n/locales/en/fourthwallPreview.json";
import { resources } from "../../i18n/resources";
import { FourthwallPreviewPage } from "./FourthwallPreviewPage";

vi.mock("../../content/store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../content/store")>();
  const catalog = structuredClone(actual.storeCatalog);
  const product = catalog.entries.find((entry) => entry.id === "product-demo-signal-heart-hoodie");
  if (!product) throw new Error("Missing fictional preview product");
  product.translations = [
    {
      locale: "fr",
      fields: {
        title: {
          value: "Vêtement fictif Signal Heart",
          review: {
            status: "reviewed",
            locale: "fr",
            reviewedBy: "synthetic-reviewer",
            reviewedAt: "2026-10-20",
            source: { locale: "en", value: product.title },
            value: "Vêtement fictif Signal Heart",
          },
        },
      },
    },
  ];
  return { ...actual, storeCatalog: catalog };
});

afterEach(() => vi.restoreAllMocks());

const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en-US", direction: "ltr", label: "English fixture" },
    { id: "fr", formatLocale: "ar-u-nu-arab", direction: "ltr", label: "French fixture" },
  ],
});
const catalogs = { en: { ...resources, fourthwallPreview } };

function Harness({ language }: { readonly language: "en" | "fr" }) {
  return (
    <MemoryRouter>
      <LocaleProvider
        registry={registry}
        catalogs={catalogs}
        search={`?lang=${language}`}
        onSearchChange={() => {}}
      >
        <FourthwallPreviewPage />
      </LocaleProvider>
    </MemoryRouter>
  );
}

describe("catalog language in the isolated provider preview", () => {
  it("changes only the canonical display name while preserving provider labels, price currency and an existing inert handoff", () => {
    const original = JSON.stringify(storeCatalog);
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const view = render(<Harness language="en" />);
    fireEvent.click(screen.getByRole("button", { name: "M" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Quantity" }), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview checkout handoff" }));
    view.rerender(<Harness language="fr" />);
    expect(screen.getByRole("heading", { name: "Vêtement fictif Signal Heart" })).toHaveAttribute(
      "lang",
      "fr",
    );
    const handoff = screen.getByRole("region", { name: "Checkout handoff preview" });
    expect(within(handoff).getByText("Black / M")).toBeVisible();
    expect(handoff.textContent).toContain(
      new Intl.NumberFormat("ar-u-nu-arab", {
        style: "currency",
        currency: "USD",
      }).format(84),
    );
    expect(screen.getByText("Illustrative price only · USD")).toBeVisible();
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.stringify(storeCatalog)).toBe(original);
    expect(getStorePurchaseAction(storeCatalog, "product-demo-signal-heart-hoodie").kind).toBe(
      "disabled",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
