import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { I18nProvider, useI18n } from "./index";

function Example() {
  const { t, formatNumber } = useI18n();
  return (
    <p>
      {t("greeting")} {formatNumber(1200)}
    </p>
  );
}

describe("i18n", () => {
  it("returns translated messages", () => {
    const { getByText } = render(
      <I18nProvider messages={{ greeting: "Hello" }}>
        <Example />
      </I18nProvider>,
    );

    expect(getByText(/Hello/)).toBeInTheDocument();
  });
});
