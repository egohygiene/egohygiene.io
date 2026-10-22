import { createLocaleRegistry } from "@egohygiene/i18n";
import { render, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppProviders } from "../app/providers";
import { resources } from "../i18n/resources";
import { StoreHelpPage } from "./StoreHelpPage";

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
      storeHelp: {
        title: "Translated store help",
        description: "Translated help description",
        feedbackLink: "Translated public feedback link",
      },
    },
  },
};

function setup(path = "/store/help") {
  const router = createMemoryRouter(
    [{ path: "/store/help", element: <StoreHelpPage /> }],
    { initialEntries: [path] },
  );
  return render(
    <AppProviders router={router} registry={registry} catalogs={catalogs}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}

afterEach(() => window.localStorage.clear());

describe("store help disclosures", () => {
  it("distinguishes order support from public website feedback and describes the external link", () => {
    const result = setup();
    const orders = within(result.getByRole("region", { name: "Help with an order" }));
    expect(orders.queryByRole("link")).not.toBeInTheDocument();
    expect(orders.getByText(/order-support link on the available product/)).toBeInTheDocument();
    const feedback = result.getByRole("link", { name: "Report a website problem on GitHub" });
    expect(feedback).toHaveAttribute(
      "href",
      "https://github.com/egohygiene/egohygiene.io/issues/new",
    );
    expect(feedback).toHaveAccessibleDescription(/GitHub issues are public/);
    expect(feedback).toHaveAccessibleDescription(/Do not include order details/);
    expect(result.container.querySelector("form")).toBeNull();
    expect(result.getByRole("link", { name: "Privacy draft" })).toHaveAttribute("href", "/privacy");
    expect(result.getByRole("link", { name: "Terms draft" })).toHaveAttribute("href", "/terms");
  });

  it("uses the shared messages and retains language only on internal policy and store links", () => {
    const result = setup("/store/help?lang=qps-Ploc");
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent("Translated store help");
    expect(document.title).toBe("Translated store help");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Translated help description",
    );
    expect(result.getByRole("link", { name: "Privacy draft" })).toHaveAttribute(
      "href",
      "/privacy?lang=qps-Ploc",
    );
    expect(result.getByRole("link", { name: "Back to the store" })).toHaveAttribute(
      "href",
      "/store?lang=qps-Ploc",
    );
    expect(result.getByRole("link", { name: "Translated public feedback link" })).toHaveAttribute(
      "href",
      "https://github.com/egohygiene/egohygiene.io/issues/new",
    );
  });
});
