import { I18nProvider } from "@egohygiene/i18n";
import type { StoreCatalog, StorefrontCuration, StoreProduct } from "@egohygiene/schemas";
import {
  emptyStorefrontCuration,
  parseStoreCatalog,
  parseStorefrontCuration,
} from "@egohygiene/schemas";
import { fireEvent, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "#test-utils";
import { resources } from "../../i18n/resources";
import { StoreArtistPage } from "./StoreArtistPage";
import { StoreCollectionPage, StoreProductPage } from "./StorePages";

const fixture = vi.hoisted(() => ({
  catalog: { schemaVersion: 1, entries: [], checkoutRoutes: [] } as StoreCatalog,
  curation: {
    schemaVersion: 1,
    egoHygieneEntryIds: [],
    incomprisEntryIds: [],
    featuredIncomprisEntryIds: [],
    artists: [],
  } as StorefrontCuration,
}));

vi.mock("../../content/store", () => ({
  get storeCatalog() {
    return fixture.catalog;
  },
  get storefrontCuration() {
    return fixture.curation;
  },
}));

const base = (id: string, title: string) => ({
  schemaVersion: 1,
  id,
  slug: id,
  title,
  description: "Fictional content used only by this unit test.",
  visibility: "public",
});

// This URL is only compared in JSDOM. No provider request or checkout is performed.
const fixtureCheckout = "https://qualification-fixture.fourthwall.com/products/test-object";
const livePurchase: StoreProduct["purchase"] = {
  state: "live",
  provider: "fourthwall",
  routeId: "route-test",
  variants: [{ id: "variant-test", label: "Test size", providerVariantId: "test-size" }],
  displayPrice: { amountMinor: 2500, currency: "USD", authority: "provider-checkout" },
};

function loadFixture(purchase: StoreProduct["purchase"] = { state: "preview" }) {
  const entries = [
    ...["first", "second"].map((name) => ({
      ...base(`artist-${name}`, `${name} artist`),
      kind: "context",
      contextType: "artist",
    })),
    { ...base("song-test", "Test song"), kind: "context", contextType: "song" },
    {
      ...base("design-test", "Test artwork"),
      kind: "design",
      artworkRevision: 1,
      artwork:
        purchase.state === "live"
          ? { kind: "image", src: "/store/test-artwork.webp", alt: "Unit test artwork" }
          : { kind: "placeholder", label: "Unit test placeholder" },
    },
    {
      ...base("product-test", "Test object"),
      kind: "product",
      designIds: ["design-test"],
      purchase,
    },
    {
      ...base("collection-test", "Test song collection"),
      kind: "collection",
      designIds: ["design-test"],
      productIds: ["product-test"],
      contextIds: ["song-test"],
    },
  ];
  fixture.catalog = parseStoreCatalog(
    entries.map((value) => ({ source: value.id, value })),
    purchase.state === "live"
      ? [
          {
            id: "route-test",
            provider: "fourthwall",
            productId: "product-test",
            checkoutUrl: fixtureCheckout,
            providerVariantIds: ["test-size"],
            artworkRevisions: [{ designId: "design-test", revision: 1 }],
          },
        ]
      : [],
  );
  fixture.curation = parseStorefrontCuration(
    {
      ...emptyStorefrontCuration(),
      artists: ["artist-first", "artist-second"].map((artistId) => ({
        artistId,
        standaloneEntryIds: ["product-test"],
        songCollectionIds: ["collection-test"],
      })),
    },
    fixture.catalog,
  );
}

function renderDetail(route: string) {
  return renderWithRouter(
    <I18nProvider locale="en" messages={resources}>
      <Routes>
        <Route path="/store/products/:slug" element={<StoreProductPage />} />
        <Route path="/store/collections/:slug" element={<StoreCollectionPage />} />
        <Route path="/store/incompris/artists/:artistSlug" element={<StoreArtistPage />} />
      </Routes>
    </I18nProvider>,
    route,
  );
}

beforeEach(() => loadFixture());

describe("canonical detail journey", () => {
  it("keeps an empty song collection useful without borrowing unrelated products", () => {
    const entries = fixture.catalog.entries.map((entry) =>
      entry.kind === "collection" ? { ...entry, designIds: [], productIds: [] } : entry,
    );
    fixture.catalog = parseStoreCatalog(entries.map((value) => ({ source: value.id, value })));
    const { getByRole, getByText, queryByRole } = renderDetail(
      "/store/collections/collection-test",
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Test song collection");
    expect(
      getByText(
        "This world is still taking shape. Its first designs and objects will appear here.",
      ),
    ).toBeInTheDocument();
    expect(queryByRole("article")).not.toBeInTheDocument();
    expect(getByRole("link", { name: "Collections", exact: true })).toHaveAttribute(
      "href",
      "/store/catalog?view=collection#catalog",
    );
    expect(getByRole("link", { name: "Store", exact: true })).toHaveAttribute("href", "/store");
  });

  it("returns a shared song collection to both curated artists while retaining one product", () => {
    const { getByRole } = renderDetail("/store/collections/collection-test");
    const returns = getByRole("navigation", { name: "Artist collections" });
    expect(within(returns).getAllByRole("link")).toHaveLength(2);
    for (const name of ["first", "second"]) {
      expect(
        within(returns).getByRole("link", { name: `${name} artist · Shop by song` }),
      ).toHaveAttribute("href", `/store/incompris/artists/artist-${name}?view=songs`);
    }
    const products = getByRole("region", { name: "The pieces of this world." });
    expect(within(products).getAllByRole("link", { name: /Test object/ })).toHaveLength(1);
    expect(within(products).getByRole("link", { name: /Test object/ })).toHaveAttribute(
      "href",
      "/store/products/product-test",
    );
    fireEvent.click(within(returns).getByRole("link", { name: "second artist · Shop by song" }));
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("second artist");
    expect(getByRole("link", { name: "Shop by song", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("link", { name: /Test song collection/ })).toHaveAttribute(
      "href",
      "/store/collections/collection-test",
    );
  });
});

describe("purchase presentation", () => {
  it.each([
    [{ state: "preview" }, "Preview — not for sale yet"],
    [{ state: "unavailable", reason: "This sample is paused." }, "Not available to purchase"],
  ] as const)("keeps %j non-purchasable on the canonical page", (purchase, status) => {
    loadFixture(purchase);
    const { getByText, container } = renderDetail("/store/products/product-test");
    expect(getByText(status, { exact: true })).toBeInTheDocument();
    if (purchase.state === "unavailable") expect(getByText(purchase.reason)).toBeInTheDocument();
    expect(container.querySelector('a[rel="external"]')).toBeNull();
    expect(container.querySelector(".store-price")).toBeNull();
  });

  it("renders a reviewed synthetic live action with the provider price authority", () => {
    loadFixture(livePurchase);
    const { getByRole, getByText } = renderDetail("/store/products/product-test");
    expect(getByRole("link", { name: "Shop on Fourthwall" })).toHaveAttribute(
      "href",
      fixtureCheckout,
    );
    expect(getByText("$25.00", { exact: false })).toHaveTextContent("before shipping and tax");
    expect(
      getByText(
        "Choose your options and confirm the current price, shipping, and returns at the provider’s checkout.",
      ),
    ).toBeInTheDocument();
  });

  it("refuses to render a live action if its reviewed route is missing", () => {
    loadFixture(livePurchase);
    fixture.catalog.checkoutRoutes = [];
    expect(() => renderDetail("/store/products/product-test")).toThrow(
      "Live products require a reviewed route for this product",
    );
  });
});
