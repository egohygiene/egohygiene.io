import { ThemeProvider } from "@egohygiene/themes";
import { type PropsWithChildren, useCallback, useSyncExternalStore } from "react";
import type { RouterProviderProps } from "react-router-dom";

import { localeRegistry } from "../i18n/config";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { resources } from "../i18n/resources";

const catalogs = { [localeRegistry.sourceLocale]: resources };
const emptySearch = () => "";
const noSubscription = () => () => undefined;

export function AppProviders({
  children,
  router,
}: PropsWithChildren<{
  readonly router?: RouterProviderProps["router"];
}>) {
  const subscribe = useCallback(
    (listener: () => void) => (router ? router.subscribe(listener) : noSubscription()),
    [router],
  );
  const getSearch = useCallback(() => router?.state.location.search ?? "", [router]);
  const search = useSyncExternalStore(subscribe, getSearch, emptySearch);
  const changeSearch = useCallback(
    (nextSearch: string) => {
      if (!router) return;
      const { pathname, hash } = router.state.location;
      void router.navigate({ pathname, search: nextSearch, hash }, { preventScrollReset: true });
    },
    [router],
  );
  return (
    <ThemeProvider>
      <LocaleProvider
        registry={localeRegistry}
        catalogs={catalogs}
        search={search}
        onSearchChange={changeSearch}
      >
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
