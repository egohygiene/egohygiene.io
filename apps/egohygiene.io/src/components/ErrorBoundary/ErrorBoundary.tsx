import { Component, type PropsWithChildren, type ReactNode } from "react";

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{ readonly fallback?: ReactNode }>,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>Something unexpected happened.</p>;
    }

    return this.props.children;
  }
}
