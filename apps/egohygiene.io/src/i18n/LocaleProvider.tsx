import {
  type I18nMessages,
  I18nProvider,
  type LocaleDefinition,
  type LocaleRegistry,
} from "@egohygiene/i18n";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";

import { useBrowserSnapshot } from "../hooks/useBrowserSnapshot";
import { localePreferenceKey } from "./config";
import {
  getRequestedLocale,
  persistLocalePreference,
  resolveLocaleSelection,
  withLocaleSearch,
} from "./selection";

export type LocaleCatalogs = Readonly<Record<string, I18nMessages>>;

interface LocaleContextValue {
  readonly locale: LocaleDefinition;
  readonly registry: LocaleRegistry;
  readonly preserveSelection: boolean;
  readonly setLocale: (id: string) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const emptyMessages: I18nMessages = Object.freeze({});

/** Browser effects stay here; router composition supplies the current search. */
export function LocaleProvider({
  children,
  registry,
  catalogs,
  search,
  onSearchChange,
}: PropsWithChildren<{
  readonly registry: LocaleRegistry;
  readonly catalogs: LocaleCatalogs;
  readonly search: string;
  readonly onSearchChange: (search: string) => void;
}>) {
  const browserReady = useBrowserSnapshot();
  const selected = useMemo(
    () =>
      browserReady
        ? resolveLocaleSelection(registry, search, () =>
            window.localStorage.getItem(localePreferenceKey),
          )
        : registry.resolve(),
    [browserReady, registry, search],
  );
  const explicitSelection = browserReady && getRequestedLocale(registry, search) !== undefined;

  const setLocale = useCallback(
    (id: string) => {
      // Validation precedes persistence. URL selection keeps working if storage is denied.
      const nextSearch = withLocaleSearch(registry, search, id);
      persistLocalePreference(registry, id, (value) =>
        window.localStorage.setItem(localePreferenceKey, value),
      );
      if (nextSearch !== search) onSearchChange(nextSearch);
    },
    [registry, search, onSearchChange],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousLang = root.getAttribute("lang");
    const previousDirection = root.getAttribute("dir");
    root.lang = selected.id;
    root.dir = selected.direction;
    return () => {
      if (previousLang === null) root.removeAttribute("lang");
      else root.setAttribute("lang", previousLang);
      if (previousDirection === null) root.removeAttribute("dir");
      else root.setAttribute("dir", previousDirection);
    };
  }, [selected]);

  const fallbacks = useMemo(
    () =>
      registry.getFallbacks(selected.id).map((locale) => ({
        locale: locale.formatLocale,
        messages: Object.hasOwn(catalogs, locale.id)
          ? (catalogs[locale.id] ?? emptyMessages)
          : emptyMessages,
      })),
    [registry, catalogs, selected],
  );
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: selected,
      registry,
      preserveSelection: explicitSelection || selected.id !== registry.sourceLocale,
      setLocale,
    }),
    [selected, registry, explicitSelection, setLocale],
  );

  // Catalogs are bundled synchronously. A missing partial dictionary falls back;
  // the source dictionary is a configuration requirement, never an empty screen.
  if (!Object.hasOwn(catalogs, registry.sourceLocale)) {
    throw new TypeError("The source locale requires a message catalog.");
  }
  const messages = Object.hasOwn(catalogs, selected.id)
    ? (catalogs[selected.id] ?? emptyMessages)
    : emptyMessages;
  return (
    <LocaleContext.Provider value={value}>
      <I18nProvider locale={selected.formatLocale} messages={messages} fallbacks={fallbacks}>
        {children}
      </I18nProvider>
    </LocaleContext.Provider>
  );
}

/** Optional for isolated existing consumers that supply only the translation runtime. */
export function useSiteLocale() {
  return useContext(LocaleContext);
}
