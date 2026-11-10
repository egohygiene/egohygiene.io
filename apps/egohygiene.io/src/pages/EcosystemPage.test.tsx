import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "../app/providers";
import { routes } from "../app/router";
import { renderPublicPage } from "../entry-server";
import { resources } from "../i18n/resources";

const destinations = [
  ["Mindcap", "/mindcap", "development"],
  ["Mindgarden", "/mindgarden", "planned"],
  ["Renderflow", "/renderflow", "planned"],
  ["Egolint", "/egolint", "development"],
  ["Reflector", "/reflector", "planned"],
  ["Aether", "/aether", "development"],
  ["Store", "/store", "development"],
] as const;
const routers: ReturnType<typeof createMemoryRouter>[] = [];

function setup(path = "/ecosystem") {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  routers.push(router);
  const result = render(
    <AppProviders router={router}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router, main: () => within(result.getByRole("main")) };
}

beforeEach(() => {
  // No viewport/layout or actual keyboard acceptance is claimed by simulated DOM.
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  for (const router of routers.splice(0)) router.dispose();
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("ecosystem navigation (simulated DOM)", () => {
  it.each(destinations)(
    "opens %s from its card and recovers the directory",
    async (name, path, status) => {
      const result = setup("/ecosystem?lang=en");
      const heading = result.main().getByRole("heading", { level: 2, name });
      const link = within(heading).getByRole("link", { name });
      expect(link).toHaveAttribute("href", `${path}?lang=en`);
      expect(link).not.toHaveAttribute("target");
      await act(async () => fireEvent.click(link));
      expect(result.router.state.location.pathname).toBe(path);
      expect(result.router.state.location.search).toBe("?lang=en");
      expect(result.main().getByRole("heading", { level: 1 })).toHaveTextContent(
        name === "Store" ? resources.storefront.home.heading : name,
      );
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://egohygiene.io${path}`,
      );
      if (name === "Store") {
        expect(result.router.state.matches.at(-1)?.route.id).toBe("page:store");
        expect(result.main().queryByText(resources.pages.product.reserved)).not.toBeInTheDocument();
        expect(result.main().queryByRole("link", { name: "Buy now" })).not.toBeInTheDocument();
      } else {
        expect(result.router.state.matches.at(-1)?.route.id).toBe("ecosystem-product");
        expect(result.main().getByText(status, { exact: true })).toBeInTheDocument();
        expect(result.main().getByText(resources.pages.product.reserved)).toBeInTheDocument();
        const back = result.main().getByRole("link", { name: "Back to the directory" });
        expect(back).toHaveAttribute("href", "/ecosystem?lang=en");
        await act(async () => fireEvent.click(back));
        expect(result.router.state.location.pathname).toBe("/ecosystem");
        await act(async () => result.router.navigate(-1));
        expect(result.router.state.location.pathname).toBe(path);
      }
      await act(async () => result.router.navigate(-1));
      expect(result.router.state.location.pathname).toBe("/ecosystem");
      expect(result.router.state.location.search).toBe("?lang=en");
      expect(result.main().getAllByRole("heading", { level: 2 })).toHaveLength(7);
    },
  );

  it("keeps repository anchors distinct from local links and language queries", () => {
    const result = setup("/ecosystem?lang=en");
    const links = result.main().getAllByRole("link");
    expect(links).toHaveLength(9);
    for (const [name, repository] of [
      ["Mindcap", "https://github.com/egohygiene/mindcap"],
      ["Egolint", "https://github.com/egohygiene/egolint"],
    ]) {
      const external = result.main().getByRole("link", {
        name: `${name} repository on GitHub (external)`,
      });
      expect(external).toHaveAttribute("href", repository);
      expect(external).not.toHaveAttribute("target");
      expect(external.querySelector("a")).toBeNull();
    }
    expect(result.main().getByText(resources.pages.ecosystem.intro)).toBeInTheDocument();
  });

  it("renders all local destinations as native links before JavaScript", async () => {
    const page = await renderPublicPage("/ecosystem");
    const fragment = document.createElement("template");
    fragment.innerHTML = page.markup;
    const headings = [...fragment.content.querySelectorAll("main h2 a")];
    expect(headings.map((link) => [link.textContent, link.getAttribute("href")])).toEqual(
      destinations.map(([name, path]) => [name, path]),
    );
    expect(page.status).toBe(200);
    expect(page.metadata.robots).toBe("index,follow");
  });
});
