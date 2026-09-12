import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldExample } from "../examples/field";
const meta = {
  title: "입력/Field",
  component: FieldExample,
  tags: ["autodocs"],
} satisfies Meta<typeof FieldExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
