import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrbitVisualization } from "./index";

describe("OrbitVisualization", () => {
  it("renders the core label", () => {
    const { getByText } = render(<OrbitVisualization />);
    expect(getByText("balance")).toBeInTheDocument();
  });
});
