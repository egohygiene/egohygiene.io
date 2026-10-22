import type { StoreCatalog } from "@egohygiene/schemas";
import { emptyStorefrontCuration, getStorePurchaseAction } from "@egohygiene/schemas";
import { act, fireEvent, render, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CATALOG_LOCALIZATION_FIXTURE as localized } from "../../../../../tests/catalog-localization/constants";
import { createCatalogLocalizationCatalog } from "../../../../../tests/catalog-localization/inputs";
import {
  catalogLocaleMessages,
  catalogLocaleRegistry,
} from "../../../../../tests/catalog-localization/locales";
import { CHECKOUT_HANDOFF_FIXTURE as handoff } from "../../../../../tests/checkout-handoff/inputs";
import { AppProviders } from "../../app/providers";
import { RootLayout } from "../../layouts/RootLayout";
import {
  StoreCatalogPage,
  StoreCollectionPage,
  StoreDesignPage,
  StoreProductPage,
} from "./StorePages";

const input = vi.hoisted(() => ({
  catalog: { schemaVersion: 3, entries: [], checkoutRoutes: [] } as StoreCatalog,
}));

// Replace only the build-time catalog input. Providers, shell, router and pages are real.
vi.mock("../../content/store", () => ({
  get storeCatalog() {
    return input.catalog;
  },
  get storefrontCuration() {
    return emptyStorefrontCuration();
  },
}));

function setup(path: string) {
  const router = createMemoryRouter(
    [
      {
        element: <RootLayout />,
        children: [
          { path: "/store/catalog", element: <StoreCatalogPage /> },
          { path: "/store/products/:slug", element: <StoreProductPage /> },
          { path: "/store/designs/:slug", element: <StoreDesignPage /> },
          { path: "/store/collections/:slug", element: <StoreCollectionPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  const result = render(
    <AppProviders router={router} registry={catalogLocaleRegistry} catalogs={catalogLocaleMessages}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router };
}

beforeEach(() => {
  input.catalog = createCatalogLocalizationCatalog();
  // jsdom has no viewport scrolling; this does not substitute for browser layout evidence.
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("shared bilingual catalog journeys (simulated DOM, not browser acceptance)", () => {
  it("follows source-name search through a language switch, product, collection and back", async () => {
    const original = JSON.stringify(input.catalog);
    const result = setup(
      `/store/catalog?lang=en&view=product&q=${encodeURIComponent(handoff.live.title)}`,
    );
    const results = () => within(result.getByRole("region", { name: "Find your frequency." }));
    expect(results().getAllByRole("article")).toHaveLength(1);
    expect(results().getByRole("heading", { name: handoff.live.title })).toHaveAttribute(
      "lang",
      "en",
    );

    await act(async () =>
      fireEvent.change(result.getByRole("combobox", { name: "Language" }), {
        target: { value: "fr" },
      }),
    );
    expect(results().getAllByRole("article")).toHaveLength(1);
    const card = results().getByRole("link", {
      name: (name) => name.includes(localized.liveTitle),
    });
    expect(card).toHaveAttribute("href", `${handoff.live.path}?lang=fr`);
    await act(async () => fireEvent.click(card));
    expect(result.router.state.location.pathname).toBe(handoff.live.path);
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(localized.liveTitle);
    expect(document.title).toContain(localized.liveTitle);
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      localized.liveDescription,
    );

    const collectionLink = result.container.querySelector<HTMLAnchorElement>(".store-detail-world");
    expect(collectionLink).toHaveAttribute("href", `${localized.collection.path}?lang=fr`);
    await act(async () => fireEvent.click(collectionLink!));
    expect(result.router.state.location.pathname).toBe(localized.collection.path);
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(localized.collection.title);
    expect(result.getByRole("heading", { level: 1 })).toHaveAttribute("lang", "en");
    expect(result.getByText(localized.collection.translatedDescription)).toHaveAttribute(
      "lang",
      "fr",
    );

    await act(async () =>
      fireEvent.change(result.getByRole("combobox", { name: "Language" }), {
        target: { value: "en" },
      }),
    );
    expect(result.router.state.location.pathname).toBe(localized.collection.path);
    const sourceCard = result.getByRole("link", {
      name: (name) => name.includes(handoff.live.title),
    });
    expect(sourceCard).toHaveAttribute("href", `${handoff.live.path}?lang=en`);
    await act(async () => fireEvent.click(sourceCard));
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(handoff.live.title);
    expect(JSON.stringify(input.catalog)).toBe(original);
  });

  it("resolves regional missing/stale fields and captures the unchanged external link without navigation", async () => {
    const original = JSON.stringify(input.catalog);
    const result = setup(`${handoff.live.path}?lang=fr-CA`);
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(localized.regionalTitle);
    expect(result.getByRole("heading", { level: 1 })).toHaveAttribute("lang", "fr-CA");
    expect(result.getByText(localized.liveDescription)).toHaveAttribute("lang", "fr");
    expect(result.getAllByAltText(localized.artworkAlt)[0]).toHaveAttribute("lang", "fr");
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      localized.liveDescription,
    );
    expect(result.container.querySelector(".store-price")?.textContent).toContain(
      new Intl.NumberFormat("fr-CA", { style: "currency", currency: "USD" }).format(35.99),
    );
    expect(result.container.innerHTML).not.toContain(localized.draftMarker);
    expect(result.container.innerHTML).not.toContain(localized.staleMarker);

    const captured: string[] = [];
    function captureClick() {
      const link = result.getByRole("link", { name: "Shop on Fourthwall" });
      if (!(link instanceof HTMLAnchorElement)) throw new Error("Checkout must remain a link");
      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          captured.push(link.href);
        },
        { once: true },
      );
      expect(fireEvent.click(link)).toBe(false);
    }
    // DOM event capture only: no request, browser interception, payment or order.
    captureClick();
    await act(async () =>
      fireEvent.change(result.getByRole("combobox", { name: "Language" }), {
        target: { value: "en" },
      }),
    );
    captureClick();
    expect(captured).toEqual([handoff.checkoutUrl, handoff.checkoutUrl]);
    expect(result.router.state.location.pathname).toBe(handoff.live.path);
    expect(getStorePurchaseAction(input.catalog, handoff.live.id)).toMatchObject({
      kind: "external",
      href: handoff.checkoutUrl,
    });
    const product = input.catalog.entries.find((entry) => entry.id === handoff.live.id);
    expect(product?.kind === "product" && product.purchase).toMatchObject({
      state: "live",
      provider: "fourthwall",
      routeId: "test-handoff-37a-route",
      variants: [
        { id: "test-handoff-37a-variant", providerVariantId: "test-handoff-37a-provider-variant" },
      ],
      displayPrice: localized.price,
    });
    expect(JSON.stringify(input.catalog)).toBe(original);
  });

  it("uses Unicode-equivalent selected text, excludes unpublished search text and keeps filters", async () => {
    const result = setup("/store/catalog?lang=fr&view=product");
    const results = within(result.getByRole("region", { name: "Find your frequency." }));
    await act(async () =>
      fireEvent.change(result.getByRole("searchbox"), {
        target: { value: "E\u0301CLAT CAFE\u0301" },
      }),
    );
    expect(results.getAllByRole("article")).toHaveLength(1);
    expect(results.getByRole("heading", { name: localized.liveTitle })).toHaveAttribute(
      "lang",
      "fr",
    );
    for (const query of [localized.draftMarker, localized.staleMarker]) {
      await act(async () =>
        fireEvent.change(result.getByRole("searchbox"), { target: { value: query } }),
      );
      expect(results.queryByRole("article")).not.toBeInTheDocument();
      const params = new URLSearchParams(result.router.state.location.search);
      expect(params.get("lang")).toBe("fr");
      expect(params.get("view")).toBe("product");
      expect(params.get("q")).toBe(query);
    }
  });

  it("keeps preview and stale unavailable copy in source language with no purchase link", async () => {
    const result = setup(`${handoff.preview.path}?lang=fr`);
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(handoff.preview.title);
    expect(result.getByRole("heading", { level: 1 })).toHaveAttribute("lang", "en");
    expect(result.container.querySelector(".store-detail__description")).toHaveAttribute(
      "lang",
      "en",
    );
    expect(result.container.querySelector('a[rel="external"]')).toBeNull();
    await act(() => result.router.navigate(`${handoff.unavailable.path}?lang=qps-Ploc`));
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(handoff.unavailable.title);
    expect(result.getByText("Fictional test item is unavailable.")).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("lang", "qps-Ploc");
    expect(result.container.querySelector('a[rel="external"]')).toBeNull();
    expect(result.container.innerHTML).not.toContain(localized.staleMarker);
  });
});
