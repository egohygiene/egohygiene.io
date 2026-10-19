import { defineConfig, devices } from "@playwright/test";

/** Build first with `pnpm build`; these journeys exercise the production bundle. */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: [
    "store.spec.ts",
    "storefront.spec.ts",
    "store-artist.spec.ts",
    "storefront-journey.spec.ts",
    "theme.spec.ts",
    "site.spec.ts",
    "store-metadata.spec.ts",
    "store-accessibility.spec.ts",
  ],
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/store/report.json" }]],
  outputDir: "test-results/store",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"]
      ? { executablePath: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"] }
      : {},
  },
  webServer: {
    command:
      "pnpm --filter @egohygiene/egohygiene.io preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
