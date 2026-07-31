import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

import { egoHygieneTheme } from "./theme";

const preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
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

