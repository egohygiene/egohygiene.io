export function HomePage() {
  return (
    <article className="docs-prose">
      <h1>Documentation</h1>
      <p>
        This repository contains the primary Ego Hygiene website, a documentation app, a playground
        app, and shared packages.
      </p>
      <ul>
        <li>
          Install with <code>pnpm install --frozen-lockfile</code>.
        </li>
        <li>
          Run the site with <code>pnpm --filter @egohygiene/egohygiene.io dev</code>.
        </li>
        <li>
          Run tests with <code>pnpm test</code> and <code>pnpm test:e2e</code>.
        </li>
      </ul>
    </article>
  );
}
