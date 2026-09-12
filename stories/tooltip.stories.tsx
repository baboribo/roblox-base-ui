import type { Meta, StoryObj } from "@storybook/react-vite";
import { TooltipExample } from "../examples/tooltip";
const meta = {
  title: "피드백/Tooltip",
  component: TooltipExample,
  tags: ["autodocs"],
} satisfies Meta<typeof TooltipExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
