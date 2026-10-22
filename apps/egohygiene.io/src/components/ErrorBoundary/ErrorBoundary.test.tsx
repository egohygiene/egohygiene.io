import { I18nProvider } from "@egohygiene/i18n";
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

  it("uses current translated fallback text without requiring router context", () => {
    const { getByRole, rerender } = render(
      <I18nProvider messages={{ errors: { unexpected: "Translated failure" } }}>
        <ErrorBoundary>
          <Broken />
        </ErrorBoundary>
      </I18nProvider>,
    );
    expect(getByRole("alert")).toHaveTextContent("Translated failure");
    rerender(
      <I18nProvider messages={{ errors: { unexpected: "Updated failure" } }}>
        <ErrorBoundary>
          <Broken />
        </ErrorBoundary>
      </I18nProvider>,
    );
    expect(getByRole("alert")).toHaveTextContent("Updated failure");
  });
});
