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

function LocaleExample() {
  const { t, locale, formatNumber } = useI18n();
  return (
    <p>
      {locale} / {t("greeting", { name: "<b>Alan</b>" })} / {formatNumber(1200)}
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

  it("renders fallback interpolation as text and updates when the selected dictionary changes", () => {
    const fallbacks = [{ locale: "en", messages: { greeting: "Hello {{name}}" } }];
    const { getByText, container, rerender } = render(
      <I18nProvider locale="fr-fr" messages={{}} fallbacks={fallbacks}>
        <LocaleExample />
      </I18nProvider>,
    );
    expect(getByText(/fr-FR \/ Hello <b>Alan<\/b>/)).toBeInTheDocument();
    expect(container.querySelector("b")).toBeNull();

    rerender(
      <I18nProvider
        locale="en-US"
        messages={{ greeting: "Welcome {{name}}" }}
        fallbacks={fallbacks}
      >
        <LocaleExample />
      </I18nProvider>,
    );
    expect(getByText("en-US / Welcome <b>Alan</b> / 1,200")).toBeInTheDocument();
  });
});
