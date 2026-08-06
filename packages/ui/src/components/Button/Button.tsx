import type { AnchorHTMLAttributes } from "react";

import { cn } from "@egohygiene/utilities";

import type { ButtonProps } from "./Button.types";

function buttonClassName(tone: NonNullable<ButtonProps["tone"]>, disabled?: boolean) {
  return cn("eh-button", `eh-button--${tone}`, disabled && "eh-button--disabled");
}

export function Button({
  children,
  className,
  disabled,
  icon,
  loading,
  tone = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClassName(tone, disabled || loading), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="eh-spinner" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}

export function LinkButton({
  className,
  href,
  tone = "secondary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { readonly tone?: ButtonProps["tone"] }) {
  return (
    <a className={cn(buttonClassName(tone ?? "secondary"), className)} href={href} {...props} />
  );
}
