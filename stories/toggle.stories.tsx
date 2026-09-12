import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleExample } from "../examples/toggle";
const meta = {
  title: "탐색/Toggle",
  component: ToggleExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
