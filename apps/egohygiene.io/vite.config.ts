import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
  type OrganizationIntelligenceOptions,
  organizationIntelligence,
} from "../../scripts/vite-organization-intelligence.mts";
import { excludePlayground } from "../../scripts/vite-playground-boundary.mts";
import { publicPagePreview } from "../../scripts/vite-public-pages.mts";
import {
  type PublicStoreCatalogOptions,
  publicStoreCatalog,
} from "../../scripts/vite-store-catalog.mts";

export function createWebsiteConfig(
  catalogOptions: PublicStoreCatalogOptions = {},
  intelligenceOptions: OrganizationIntelligenceOptions = {},
) {
  return defineConfig({
    plugins: [
      excludePlayground(),
      react(),
      publicStoreCatalog(catalogOptions),
      organizationIntelligence(intelligenceOptions),
      publicPagePreview(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 4173,
      strictPort: true,
    },
  });
}

export default createWebsiteConfig();
