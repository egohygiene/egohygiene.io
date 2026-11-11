import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { target } from "virtual:intelligence-export-target";

import { intelligenceEndpointRoutes } from "../../../content/intelligence-routes";
import { IntelligenceExportProviders } from "./providers";
import { IntelligenceExportRoutes } from "./routes";

export function renderIntelligenceExport(pathname: string): string {
  if (pathname !== "/intelligence/" && !intelligenceEndpointRoutes.some((route) => route.path === pathname))
    throw new Error("Only declared organization Intelligence routes may be rendered");
  const markup = renderToString(<StrictMode><StaticRouter
    basename={target.base_path.replace(/\/$/, "") || "/"}
    location={`${target.base_path.replace(/\/$/, "")}${pathname}`}>
    <IntelligenceExportProviders><IntelligenceExportRoutes /></IntelligenceExportProviders>
  </StaticRouter></StrictMode>, { identifierPrefix: "eh-intelligence-export-" });
  if (!markup || /<!--\$(?:!|\?)-->/.test(markup)) throw new Error("Unresolved Intelligence rendering boundary");
  return markup;
}
