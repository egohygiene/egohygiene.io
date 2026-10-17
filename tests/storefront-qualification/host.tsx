/** Browser-only qualification entry. No production module imports this file. */

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { I18nProvider } from "../../packages/i18n/src/index";
import { parseStoreCatalog, parseStorefrontCuration } from "../../packages/schemas/src/index";
import { ThemeProvider } from "../../packages/themes/src/index";

import "../../packages/ui/src/styles/index.css";
import { storeCatalog } from "../../apps/egohygiene.io/src/content/store";
import { createArtistPreview } from "../../apps/egohygiene.io/src/features/artist-preview/fixture";
import { StoreArtistPage } from "../../apps/egohygiene.io/src/features/store/StoreArtistPage";
import {
  IncomprisPage,
  StorefrontPage,
} from "../../apps/egohygiene.io/src/features/store/StorefrontPages";
import { resources } from "../../apps/egohygiene.io/src/i18n/resources";
import { RootLayout } from "../../apps/egohygiene.io/src/layouts/RootLayout";
import { createLocaleFixture } from "../../apps/egohygiene.io/src/test/locale-fixtures";
import "../../apps/egohygiene.io/src/styles/app.css";

const mode = new URLSearchParams(location.search).get("qaLocale") === "rtl" ? "rtl" : "expanded";
const locale = createLocaleFixture(resources, mode);
document.documentElement.lang = locale.locale;
document.documentElement.dir = locale.direction;
const preview = createArtistPreview(storeCatalog);
const catalog = parseStoreCatalog(
  preview.catalog.entries.map((entry) => ({
    source: `qualification:${entry.id}`,
    value:
      entry.id === "artist-preview-fictional" || entry.id.includes("-demo-")
        ? {
            ...entry,
            title: `${entry.title} — an unusually long fictional collection title`,
            description: `${entry.description} This additional fictional description exercises longer editorial copy across narrow and wide layouts, without changing product identity or availability.`,
          }
        : entry,
  })),
  preview.catalog.checkoutRoutes,
);
const selection = [
  "product-demo-signal-heart-hoodie",
  "design-demo-static-bloom",
  "product-demo-static-bloom-mug",
  "product-demo-unwritten-realm-comic",
];
const curation = parseStorefrontCuration(
  {
    schemaVersion: 1,
    egoHygieneEntryIds: ["design-demo-static-bloom"],
    incomprisEntryIds: selection,
    featuredIncomprisEntryIds: selection,
    artists: [
      {
        artistId: "artist-preview-fictional",
        standaloneEntryIds: selection,
        songCollectionIds: ["collection-demo-static-bloom"],
      },
    ],
  },
  catalog,
  "qualification-only-curation",
);

function QualificationLayout() {
  return (
    <>
      <aside className="store-shell store-preview-note" aria-label="Qualification fixture">
        <strong>LOCAL TEST ONLY · Fictional merchandise · {mode} text</strong>
        <p>
          Synthetic language and longer catalog copy test layout resilience. These examples are not
          real artist selections, translations, products for sale, or production pages.
        </p>
      </aside>
      <RootLayout />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <QualificationLayout />,
    children: [
      { path: "store", element: <StorefrontPage catalog={catalog} curation={curation} /> },
      {
        path: "store/incompris",
        element: <IncomprisPage catalog={catalog} curation={curation} />,
      },
      {
        path: "store/incompris/artists/:artistSlug",
        element: <StoreArtistPage catalog={catalog} curation={curation} />,
      },
    ],
  },
]);

const root = document.getElementById("root");
if (!root) throw new Error("Qualification root is missing");
createRoot(root).render(
  <ThemeProvider>
    <I18nProvider locale={locale.locale} messages={locale.messages}>
      <RouterProvider router={router} />
    </I18nProvider>
  </ThemeProvider>,
);
