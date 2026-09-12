import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressExample } from "../examples/progress";
const meta = {
  title: "콘텐츠/Progress",
  component: ProgressExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
