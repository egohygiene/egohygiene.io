import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders supporting navigation", () => {
    const { getByRole } = renderWithRouter(<Footer />);
    expect(getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
  });
});
