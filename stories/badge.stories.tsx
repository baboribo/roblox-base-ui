import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeExample } from "../examples/badge";
const meta = {
  title: "콘텐츠/Badge",
  component: BadgeExample,
  tags: ["autodocs"],
} satisfies Meta<typeof BadgeExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
