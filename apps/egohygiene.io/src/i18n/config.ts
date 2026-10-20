import { createLocaleRegistry } from "@egohygiene/i18n";

// Only reviewed public languages belong here. Pseudo/RTL locales live in tests.
export const localeRegistry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [{ id: "en", formatLocale: "en", direction: "ltr", label: "English" }],
});

export const defaultLocale = localeRegistry.sourceLocale;
export const localePreferenceKey = "egohygiene.locale";
export const localeSearchParameter = "lang";
