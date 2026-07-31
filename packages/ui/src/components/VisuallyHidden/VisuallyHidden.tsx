import type { PropsWithChildren } from "react";

export function VisuallyHidden({ children }: PropsWithChildren) {
  return <span className="eh-visually-hidden">{children}</span>;
}
