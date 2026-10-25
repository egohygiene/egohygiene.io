import type { I18nMessages } from "@egohygiene/i18n";
import { createLocaleRegistry, I18nProvider } from "@egohygiene/i18n";
import type { StoreCatalog, StorefrontCuration } from "@egohygiene/schemas";
import { fireEvent, render, within } from "@testing-library/react";
import {
  createMemoryRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import { AppProviders } from "../../app/providers";
import { LanguageSelector } from "../../i18n/LanguageSelector";
import { resources } from "../../i18n/resources";
import { createLocaleFixture } from "../../test/locale-fixtures";
import { StoreArtistPage } from "./StoreArtistPage";
import { IncomprisPage } from "./StorefrontPages";

const fixtureCatalog: StoreCatalog = {
  schemaVersion: 3,
  checkoutRoutes: [],
  entries: [
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "context",
      contextType: "artist",
      id: "artist-test",
      slug: "test-artist",
      title: "Test artist",
      description: "A fictional artist used only in this test.",
      visibility: "public",
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "context",
      contextType: "song",
      id: "song-test",
      slug: "test-song",
      title: "Test song",
      description: "A fictional song used only in this test.",
      visibility: "public",
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "design",
      id: "design-test",
      slug: "test-artwork",
      title: "Test artwork",
      description: "A fictional artwork used only in this test.",
      visibility: "public",
      contextIds: [],
      artworkRevision: 1,
      artwork: { kind: "placeholder", label: "Test artwork" },
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "product",
      id: "product-shirt",
      slug: "test-shirt",
      title: "Test shirt",
      description: "A fictional shirt used only in this test.",
      visibility: "public",
      designIds: ["design-test"],
      contextIds: ["artist-test"],
      purchase: { state: "preview" },
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "product",
      id: "product-hoodie",
      slug: "test-hoodie",
      title: "Test hoodie",
      description: "A fictional hoodie used only in this test.",
      visibility: "public",
      designIds: ["design-test"],
      contextIds: ["artist-test"],
      purchase: { state: "preview" },
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "collection",
      id: "collection-first",
      slug: "first-song-collection",
      title: "First song collection",
      description: "A fictional collection used only in this test.",
      visibility: "public",
      designIds: ["design-test"],
      productIds: ["product-shirt"],
      contextIds: ["artist-test", "song-test"],
    },
    {
      schemaVersion: 3,
      sourceLocale: "en",
      translations: [],
      attribution: { status: "unknown" },
      kind: "collection",
      id: "collection-second",
      slug: "second-song-collection",
      title: "Second song collection",
      description: "Another fictional collection used only in this test.",
      visibility: "public",
      designIds: ["design-test"],
      productIds: ["product-shirt"],
      contextIds: ["artist-test", "song-test"],
    },
  ],
};

const fixtureCuration: StorefrontCuration = {
  schemaVersion: 1,
  egoHygieneEntryIds: [],
  featuredIncomprisEntryIds: [],
  incomprisEntryIds: [],
  artists: [
    {
      artistId: "artist-test",
      standaloneEntryIds: ["product-hoodie", "product-shirt"],
      songCollectionIds: ["collection-second", "collection-first"],
    },
  ],
};

function LocationControls() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div data-testid="location">{location.pathname + location.search}</div>
      <button type="button" onClick={() => navigate(-1)}>
        Test history back
      </button>
    </>
  );
}

function renderArtist({
  route = "/store/incompris/artists/test-artist",
  catalog = fixtureCatalog,
  curation = fixtureCuration,
  messages = resources,
}: {
  route?: string;
  catalog?: StoreCatalog;
  curation?: StorefrontCuration;
  messages?: I18nMessages;
} = {}) {
  const page = <StoreArtistPage catalog={catalog} curation={curation} />;
  return renderWithRouter(
    <I18nProvider locale="en" messages={messages}>
      <Routes>
        <Route
          path="/store/incompris"
          element={<IncomprisPage catalog={catalog} curation={curation} />}
        />
        <Route path="/store/incompris/artists/:artistSlug" element={page} />
        <Route path="/store/preview/artists/:artistSlug" element={page} />
      </Routes>
      <LocationControls />
    </I18nProvider>,
    route,
  );
}

// Engineering translations only; no public language or attribution is approved.
function translatedArtistCatalog(): StoreCatalog {
  const catalog = structuredClone(fixtureCatalog);
  for (const [id, title] of [
    ["artist-test", "Artiste de démonstration"],
    ["product-hoodie", "Vêtement de démonstration"],
  ]) {
    const entry = catalog.entries.find((candidate) => candidate.id === id);
    if (!entry || !title) throw new Error("Missing localization fixture entry");
    entry.translations = [
      {
        locale: "fr",
        fields: {
          title: {
            value: title,
            review: {
              status: "reviewed",
              locale: "fr",
              reviewedBy: "synthetic-reviewer",
              reviewedAt: "2026-10-20",
              source: { locale: "en", value: entry.title },
              value: title,
            },
          },
          description: { value: "DRAFT_ARTIST_DESCRIPTION", review: { status: "draft" } },
        },
      },
    ];
  }
  return catalog;
}

function renderLocalizedArtist(
  catalog = translatedArtistCatalog(),
  route = "/store/incompris?lang=fr",
) {
  const registry = createLocaleRegistry({
    sourceLocale: "en",
    locales: [
      { id: "en", formatLocale: "en-US", direction: "ltr", label: "English fixture" },
      // Deliberately different: catalog language follows `id`, not formatting locale.
      { id: "fr", formatLocale: "ja-JP", direction: "ltr", label: "French fixture" },
    ],
  });
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
          {
            path: "/store/incompris",
            element: <IncomprisPage catalog={catalog} curation={fixtureCuration} />,
          },
          {
            path: "/store/incompris/artists/:artistSlug",
            element: <StoreArtistPage catalog={catalog} curation={fixtureCuration} />,
          },
        ],
      },
    ],
    { initialEntries: [route] },
  );
  return {
    router,
    ...render(
      <AppProviders router={router} registry={registry} catalogs={{ en: resources }}>
        <RouterProvider router={router} />
      </AppProviders>,
    ),
  };
}

describe("artist collection", () => {
  it("opens a reusable artist destination from Incompris without assigning its artwork", () => {
    const { getByRole, queryByRole } = renderArtist({ route: "/store/incompris" });
    const artistLink = getByRole("link", { name: /Test artist.*Explore artist collection/ });
    expect(artistLink).toHaveAttribute("href", "/store/incompris/artists/test-artist");
    fireEvent.click(artistLink);
    expect(getByRole("heading", { level: 1, name: "Test artist" })).toBeInTheDocument();
    expect(queryByRole("heading", { name: "Test artwork" })).not.toBeInTheDocument();
    expect(getByRole("link", { name: "Back to Incompris" })).toHaveAttribute(
      "href",
      "/store/incompris",
    );
  });

  it("preserves manual order and canonical destinations for selected standalone objects", () => {
    const { getByRole } = renderArtist();
    const section = getByRole("region", { name: "Standalone designs & worlds" });
    expect(
      within(section)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Test hoodie", "Test shirt"]);
    expect(getByRole("link", { name: /Test shirt/ })).toHaveAttribute(
      "href",
      "/store/products/test-shirt",
    );
    expect(getByRole("link", { name: "Standalone & worlds" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("hydrates song links and search from the URL without duplicating products", () => {
    const { getByRole, queryByRole } = renderArtist({
      route: "/store/incompris/artists/test-artist?view=songs&q=Second",
    });
    expect(getByRole("searchbox", { name: "Search song collections" })).toHaveValue("Second");
    expect(getByRole("link", { name: "Shop by song" })).toHaveAttribute("aria-current", "page");
    expect(getByRole("link", { name: /Second song collection/ })).toHaveAttribute(
      "href",
      "/store/collections/second-song-collection",
    );
    expect(
      queryByRole("link", { name: /First song collection|Test shirt/ }),
    ).not.toBeInTheDocument();
  });

  it("orders song collections explicitly and uses their existing shareable URLs", () => {
    const { getByRole } = renderArtist({
      route: "/store/incompris/artists/test-artist?view=songs",
    });
    const section = getByRole("region", { name: "Shop by song" });
    expect(
      within(section)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Second song collection", "First song collection"]);
    expect(getByRole("link", { name: /First song collection/ })).toHaveAttribute(
      "href",
      "/store/collections/first-song-collection",
    );
  });

  it("keeps search and unrelated parameters while view links support browser back", () => {
    const { getByRole, getByTestId } = renderArtist({
      route: "/store/incompris/artists/test-artist?utm_source=soundcloud&q=Test",
    });
    fireEvent.click(getByRole("link", { name: "Shop by song" }));
    expect(getByTestId("location")).toHaveTextContent(
      "/store/incompris/artists/test-artist?utm_source=soundcloud&q=Test&view=songs",
    );
    fireEvent.click(getByRole("button", { name: "Test history back" }));
    expect(getByRole("link", { name: "Standalone & worlds" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("searchbox")).toHaveValue("Test");
    fireEvent.change(getByRole("searchbox"), { target: { value: "hoodie" } });
    expect(getByTestId("location")).toHaveTextContent("?utm_source=soundcloud&q=hoodie");
    expect(getByRole("status")).toHaveTextContent("Results: 1");
  });

  it("explains empty search and clears only the search parameter", () => {
    const { getByRole, getByTestId, queryByRole } = renderArtist({
      route: "/store/incompris/artists/test-artist?view=songs&utm_source=soundcloud&q=unmatched",
    });
    expect(getByRole("heading", { name: "No matches in this view." })).toBeInTheDocument();
    expect(queryByRole("article")).not.toBeInTheDocument();
    fireEvent.click(getByRole("button", { name: "Clear search" }));
    expect(getByTestId("location")).toHaveTextContent("?view=songs&utm_source=soundcloud");
    expect(getByRole("status")).toHaveTextContent("Results: 2");
    expect(getByRole("searchbox")).toHaveValue("");
  });

  it("keeps empty artist selections honest and distinct in each view", () => {
    const emptyCuration: StorefrontCuration = {
      ...fixtureCuration,
      artists: [{ artistId: "artist-test", standaloneEntryIds: [], songCollectionIds: [] }],
    };
    const { getByRole, queryByRole } = renderArtist({ curation: emptyCuration });
    expect(
      getByRole("heading", { name: "The first designs are still taking shape." }),
    ).toBeInTheDocument();
    expect(queryByRole("article")).not.toBeInTheDocument();
    fireEvent.click(getByRole("link", { name: "Shop by song" }));
    expect(
      getByRole("heading", { name: "The first song collection is on its way." }),
    ).toBeInTheDocument();
    expect(queryByRole("article")).not.toBeInTheDocument();
  });

  it("handles an unknown artist with an actionable return", () => {
    const { getByRole, queryByRole } = renderArtist({
      route: "/store/incompris/artists/missing",
    });
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "This artist collection isn’t here.",
    );
    expect(queryByRole("searchbox")).not.toBeInTheDocument();
    fireEvent.click(getByRole("link", { name: "Back to Incompris" }));
    expect(getByRole("heading", { level: 1, name: "Incompris" })).toBeInTheDocument();
  });

  it("keeps the preview route while switching views and falls back from an unknown view", () => {
    const { getByRole, getByTestId } = renderArtist({
      route: "/store/preview/artists/test-artist?view=missing&q=Test",
    });
    expect(getByRole("link", { name: "Standalone & worlds" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(getByRole("link", { name: "Shop by song" }));
    expect(getByTestId("location")).toHaveTextContent(
      "/store/preview/artists/test-artist?view=songs&q=Test",
    );
    fireEvent.click(getByRole("link", { name: "Standalone & worlds" }));
    expect(getByTestId("location")).toHaveTextContent("/store/preview/artists/test-artist?q=Test");
  });

  it("uses supplied messages for metadata, controls, search, and navigation", () => {
    const messages = createLocaleFixture(resources, "rtl").messages;
    const { getByRole, getByText } = renderArtist({ messages });
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Test artist");
    expect(getByRole("heading", { level: 1 }).querySelector("bdi")).toHaveAttribute("dir", "auto");
    expect(document.title).toContain("نص تجريبي · Test artist · Artist collection");
    expect(
      getByRole("searchbox", {
        name: `نص تجريبي · ${resources.storeArtist.standalone.searchLabel}`,
      }),
    ).toBeInTheDocument();
    expect(
      getByRole("link", { name: `نص تجريبي · ${resources.storeArtist.backLink}` }),
    ).toHaveAttribute("href", "/store/incompris");
    expect(getByText(`نص تجريبي · ${resources.storeArtist.introduction}`)).toBeInTheDocument();
  });
  it("uses the selected catalog language for artist entrances and search while retaining canonical destinations", () => {
    const catalog = translatedArtistCatalog();
    const original = JSON.stringify(catalog);
    const { getByRole, getByText, queryByText, router } = renderLocalizedArtist(catalog);
    const link = getByRole("link", { name: /Artiste de démonstration.*Explore artist collection/ });
    expect(link).toHaveAttribute("href", "/store/incompris/artists/test-artist?lang=fr");
    expect(within(link).getByText("Artiste de démonstration")).toHaveAttribute("lang", "fr");
    expect(within(link).getByText("A fictional artist used only in this test.")).toHaveAttribute(
      "lang",
      "en",
    );
    fireEvent.click(link);
    expect(
      getByRole("heading", { level: 1, name: "Artiste de démonstration" }),
    ).toBeInTheDocument();
    expect(document.title).toContain("Artiste de démonstration");
    expect(queryByText("DRAFT_ARTIST_DESCRIPTION")).not.toBeInTheDocument();
    expect(getByText("A fictional artist used only in this test.")).toHaveAttribute("lang", "en");
    fireEvent.change(getByRole("searchbox"), { target: { value: "VÊTEMENT" } });
    const product = getByRole("link", { name: /Vêtement de démonstration/ });
    expect(product).toHaveAttribute("href", "/store/products/test-hoodie?lang=fr");
    expect(getByRole("status")).toHaveTextContent("Results: 1");
    expect(router.state.location.search).toContain("lang=fr");
    expect(JSON.stringify(catalog)).toBe(original);
  });

  it("falls back for stale artist names and keeps the source-language annotation", () => {
    const catalog = translatedArtistCatalog();
    const artist = catalog.entries.find((entry) => entry.id === "artist-test");
    if (!artist) throw new Error("Missing artist fixture");
    artist.title = "Updated creative name";
    const { getByRole, queryByText } = renderLocalizedArtist(
      catalog,
      "/store/incompris/artists/test-artist?lang=fr",
    );
    expect(
      getByRole("heading", { level: 1, name: "Updated creative name" }).querySelector("bdi"),
    ).toHaveAttribute("lang", "en");
    expect(queryByText("Artiste de démonstration")).not.toBeInTheDocument();
  });
});
