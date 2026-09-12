import type { Meta, StoryObj } from "@storybook/react-vite";
import { DrawerExample } from "../examples/drawer";
const meta = {
  title: "피드백/Drawer",
  component: DrawerExample,
  tags: ["autodocs"],
} satisfies Meta<typeof DrawerExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
