import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <article className="site-prose">
      <h1>Page not found</h1>
      <p>The route you requested is not available yet.</p>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </article>
  );
}
