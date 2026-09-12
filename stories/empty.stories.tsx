import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyExample } from "../examples/empty";
const meta = {
  title: "콘텐츠/Empty",
  component: EmptyExample,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
