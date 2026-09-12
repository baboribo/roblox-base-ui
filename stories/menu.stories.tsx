import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuExample } from "../examples/menu";
const meta = {
  title: "피드백/Menu",
  component: MenuExample,
  tags: ["autodocs"],
} satisfies Meta<typeof MenuExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
