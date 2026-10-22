import type { LocaleDefinition, LocaleRegistry } from "@egohygiene/i18n";

import { localeSearchParameter } from "./config";

function findRegisteredLocale(
  registry: LocaleRegistry,
  candidate: string | null | undefined,
): LocaleDefinition | undefined {
  if (!candidate) return undefined;
  try {
    const [id] = Intl.getCanonicalLocales(candidate);
    return registry.locales.find((locale) => locale.id === id);
  } catch {
    return undefined;
  }
}

export function getRequestedLocale(
  registry: LocaleRegistry,
  search: string,
): LocaleDefinition | undefined {
  const values = new URLSearchParams(search).getAll(localeSearchParameter);
  return values.length === 1 ? findRegisteredLocale(registry, values[0]) : undefined;
}

/** URL selection, then an optional saved preference, then the source locale. */
export function resolveLocaleSelection(
  registry: LocaleRegistry,
  search: string,
  readPreference?: () => string | null,
): LocaleDefinition {
  const requested = getRequestedLocale(registry, search);
  if (requested) return requested;

  // The callback also encloses access to window.localStorage itself, whose getter
  // can throw. Neither this module nor the shared runtime reads browser globals.
  try {
    const saved = findRegisteredLocale(registry, readPreference?.());
    if (saved) return saved;
  } catch {
    // Preference persistence is optional; denied storage must not block rendering.
  }
  return registry.resolve();
}

/** Preserve filters; an explicit source choice remains shareable as ?lang=en. */
export function withLocaleSearch(registry: LocaleRegistry, search: string, locale: string): string {
  const selected = findRegisteredLocale(registry, locale);
  if (!selected) throw new RangeError(`Locale is not registered: ${locale}`);
  const parameters = new URLSearchParams(search);
  parameters.set(localeSearchParameter, selected.id);
  return `?${parameters.toString()}`;
}

/** Validate first and treat storage rejection as a recoverable preference failure. */
export function persistLocalePreference(
  registry: LocaleRegistry,
  locale: string,
  writePreference: (locale: string) => void,
): boolean {
  const selected = findRegisteredLocale(registry, locale);
  if (!selected) return false;
  try {
    writePreference(selected.id);
    return true;
  } catch {
    return false;
  }
}
