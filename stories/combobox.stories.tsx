import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboboxExample } from "../examples/combobox";
const meta = {
  title: "입력/Combobox",
  component: ComboboxExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ComboboxExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
