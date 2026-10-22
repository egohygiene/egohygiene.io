/** Isolated qualification entry. Built only by tests/catalog-localization/run.mts. */
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "../../apps/egohygiene.io/src/app/providers";
import { router } from "../../apps/egohygiene.io/src/app/router";
import "../../packages/ui/src/styles/index.css";
import "../../apps/egohygiene.io/src/styles/app.css";
import { catalogLocaleMessages, catalogLocaleRegistry } from "./locales";

const root = document.getElementById("root");
if (!root) throw new Error("Catalog localization qualification root is missing");
createRoot(root).render(
  <AppProviders router={router} registry={catalogLocaleRegistry} catalogs={catalogLocaleMessages}>
    <aside className="store-shell store-preview-note" aria-label="Qualification fixture">
      <strong>LOCAL TEST ONLY · Synthetic catalog languages · No real merchandise or orders</strong>
    </aside>
    <RouterProvider router={router} />
  </AppProviders>,
);
