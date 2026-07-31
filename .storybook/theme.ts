import { create } from "storybook/theming";

export const egoHygieneTheme = create({
  base: "dark",

  brandTitle: "Ego Hygiene",
  brandUrl: "https://egohygiene.io",
  brandTarget: "_blank",

  colorPrimary: "#7c3aed",
  colorSecondary: "#f472b6",

  appBg: "#0d1117",
  appContentBg: "#0d1117",
  appPreviewBg: "#090c10",
  appBorderColor: "#30363d",
  appBorderRadius: 8,

  barBg: "#161b22",
  barTextColor: "#b1bac4",
  barSelectedColor: "#f472b6",
  barHoverColor: "#ffffff",

  inputBg: "#0d1117",
  inputBorder: "#30363d",
  inputTextColor: "#f0f6fc",
  inputBorderRadius: 6,

  textColor: "#f0f6fc",
  textInverseColor: "#0d1117",

  fontBase:
    '"Atkinson Hyperlegible", Inter, ui-sans-serif, system-ui, sans-serif',
  fontCode:
    '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
});

