import type { SVGProps } from "react";

import type { IconName } from "./Icon.types";

const paths: Record<IconName, string> = {
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  close: "M6 6l12 12M18 6 6 18",
  external: "M14 5h5v5M10 14 19 5M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5",
  menu: "M4 7h16M4 12h16M4 17h16",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z",
  sparkles:
    "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Zm7 12 1 2.5L22.5 18 20 19l-1 2.5L18 19l-2.5-1 2.5-.5 1-2.5ZM5 15l.8 2 2 .8-2 .7-.8 2-.7-2-2-.7 2-.8.7-2Z",
  sun: "M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  contrast: "M12 3a9 9 0 1 0 0 18V3Z",
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  readonly name: IconName;
  readonly decorative?: boolean;
  readonly label?: string;
}

export function Icon({ decorative = true, label, name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      fill="none"
      height="1em"
      role={decorative ? undefined : "img"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
