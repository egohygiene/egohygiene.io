import { I18nProvider } from "@egohygiene/i18n";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import shell from "../../i18n/locales/en/shell.json";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("preserves supporting and legal destinations", () => {
    const { getByRole } = renderWithRouter(
      <I18nProvider messages={{ shell }}>
        <Footer />
      </I18nProvider>,
    );
    expect(getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
    expect(getByRole("navigation", { name: "Legal" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Community store" })).toHaveAttribute("href", "/store");
    expect(getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(getByRole("link", { name: "View the source" })).toHaveAttribute(
      "href",
      "https://github.com/egohygiene/egohygiene.io",
    );
  });

  it("keeps translated labels separate from canonical routes", () => {
    const messages = { shell: { ...shell, footer: { ...shell.footer, privacy: "Datenschutz" } } };
    const { getByRole } = renderWithRouter(
      <I18nProvider messages={messages}>
        <Footer />
      </I18nProvider>,
    );
    expect(getByRole("link", { name: "Datenschutz" })).toHaveAttribute("href", "/privacy");
  });
});
