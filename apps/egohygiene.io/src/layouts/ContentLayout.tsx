import type { PropsWithChildren } from "react";

import { Container } from "@egohygiene/ui";

export function ContentLayout({ children }: PropsWithChildren) {
  return <Container>{children}</Container>;
}
