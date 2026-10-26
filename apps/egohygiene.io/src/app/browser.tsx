import { StrictMode } from "react";
import { createRoot, hydrateRoot, type RootOptions } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./App";
import { AppProviders } from "./providers";
import { identifierPrefix, prerenderedPathAttribute } from "./rendering";
import { routes } from "./router";

/** Reuse matching generated markup; a host's SPA fallback must never hydrate another page. */
export function mountBrowserApp(rootElement: HTMLElement, options: RootOptions = {}) {
  const router = createBrowserRouter(routes);
  const app = (
    <StrictMode>
      <AppProviders router={router}>
        <App>
          <RouterProvider router={router} />
        </App>
      </AppProviders>
    </StrictMode>
  );
  const hydrate =
    rootElement.hasChildNodes() &&
    rootElement.getAttribute(prerenderedPathAttribute) === window.location.pathname;
  const rootOptions = { ...options, identifierPrefix };
  const root = hydrate
    ? hydrateRoot(rootElement, app, rootOptions)
    : createRoot(rootElement, rootOptions);
  if (!hydrate) root.render(app);
  return { root, router, hydrated: hydrate };
}
