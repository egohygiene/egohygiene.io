import { createLocaleRegistry } from "@egohygiene/i18n";
import type { StoreCatalog, StoreProduct, StoreTranslatedText } from "@egohygiene/schemas";
import { emptyStorefrontCuration, parseStoreCatalog } from "@egohygiene/schemas";
import { act, fireEvent, render, within } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "../../app/providers";
import { LanguageSelector } from "../../i18n/LanguageSelector";
import { resources } from "../../i18n/resources";
import {
  StoreCatalogPage,
  StoreCollectionPage,
  StoreDesignPage,
  StoreProductPage,
} from "./StorePages";

const fixture = vi.hoisted(() => ({
  catalog: { schemaVersion: 2, entries: [], checkoutRoutes: [] } as StoreCatalog,
}));
vi.mock("../../content/store", () => ({
  get storeCatalog() {
    return fixture.catalog;
  },
  get storefrontCuration() {
    return emptyStorefrontCuration();
  },
}));

// Synthetic reviewed text and route only. No real language or purchase is approved.
const checkoutUrl = "https://locale-fixture.fourthwall.com/products/original-product";
const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en-US", direction: "ltr", label: "English fixture" },
    { id: "fr", formatLocale: "fr-FR", direction: "ltr", label: "French fixture" },
    {
      id: "fr-CA",
      formatLocale: "de-DE",
      direction: "ltr",
      label: "Mixed formatting fixture",
      fallbacks: ["fr"],
    },
  ],
});
const reviewed = (
  source: string,
  value: string,
  locale = "fr",
  artworkRevision?: number,
): StoreTranslatedText => ({
  value,
  review: {
    status: "reviewed",
    locale,
    reviewedBy: "synthetic-reviewer",
    reviewedAt: "2026-10-20",
    source: {
      locale: "en",
      value: source,
      ...(artworkRevision === undefined ? {} : { artworkRevision }),
    },
    value,
  },
});
const base = (id: string, title: string) => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title,
  description: `Source description for ${id}.`,
  visibility: "public",
});
const livePurchase: StoreProduct["purchase"] = {
  state: "live",
  provider: "fourthwall",
  routeId: "route-localized",
  variants: [
    { id: "variant-original", label: "Original size", providerVariantId: "provider-original" },
  ],
  displayPrice: { amountMinor: 123456, currency: "USD", authority: "provider-checkout" },
};
function loadFixture(purchase: StoreProduct["purchase"] = livePurchase) {
  const entries = [
    {
      ...base("song-original", "Original song"),
      kind: "context",
      contextType: "song",
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("Original song", "Chanson fictive"),
            description: reviewed("Source description for song-original.", "Contexte fictif."),
          },
        },
      ],
    },
    {
      ...base("design-first", "Original artwork"),
      kind: "design",
      artworkRevision: 1,
      artwork: { kind: "image", src: "/store/first.webp", alt: "Original image description" },
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("Original artwork", "Illustration fictive"),
            artworkAlt: reviewed(
              "Original image description",
              "Description fictive de l’image",
              "fr",
              1,
            ),
          },
        },
      ],
    },
    {
      ...base("design-second", "Second original artwork"),
      kind: "design",
      artworkRevision: 2,
      artwork: {
        kind: "image",
        src: "/store/second.webp",
        alt: "Second original image description",
      },
      translations: [
        {
          locale: "fr",
          fields: {
            title: { value: "SECRET_DRAFT_TITLE", review: { status: "draft" } },
            artworkAlt: reviewed("Second original image description", "SECRET_STALE_ALT", "fr", 1),
          },
        },
      ],
    },
    {
      ...base("product-original", "Original product"),
      kind: "product",
      designIds: ["design-first", "design-second"],
      contextIds: ["song-original"],
      purchase,
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("Original product", "Objet éprouvé"),
            ...(purchase.state === "unavailable"
              ? {
                  unavailableReason: reviewed(
                    purchase.reason,
                    "Objet temporairement indisponible.",
                  ),
                }
              : {}),
          },
        },
        {
          locale: "fr-CA",
          fields: {
            description: reviewed(
              "Source description for product-original.",
              "Description canadienne fictive.",
              "fr-CA",
            ),
          },
        },
      ],
    },
    {
      ...base("collection-original", "Original collection"),
      kind: "collection",
      designIds: ["design-first", "design-second"],
      productIds: ["product-original"],
      contextIds: ["song-original"],
      translations: [
        {
          locale: "fr",
          fields: {
            title: reviewed("Original collection", "Collection fictive"),
            description: { value: "SECRET_DRAFT_DESCRIPTION", review: { status: "draft" } },
          },
        },
      ],
    },
  ];
  fixture.catalog = parseStoreCatalog(
    entries.map((value) => ({ source: value.id, value })),
    purchase.state === "live"
      ? [
          {
            id: "route-localized",
            provider: "fourthwall",
            productId: "product-original",
            checkoutUrl,
            providerVariantIds: ["provider-original"],
            artworkRevisions: [
              { designId: "design-first", revision: 1 },
              { designId: "design-second", revision: 2 },
            ],
          },
        ]
      : [],
  );
}
function setup(route = "/store/products/product-original?lang=fr-CA") {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <LanguageSelector />
            <Outlet />
          </>
        ),
        children: [
          { path: "/store/catalog", element: <StoreCatalogPage /> },
          { path: "/store/products/:slug", element: <StoreProductPage /> },
          { path: "/store/designs/:slug", element: <StoreDesignPage /> },
          { path: "/store/collections/:slug", element: <StoreCollectionPage /> },
        ],
      },
    ],
    { initialEntries: [route] },
  );
  const result = render(
    <AppProviders router={router} registry={registry} catalogs={{ en: resources }}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router };
}

beforeEach(() => loadFixture());
afterEach(() => window.localStorage.clear());

describe("catalog presentation through the website locale service", () => {
  it("resolves fields independently of formatting and keeps canonical checkout and links intact", async () => {
    const original = JSON.stringify(fixture.catalog);
    const { getByRole, getByText, container } = setup();
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Objet éprouvé");
    expect(getByRole("heading", { level: 1 })).toHaveAttribute("lang", "fr");
    expect(getByText("Description canadienne fictive.")).toHaveAttribute("lang", "fr-CA");
    expect(getByRole("heading", { name: "Chanson fictive" })).toHaveAttribute("lang", "fr");
    expect(getByText("Contexte fictif.")).toHaveAttribute("lang", "fr");
    expect(container.querySelector(".store-price")?.textContent).toContain(
      new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(1234.56),
    );
    expect(getByRole("link", { name: "Shop on Fourthwall" })).toHaveAttribute("href", checkoutUrl);
    expect(
      container.querySelector(
        '.store-detail-facts a[href="/store/designs/design-first?lang=fr-CA"]',
      ),
    ).toHaveTextContent("Illustration fictive");
    expect(document.title).toContain("Objet éprouvé");
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Description canadienne fictive.",
    );
    expect(JSON.stringify(fixture.catalog)).toBe(original);

    await act(async () =>
      fireEvent.change(getByRole("combobox", { name: "Language" }), { target: { value: "en" } }),
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Original product");
    expect(getByRole("heading", { level: 1 })).toHaveAttribute("lang", "en");
    expect(getByRole("link", { name: "Shop on Fourthwall" })).toHaveAttribute("href", checkoutUrl);
    expect(JSON.stringify(fixture.catalog)).toBe(original);
  });

  it("localizes gallery captions and alt text while preserving declared artwork order and stale fallback", () => {
    const { getByRole, getAllByAltText, container } = setup();
    expect(getAllByAltText("Description fictive de l’image")[0]).toHaveAttribute(
      "src",
      "/store/first.webp",
    );
    expect(getAllByAltText("Description fictive de l’image")[0]).toHaveAttribute("lang", "fr");
    const choices = within(getByRole("group", { name: "Choose artwork" })).getAllByRole("button");
    expect(choices.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Select artwork: Illustration fictive",
      "Select artwork: Second original artwork",
    ]);
    fireEvent.click(choices[1]!);
    const caption = container.querySelector(".store-artwork-gallery__caption span");
    expect(caption).toHaveTextContent("Second original artwork");
    expect(caption).toHaveAttribute("lang", "en");
    expect(container.querySelector(".store-artwork-gallery__open img")).toHaveAttribute(
      "alt",
      "Second original image description",
    );
    expect(container.innerHTML).not.toMatch(/SECRET_DRAFT|SECRET_STALE/);
  });

  it("searches reviewed selected content with Unicode equivalence and stable links", async () => {
    const { getByRole, container, router } = setup(
      "/store/catalog?lang=fr-CA&q=Objet%20e%CC%81prouve%CC%81&view=product",
    );
    const results = within(getByRole("region", { name: "Find your frequency." }));
    expect(results.getByRole("heading", { name: "Objet éprouvé" })).toHaveAttribute("lang", "fr");
    expect(results.getByRole("link", { name: /Objet éprouvé/ })).toHaveAttribute(
      "href",
      "/store/products/product-original?lang=fr-CA",
    );
    await act(async () =>
      fireEvent.change(getByRole("searchbox"), { target: { value: "SECRET_DRAFT" } }),
    );
    expect(results.queryByRole("article")).not.toBeInTheDocument();
    expect(router.state.location.search).toContain("lang=fr-CA");
    expect(router.state.location.search).toContain("view=product");
    expect(container.innerHTML).not.toContain("SECRET_DRAFT_TITLE");
  });

  it("renders translated unavailable reasons without activating purchase", () => {
    loadFixture({ state: "unavailable", reason: "Original unavailable reason." });
    const { getByText, container } = setup();
    expect(getByText("Objet temporairement indisponible.")).toHaveAttribute("lang", "fr");
    expect(container.querySelector('a[rel="external"]')).toBeNull();
  });

  it("keeps an untranslated creative title and collection description usable on canonical detail pages", () => {
    const { getByRole, getByText, container } = setup(
      "/store/collections/collection-original?lang=fr-CA",
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Collection fictive");
    expect(getByText("Source description for collection-original.")).toHaveAttribute("lang", "en");
    expect(container.innerHTML).not.toContain("SECRET_DRAFT_DESCRIPTION");
    expect(getByRole("link", { name: /Objet éprouvé/ })).toHaveAttribute(
      "href",
      "/store/products/product-original?lang=fr-CA",
    );
  });
});
