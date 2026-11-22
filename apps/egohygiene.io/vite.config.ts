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
      {
        name: "merch-studio-loopback",
        config(_config, { command }) {
          // A static build must exclude this route even when started with a development NODE_ENV.
          if (command === "build") {
            return { define: { "import.meta.env.VITE_STORE_STUDIO": JSON.stringify("false") } };
          }
        },
        configResolved(config) {
          if (
            config.command === "serve" &&
            !config.isPreview &&
            config.env.VITE_STORE_STUDIO === "true" &&
            config.server.host !== "127.0.0.1"
          ) {
            throw new Error("Merch studio requires the loopback host 127.0.0.1.");
          }
        },
      },
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
