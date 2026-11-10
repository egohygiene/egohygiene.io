import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppProviders } from "../../apps/egohygiene.io/src/app/providers";

import { Header } from "../../apps/egohygiene.io/src/components/Header/Header";
import { AboutPage } from "../../apps/egohygiene.io/src/pages/AboutPage";
import { EcosystemPage } from "../../apps/egohygiene.io/src/pages/EcosystemPage";
import { HomePage } from "../../apps/egohygiene.io/src/pages/HomePage";

function renderPage(element: ReactElement) {
  return render(
    <MemoryRouter>
      <AppProviders>{element}</AppProviders>
    </MemoryRouter>,
  );
}

describe("primary site accessibility", () => {
  it("renders the home page heading and links", () => {
    const { getByRole, getAllByRole } = renderPage(<HomePage />);
    expect(getByRole("heading", { level: 1, name: /A little more human/i })).toBeInTheDocument();
    expect(getByRole("link", { name: "Discover Ego Hygiene" })).toHaveAttribute("href", "/about");
    expect(getByRole("link", { name: /Explore the ecosystem/i })).toHaveAttribute(
      "href",
      "/ecosystem",
    );
    for (const link of getAllByRole("link", { name: "Explore the store" })) {
      expect(link).toHaveAttribute("href", "/store");
    }
    expect(
      getByRole("link", { name: "Explore this design: heartburst" }),
    ).toHaveAttribute("href", "/store/designs/heartburst");
    expect(
      getByRole("img", { name: "Ego Hygiene’s cyan and magenta yin-yang symbol" }),
    ).toHaveAttribute("width", "512");
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
