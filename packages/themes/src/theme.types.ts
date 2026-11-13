export const themeNames = ["system", "light", "dark", "high-contrast"] as const;

export const themeStorageKey = "egohygiene-theme";

export type ThemeName = (typeof themeNames)[number];
