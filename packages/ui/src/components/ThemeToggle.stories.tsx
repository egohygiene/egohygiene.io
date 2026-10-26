import { ThemeProvider } from "@egohygiene/themes";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { ThemeToggle } from "../index";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  // This story exercises the actual preference owner, including system mode.
  // Disable the preview toolbar/attribute owner to avoid competing root writes.
  parameters: { themes: { disable: true } },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<NonNullable<ComponentProps<typeof ThemeToggle>>>;

export const Default: Story = {};
