import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroupExample } from "../examples/toggle-group";
const meta = {
  title: "탐색/Toggle Group",
  component: ToggleGroupExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroupExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
