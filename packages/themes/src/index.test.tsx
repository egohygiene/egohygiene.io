import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider, applyTheme, resolveTheme } from "./index";

describe("theme helpers", () => {
  it("resolves system themes", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("applies document theme", () => {
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("renders the provider", () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>inside</span>
      </ThemeProvider>,
    );

    expect(getByText("inside")).toBeInTheDocument();
  });
});
