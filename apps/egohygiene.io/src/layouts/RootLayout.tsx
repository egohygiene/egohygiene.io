import { Outlet } from "react-router-dom";

import { Container } from "@egohygiene/ui";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { SkipLink } from "../components/SkipLink/SkipLink";

export function RootLayout() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
