import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@egohygiene/themes";

import { renderWithRouter } from "#test-utils";
import { Header } from "./Header";

describe("Header", () => {
  it("toggles mobile navigation", () => {
    const { getByRole } = renderWithRouter(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    const toggle = getByRole("button", { name: "Toggle navigation" });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
