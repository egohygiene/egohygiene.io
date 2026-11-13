import { ThemeProvider } from "@egohygiene/themes";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppearanceControl } from "./AppearanceControl";

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("portable Intelligence appearance", () => {
  it("renders stable disabled server controls and explicit no-JavaScript content", () => {
    const markup = renderToString(
      <ThemeProvider>
        <AppearanceControl />
      </ThemeProvider>,
    );
    expect(markup).toContain('aria-label="Appearance" disabled=""');
    expect(markup).toContain('value="system" selected=""');
    expect(markup).toContain("Changing appearance requires JavaScript");
  });

  it("exposes the requested choices and saves changes through the existing provider", () => {
    render(
      <ThemeProvider>
        <AppearanceControl />
      </ThemeProvider>,
    );
    const control = screen.getByRole("combobox", { name: "Appearance" });
    expect(screen.getAllByRole("option").map((item) => item.textContent)).toEqual([
      "System",
      "Light",
      "Dark",
    ]);
    fireEvent.change(control, { target: { value: "light" } });
    expect(control).toHaveValue("light");
    expect(document.documentElement.dataset["theme"]).toBe("light");
    expect(window.localStorage.getItem("egohygiene-theme")).toBe("light");
    fireEvent.change(control, { target: { value: "dark" } });
    expect(document.documentElement.dataset["theme"]).toBe("dark");
  });

  it("preserves an existing high-contrast preference until the visitor changes it", () => {
    window.localStorage.setItem("egohygiene-theme", "high-contrast");
    render(
      <ThemeProvider>
        <AppearanceControl />
      </ThemeProvider>,
    );
    const control = screen.getByRole("combobox", { name: "Appearance" });
    expect(control).toHaveValue("high-contrast");
    expect(document.documentElement.dataset["theme"]).toBe("high-contrast");
    fireEvent.change(control, { target: { value: "system" } });
    expect(control).toHaveValue("system");
    expect(screen.queryByRole("option", { name: "High contrast" })).not.toBeInTheDocument();
  });
});
