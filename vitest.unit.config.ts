import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));
const resolve = (value: string) => fileURLToPath(new URL(value, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "#test-utils": resolve("./.vitest/test-utils.tsx"),
      "@egohygiene/api-client": resolve("./packages/api-client/src/index.ts"),
      "@egohygiene/config": resolve("./packages/config/src/index.ts"),
      "@egohygiene/content": resolve("./packages/content/src/index.ts"),
      "@egohygiene/design-tokens": resolve("./packages/design-tokens/src/index.ts"),
      "@egohygiene/icons": resolve("./packages/icons/src/index.ts"),
      "@egohygiene/i18n": resolve("./packages/i18n/src/index.ts"),
      "@egohygiene/schemas": resolve("./packages/schemas/src/index.ts"),
      "@egohygiene/themes": resolve("./packages/themes/src/index.ts"),
      "@egohygiene/ui": resolve("./packages/ui/src/index.tsx"),
      "@egohygiene/utilities": resolve("./packages/utilities/src/index.ts"),
      "@egohygiene/visualizations": resolve("./packages/visualizations/src/index.tsx"),
    },
  },
  test: {
    root,
    name: "unit",
    environment: "jsdom",
    setupFiles: ["./.vitest/setup.ts"],
    globals: true,
    include: [
      "apps/*/src/**/*.test.ts",
      "apps/*/src/**/*.test.tsx",
      "packages/*/src/**/*.test.ts",
      "packages/*/src/**/*.test.tsx",
    ],
    exclude: ["tests/**"],
  },
});
