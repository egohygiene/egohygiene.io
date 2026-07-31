import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, Cluster, Stack } from "../index";

const meta = {
  title: "Foundation/Layout Primitive",
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => (
    <Stack>
      <Cluster>
        <Card>One</Card>
        <Card>Two</Card>
      </Cluster>
    </Stack>
  ),
};
