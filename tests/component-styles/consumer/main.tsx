import { OrbitVisualization } from "@egohygiene/visualizations";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@egohygiene/visualizations/styles.css";

const requested = new URLSearchParams(location.search).get("theme");
const theme = ["light", "dark", "high-contrast"].find((value) => value === requested) ?? "light";
document.documentElement.dataset["theme"] = theme;
const root = document.getElementById("root");
if (!root) throw new Error("Standalone consumer root is missing");
createRoot(root).render(
  <StrictMode>
    <main>
      <h1>Standalone visualization</h1>
      <OrbitVisualization size={220} />
    </main>
  </StrictMode>,
);
