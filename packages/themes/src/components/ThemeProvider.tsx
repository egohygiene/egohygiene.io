import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { isBrowser } from "@egohygiene/utilities";

import { themeNames, type ThemeName } from "../theme.types";

const STORAGE_KEY = "egohygiene-theme";

export interface ThemeContextValue {
  readonly theme: ThemeName;
  readonly resolvedTheme: Exclude<ThemeName, "system">;
  readonly setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function resolveTheme(theme: ThemeName, prefersDark: boolean): Exclude<ThemeName, "system"> {
  if (theme === "system") {
    return prefersDark ? "dark" : "light";
  }

  return theme;
}

export function applyTheme(theme: ThemeName): Exclude<ThemeName, "system"> {
  const prefersDark =
    isBrowser() && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true;
  const resolvedTheme = resolveTheme(theme, prefersDark);

  if (isBrowser()) {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme === "light" ? "light" : "dark";
  }

  return resolvedTheme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (!isBrowser()) {
      return "system";
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return themeNames.includes(storedTheme as ThemeName) ? (storedTheme as ThemeName) : "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<Exclude<ThemeName, "system">>(() =>
    applyTheme(theme),
  );

  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);

    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!isBrowser() || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setResolvedTheme(applyTheme("system"));
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
    }),
    [resolvedTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
