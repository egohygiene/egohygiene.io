import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly href?: string;
  readonly icon?: ReactNode;
  readonly loading?: boolean;
  readonly tone?: "primary" | "secondary" | "ghost";
}
