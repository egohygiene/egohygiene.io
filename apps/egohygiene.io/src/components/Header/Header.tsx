import { useState } from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "@egohygiene/icons";
import { Container, ThemeToggle } from "@egohygiene/ui";

const routes = [
  ["/", "Home"],
  ["/about", "About"],
  ["/ecosystem", "Ecosystem"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Container>
        <div className="site-header__inner">
          <NavLink className="site-wordmark" to="/">
            Ego Hygiene
          </NavLink>
          <button
            aria-controls="primary-navigation"
            aria-expanded={open}
            className="site-nav-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <Icon decorative name={open ? "close" : "menu"} />
            <span className="eh-visually-hidden">Toggle navigation</span>
          </button>
          <nav aria-label="Primary" className="site-nav" data-open={open} id="primary-navigation">
            <ul>
              {routes.map(([to, label]) => (
                <li key={to}>
                  <NavLink className="site-nav__link" onClick={() => setOpen(false)} to={to}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
