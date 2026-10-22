import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { LocaleLink as Link } from "../i18n/LocaleLink";

/** Store guidance only; reviewed order-support links belong to each available product. */
export function StoreHelpPage() {
  const { t } = useI18n();

  return (
    <article className="site-prose">
      <PageMetadata
        title={t("pages.storeHelp.title")}
        description={t("pages.storeHelp.description")}
      />
      <h1>{t("pages.storeHelp.title")}</h1>
      <p>{t("pages.storeHelp.intro")}</p>

      <section aria-labelledby="store-help-products">
        <h2 id="store-help-products">{t("pages.storeHelp.productsHeading")}</h2>
        <p>{t("pages.storeHelp.products")}</p>
        <p>{t("pages.storeHelp.previews")}</p>
        <p>{t("pages.storeHelp.images")}</p>
      </section>

      <section aria-labelledby="store-help-checkout">
        <h2 id="store-help-checkout">{t("pages.storeHelp.checkoutHeading")}</h2>
        <p>{t("pages.storeHelp.checkout")}</p>
        <p>{t("pages.storeHelp.options")}</p>
        <p>{t("pages.storeHelp.delivery")}</p>
      </section>

      <section aria-labelledby="store-help-orders">
        <h2 id="store-help-orders">{t("pages.storeHelp.ordersHeading")}</h2>
        <p>{t("pages.storeHelp.orders")}</p>
        <p>{t("pages.storeHelp.orderPrivacy")}</p>
      </section>

      <section aria-labelledby="store-help-website">
        <h2 id="store-help-website">{t("pages.storeHelp.websiteHeading")}</h2>
        <p>{t("pages.storeHelp.website")}</p>
        <p id="store-help-feedback-warning">{t("pages.storeHelp.feedbackWarning")}</p>
        <p>
          <a
            href="https://github.com/egohygiene/egohygiene.io/issues/new"
            rel="external"
            aria-describedby="store-help-feedback-warning"
          >
            {t("pages.storeHelp.feedbackLink")}
          </a>
        </p>
      </section>

      <section aria-labelledby="store-help-policies">
        <h2 id="store-help-policies">{t("pages.storeHelp.policiesHeading")}</h2>
        <p>{t("pages.storeHelp.policies")}</p>
        <ul>
          <li>
            <Link to="/privacy">{t("pages.privacyTitle")}</Link>
          </li>
          <li>
            <Link to="/terms">{t("pages.termsTitle")}</Link>
          </li>
        </ul>
      </section>
      <p>
        <Link to="/store">{t("pages.storeHelp.back")}</Link>
      </p>
    </article>
  );
}
