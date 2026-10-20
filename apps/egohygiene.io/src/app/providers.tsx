import { I18nProvider } from "@egohygiene/i18n";
import { ThemeProvider } from "@egohygiene/themes";
import type { PropsWithChildren } from "react";

import { localeRegistry } from "../i18n/config";
import { resources } from "../i18n/resources";

export function AppProviders({ children }: PropsWithChildren) {
  const source = localeRegistry.resolve();
  return (
    <ThemeProvider>
      <I18nProvider locale={source.formatLocale} messages={resources}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
