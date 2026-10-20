import { useI18n } from "@egohygiene/i18n";

import { useSiteLocale } from "./LocaleProvider";

export function LanguageSelector() {
  const { t } = useI18n();
  const selection = useSiteLocale();
  if (!selection) return null;
  return (
    <label className="site-language-selector">
      <span>{t("shell.language.label")}</span>
      <select
        className="eh-select"
        value={selection.locale.id}
        onChange={(event) => selection.setLocale(event.target.value)}
      >
        {selection.registry.locales.map((locale) => (
          <option key={locale.id} value={locale.id} lang={locale.id} dir={locale.direction}>
            {locale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
