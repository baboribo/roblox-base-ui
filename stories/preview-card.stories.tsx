import type { Meta, StoryObj } from "@storybook/react-vite";
import { PreviewCardExample } from "../examples/preview-card";
const meta = {
  title: "피드백/Preview Card",
  component: PreviewCardExample,
  tags: ["autodocs"],
} satisfies Meta<typeof PreviewCardExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
