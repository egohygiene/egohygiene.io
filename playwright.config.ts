import { defineConfig, devices } from "@playwright/test";

/** Prepare all three production artifacts with test:smoke or the complete ci:browser profile. */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  outputDir: "test-results/apps",
  use: {
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command:
        "pnpm --filter @egohygiene/egohygiene.io preview --host 127.0.0.1 --port 5173 --strictPort",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @egohygiene/docs preview --host 127.0.0.1 --port 5174 --strictPort",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        "pnpm --filter @egohygiene/playground preview --host 127.0.0.1 --port 5175 --strictPort",
      url: "http://127.0.0.1:5175",
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "site",
      testMatch: /site\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:5173",
      },
    },
    {
      name: "docs",
      testMatch: /docs\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:5174",
      },
    },
    {
      name: "playground",
      testMatch: /playground\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:5175",
      },
    },
  ],
});
