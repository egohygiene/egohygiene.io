import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { LocaleLink as Link } from "../i18n/LocaleLink";

export function PrivacyPage() {
  const { t } = useI18n();
  return (
    <article className="site-prose">
      <PageMetadata title={t("pages.privacyTitle")} description={t("pages.privacy.description")} />
      <h1>{t("pages.privacyTitle")}</h1>
      <p>{t("pages.privacy.intro")}</p>
      <p>{t("pages.privacy.current")}</p>
      <p>{t("pages.privacy.preferences")}</p>
      <p>{t("pages.privacy.external")}</p>
      <p>{t("pages.privacy.future")}</p>
      <p>
        <Link to="/help">{t("pages.help.moreHelp")}</Link>
      </p>
    </article>
  );
}
