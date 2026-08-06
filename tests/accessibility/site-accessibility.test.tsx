import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider } from "@egohygiene/themes";

import { Header } from "../../apps/egohygiene.io/src/components/Header/Header";
import { AboutPage } from "../../apps/egohygiene.io/src/pages/AboutPage";
import { EcosystemPage } from "../../apps/egohygiene.io/src/pages/EcosystemPage";
import { HomePage } from "../../apps/egohygiene.io/src/pages/HomePage";

function renderPage(element: ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{element}</ThemeProvider>
    </MemoryRouter>,
  );
}

describe("primary site accessibility", () => {
  it("renders the home page heading and links", () => {
    const { getByRole } = renderPage(<HomePage />);
    expect(
      getByRole("heading", { level: 1, name: /Tools, ideas, and practices/i }),
    ).toBeInTheDocument();
    expect(getByRole("link", { name: /Explore the ecosystem/i })).toBeInTheDocument();
  });

  it("renders about and ecosystem headings", () => {
    const about = renderPage(<AboutPage />);
    expect(
      about.getByRole("heading", { level: 1, name: /About Ego Hygiene/i }),
    ).toBeInTheDocument();

    const ecosystem = renderPage(<EcosystemPage />);
    expect(
      ecosystem.getByRole("heading", { level: 1, name: /The Ego Hygiene ecosystem/i }),
    ).toBeInTheDocument();
  });

  it("renders navigation and theme controls", () => {
    const { getByRole, getByLabelText } = renderPage(<Header />);
    expect(getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(getByLabelText("Theme")).toBeInTheDocument();
  });
});
