import type { I18nMessages } from "@egohygiene/i18n";

/** Test-only message stress cases, not translated or publicly supported locales. */
export function createLocaleFixture(
  messages: I18nMessages,
  mode: "expanded" | "rtl",
): {
  locale: string;
  direction: "ltr" | "rtl";
  messages: I18nMessages;
} {
  const transform = (value: string) =>
    mode === "expanded" ? `[${value} · ${value}]` : `نص تجريبي · ${value}`;

  const mapMessages = (source: I18nMessages): I18nMessages =>
    Object.fromEntries(
      Object.entries(source).map(([key, value]) => [
        key,
        typeof value === "string" ? transform(value) : mapMessages(value),
      ]),
    );

  return {
    locale: mode === "rtl" ? "ar" : "en",
    direction: mode === "rtl" ? "rtl" : "ltr",
    messages: mapMessages(messages),
  };
}
