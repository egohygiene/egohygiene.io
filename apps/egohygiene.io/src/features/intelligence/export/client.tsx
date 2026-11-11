import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { target } from "virtual:intelligence-export-target";

import { IntelligenceExportProviders } from "./providers";
import { IntelligenceExportRoutes } from "./routes";
import "@egohygiene/themes/styles.css";
import "./export.css";

const root = document.getElementById("root");
if (!root || root.getAttribute("data-intelligence-export-path") !== window.location.pathname)
  throw new Error("This artifact does not represent the requested Intelligence route");
hydrateRoot(root, <StrictMode><BrowserRouter basename={target.base_path.replace(/\/$/, "") || "/"}>
  <IntelligenceExportProviders><IntelligenceExportRoutes /></IntelligenceExportProviders>
</BrowserRouter></StrictMode>, { identifierPrefix: "eh-intelligence-export-" });
