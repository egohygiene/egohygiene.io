import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, LinkButton } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Explore the ecosystem",
  },
};

export const SecondaryLink: Story = {
  render: () => <LinkButton href="#">Read the docs</LinkButton>,
};
