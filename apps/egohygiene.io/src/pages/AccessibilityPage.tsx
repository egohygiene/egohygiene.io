import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { WebsiteFeedback } from "../components/WebsiteFeedback/WebsiteFeedback";
import { LocaleLink as Link } from "../i18n/LocaleLink";

export function AccessibilityPage() {
  const { t } = useI18n();

  return (
    <article className="site-prose">
      <PageMetadata
        title={t("pages.accessibility.title")}
        description={t("pages.accessibility.description")}
      />
      <h1>{t("pages.accessibility.title")}</h1>
      <p>{t("pages.accessibility.intro")}</p>

      <section aria-labelledby="accessibility-using">
        <h2 id="accessibility-using">{t("pages.accessibility.usingHeading")}</h2>
        <p>{t("pages.accessibility.using")}</p>
      </section>

      <section aria-labelledby="accessibility-review">
        <h2 id="accessibility-review">{t("pages.accessibility.reviewHeading")}</h2>
        <p>{t("pages.accessibility.review")}</p>
      </section>

      <section aria-labelledby="accessibility-feedback">
        <h2 id="accessibility-feedback">{t("pages.accessibility.feedbackHeading")}</h2>
        <p>{t("pages.accessibility.feedback")}</p>
        <WebsiteFeedback
          warning={t("pages.websiteFeedback.warning")}
          linkLabel={t("pages.accessibility.feedbackLink")}
        />
      </section>

      <p>
        <Link to="/help">{t("pages.help.moreHelp")}</Link>
      </p>
    </article>
  );
}
