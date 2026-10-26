import { createTranslator } from "@egohygiene/i18n";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  matchRoutes,
  type RouteObject,
  StaticRouterProvider,
} from "react-router-dom";

import { App } from "./app/App";
import { AppProviders } from "./app/providers";
import { identifierPrefix } from "./app/rendering";
import { routes } from "./app/router";
import { getPublicRoutes, PUBLIC_ORIGIN, resolvePageMetadata } from "./content/publication";
import { storeCatalog, storefrontCuration } from "./content/store";
import { defaultLocale } from "./i18n/config";
import { resources } from "./i18n/resources";

export { PUBLIC_ORIGIN as publicOrigin } from "./content/publication";

const input = {
  catalog: storeCatalog,
  curation: storefrontCuration,
  t: createTranslator({ locale: defaultLocale, messages: resources }),
};

// This adapter intentionally supports the existing synchronous public route tree.
// An async route needs an explicit rendering-contract review, not a loading shell.
function requireSynchronousRoutes(definitions: RouteObject[]) {
  for (const route of definitions) {
    if (route.lazy || route.loader || route.action) {
      throw new Error(
        `Static public route requires asynchronous rendering review: ${route.id ?? route.path}`,
      );
    }
    if (route.children) requireSynchronousRoutes(route.children);
  }
}

export function listPublicPages() {
  return getPublicRoutes(input).map((page) => {
    const expectedRoute =
      page.kind === "page"
        ? `page:${page.page}`
        : page.kind === "ecosystem"
          ? "ecosystem-product"
          : page.kind === "artist"
            ? "artist"
            : `store-${storeCatalog.entries.find((entry) => entry.id === page.entryId)?.kind}`;
    const matches = matchRoutes(routes, page.path);
    if (matches?.at(-1)?.route.id !== expectedRoute) {
      throw new Error(`Public path does not resolve to its declared page: ${page.path}`);
    }
    return {
      pathname: page.path,
      metadata: resolvePageMetadata(page.path, input),
      indexable: page.indexable,
      reason: page.reason,
    };
  });
}

export async function renderPublicPage(pathname: string) {
  requireSynchronousRoutes(routes);
  // Known paths have already passed the publication inventory's validation.
  // Unknown paths intentionally render the friendly missing UI for the 404 artifact.
  const known = listPublicPages().some((page) => page.pathname === pathname);
  const url = new URL(pathname, PUBLIC_ORIGIN);
  if (url.origin !== PUBLIC_ORIGIN || url.pathname !== pathname || url.search || url.hash) {
    throw new Error(`Static rendering requires a canonical pathname: ${pathname}`);
  }
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(url));
  if (context instanceof Response) {
    throw new Error(`Unexpected static route response: ${pathname} (${context.status})`);
  }
  if (context.errors || context.statusCode !== 200) {
    throw new Error(`Static route failed: ${pathname} (${context.statusCode})`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const markup = renderToString(
    <StrictMode>
      <AppProviders>
        <App>
          <StaticRouterProvider router={router} context={context} hydrate={false} />
        </App>
      </AppProviders>
    </StrictMode>,
    { identifierPrefix },
  );
  if (!markup || /<!--\$(?:!|\?)-->/.test(markup)) {
    throw new Error(`Static route emitted an unresolved rendering boundary: ${pathname}`);
  }
  return {
    markup,
    metadata: resolvePageMetadata(pathname, input),
    status: known ? 200 : 404,
  };
}
