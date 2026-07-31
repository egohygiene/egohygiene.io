import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@egohygiene/ui/styles.css";

import { App } from "./app/App";
import { AppProviders } from "./app/providers";
import "./styles/app.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
