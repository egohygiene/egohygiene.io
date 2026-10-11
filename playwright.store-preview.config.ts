import { defineConfig, devices } from "@playwright/test";

/** Run `task build:store` first; this suite uses the isolated local demo artifact. */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "fourthwall-preview.spec.ts",
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/store-preview",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"]
      ? { executablePath: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"] }
      : {},
  },
  webServer: {
    command: "node scripts/store-environment.mjs preview",
    env: { STORE_PREVIEW_PORT: "4174", STORE_OPEN_BROWSER: "false" },
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
