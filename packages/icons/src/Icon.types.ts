export const iconNames = [
  "arrow-right",
  "close",
  "external",
  "menu",
  "moon",
  "sparkles",
  "sun",
  "contrast",
] as const;

export type IconName = (typeof iconNames)[number];
