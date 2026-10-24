import assert from "node:assert/strict";
import type { BrowserContext } from "@playwright/test";

import { CHECKOUT_HANDOFF_FIXTURE } from "./inputs.ts";

type RequestDetails = {
  url: string;
  method: string;
  resourceType: string;
  isMainFrameNavigation: boolean;
};

/** Test-only allowlist: no provider request ever continues to the network. */
export function decideHandoffRequest(request: RequestDetails, localOrigin: string) {
  const local = new URL(localOrigin);
  assert.equal(local.protocol, "http:");
  assert.equal(local.hostname, "127.0.0.1");
  assert.equal(local.origin, localOrigin);
  if (request.method !== "GET") return "block";
  const url = new URL(request.url);
  if (url.username || url.password) return "block";
  if (url.origin === localOrigin) return "local";
  if (
    request.url === CHECKOUT_HANDOFF_FIXTURE.checkoutUrl &&
    request.resourceType === "document" &&
    request.isMainFrameNavigation
  ) {
    return "destination";
  }
  return "block";
}

export async function installHandoffBoundary(context: BrowserContext, localOrigin: string) {
  const intercepted: string[] = [];
  const blocked: RequestDetails[] = [];
  const blockedWebSockets: string[] = [];
  await context.route("**/*", async (route) => {
    const request = route.request();
    const details = {
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      isMainFrameNavigation:
        request.isNavigationRequest() && request.frame() === request.frame().page().mainFrame(),
    };
    const action = decideHandoffRequest(details, localOrigin);
    if (action === "local") {
      // Playwright may follow redirects without invoking the handler for each hop.
      // Fetch only the loopback URL, never follow a redirect, and serve the response locally.
      const response = await route.fetch({ maxRedirects: 0 });
      if (response.status() < 300 || response.status() >= 400) {
        return route.fulfill({ response });
      }
      blocked.push(details);
      return route.abort("blockedbyclient");
    }
    if (action === "destination") {
      intercepted.push(details.url);
      return route.fulfill({
        status: 200,
        contentType: "text/html",
        headers: { "content-security-policy": "default-src 'none'; frame-ancestors 'none'" },
        body: '<!doctype html><html lang="en"><head><title>Local handoff fixture</title></head><body><h1>Intercepted checkout destination</h1><p>Fictional test only. No provider request, payment or order occurred.</p></body></html>',
      });
    }
    blocked.push(details);
    return route.abort("blockedbyclient");
  });
  // A static preview needs no WebSockets. Do not permit future test content to open one.
  await context.routeWebSocket("**/*", (socket) => {
    blockedWebSockets.push(socket.url());
    socket.close();
  });
  return { intercepted, blocked, blockedWebSockets };
}
