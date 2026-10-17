import { I18nProvider } from "@egohygiene/i18n";
import { ThemeProvider } from "@egohygiene/themes";
import { fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import shell from "../../i18n/locales/en/shell.json";
import { Header } from "./Header";

function HistoryControls() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/about")} type="button">
      Change route
    </button>
  );
}

function renderHeader(route = "/", messages = shell) {
  return renderWithRouter(
    <ThemeProvider>
      <I18nProvider messages={{ shell: messages }}>
        <Header />
        <HistoryControls />
      </I18nProvider>
    </ThemeProvider>,
    route,
  );
}

describe("Header", () => {
  it("exposes a labelled disclosure and returns focus on Escape", () => {
    const { getByRole } = renderHeader();
    const toggle = getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-controls", "primary-navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Close navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    getByRole("link", { name: "Store" }).focus();
    fireEvent.keyDown(document.activeElement ?? document, { key: "Escape" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes after following a link and marks only the current section", () => {
    const { getByRole } = renderHeader();
    fireEvent.click(getByRole("button", { name: "Open navigation" }));
    fireEvent.click(getByRole("link", { name: "Store" }));

    expect(getByRole("button", { name: "Open navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(getByRole("link", { name: "Store" })).toHaveAttribute("aria-current", "page");
    expect(getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("closes when navigation happens outside the header", () => {
    const { getByRole } = renderHeader();
    fireEvent.click(getByRole("button", { name: "Open navigation" }));
    fireEvent.click(getByRole("button", { name: "Change route" }));
    expect(getByRole("button", { name: "Open navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes when focus leaves the header for page content", () => {
    const { getByRole } = renderHeader();
    const toggle = getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    fireEvent.focusIn(getByRole("button", { name: "Change route" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("retains the store section on a product deep link", () => {
    const { getByRole } = renderHeader("/store/products/signal-heart-hoodie");
    expect(getByRole("link", { name: "Store" })).toHaveAttribute("aria-current", "page");
    expect(getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("reads navigation and accessible theme labels from the app messages", () => {
    const { getByRole } = renderHeader("/", {
      ...shell,
      navigation: { ...shell.navigation, open: "Navigation öffnen", store: "Gemeinschaftsladen" },
      theme: { ...shell.theme, label: "Darstellung", dark: "Dunkel" },
    });
    expect(getByRole("button", { name: "Navigation öffnen" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Gemeinschaftsladen" })).toHaveAttribute("href", "/store");
    expect(getByRole("combobox", { name: "Darstellung" })).toBeInTheDocument();
    expect(getByRole("option", { name: "Dunkel" })).toHaveAttribute("value", "dark");
  });
});
