import { Container } from "@egohygiene/ui";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { SkipLink } from "../components/SkipLink/SkipLink";

export function RootLayout() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
