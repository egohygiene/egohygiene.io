import { useI18n } from "@egohygiene/i18n";
import { Component, type PropsWithChildren, type ReactNode } from "react";

function DefaultErrorFallback() {
  const { t } = useI18n();
  return <p role="alert">{t("errors.unexpected")}</p>;
}

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
      return this.props.fallback ?? <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}
