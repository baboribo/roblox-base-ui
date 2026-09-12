import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconExample } from "../examples/icon";
const meta = {
  title: "콘텐츠/Icon",
  component: IconExample,
  tags: ["autodocs"],
} satisfies Meta<typeof IconExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
