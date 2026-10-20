import { useI18n } from "@egohygiene/i18n";
import { Icon } from "@egohygiene/icons";
import { Container, ThemeToggle } from "@egohygiene/ui";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { LanguageSelector } from "../../i18n/LanguageSelector";
import { LocaleNavLink as NavLink } from "../../i18n/LocaleLink";

const routes = [
  ["/", "home"],
  ["/store", "store"],
  ["/about", "about"],
  ["/ecosystem", "ecosystem"],
] as const;

function HeaderNavigation() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("focusin", closeOnOutsideFocus);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("focusin", closeOnOutsideFocus);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <Container>
        <div className="site-header__inner">
          <NavLink className="site-wordmark" onClick={() => setOpen(false)} to="/">
            <img alt="" height="42" src="/icons/icon-192x192.png" width="42" />
            <span>{t("shell.brand")}</span>
          </NavLink>
          <button
            aria-controls="primary-navigation"
            aria-expanded={open}
            className="site-nav-toggle"
            onClick={() => setOpen((value) => !value)}
            ref={toggleRef}
            type="button"
          >
            <Icon decorative name={open ? "close" : "menu"} />
            <span className="eh-visually-hidden">
              {t(open ? "shell.navigation.close" : "shell.navigation.open")}
            </span>
          </button>
          <nav
            aria-label={t("shell.navigation.label")}
            className="site-nav"
            data-open={open}
            id="primary-navigation"
          >
            <ul>
              {routes.map(([to, key]) => (
                <li key={to}>
                  <NavLink
                    className="site-nav__link"
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    to={to}
                  >
                    {t(`shell.navigation.${key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <LanguageSelector />
            <ThemeToggle
              label={t("shell.theme.label")}
              labels={{
                system: t("shell.theme.system"),
                light: t("shell.theme.light"),
                dark: t("shell.theme.dark"),
                "high-contrast": t("shell.theme.highContrast"),
              }}
            />
          </nav>
        </div>
      </Container>
    </header>
  );
}

export function Header() {
  const location = useLocation();
  // A route change resets the disclosure. Same-page language changes retain focus
  // on the native selector, including inside the mobile navigation.
  return <HeaderNavigation key={location.pathname} />;
}
