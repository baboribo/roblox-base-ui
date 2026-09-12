import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenubarExample } from "../examples/menubar";
const meta = {
  title: "탐색/Menubar",
  component: MenubarExample,
  tags: ["autodocs"],
} satisfies Meta<typeof MenubarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
