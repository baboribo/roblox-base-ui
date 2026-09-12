import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberFieldExample } from "../examples/number-field";
const meta = {
  title: "입력/Number Field",
  component: NumberFieldExample,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberFieldExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
