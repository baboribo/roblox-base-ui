import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioExample } from "../examples/radio-group";
const meta = {
  title: "입력/Radio Group",
  component: RadioExample,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
