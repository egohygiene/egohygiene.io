import { defineConfig, devices } from "@playwright/test";

/** Build Storybook and the standalone consumer first; --list never launches a browser. */
export default defineConfig({
  testDir: "./tests/component-styles",
  testMatch: "styles.spec.ts",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/component-styles",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4186",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command:
        "pnpm exec vite preview .cache/component-styles-53 --outDir dist --config tests/component-styles/preview.config.mjs --host 127.0.0.1 --port 4186 --strictPort",
      url: "http://127.0.0.1:4186",
      reuseExistingServer: false,
    },
    {
      command:
        "pnpm exec vite preview .cache --outDir storybook --config tests/component-styles/preview.config.mjs --host 127.0.0.1 --port 4187 --strictPort",
      url: "http://127.0.0.1:4187",
      reuseExistingServer: false,
    },
  ],
});
