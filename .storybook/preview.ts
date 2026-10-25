import { DecoratorHelpers } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { useEffect } from "storybook/preview-api";

import "@egohygiene/ui/styles.css";
import "@egohygiene/visualizations/styles.css";

import { egoHygieneTheme } from "./theme";

const previewThemes = ["light", "dark", "high-contrast"] as const;
DecoratorHelpers.initializeThemeState([...previewThemes], "dark");

const preview = {
  decorators: [
    (Story, context) => {
      const { disable = false, themeOverride } = context.parameters["themes"] ?? {};
      const selected = themeOverride || DecoratorHelpers.pluckThemeFromContext(context);
      const theme = previewThemes.find((name) => name === selected) ?? "dark";

      // Always call the hook. Provider-owned stories opt out inside the effect,
      // so the toolbar and a real ThemeProvider never compete for the root.
      useEffect(() => {
        if (disable) return;
        document.documentElement.dataset["theme"] = theme;
        // A preceding provider story may have set an inline color scheme.
        // Let the selected semantic theme stylesheet own it again.
        document.documentElement.style.removeProperty("color-scheme");
      }, [disable, theme]);

      return Story();
    },
  ],

  parameters: {
    a11y: {
      test: "error",
    },

    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      theme: egoHygieneTheme,
    },

    layout: "padded",

    options: {
      storySort: {
        order: [
          "Foundation",
          "Components",
          "Patterns",
          "Features",
          "Visualizations",
          "Pages",
          "Examples",
          "*",
        ],
      },
    },
  },

  tags: ["autodocs"],
} satisfies Preview;

export default preview;
