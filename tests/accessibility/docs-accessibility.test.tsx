import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider } from "@egohygiene/themes";

import { HomePage } from "../../apps/docs/src/pages/HomePage";

describe("docs accessibility", () => {
  it("renders the docs home content", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(getByRole("heading", { level: 1, name: /Documentation/i })).toBeInTheDocument();
  });
});
