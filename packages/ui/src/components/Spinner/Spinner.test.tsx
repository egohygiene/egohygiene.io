import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("announces its label", () => {
    const { getByRole } = render(<Spinner label="Loading section" />);
    expect(getByRole("status", { name: "Loading section" })).toBeInTheDocument();
  });
});
