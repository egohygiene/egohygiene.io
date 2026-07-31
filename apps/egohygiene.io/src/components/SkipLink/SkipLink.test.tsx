import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("links to the main landmark", () => {
    const { getByRole } = render(<SkipLink />);
    expect(getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
  });
});
