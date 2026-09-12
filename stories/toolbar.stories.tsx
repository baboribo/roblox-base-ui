import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolbarExample } from "../examples/toolbar";
const meta = {
  title: "탐색/Toolbar",
  component: ToolbarExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ToolbarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
