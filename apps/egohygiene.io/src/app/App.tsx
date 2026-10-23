import type { PropsWithChildren } from "react";

import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

/** The same application boundary wraps the browser and build-time router providers. */
export function App({ children }: PropsWithChildren) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
