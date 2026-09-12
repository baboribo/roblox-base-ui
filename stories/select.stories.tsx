import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectExample } from "../examples/select";
const meta = {
  title: "입력/Select",
  component: SelectExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
