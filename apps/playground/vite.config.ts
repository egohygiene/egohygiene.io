import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "127.0.0.1",
    headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
    port: 5175,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
    port: 4175,
    strictPort: true,
  },
});
