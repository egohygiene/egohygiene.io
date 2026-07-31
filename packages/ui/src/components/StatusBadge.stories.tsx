import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusBadge } from "../index";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Available: Story = {
  args: {
    children: "available",
    tone: "available",
  },
};
