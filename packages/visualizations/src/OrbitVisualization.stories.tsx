import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrbitVisualization } from "./index";

const meta = {
  title: "Visualizations/Orbit",
  component: OrbitVisualization,
  args: { size: 220 },
} satisfies Meta<typeof OrbitVisualization>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { size: 140 } };
