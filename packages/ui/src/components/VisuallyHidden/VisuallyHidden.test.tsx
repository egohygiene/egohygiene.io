import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders content for assistive technology", () => {
    const { getByText } = render(<VisuallyHidden>Only screen readers</VisuallyHidden>);
    expect(getByText("Only screen readers")).toBeInTheDocument();
  });
});
