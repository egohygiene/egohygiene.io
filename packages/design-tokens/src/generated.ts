export const tokens = {
  "color": {
    "background": "#f6f1ff",
    "surface": "#ffffff",
    "foreground": "#1f1633",
    "muted": "#6c6480",
    "accent": "#9b5de5",
    "accentStrong": "#7b2cbf",
    "border": "#d9caef",
    "focus": "#ff7ac6",
    "success": "#0f9d84",
    "warning": "#d97706",
    "danger": "#dc2626",
    "darkBackground": "#120d1f",
    "darkSurface": "#1c1530",
    "darkForeground": "#f9f5ff",
    "darkMuted": "#cbbcdf",
    "highContrastBackground": "#000000",
    "highContrastSurface": "#0f0f0f",
    "highContrastForeground": "#ffffff",
    "highContrastAccent": "#ffd60a"
  },
  "spacing": {
    "2xs": "0.25rem",
    "xs": "0.5rem",
    "sm": "0.75rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  },
  "size": {
    "container": "72rem",
    "content": "52rem",
    "radiusSm": "0.5rem",
    "radiusMd": "0.75rem",
    "radiusLg": "1.25rem",
    "icon": "1.25rem"
  },
  "border": {
    "width": "1px",
    "widthStrong": "2px"
  },
  "shadow": {
    "card": "0 14px 36px rgba(38, 12, 77, 0.12)",
    "focus": "0 0 0 4px rgba(255, 122, 198, 0.35)"
  },
  "typography": {
    "fontSans": "Inter, ui-sans-serif, system-ui, sans-serif",
    "fontMono": "ui-monospace, SFMono-Regular, Menlo, monospace",
    "sizeSm": "0.875rem",
    "sizeMd": "1rem",
    "sizeLg": "1.125rem",
    "sizeXl": "1.5rem",
    "size2xl": "2.25rem",
    "size3xl": "3.5rem",
    "lineHeight": "1.6"
  },
  "motion": {
    "fast": "120ms",
    "base": "180ms",
    "slow": "280ms"
  }
} as const;
export type Tokens = typeof tokens;
