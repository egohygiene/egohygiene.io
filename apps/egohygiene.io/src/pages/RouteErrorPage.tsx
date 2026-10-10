import { Link } from "react-router-dom";
import { Container } from "@egohygiene/ui";

export function RouteErrorPage() {
  return (
    <main>
      <Container>
        <h1>This page could not load</h1>
        <p>Please try again, or return to the homepage.</p>
        <p><button type="button" onClick={() => window.location.reload()}>Try again</button></p>
        <Link to="/">Return home</Link>
      </Container>
    </main>
  );
}
