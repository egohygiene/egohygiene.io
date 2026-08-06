import type { PropsWithChildren } from "react";

import { I18nProvider } from "@egohygiene/i18n";
import { ThemeProvider } from "@egohygiene/themes";

import { resources } from "../i18n/resources";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <I18nProvider messages={resources}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
