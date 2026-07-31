import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ["react", "react-dom"],
    tsconfigPaths: true,
  },

  server: {
    port: 5175,
    strictPort: true,
  },

  preview: {
    port: 4175,
    strictPort: true,
  },
});

