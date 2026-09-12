import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenuExample } from "../examples/context-menu";
const meta = {
  title: "피드백/Context Menu",
  component: ContextMenuExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenuExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
