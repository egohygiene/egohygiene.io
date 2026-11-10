/** Reuse the real Vite document with one test-only entry; deny all remote or mutating traffic. */
import assert from "node:assert/strict";
import path from "node:path";

export async function installHostBoundary(page, { origin, entry }) {
  // Match Vite's canonical module URL so self-imports cannot execute a second root.
  const entryUrl = path.posix.join("/@fs", entry.replaceAll("\\", "/"));
  const errors = [];
  const blockedRequests = [];
  const blockedWebSockets = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.routeWebSocket("**/*", (socket) => {
    blockedWebSockets.push(socket.url());
    socket.close();
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || request.method() !== "GET") {
      blockedRequests.push(`${request.method()} ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    const response = await route.fetch({ maxRedirects: 0 });
    if (response.status() >= 300) {
      blockedRequests.push(`Unexpected HTTP ${response.status()}: ${request.url()}`);
      return route.abort("blockedbyclient");
    }
    if (request.resourceType() !== "document") return route.fulfill({ response });
    const html = (await response.text()).replace('src="/src/main.tsx"', `src="${entryUrl}"`);
    assert.ok(html.includes(`src="${entryUrl}"`), "Vite document entry must be replaced");
    return route.fulfill({ response, body: html });
  });
  return {
    errors,
    blockedRequests,
    blockedWebSockets,
    assertClean() {
      assert.deepEqual(errors, [], "No uncaught browser errors");
      assert.deepEqual(blockedRequests, [], "No remote, mutating, redirected, or failed requests");
      // Vite's local development socket is denied too; no socket is connected.
      assert.ok(blockedWebSockets.every((url) => new URL(url).host === new URL(origin).host));
    },
  };
}
