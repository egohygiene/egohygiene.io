import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";

export function AboutPage() {
  const { t } = useI18n();
  return (
    <article className="site-prose">
      <PageMetadata title={t("pages.aboutTitle")} description={t("pages.about.description")} />
      <h1>{t("pages.aboutTitle")}</h1>
      <p>{t("pages.about.intro")}</p>
      <p>{t("pages.about.balance")}</p>
      <p>{t("pages.about.identity")}</p>
      <p>{t("pages.about.progress")}</p>
    </article>
  );
}
