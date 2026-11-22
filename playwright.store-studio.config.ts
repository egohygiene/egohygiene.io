import { defineConfig, devices } from "@playwright/test";

const port = "4176";
const origin = `http://127.0.0.1:${port}`;
const chromiumPathVariable = "PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH";
const executablePath = process.env[chromiumPathVariable];

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "store-studio.spec.ts",
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/store-studio",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: origin,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: "node scripts/store-environment.mjs studio",
    env: { STORE_DEV_PORT: port, STORE_OPEN_BROWSER: "false" },
    url: `${origin}/store/studio`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
