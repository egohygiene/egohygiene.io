/** Isolated synthetic browser host. Never included by an application/export build. */
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IntelligenceGraph } from "../../apps/egohygiene.io/src/features/intelligence/graph/IntelligenceGraph";

const nodes = [
  {
    id: "module-audits",
    label: "Audits",
    kind: "module" as const,
    href: "/audits/",
    state: "available",
    description: "Synthetic navigation destination, not an audit claim.",
  },
  {
    id: "entity-synthetic-finding",
    label: "Synthetic finding with a deliberately long label to constrain the mobile node selector",
    kind: "entity" as const,
    href: "/audits/#synthetic-finding",
    state: "confirmed",
    description: "Synthetic browser fixture only, not real repository evidence.",
  },
];

const root = document.getElementById("root");
if (!root) throw new Error("Graph qualification root is missing");

createRoot(root).render(
  <BrowserRouter basename="/.github">
    <Routes>
      <Route
        path="/intelligence/"
        element={
          <main style={{ margin: "1rem", maxWidth: "100%" }}>
            <h1>LOCAL TEST ONLY · Synthetic graph</h1>
            <IntelligenceGraph nodes={nodes} edges={[]} />
          </main>
        }
      />
      <Route
        path="/audits/"
        element={<h1 id="synthetic-finding">Synthetic audit destination</h1>}
      />
    </Routes>
  </BrowserRouter>,
);
