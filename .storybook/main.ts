import type { StorybookConfig } from "@storybook/react-vite";

const config = {
  stories: [
    "../apps/*/src/**/*.mdx",
    "../apps/*/src/**/*.stories.@(ts|tsx)",
    "../packages/*/src/**/*.mdx",
    "../packages/*/src/**/*.stories.@(ts|tsx)",
  ],

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {
      strictMode: true,
    },
  },

  docs: {
    defaultName: "Documentation",
  },

  core: {
    disableTelemetry: true,
    enableCrashReports: false,
    disableWhatsNewNotifications: true,
  },
} satisfies StorybookConfig;

export default config;

