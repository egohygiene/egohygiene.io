import { createBrowserRouter } from "react-router-dom";
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
import { EcosystemPage } from "../pages/EcosystemPage";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "ecosystem", element: <EcosystemPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "store", element: <StorePage /> },
      { path: "store/help", element: <StoreHelpPage /> },
      { path: "store/incompris", element: <IncomprisPage /> },
      { path: "store/incompris/artists/:artistSlug", element: <StoreArtistPage /> },
      { path: "store/catalog", element: <StoreCatalogPage /> },
      ...previewRoutes,
      { path: "store/products/:slug", element: <StoreProductPage /> },
      { path: "store/designs/:slug", element: <StoreDesignPage /> },
      { path: "store/collections/:slug", element: <StoreCollectionPage /> },
      { path: ":product", element: <ProductPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
