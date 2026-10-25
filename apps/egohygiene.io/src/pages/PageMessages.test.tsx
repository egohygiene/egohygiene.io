import { I18nProvider } from "@egohygiene/i18n";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { resources } from "../i18n/resources";
import { AboutPage } from "./AboutPage";
import { EcosystemPage } from "./EcosystemPage";
import { NotFoundPage } from "./NotFoundPage";
import { RouteErrorPage } from "./RouteErrorPage";

const messages = {
  ...resources,
  pages: {
    ...resources.pages,
    aboutTitle: "Translated about title",
    about: {
      ...resources.pages.about,
      description: "Translated metadata",
      intro: "Translated introduction",
    },
    ecosystem: {
      ...resources.pages.ecosystem,
      repository: "Translated repository {{name}} (external)",
      status: { ...resources.pages.ecosystem.status, development: "Translated development" },
      categories: { ...resources.pages.ecosystem.categories, knowledge: "Translated knowledge" },
    },
  },
  errors: {
    ...resources.errors,
    notFoundTitle: "Translated missing page",
    routeTitle: "Translated route failure",
    retry: "Translated retry",
    returnHome: "Translated home",
  },
};

describe("page interface messages", () => {
  it("updates page copy and client metadata together when dictionaries change", () => {
    const before = document.title;
    const { getByRole, getByText, rerender, unmount } = render(
      <I18nProvider messages={messages}>
        <AboutPage />
      </I18nProvider>,
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Translated about title");
    expect(getByText("Translated introduction")).toBeInTheDocument();
    expect(document.title).toBe("Translated about title");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Translated metadata",
    );
    rerender(
      <I18nProvider messages={resources}>
        <AboutPage />
      </I18nProvider>,
    );
    expect(document.title).toBe(resources.pages.aboutTitle);
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(resources.pages.aboutTitle);
    unmount();
    expect(document.title).toBe(before);
  });

  it("localizes missing and route-error recovery while retaining the home destination", () => {
    for (const [page, title] of [
      [<NotFoundPage key="missing" />, "Translated missing page"],
      [<RouteErrorPage key="error" />, "Translated route failure"],
    ] as const) {
      const { getByRole, unmount } = render(
        <MemoryRouter>
          <I18nProvider messages={messages}>{page}</I18nProvider>
        </MemoryRouter>,
      );
      expect(getByRole("heading", { level: 1 })).toHaveTextContent(title);
      expect(getByRole("link", { name: "Translated home" })).toHaveAttribute("href", "/");
      if (title === "Translated route failure") {
        expect(getByRole("button", { name: "Translated retry" })).toBeInTheDocument();
      }
      unmount();
    }
  });

  it("translates registry status/category labels while keeping creative names intact", () => {
    const { getAllByText, getByRole } = render(
      <MemoryRouter>
        <I18nProvider messages={messages}>
          <EcosystemPage />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(getAllByText("Translated development").length).toBeGreaterThan(0);
    expect(getAllByText("Translated knowledge").length).toBeGreaterThan(0);
    expect(getByRole("heading", { name: "Mindcap" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Translated repository Mindcap (external)" })).toHaveAttribute(
      "href",
      "https://github.com/egohygiene/mindcap",
    );
  });
});
