import type { Meta, StoryObj } from "@storybook/react-vite";
import { PopoverExample } from "../examples/popover";
const meta = {
  title: "피드백/Popover",
  component: PopoverExample,
  tags: ["autodocs"],
} satisfies Meta<typeof PopoverExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
