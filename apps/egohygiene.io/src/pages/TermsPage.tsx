import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";

export function TermsPage() {
  const { t } = useI18n();
  return (
    <article className="site-prose">
      <PageMetadata title={t("pages.termsTitle")} description={t("pages.terms.description")} />
      <h1>{t("pages.termsTitle")}</h1>
      <p>{t("pages.terms.intro")}</p>
      <p>{t("pages.terms.use")}</p>
      <p>{t("pages.terms.store")}</p>
      <p>{t("pages.terms.limits")}</p>
    </article>
  );
}
