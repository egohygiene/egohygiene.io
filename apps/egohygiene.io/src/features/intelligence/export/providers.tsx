import { ThemeProvider } from "@egohygiene/themes";
import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { localeRegistry } from "../../../i18n/config";
import { LocaleProvider } from "../../../i18n/LocaleProvider";
import common from "../../../i18n/locales/en/common.json";
import errors from "../../../i18n/locales/en/errors.json";
import intelligence from "../../../i18n/locales/en/intelligence.json";
import intelligenceGovernance from "../../../i18n/locales/en/intelligenceGovernance.json";
import { ErrorBoundary } from "../../../components/ErrorBoundary/ErrorBoundary";

const catalogs = { en: { common, errors, intelligence, intelligenceGovernance } };

/** One existing theme/locale runtime, with no commerce dictionaries or state. */
export function IntelligenceExportProviders({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  return <ThemeProvider><LocaleProvider registry={localeRegistry} catalogs={catalogs} search={location.search}
    onSearchChange={(search) => void navigate({ pathname: location.pathname, search, hash: location.hash }, { preventScrollReset: true })}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </LocaleProvider></ThemeProvider>;
}
