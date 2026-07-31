import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeProvider } from "@egohygiene/themes";

import { ThemeToggle } from "../index";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
