import type { ReactElement } from "react";
import type { RouteObject } from "react-router-dom";

import { fixedPublicRoutes } from "../content/publication";
import {
  IncomprisPage,
  StoreArtistPage,
  StoreCatalogPage,
  StoreCollectionPage,
  StoreDesignPage,
  StoreProductPage,
} from "../features/store";
import { RootLayout } from "../layouts/RootLayout";
import { AboutPage } from "../pages/AboutPage";
import { AccessibilityPage } from "../pages/AccessibilityPage";
import { EcosystemPage } from "../pages/EcosystemPage";
import { HelpPage } from "../pages/HelpPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { ProductPage } from "../pages/ProductPage";
import { RouteErrorPage } from "../pages/RouteErrorPage";
import { StoreHelpPage } from "../pages/StoreHelpPage";
import { StorePage } from "../pages/StorePage";
import { TermsPage } from "../pages/TermsPage";

// Only the isolated local preview build includes the provider tryout or its fixtures.
const previewRoutes =
  import.meta.env.VITE_STORE_PREVIEW === "true"
    ? [
        {
          path: "store/preview/fourthwall",
          lazy: async () => {
            const { FourthwallPreviewPage } = await import(
              "../features/fourthwall-preview/FourthwallPreviewPage"
            );
            return { Component: FourthwallPreviewPage };
          },
        },
        {
          path: "store/preview/artists/:artistSlug",
          lazy: async () => {
            const { ArtistPreviewPage } = await import(
              "../features/artist-preview/ArtistPreviewPage"
            );
            return { Component: ArtistPreviewPage };
          },
        },
      ]
    : [];

// The fixed page paths and their publication metadata are declared together.
// Both adapters consume this route table; importing it never reads a browser global.
const fixedPages: Record<(typeof fixedPublicRoutes)[number]["page"], ReactElement> = {
  home: <HomePage />,
  about: <AboutPage />,
  help: <HelpPage />,
  accessibility: <AccessibilityPage />,
  ecosystem: <EcosystemPage />,
  privacy: <PrivacyPage />,
  terms: <TermsPage />,
  store: <StorePage />,
  storeHelp: <StoreHelpPage />,
  incompris: <IncomprisPage />,
  catalog: <StoreCatalogPage />,
};

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      ...fixedPublicRoutes.map(
        ({ path, page }): RouteObject => ({
          id: `page:${page}`,
          ...(path === "/" ? { index: true as const } : { path: path.slice(1) }),
          element: fixedPages[page],
        }),
      ),
      { id: "artist", path: "store/incompris/artists/:artistSlug", element: <StoreArtistPage /> },
      ...previewRoutes,
      { id: "store-product", path: "store/products/:slug", element: <StoreProductPage /> },
      { id: "store-design", path: "store/designs/:slug", element: <StoreDesignPage /> },
      { id: "store-collection", path: "store/collections/:slug", element: <StoreCollectionPage /> },
      { id: "ecosystem-product", path: ":product", element: <ProductPage /> },
      { id: "not-found", path: "*", element: <NotFoundPage /> },
    ],
  },
];
