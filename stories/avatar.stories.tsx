import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarExample } from "../examples/avatar";
const meta = {
  title: "콘텐츠/Avatar",
  component: AvatarExample,
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
