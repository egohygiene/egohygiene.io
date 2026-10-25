import type { I18nMessages } from "@egohygiene/i18n";
import { I18nProvider } from "@egohygiene/i18n";
import type { StoreCatalog, StoreDesign, StorefrontCuration } from "@egohygiene/schemas";
import { fireEvent, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import { storeCatalog, storefrontCuration } from "../../content/store";
import { resources } from "../../i18n/resources";
import { createLocaleFixture } from "../../test/locale-fixtures";
import { IncomprisPage, StorefrontPage } from "./StorefrontPages";

const emptyCuration: StorefrontCuration = {
  schemaVersion: 1,
  egoHygieneEntryIds: [],
  incomprisEntryIds: [],
  featuredIncomprisEntryIds: [],
  artists: [],
};

function design(id: string, title: string): StoreDesign {
  return {
    schemaVersion: 3,
    sourceLocale: "en", translations: [], attribution: { status: "unknown" },
    kind: "design",
    id,
    slug: id,
    title,
    description: "A fictional artwork used only in this test.",
    visibility: "public",
    contextIds: [],
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "Test artwork" },
  };
}

const fixtureCatalog: StoreCatalog = {
  schemaVersion: 3,
  entries: [design("design-one", "First artwork"), design("design-two", "Second artwork")],
  checkoutRoutes: [],
};

function renderPage(element: ReactElement, messages: I18nMessages = resources) {
  return renderWithRouter(
    <I18nProvider locale="en" messages={messages}>
      {element}
    </I18nProvider>,
  );
}

describe("curated storefront pages", () => {
  it("leads with Ego Hygiene and only features the selected public artwork", () => {
    const { getByRole, getByText, getAllByRole, queryByRole } = renderPage(<StorefrontPage />);
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("The Ego Hygiene store.");
    expect(getByText(resources.storefront.egoHygiene.emptyDescription)).toBeInTheDocument();
    expect(getAllByRole("article")).toHaveLength(1);
    expect(getByRole("heading", { name: "heartburst" })).toBeInTheDocument();
    expect(getByRole("link", { name: /heartburst/ })).toHaveAttribute(
      "href",
      "/store/designs/heartburst",
    );
    expect(getByRole("link", { name: "Explore Incompris" })).toHaveAttribute(
      "href",
      "/store/incompris",
    );
    expect(getByRole("link", { name: "Catalog preview" })).toHaveAttribute(
      "href",
      "/store/catalog",
    );
    expect(getByText(resources.storefront.artworkNote)).toBeInTheDocument();
    expect(queryByRole("button", { name: /buy|checkout|add to cart/i })).not.toBeInTheDocument();
    expect(queryByRole("link", { name: /\.play\(\)/i })).not.toBeInTheDocument();
  });

  it("uses the same canonical artwork destination on both curated pages", () => {
    const { getByRole } = renderPage(
      <Routes>
        <Route path="/" element={<StorefrontPage />} />
        <Route path="/store/incompris" element={<IncomprisPage />} />
      </Routes>,
    );
    const designHref = getByRole("link", { name: /heartburst/ }).getAttribute("href");
    fireEvent.click(getByRole("link", { name: "Explore Incompris" }));
    expect(getByRole("heading", { level: 1, name: "Incompris" })).toBeInTheDocument();
    expect(getByRole("link", { name: /heartburst/ })).toHaveAttribute("href", designHref);
    expect(getByRole("link", { name: "Ego Hygiene store" })).toHaveAttribute("href", "/store");
    expect(getByRole("link", { name: "Back to the Ego Hygiene store" })).toHaveAttribute(
      "href",
      "/store",
    );
    expect(getByRole("link", { name: /\.play\(\).*Explore artist collection/ })).toHaveAttribute(
      "href",
      "/store/incompris/artists/play",
    );
  });

  it("keeps explicit empty collection states and a working collection link", () => {
    const { getByText, getByRole, queryByRole } = renderPage(
      <StorefrontPage curation={emptyCuration} />,
    );
    expect(getByText(resources.storefront.egoHygiene.emptyDescription)).toBeInTheDocument();
    expect(getByText(resources.storefront.featured.emptyDescription)).toBeInTheDocument();
    expect(getByRole("link", { name: "Explore Incompris" })).toHaveAttribute(
      "href",
      "/store/incompris",
    );
    expect(queryByRole("article")).not.toBeInTheDocument();
    expect(queryByRole("region", { name: "Artist collections" })).not.toBeInTheDocument();
  });

  it("shows an empty Incompris page without borrowing unselected catalog examples", () => {
    const { getByText, getByRole, queryByRole } = renderPage(
      <IncomprisPage curation={emptyCuration} />,
    );
    expect(storeCatalog.entries.length).toBeGreaterThan(0);
    expect(getByText(resources.storefront.incompris.emptyDescription)).toBeInTheDocument();
    expect(getByRole("link", { name: "Back to the Ego Hygiene store" })).toHaveAttribute(
      "href",
      "/store",
    );
    expect(queryByRole("article")).not.toBeInTheDocument();
  });

  it("renders curated order and a focusable manual row when multiple entries are selected", () => {
    const curation: StorefrontCuration = {
      ...emptyCuration,
      egoHygieneEntryIds: ["design-one"],
      incomprisEntryIds: ["design-one", "design-two"],
      featuredIncomprisEntryIds: ["design-two", "design-one"],
    };
    const { queryByText, getByRole } = renderPage(
      <StorefrontPage catalog={fixtureCatalog} curation={curation} />,
    );
    const row = getByRole("region", { name: "Selected Incompris pieces" });
    expect(row).toHaveAttribute("tabindex", "0");
    expect(row).toHaveAccessibleDescription(resources.storefront.featured.scrollHint);
    expect(
      within(row)
        .getAllByRole("heading")
        .map((heading) => heading.textContent),
    ).toEqual(["Second artwork", "First artwork"]);
    expect(queryByText(resources.storefront.egoHygiene.emptyDescription)).not.toBeInTheDocument();
    expect(
      within(getByRole("region", { name: "Ego Hygiene merchandise" })).getAllByRole("article"),
    ).toHaveLength(1);
  });

  it("keeps feature selection separate from the full Incompris collection", () => {
    const curation: StorefrontCuration = {
      ...emptyCuration,
      incomprisEntryIds: ["design-two", "design-one"],
      featuredIncomprisEntryIds: ["design-one"],
    };
    const { getByRole } = renderPage(
      <IncomprisPage catalog={fixtureCatalog} curation={curation} />,
    );
    const collection = getByRole("region", { name: "Explore the collection" });
    expect(
      within(collection)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Second artwork", "First artwork"]);
  });

  it("uses supplied messages for page copy, metadata, shared cards, and navigation", () => {
    const messages = createLocaleFixture(resources, "rtl").messages;
    const { getByRole, getByText, unmount } = renderPage(<StorefrontPage />, messages);
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      `نص تجريبي · ${resources.storefront.home.heading}`,
    );
    expect(
      getByRole("link", { name: `نص تجريبي · ${resources.storefront.featured.link}` }),
    ).toHaveAttribute("href", "/store/incompris");
    expect(getByText(`نص تجريبي · ${resources.storefront.artworkNote}`)).toBeInTheDocument();
    expect(document.title).toContain(`نص تجريبي · ${resources.storefront.home.title}`);
    expect(getByRole("link", { name: /heartburst/ }).textContent).toContain("نص تجريبي");
    unmount();
  });

  it("keeps the real design reachable when its artwork image fails", () => {
    const { getByRole, getByText } = renderPage(<IncomprisPage />);
    const realDesign = storeCatalog.entries.find(
      (entry) => entry.id === storefrontCuration.incomprisEntryIds[0],
    );
    expect(realDesign?.kind).toBe("design");
    fireEvent.error(getByRole("img", { name: /fuchsia heart/i }));
    expect(getByText(resources.storeCards.artwork.unavailable)).toBeInTheDocument();
    expect(getByRole("link", { name: /heartburst/ })).toHaveAttribute(
      "href",
      "/store/designs/heartburst",
    );
  });
});
