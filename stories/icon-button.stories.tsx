import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButtonExample } from "../examples/icon-button";
const meta = {
  title: "입력/Icon Button",
  component: IconButtonExample,
  tags: ["autodocs"],
} satisfies Meta<typeof IconButtonExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
