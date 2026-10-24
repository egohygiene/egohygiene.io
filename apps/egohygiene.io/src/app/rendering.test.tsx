import { act, render } from "@testing-library/react";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { listPublicPages, renderPublicPage } from "../entry-server";
import { App } from "./App";
import { AppProviders } from "./providers";
import { routes } from "./router";
import { mountBrowserApp } from "./browser";
import { prerenderedPathAttribute } from "./rendering";

let mounted: ReturnType<typeof mountBrowserApp> | undefined;

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  Element.prototype.scrollIntoView = vi.fn();
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

afterEach(async () => {
  if (mounted) {
    await act(async () => mounted?.root.unmount());
    mounted.router.dispose();
    mounted = undefined;
  }
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function hydrate(path: string, browserPath = path) {
  const rendered = await renderPublicPage(path);
  const element = document.createElement("div");
  element.id = "root";
  element.setAttribute(prerenderedPathAttribute, path);
  element.innerHTML = rendered.markup;
  document.body.append(element);
  const main = element.querySelector("main");
  window.history.replaceState({}, "", browserPath);
  const onRecoverableError = vi.fn();
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  await act(async () => {
    mounted = mountBrowserApp(element, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(consoleError).not.toHaveBeenCalled();
  return { element, main, rendered };
}

describe("public rendering and browser adapter (simulated DOM)", () => {
  it("renders every approved current destination as meaningful HTML with its metadata", async () => {
    const pages = listPublicPages();
    expect(pages).toHaveLength(26);
    expect(pages.filter((page) => page.indexable)).toHaveLength(10);
    for (const page of pages) {
      const rendered = await renderPublicPage(page.pathname);
      expect(rendered.status, page.pathname).toBe(200);
      expect(rendered.metadata, page.pathname).toEqual(page.metadata);
      const fragment = document.createElement("template");
      fragment.innerHTML = rendered.markup;
      expect(fragment.content.querySelectorAll("main h1"), page.pathname).toHaveLength(1);
      expect(fragment.content.querySelector("main")?.textContent?.trim().length, page.pathname)
        .toBeGreaterThan(40);
      expect(rendered.markup).not.toMatch(/<!--\$(?:!|\?)-->/);
      expect(rendered.markup).not.toContain("Buy now");
    }
  });

  it("rejects a publication path whose route would fall through to missing-page UI", () => {
    const gateway = routes[0]!.children!.find((route) => route.id === "ecosystem-product")!;
    const originalPath = gateway.path;
    try {
      gateway.path = "disconnected/:product";
      expect(() => listPublicPages()).toThrow("does not resolve to its declared page");
    } finally {
      gateway.path = originalPath!;
    }
  });

  it("fails known-route rendering instead of emitting an exception or Suspense fallback", async () => {
    const home = routes[0]!.children!.find((route) => route.id === "page:home")!;
    const original = home.element;
    function BrokenPage(): never { throw new Error("Synthetic rendering failure"); }
    function PendingPage(): never { throw new Promise(() => undefined); }
    try {
      home.element = <BrokenPage />;
      await expect(renderPublicPage("/")).rejects.toThrow("Synthetic rendering failure");
      home.element = <Suspense fallback={<main>Loading</main>}><PendingPage /></Suspense>;
      await expect(renderPublicPage("/")).rejects.toThrow("unresolved rendering boundary");
      home.element = original;
      home.loader = () => null;
      await expect(renderPublicPage("/")).rejects.toThrow("asynchronous rendering review");
    } finally {
      home.element = original;
      delete home.loader;
    }
  });

  it("removes a stale canonical when the outer application boundary catches an error", () => {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = "https://egohygiene.io/";
    document.head.append(link);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    function BrokenChild(): never { throw new Error("Synthetic client failure"); }
    const result = render(<AppProviders><App><BrokenChild /></App></AppProviders>);
    expect(result.getByRole("alert")).toBeInTheDocument();
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    result.unmount();
    link.remove();
  });

  it.each(["/store/designs/missing", "/store/products/missing", "/store/collections/missing",
    "/store/incompris/artists/missing", "/missing", "/missing/nested"])(
    "renders %s as a missing page without a home canonical", async (path) => {
      const rendered = await renderPublicPage(path);
      expect(rendered.status).toBe(404);
      expect(rendered.metadata.robots).toBe("noindex,follow");
      expect(rendered.metadata.canonical).toBeUndefined();
      expect(rendered.markup).toContain("<main");
    },
  );

  it.each(["/", "/help", "/store/designs/heartburst", "/store/products/signal-heart-hoodie",
    "/store/collections/static-bloom-collection"])(
    "hydrates %s without replacing its rendered content or IDs", async (path) => {
      window.localStorage.setItem("egohygiene-theme", "high-contrast");
      const result = await hydrate(path);
      expect(mounted?.hydrated).toBe(true);
      expect(result.element.querySelector("main")).toBe(result.main);
      expect(document.documentElement.dataset.theme).toBe("high-contrast");
      expect(document.title).toBe(result.rendered.metadata.title);
      expect(document.querySelector('link[rel="canonical"]'))
        .toHaveAttribute("href", `https://egohygiene.io${path}`);
    },
  );

  it("hydrates ecosystem links before restoring the explicit language query", async () => {
    const result = await hydrate("/ecosystem", "/ecosystem?lang=en");
    expect(mounted?.hydrated).toBe(true);
    expect(result.element.querySelector("main")).toBe(result.main);
    const links = [...result.element.querySelectorAll("main h2 a")];
    expect(links).toHaveLength(7);
    for (const link of links) {
      expect(new URL(link.getAttribute("href")!, window.location.origin).search).toBe("?lang=en");
    }
    expect(document.querySelector('link[rel="canonical"]'))
      .toHaveAttribute("href", "https://egohygiene.io/ecosystem");
  });

  it("hydrates the unfiltered catalog then restores query and language without rewriting the URL", async () => {
    const result = await hydrate("/store/catalog", "/store/catalog?q=heartburst&lang=en#catalog");
    expect(mounted?.hydrated).toBe(true);
    expect(result.element.querySelector("main")).toBe(result.main);
    expect(result.element.querySelector('input[type="search"]')).toHaveValue("heartburst");
    expect(window.location.search).toBe("?q=heartburst&lang=en");
    expect(window.location.hash).toBe("#catalog");
    expect(document.querySelector('link[rel="canonical"]'))
      .toHaveAttribute("href", "https://egohygiene.io/store/catalog");
  });

  it("hydrates artist content before restoring the song filter", async () => {
    const path = "/store/incompris/artists/play";
    const result = await hydrate(path, `${path}?view=songs&q=signal&lang=en`);
    expect(mounted?.hydrated).toBe(true);
    expect(result.element.querySelector("main")).toBe(result.main);
    expect(result.element.querySelector('input[type="search"]')).toHaveValue("signal");
    expect(window.location.search).toBe("?view=songs&q=signal&lang=en");
  });

  it("defers legacy catalog forwarding until after matching store hydration", async () => {
    await hydrate("/store", "/store?q=heartburst&lang=en#catalog");
    expect(mounted?.hydrated).toBe(true);
    expect(mounted?.router.state.location.pathname).toBe("/store/catalog");
    expect(window.location.search).toBe("?q=heartburst&lang=en");
    expect(window.location.hash).toBe("#catalog");
  });

  it("uses a fresh client render when a host serves home HTML for an unknown path", async () => {
    const result = await hydrate("/", "/missing/nested");
    expect(mounted?.hydrated).toBe(false);
    expect(result.element.querySelector("main")).not.toBe(result.main);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it("uses a fresh client render for an empty development shell", async () => {
    const element = document.createElement("div");
    document.body.append(element);
    await act(async () => { mounted = mountBrowserApp(element); });
    expect(mounted?.hydrated).toBe(false);
    expect(element.querySelector("main h1")).not.toBeNull();
  });
});
