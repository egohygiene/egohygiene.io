import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <article className="docs-prose">
      <h1>Not found</h1>
      <p>The requested documentation page does not exist.</p>
      <Link to="/">Return to docs home</Link>
    </article>
  );
}
