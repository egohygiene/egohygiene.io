import { useI18n } from "@egohygiene/i18n";
import { Container } from "@egohygiene/ui";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { LocaleLink as Link } from "../i18n/LocaleLink";

export function RouteErrorPage() {
  const { t } = useI18n();
  return (
    <main>
      <Container>
        <PageMetadata title={t("errors.routeTitle")} description={t("errors.routeDescription")} />
        <h1>{t("errors.routeTitle")}</h1>
        <p>{t("errors.routeDescription")}</p>
        <p>
          <button type="button" onClick={() => window.location.reload()}>
            {t("errors.retry")}
          </button>
        </p>
        <Link to="/">{t("errors.returnHome")}</Link>
      </Container>
    </main>
  );
}
