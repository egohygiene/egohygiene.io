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

function MessageExample({ messageKey }: { messageKey: string }) {
  const { t } = useI18n();
  return <p>{t(messageKey)}</p>;
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

  it.each([
    "navigation",
    "navigation.community",
    "missing.child",
    "greeting.child",
    "toString",
    "constructor",
    "navigation.constructor.name",
  ])("renders the complete invalid key %s as readable fallback text", (messageKey) => {
    const { getByText } = render(
      <I18nProvider
        messages={{ greeting: "Hello", navigation: { community: { title: "Community" } } }}
      >
        <MessageExample messageKey={messageKey} />
      </I18nProvider>,
    );

    expect(getByText(messageKey, { exact: true })).toBeInTheDocument();
  });

  it("renders a nested string and preserves an explicitly empty translation", () => {
    const messages = { navigation: { title: "Community" }, empty: "" };
    const { container, getByText, rerender } = render(
      <I18nProvider messages={messages}>
        <MessageExample messageKey="navigation.title" />
      </I18nProvider>,
    );
    expect(getByText("Community")).toBeInTheDocument();

    rerender(
      <I18nProvider messages={messages}>
        <MessageExample messageKey="empty" />
      </I18nProvider>,
    );
    expect(container.querySelector("p")?.textContent).toBe("");
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
