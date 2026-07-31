import { NavLink } from "react-router-dom";

import { Container } from "@egohygiene/ui";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__inner">
          <div>
            <strong>Ego Hygiene</strong>
            <p>
              A small, honest first release focused on balance, self-awareness, empathy, and growth.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="site-footer__links">
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/ecosystem">Ecosystem</NavLink>
              </li>
              <li>
                <a href="https://github.com/egohygiene/website">Repository</a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
