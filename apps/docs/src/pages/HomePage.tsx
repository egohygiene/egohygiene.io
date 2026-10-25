import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <article className="docs-prose">
      <h1>Documentation</h1>
      <p>
        This repository contains the public Ego Hygiene website/store, a documentation app, a
        playground app, and shared packages.
      </p>
      <p>
        <Link to="/getting-started">Read the setup instructions</Link> for the pinned Node and pnpm
        versions and a locked dependency installation.
      </p>
      <ul>
        <li>
          <code>pnpm dev</code> starts the website/store.
        </li>
        <li>
          <code>pnpm --filter @egohygiene/docs dev</code> starts this documentation app.
        </li>
        <li>
          <Link to="/development">Read the development guide</Link> for separate app builds, content
          checks and the scope of wider tests.
        </li>
      </ul>
    </article>
  );
}
