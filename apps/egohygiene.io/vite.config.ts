import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { loadCatalog } from "../../scripts/store-catalog.mts";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "validate-store-catalog",
      async buildStart() {
        await loadCatalog();
      },
    },
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
