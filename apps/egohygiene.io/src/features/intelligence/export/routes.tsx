import { Route, Routes } from "react-router-dom";

import { intelligenceEndpointRoutes } from "../../../content/intelligence-routes";
import { IntelligencePage } from "../IntelligencePage";
import { IntelligenceEndpoint } from "../endpoints/IntelligenceEndpoint";

/** The portable entry composes the same features without the product router. */
export function IntelligenceExportRoutes() {
  return <Routes>
    <Route path="/intelligence/" element={<IntelligencePage />} />
    {intelligenceEndpointRoutes.map((route) => <Route key={route.id} path={route.path}
      element={<IntelligenceEndpoint id={route.id} />} />)}
    <Route path="*" element={<main><h1>Intelligence route unavailable</h1><p>Use the exported organization overview.</p></main>} />
  </Routes>;
}
