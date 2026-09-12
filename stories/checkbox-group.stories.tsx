import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroupExample } from "../examples/checkbox-group";
const meta = {
  title: "입력/Checkbox Group",
  component: CheckboxGroupExample,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroupExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
