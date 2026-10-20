import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { LocaleLink as Link } from "../i18n/LocaleLink";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <article className="site-prose">
      <PageMetadata
        title={t("errors.notFoundTitle")}
        description={t("errors.notFoundDescription")}
      />
      <h1>{t("errors.notFoundTitle")}</h1>
      <p>{t("errors.notFoundDescription")}</p>
      <p>
        <Link to="/">{t("errors.returnHome")}</Link>
      </p>
    </article>
  );
}
