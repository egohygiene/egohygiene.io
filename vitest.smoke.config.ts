import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "smoke",
    environment: "node",
    globals: true,
    include: ["tests/smoke/**/*.test.ts"],
  },
});
