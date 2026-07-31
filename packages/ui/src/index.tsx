import type { HTMLAttributes, PropsWithChildren } from "react";

import { Icon } from "@egohygiene/icons";
import { useTheme, themeNames } from "@egohygiene/themes";
import { cn } from "@egohygiene/utilities";

export { Button, LinkButton } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Spinner } from "./components/Spinner";
export { VisuallyHidden } from "./components/VisuallyHidden";

export function Container({
  children,
  className,
}: PropsWithChildren<{ readonly className?: string }>) {
  return <div className={cn("eh-container", className)}>{children}</div>;
}

export function Stack({ children, className }: PropsWithChildren<{ readonly className?: string }>) {
  return <div className={cn("eh-stack", className)}>{children}</div>;
}

export function Cluster({
  children,
  className,
}: PropsWithChildren<{ readonly className?: string }>) {
  return <div className={cn("eh-cluster", className)}>{children}</div>;
}

export function Card({ children, className }: PropsWithChildren<{ readonly className?: string }>) {
  return <article className={cn("eh-card", className)}>{children}</article>;
}

export function StatusBadge({
  children,
  tone = "development",
}: PropsWithChildren<{ readonly tone?: "available" | "development" | "planned" }>) {
  return <span className={cn("eh-badge", `eh-badge--${tone}`)}>{children}</span>;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="eh-theme-toggle">
      <span className="eh-theme-toggle__label">Theme</span>
      <select
        aria-label="Theme"
        className="eh-select"
        onChange={(event) => setTheme(event.target.value as typeof theme)}
        value={theme}
      >
        {themeNames.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon
        decorative
        name={theme === "dark" ? "moon" : theme === "high-contrast" ? "contrast" : "sun"}
      />
    </label>
  );
}

export function PageSection({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section className={cn("eh-section", className)} {...props}>
      {children}
    </section>
  );
}
