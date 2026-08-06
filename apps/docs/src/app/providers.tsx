import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@egohygiene/themes";

export function AppProviders({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
