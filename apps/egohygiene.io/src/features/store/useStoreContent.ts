import { useI18n } from "@egohygiene/i18n";
import type { StoreEntry } from "@egohygiene/schemas";
import { useMemo } from "react";

import { useSiteLocale } from "../../i18n/LocaleProvider";
import { getStoreEntryContent, type StoreContentSelection } from "./domain/index.ts";

/** Adapt the existing selected content language to the pure catalog presentation API. */
export function useStoreContent() {
  const site = useSiteLocale();
  const { locale: formatLocale } = useI18n();
  const registry = site?.registry;
  // Isolated consumers without the website service can request their runtime locale;
  // only the registry supplies additional languages, and every entry retains its source.
  const locale = site?.locale.id ?? formatLocale;
  return useMemo(() => {
    const selection: StoreContentSelection = {
      locale,
      fallbackLocales: registry?.getFallbacks(locale).map((fallback) => fallback.id) ?? [],
    };
    return {
      selection,
      formatLocale,
      content: (entry: StoreEntry) => getStoreEntryContent(entry, selection),
    };
  }, [locale, registry, formatLocale]);
}
