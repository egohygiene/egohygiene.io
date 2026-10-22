/** Browser-only qualification entry. No production module imports this file. */

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createLocaleRegistry, useI18n } from "../../packages/i18n/src/index";
import {
  parseStoreCatalog,
  parseStorefrontCuration,
  type StoreDesign,
} from "../../packages/schemas/src/index";
import { Button, Spinner } from "../../packages/ui/src/index";

import "../../packages/ui/src/styles/index.css";
import { AppProviders } from "../../apps/egohygiene.io/src/app/providers";
import { storeCatalog } from "../../apps/egohygiene.io/src/content/store";
import { createArtistPreview } from "../../apps/egohygiene.io/src/features/artist-preview/fixture";
import { FourthwallPreviewPage } from "../../apps/egohygiene.io/src/features/fourthwall-preview/FourthwallPreviewPage";
import { StoreArtistPage } from "../../apps/egohygiene.io/src/features/store/StoreArtistPage";
import { StoreArtworkGallery } from "../../apps/egohygiene.io/src/features/store/StoreArtworkGallery";
import {
  IncomprisPage,
  StorefrontPage,
} from "../../apps/egohygiene.io/src/features/store/StorefrontPages";
import {
  StoreCatalogPage,
  StoreProductPage,
} from "../../apps/egohygiene.io/src/features/store/StorePages";
import { LocaleLink } from "../../apps/egohygiene.io/src/i18n/LocaleLink";
import fourthwallPreview from "../../apps/egohygiene.io/src/i18n/locales/en/fourthwallPreview.json";
import { resources } from "../../apps/egohygiene.io/src/i18n/resources";
import { RootLayout } from "../../apps/egohygiene.io/src/layouts/RootLayout";
import { NotFoundPage } from "../../apps/egohygiene.io/src/pages/NotFoundPage";
import { RouteErrorPage } from "../../apps/egohygiene.io/src/pages/RouteErrorPage";
import { createLocaleFixture } from "../../apps/egohygiene.io/src/test/locale-fixtures";
import "../../apps/egohygiene.io/src/styles/app.css";

// Public configuration stays English-only. These three entries exist only in this host.
const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en", direction: "ltr", label: "English" },
    { id: "qps-Ploc", formatLocale: "en", direction: "ltr", label: "Expanded test text" },
    { id: "ar", formatLocale: "ar-u-nu-arab", direction: "rtl", label: "Synthetic RTL" },
  ],
});
const sourceMessages = {
  ...resources,
  fourthwallPreview,
  qualification: {
    sourceOnly: "Source fallback stays readable",
    interpolation: "Hello {{name}} / {{missing}}",
    cardinal_one: "{{formattedCount}} source item",
    cardinal_other: "{{formattedCount}} source items",
    object: { nested: "This object must never reach React" },
  },
};
const catalogs = {
  en: sourceMessages,
  "qps-Ploc": {
    ...createLocaleFixture(sourceMessages, "expanded").messages,
    // Deliberately partial, to exercise source fallback in a real browser.
    qualification: { interpolation: "Expanded {{name}} / {{missing}}" },
  },
  ...(new URLSearchParams(location.search).has("qaMissingCatalog")
    ? {}
    : {
        ar: {
          ...createLocaleFixture(sourceMessages, "rtl").messages,
          qualification: {
            cardinal_zero: "{{formattedCount}} synthetic zero",
            cardinal_one: "{{formattedCount}} synthetic one",
            cardinal_two: "{{formattedCount}} synthetic two",
            cardinal_few: "{{formattedCount}} synthetic few",
            cardinal_many: "{{formattedCount}} synthetic many",
            cardinal_other: "{{formattedCount}} synthetic other",
          },
        },
      }),
};

function MessageProbe() {
  const { t, locale, formatNumber } = useI18n();
  return (
    <section className="store-shell" aria-label="Message contract fixture">
      <h1>Local message contract fixture</h1>
      <p data-probe="format-locale">{locale}</p>
      <p data-probe="source">{t("qualification.sourceOnly")}</p>
      <p data-probe="missing">{t("qualification.missing")}</p>
      <p data-probe="object">{t("qualification.object")}</p>
      <p data-probe="interpolation">
        {t("qualification.interpolation", { name: "<strong>Sky</strong>" })}
      </p>
      {[0, 1, 2, 3, 11, 100].map((count) => (
        <p data-probe={`plural-${count}`} key={count}>
          {t("qualification.cardinal", { count, formattedCount: formatNumber(count) })}
        </p>
      ))}
      <LocaleLink data-probe="internal" to="/store?view=product#catalog">
        Store fixture
      </LocaleLink>
      <LocaleLink data-probe="explicit" to="/store?lang=en#catalog">
        Explicit English
      </LocaleLink>
      <LocaleLink data-probe="external" to="https://example.invalid/never-follow">
        External fixture (never followed)
      </LocaleLink>
    </section>
  );
}

const galleryDesigns = storeCatalog.entries.filter(
  (entry): entry is StoreDesign =>
    entry.kind === "design" &&
    ["design-demo-signal-heart", "design-demo-static-bloom"].includes(entry.id),
);
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
        <strong>LOCAL TEST ONLY · Fictional merchandise · synthetic locale qualification</strong>
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
      { index: true, element: <MessageProbe /> },
      { path: "qualification/messages", element: <MessageProbe /> },
      {
        path: "qualification/gallery",
        element: (
          <StoreArtworkGallery designs={galleryDesigns} title="Fictional artwork qualification" />
        ),
      },
      {
        path: "qualification/error",
        loader: () => {
          throw new Response("Synthetic route failure", { status: 503 });
        },
        errorElement: <RouteErrorPage />,
      },
      { path: "qualification/fourthwall", element: <FourthwallPreviewPage /> },
      { path: "store/catalog", element: <StoreCatalogPage /> },
      { path: "store/products/:slug", element: <StoreProductPage /> },
      { path: "*", element: <NotFoundPage /> },
      {
        path: "qualification/shared",
        element: (
          <section aria-label="Shared motion fixture">
            <h1>Shared control qualification</h1>
            <Button tone="secondary">Synthetic action</Button>
            <Spinner label="Synthetic loading state" />
          </section>
        ),
      },
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
  <AppProviders router={router} registry={registry} catalogs={catalogs}>
    <RouterProvider router={router} />
  </AppProviders>,
);
