import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationItemExample } from "../examples/navigation-item";
const meta = {
  title: "탐색/Navigation Item",
  component: NavigationItemExample,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationItemExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
