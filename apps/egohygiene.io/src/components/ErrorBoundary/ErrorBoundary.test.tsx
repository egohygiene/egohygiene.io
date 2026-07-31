import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorBoundary } from "./ErrorBoundary";

function Broken() {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("renders the fallback on render errors", () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<p>Recovered</p>}>
        <Broken />
      </ErrorBoundary>,
    );

    expect(getByText("Recovered")).toBeInTheDocument();
  });
});
