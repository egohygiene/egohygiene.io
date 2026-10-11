import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import { AboutPage } from "../pages/AboutPage";
import { EcosystemPage } from "../pages/EcosystemPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { ProductPage } from "../pages/ProductPage";
import { TermsPage } from "../pages/TermsPage";
import { StorePage } from "../pages/StorePage";
import { StoreCollectionPage, StoreDesignPage, StoreProductPage } from "../features/store";
import { RouteErrorPage } from "../pages/RouteErrorPage";

// Only the isolated local preview build includes the provider tryout or its fixtures.
const previewRoutes = import.meta.env.VITE_STORE_PREVIEW === "true"
  ? [{
      path: "store/preview/fourthwall",
      lazy: async () => {
        const { FourthwallPreviewPage } = await import("../features/fourthwall-preview/FourthwallPreviewPage");
        return { Component: FourthwallPreviewPage };
      },
    }]
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
      ...previewRoutes,
      { path: "store/products/:slug", element: <StoreProductPage /> },
      { path: "store/designs/:slug", element: <StoreDesignPage /> },
      { path: "store/collections/:slug", element: <StoreCollectionPage /> },
      { path: ":product", element: <ProductPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
