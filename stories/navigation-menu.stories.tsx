import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenuExample } from "../examples/navigation-menu";
const meta = {
  title: "탐색/Navigation Menu",
  component: NavigationMenuExample,
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenuExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
