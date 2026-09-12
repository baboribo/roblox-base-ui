import type { Meta, StoryObj } from "@storybook/react-vite";
import { DialogExample } from "../examples/dialog";
const meta = {
  title: "피드백/Dialog",
  component: DialogExample,
  tags: ["autodocs"],
} satisfies Meta<typeof DialogExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
