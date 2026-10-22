import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

import {
  createTranslator,
  type I18nDictionary,
  type I18nMessages,
  type Translator,
} from "../create-i18n";
import { canonicalizeLocale } from "../locale-registry";

interface I18nContextValue {
  readonly locale: string;
  readonly t: Translator;
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
  fallbacks,
}: PropsWithChildren<{
  locale?: string;
  messages: I18nMessages;
  fallbacks?: readonly I18nDictionary[];
}>) {
  const value = useMemo<I18nContextValue>(() => {
    const normalizedLocale = canonicalizeLocale(locale);
    const dates = new Intl.DateTimeFormat(normalizedLocale, { dateStyle: "medium" });
    const numbers = new Intl.NumberFormat(normalizedLocale);
    const relativeTimes = new Intl.RelativeTimeFormat(normalizedLocale, { numeric: "auto" });
    const lists = new Intl.ListFormat(normalizedLocale, { style: "long", type: "conjunction" });

    return {
      locale: normalizedLocale,
      t: createTranslator({ locale: normalizedLocale, messages, fallbacks: fallbacks ?? [] }),
      formatDate: (value) => dates.format(value),
      formatNumber: (value) => numbers.format(value),
      formatRelativeTime: (value, unit) => relativeTimes.format(value, unit),
      formatList: (value) => lists.format(value),
    };
  }, [locale, messages, fallbacks]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within I18nProvider.");
  }
  return value;
}
