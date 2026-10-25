import { useI18n } from "@egohygiene/i18n";
import { Container } from "@egohygiene/ui";
import { LocaleNavLink as NavLink } from "../../i18n/LocaleLink";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__inner">
          <div className="site-footer__identity">
            <NavLink className="site-wordmark" to="/">
              <img alt="" height="42" src="/icons/icon-192x192.png" width="42" />
              <span>{t("shell.brand")}</span>
            </NavLink>
            <p>{t("shell.footer.statement")}</p>
          </div>
          <nav aria-label={t("shell.footer.navigation")}>
            <ul className="site-footer__links">
              <li>
                <NavLink to="/store">{t("shell.footer.store")}</NavLink>
              </li>
              <li>
                <NavLink to="/store/help">{t("shell.footer.storeHelp")}</NavLink>
              </li>
              <li>
                <NavLink to="/help">{t("shell.footer.help")}</NavLink>
              </li>
              <li>
                <NavLink to="/accessibility">{t("shell.footer.accessibility")}</NavLink>
              </li>
              <li>
                <NavLink to="/about">{t("shell.navigation.about")}</NavLink>
              </li>
              <li>
                <NavLink to="/ecosystem">{t("shell.navigation.ecosystem")}</NavLink>
              </li>
              <li>
                <a href="https://github.com/egohygiene/egohygiene.io">
                  {t("shell.footer.repository")}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="site-footer__bottom">
          <p>{t("shell.footer.signature")}</p>
          <nav aria-label={t("shell.footer.legal")}>
            <ul className="site-footer__legal">
              <li>
                <NavLink to="/privacy">{t("shell.footer.privacy")}</NavLink>
              </li>
              <li>
                <NavLink to="/terms">{t("shell.footer.terms")}</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
