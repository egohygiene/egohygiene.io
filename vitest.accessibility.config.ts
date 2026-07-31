import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const resolve = (value: string) => fileURLToPath(new URL(value, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@egohygiene/content": resolve("./packages/content/src/index.ts"),
      "@egohygiene/icons": resolve("./packages/icons/src/index.ts"),
      "@egohygiene/schemas": resolve("./packages/schemas/src/index.ts"),
      "@egohygiene/themes": resolve("./packages/themes/src/index.ts"),
      "@egohygiene/ui": resolve("./packages/ui/src/index.tsx"),
      "@egohygiene/utilities": resolve("./packages/utilities/src/index.ts"),
      "@egohygiene/visualizations": resolve("./packages/visualizations/src/index.tsx"),
    },
  },
  test: {
    name: "accessibility",
    environment: "jsdom",
    setupFiles: ["./.vitest/setup.ts"],
    globals: true,
    include: ["tests/accessibility/**/*.test.ts", "tests/accessibility/**/*.test.tsx"],
  },
});
