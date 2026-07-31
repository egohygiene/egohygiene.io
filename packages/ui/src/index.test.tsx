import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@egohygiene/themes";

import { StatusBadge, ThemeToggle } from "./index";

describe("ui exports", () => {
  it("renders status badges", () => {
    const { getByText } = render(<StatusBadge tone="available">available</StatusBadge>);
    expect(getByText("available")).toHaveClass("eh-badge--available");
  });

  it("changes the theme", () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    fireEvent.change(getByLabelText("Theme"), { target: { value: "dark" } });
    expect((getByLabelText("Theme") as HTMLSelectElement).value).toBe("dark");
  });
});
