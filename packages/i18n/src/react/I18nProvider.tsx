import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

import { getMessage, type I18nMessages } from "../create-i18n";

interface I18nContextValue {
  readonly locale: string;
  readonly t: (key: string) => string;
  readonly formatDate: (value: Date) => string;
  readonly formatNumber: (value: number) => string;
  readonly formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
  readonly formatList: (value: string[]) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale = "en",
  messages,
}: PropsWithChildren<{ locale?: string; messages: I18nMessages }>) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key) => getMessage(messages, key),
      formatDate: (value) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value),
      formatNumber: (value) => new Intl.NumberFormat(locale).format(value),
      formatRelativeTime: (value, unit) =>
        new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit),
      formatList: (value) =>
        new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(value),
    }),
    [locale, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within I18nProvider.");
  }
  return value;
}
