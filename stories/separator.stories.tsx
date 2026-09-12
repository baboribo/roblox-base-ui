import type { Meta, StoryObj } from "@storybook/react-vite";
import { SeparatorExample } from "../examples/separator";
const meta = {
  title: "콘텐츠/Separator",
  component: SeparatorExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SeparatorExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
