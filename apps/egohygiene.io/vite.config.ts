import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import {
  publicStoreCatalog,
  type PublicStoreCatalogOptions,
} from "../../scripts/vite-store-catalog.mts";
import { publicPagePreview } from "../../scripts/vite-public-pages.mts";
import { organizationIntelligence, type OrganizationIntelligenceOptions } from "../../scripts/vite-organization-intelligence.mts";

export function createWebsiteConfig(catalogOptions: PublicStoreCatalogOptions = {}, intelligenceOptions: OrganizationIntelligenceOptions = {}) {
  return defineConfig({
    plugins: [react(), publicStoreCatalog(catalogOptions), organizationIntelligence(intelligenceOptions), publicPagePreview()],
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
