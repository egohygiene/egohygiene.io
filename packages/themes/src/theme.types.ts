export const themeNames = ["system", "light", "dark", "high-contrast"] as const;

export type ThemeName = (typeof themeNames)[number];
