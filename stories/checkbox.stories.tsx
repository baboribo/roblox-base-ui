import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxExample } from "../examples/checkbox";
const meta = {
  title: "입력/Checkbox",
  component: CheckboxExample,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
