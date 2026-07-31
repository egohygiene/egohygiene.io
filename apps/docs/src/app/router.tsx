import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";

import { Container, ThemeToggle } from "@egohygiene/ui";

import architectureSource from "../content/architecture.mdx?raw";
import developmentSource from "../content/development.mdx?raw";
import gettingStartedSource from "../content/getting-started.mdx?raw";
import packagesSource from "../content/packages.mdx?raw";
import { MarkdownPage } from "../components/MarkdownPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

function Layout() {
  return (
    <Container>
      <header className="docs-header">
        <div>
          <h1>Ego Hygiene Docs</h1>
          <p>Minimal platform and workspace documentation.</p>
        </div>
        <ThemeToggle />
      </header>
      <div className="docs-layout">
        <nav aria-label="Documentation navigation" className="docs-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/getting-started">Getting started</NavLink>
          <NavLink to="/architecture">Architecture</NavLink>
          <NavLink to="/development">Development</NavLink>
          <NavLink to="/packages">Packages</NavLink>
        </nav>
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    </Container>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "getting-started",
        element: <MarkdownPage source={gettingStartedSource} title="Getting started" />,
      },
      {
        path: "architecture",
        element: <MarkdownPage source={architectureSource} title="Architecture" />,
      },
      {
        path: "development",
        element: <MarkdownPage source={developmentSource} title="Development" />,
      },
      { path: "packages", element: <MarkdownPage source={packagesSource} title="Packages" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
