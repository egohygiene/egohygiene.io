import { useI18n } from "@egohygiene/i18n";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a className="site-skip-link" href="#main-content">
      {t("shell.skipToContent")}
    </a>
  );
}
