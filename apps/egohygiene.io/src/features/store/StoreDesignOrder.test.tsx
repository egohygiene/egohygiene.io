import { I18nProvider } from "@egohygiene/i18n";
import type { StoreCatalog } from "@egohygiene/schemas";
import { emptyStorefrontCuration, parseStoreCatalog } from "@egohygiene/schemas";
import { fireEvent, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "#test-utils";
import { resources } from "../../i18n/resources";
import { StoreCard, StoreCollectionPage, StoreProductPage } from "./StorePages";

const fixture = vi.hoisted(() => ({
  catalog: { schemaVersion: 1, entries: [], checkoutRoutes: [] } as StoreCatalog,
}));

vi.mock("../../content/store", () => ({
  get storeCatalog() {
    return fixture.catalog;
  },
  get storefrontCuration() {
    return emptyStorefrontCuration();
  },
}));

const base = (id: string, title: string) => ({
  schemaVersion: 1,
  id,
  slug: id,
  title,
  description: "Fictional artwork-order fixture; no physical product or sale is approved.",
  visibility: "public",
});

function loadFixture(reverse: boolean) {
  const entries = [
    ...["Alpha", "Beta", "Gamma", "Delta"].map((name) => ({
      ...base(`design-${name.toLowerCase()}`, `${name} artwork`),
      kind: "design",
      artworkRevision: 1,
      // JSDOM compares these test-only URLs without requesting artwork files.
      artwork: {
        kind: "image",
        src: `/store/test/${name.toLowerCase()}.webp`,
        alt: `Fictional ${name} artwork`,
      },
    })),
    {
      ...base("product-alpha", "Alpha object"),
      kind: "product",
      designIds: ["design-beta", "design-delta", "design-alpha"],
      purchase: { state: "preview" },
    },
    {
      ...base("product-beta", "Beta object"),
      kind: "product",
      designIds: ["design-gamma", "design-alpha", "design-beta"],
      purchase: { state: "preview" },
    },
    {
      ...base("collection-explicit", "Explicit artwork collection"),
      kind: "collection",
      designIds: ["design-delta", "design-beta"],
      productIds: ["product-beta", "product-alpha"],
    },
    {
      ...base("collection-fallback", "Product artwork collection"),
      kind: "collection",
      productIds: ["product-beta", "product-alpha"],
    },
  ];
  fixture.catalog = parseStoreCatalog(
    (reverse ? entries.toReversed() : entries).map((value) => ({ source: value.id, value })),
  );
}

const cases = [
  { entryId: "product-beta", artwork: ["Gamma", "Alpha", "Beta"] },
  { entryId: "collection-explicit", artwork: ["Delta", "Beta", "Gamma", "Alpha"] },
  { entryId: "collection-fallback", artwork: ["Gamma", "Alpha", "Beta", "Delta"] },
].flatMap((testCase) =>
  [false, true].map((reverse) => ({
    ...testCase,
    reverse,
    sourceOrder: reverse ? "reversed" : "original",
  })),
);

describe("declared artwork order across cards and canonical pages", () => {
  it.each(cases)(
    "keeps $entryId cover and gallery order with $sourceOrder catalog input",
    ({ entryId, artwork, reverse }) => {
      loadFixture(reverse);
      const entry = fixture.catalog.entries.find((candidate) => candidate.id === entryId);
      if (!entry || (entry.kind !== "product" && entry.kind !== "collection")) {
        throw new Error(`Missing browsable fixture: ${entryId}`);
      }
      const { getByRole, getByText, container } = renderWithRouter(
        <I18nProvider locale="en" messages={resources}>
          <Routes>
            <Route path="/" element={<StoreCard entry={entry} />} />
            <Route path="/store/products/:slug" element={<StoreProductPage />} />
            <Route path="/store/collections/:slug" element={<StoreCollectionPage />} />
          </Routes>
        </I18nProvider>,
      );

      const cover = getByRole("img", { name: `Fictional ${artwork[0]} artwork` });
      const coverSource = cover.getAttribute("src");
      expect(coverSource).toBe(`/store/test/${artwork[0]?.toLowerCase()}.webp`);
      const cardLink = within(getByRole("article")).getByRole("link");
      expect(cardLink).toHaveAttribute(
        "href",
        `/store/${entry.kind === "product" ? "products" : "collections"}/${entry.slug}`,
      );
      fireEvent.click(cardLink);

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(entry.title);
      const opener = getByRole("button", { name: `View artwork: ${entry.title}` });
      expect(within(opener).getByRole("img")).toHaveAttribute("src", coverSource);
      expect(getByText(`1 / ${artwork.length}`, { exact: true })).toBeInTheDocument();

      const thumbnails = within(getByRole("group", { name: "Choose artwork" })).getAllByRole(
        "button",
      );
      expect(thumbnails.map((button) => button.getAttribute("aria-label"))).toEqual(
        artwork.map((name) => `Select artwork: ${name} artwork`),
      );
      for (const [index, button] of thumbnails.entries()) {
        fireEvent.click(button);
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(within(opener).getByRole("img")).toHaveAttribute(
          "src",
          `/store/test/${artwork[index]?.toLowerCase()}.webp`,
        );
        expect(getByText(`${index + 1} / ${artwork.length}`, { exact: true })).toBeInTheDocument();
      }

      const related = getByRole("region", {
        name: entry.kind === "product" ? "Behind the object." : "The pieces of this world.",
      });
      const designLinks = within(related)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"))
        .filter((href) => href?.startsWith("/store/designs/"));
      expect(designLinks).toEqual(
        artwork.map((name) => `/store/designs/design-${name.toLowerCase()}`),
      );
      expect(container.querySelector('a[rel="external"]')).toBeNull();
    },
  );
});
