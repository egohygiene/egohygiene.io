import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders content and responds to clicks", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button onClick={onClick}>Explore</Button>);

    fireEvent.click(getByRole("button", { name: "Explore" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables loading buttons", () => {
    const { getByRole } = render(<Button loading>Loading</Button>);
    expect(getByRole("button", { name: "Loading" })).toBeDisabled();
  });
});
