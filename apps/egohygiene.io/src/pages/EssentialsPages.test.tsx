import { createLocaleRegistry } from "@egohygiene/i18n";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "../app/providers";
import { router as websiteRouter } from "../app/router";
import { resources } from "../i18n/resources";

const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en", direction: "ltr", label: "English" },
    { id: "qps-Ploc", formatLocale: "en", direction: "ltr", label: "Test language" },
  ],
});
const catalogs = {
  en: resources,
  "qps-Ploc": {
    pages: {
      help: { title: "Translated help", description: "Translated help description" },
      accessibility: {
        title: "Translated accessibility",
        description: "Translated accessibility description",
        feedbackLink: "Translated accessibility report",
      },
      websiteFeedback: { warning: "Translated public/account warning" },
    },
  },
};
const routers: ReturnType<typeof createMemoryRouter>[] = [];

function setup(path: string) {
  // Use the real route table and shell so a missing registration cannot pass as a page test.
  const router = createMemoryRouter(websiteRouter.routes, { initialEntries: [path] });
  routers.push(router);
  const result = render(
    <AppProviders router={router} registry={registry} catalogs={catalogs}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router, main: () => within(result.getByRole("main")) };
}

beforeEach(() => {
  // jsdom has no viewport scrolling; these tests do not establish browser/layout acceptance.
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  for (const router of routers.splice(0)) router.dispose();
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterAll(() => websiteRouter.dispose());

describe("website essentials journeys (simulated DOM)", () => {
  it.each([
    ["/help", "Help", resources.pages.help.description],
    ["/about", "About Ego Hygiene", resources.pages.about.description],
    ["/accessibility", "Accessibility", resources.pages.accessibility.description],
    ["/store/help", "Store help", resources.pages.storeHelp.description],
    ["/privacy", "Privacy draft", resources.pages.privacy.description],
    ["/terms", "Terms draft", resources.pages.terms.description],
  ])("registers %s in the real shell with matching client metadata", (path, title, description) => {
    const result = setup(path);
    expect(result.main().getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(result.main().getByRole("heading", { level: 1 })).toHaveTextContent(title);
    expect(document.title).toBe(title);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      description,
    );
    const footer = within(result.getByRole("navigation", { name: "Footer" }));
    expect(footer.getByRole("link", { name: "Help", exact: true })).toHaveAttribute("href", "/help");
    expect(footer.getByRole("link", { name: "Accessibility", exact: true })).toHaveAttribute(
      "href",
      "/accessibility",
    );
  });

  it.each(["/help", "/accessibility", "/store/help"])(
    "keeps %s feedback public and separate from private order support",
    (path) => {
      const result = setup(path);
      const feedback = result.main().getByRole("link", { name: /problem on GitHub/ });
      expect(feedback).toHaveAttribute(
        "href",
        "https://github.com/egohygiene/egohygiene.io/issues/new",
      );
      expect(feedback).toHaveAccessibleDescription(/GitHub issues are public/);
      expect(feedback).toHaveAccessibleDescription(/require a GitHub account/);
      expect(feedback).toHaveAccessibleDescription(/Do not include order details/);
      expect(feedback).toHaveAccessibleDescription(/private website-feedback channel is not published/);
      expect(result.getByRole("main").querySelector("form")).toBeNull();
      if (path !== "/accessibility") {
        const orders = within(result.main().getByRole("region", { name: "Help with an order" }));
        expect(
          orders.getByText(/Public website feedback is not an order-support channel/),
        ).toBeInTheDocument();
        for (const link of orders.queryAllByRole("link")) {
          expect(link).toHaveAttribute("href", "/store/help");
        }
      }
    },
  );

  it("preserves language across help, accessibility and policy navigation without altering external feedback", async () => {
    const result = setup("/help?lang=qps-Ploc");
    expect(document.title).toBe("Translated help");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Translated help description",
    );
    const accessibility = result.main().getByRole("link", { name: "Accessibility information" });
    expect(accessibility).toHaveAttribute("href", "/accessibility?lang=qps-Ploc");
    await act(async () => fireEvent.click(accessibility));
    expect(result.router.state.location.pathname).toBe("/accessibility");
    expect(document.title).toBe("Translated accessibility");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Translated accessibility description",
    );
    const feedback = result.main().getByRole("link", { name: "Translated accessibility report" });
    expect(feedback).toHaveAccessibleDescription("Translated public/account warning");
    expect(feedback).toHaveAttribute("href", "https://github.com/egohygiene/egohygiene.io/issues/new");
    await act(async () =>
      fireEvent.click(result.main().getByRole("link", { name: "More website help" })),
    );

    for (const [label, path] of [
      ["Privacy draft", "/privacy"],
      ["Terms draft", "/terms"],
    ]) {
      await act(async () => fireEvent.click(result.main().getByRole("link", { name: label })));
      expect(result.router.state.location.pathname).toBe(path);
      expect(result.main().getByRole("heading", { level: 1 })).toHaveTextContent(label);
      const back = result.main().getByRole("link", { name: "More website help" });
      expect(back).toHaveAttribute("href", "/help?lang=qps-Ploc");
      await act(async () => fireEvent.click(back));
      expect(result.router.state.location.pathname).toBe("/help");
    }
    expect(result.router.state.location.search).toBe("?lang=qps-Ploc");
  });

  it("still navigates the real help shell when preference storage is denied", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    const result = setup("/help?lang=en");
    expect(result.main().getByRole("heading", { level: 1 })).toHaveTextContent("Help");
    await act(async () =>
      fireEvent.click(result.main().getByRole("link", { name: "Accessibility information" })),
    );
    expect(result.router.state.location.pathname).toBe("/accessibility");
    expect(result.main().getByRole("heading", { level: 1 })).toHaveTextContent("Accessibility");
    const restored = `${result.router.state.location.pathname}${result.router.state.location.search}`;
    result.unmount();
    const remounted = setup(restored);
    expect(remounted.main().getByRole("heading", { level: 1 })).toHaveTextContent("Accessibility");
    expect(remounted.router.state.location.search).toBe("?lang=en");
  });
});
