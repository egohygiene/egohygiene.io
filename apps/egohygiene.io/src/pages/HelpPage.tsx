import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { WebsiteFeedback } from "../components/WebsiteFeedback/WebsiteFeedback";
import { LocaleLink as Link } from "../i18n/LocaleLink";

export function HelpPage() {
  const { t } = useI18n();

  return (
    <article className="site-prose">
      <PageMetadata title={t("pages.help.title")} description={t("pages.help.description")} />
      <h1>{t("pages.help.title")}</h1>
      <p>{t("pages.help.intro")}</p>

      <section aria-labelledby="help-explore">
        <h2 id="help-explore">{t("pages.help.exploreHeading")}</h2>
        <p>{t("pages.help.explore")}</p>
        <ul>
          <li>
            <Link to="/about">{t("pages.aboutTitle")}</Link>
          </li>
          <li>
            <Link to="/store/help">{t("pages.storeHelp.title")}</Link>
          </li>
          <li>
            <Link to="/accessibility">{t("pages.help.accessibilityLink")}</Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="help-feedback">
        <h2 id="help-feedback">{t("pages.help.feedbackHeading")}</h2>
        <p>{t("pages.help.feedback")}</p>
        <WebsiteFeedback
          warning={t("pages.websiteFeedback.warning")}
          linkLabel={t("pages.websiteFeedback.link")}
        />
      </section>

      <section aria-labelledby="help-orders">
        <h2 id="help-orders">{t("pages.help.ordersHeading")}</h2>
        <p>{t("pages.help.orders")}</p>
        <p>
          <Link to="/store/help">{t("pages.help.storeHelpLink")}</Link>
        </p>
      </section>

      <section aria-labelledby="help-policies">
        <h2 id="help-policies">{t("pages.help.policiesHeading")}</h2>
        <p>{t("pages.help.policies")}</p>
        <ul>
          <li>
            <Link to="/privacy">{t("pages.privacyTitle")}</Link>
          </li>
          <li>
            <Link to="/terms">{t("pages.termsTitle")}</Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
