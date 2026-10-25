import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

// Retained for the final local browser pass. This uses the existing docs project
// and its development server; it does not qualify a deployed/static docs host.
const failures = new WeakMap<Page, string[]>();

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ context, page, baseURL }) => {
  const observed: string[] = [];
  failures.set(page, observed);
  const origin = new URL(baseURL ?? "http://localhost:5174").origin;
  page.on("pageerror", (error) => observed.push(error.message));
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || request.method() !== "GET") {
      observed.push(`Blocked request: ${request.method()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    const response = await route.fetch({ maxRedirects: 0 });
    if (response.status() >= 300) {
      observed.push(`Unexpected response: ${response.status()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    return route.fulfill({ response });
  });
  // HMR is unnecessary for these fixed-source journeys. Close all WebSockets so
  // the tests cannot contact a second service through that channel.
  await context.routeWebSocket("**/*", (socket) => socket.close());
});

test.afterEach(async ({ page }) => {
  expect(
    failures.get(page),
    "Documentation journeys use only successful local GET requests",
  ).toEqual([]);
});

for (const [path, title, linkName, destination] of [
  ["/getting-started", "Getting started", "Local development", "/development"],
  ["/development", "Local development", "Getting started", "/getting-started"],
  ["/architecture", "Repository architecture", "Package overview", "/packages"],
  ["/packages", "Package overview", "Local development", "/development"],
] as const) {
  test(`docs ${path} renders semantic Markdown on direct entry and reload`, async ({ page }) => {
    await page.goto(path);
    const article = page.getByRole("main").getByRole("article");
    for (const reload of [false, true]) {
      if (reload) await page.reload();
      await expect(
        article.getByRole("heading", { level: 1, name: title, exact: true }),
      ).toBeVisible();
      await expect(article.locator("code").first()).toBeVisible();
      await expect(article.getByRole("list").first()).toBeVisible();
      await expect(article.getByRole("link", { name: linkName, exact: true })).toHaveAttribute(
        "href",
        destination,
      );
    }
    if (path === "/development") {
      await expect(
        article.locator("pre > code").filter({
          hasText: "pnpm --filter @egohygiene/docs build",
        }),
      ).toHaveText(
        "pnpm --filter @egohygiene/docs build\npnpm --filter @egohygiene/docs preview --host 127.0.0.1\n",
      );
      await expect(article).toContainText("starts only the public website/store");
    }
    if (path === "/getting-started") {
      await expect(article.locator("pre > code").filter({ hasText: "npm exec" })).toContainText(
        "--frozen-lockfile --ignore-scripts",
      );
    }
  });
}

test("docs home navigation and missing-page recovery reach the current guides", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ego Hygiene Docs" })).toBeVisible();
  await page.getByRole("link", { name: "Read the setup instructions", exact: true }).click();
  await expect(page).toHaveURL("/getting-started");
  await expect(
    page.getByRole("main").getByRole("heading", {
      level: 1,
      name: "Getting started",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", {
      name: "Local development",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL("/development");
  await expect(page.getByRole("main").locator("pre > code").first()).toHaveText(
    "pnpm --filter @egohygiene/docs dev\n",
  );
  await page.goto("/missing-document-50");
  await page.reload();
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Not found", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to docs home", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("link", { name: "Read the development guide", exact: true }),
  ).toBeVisible();
});
