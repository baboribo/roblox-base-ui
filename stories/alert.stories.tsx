import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertExample } from "../examples/alert";
const meta = {
  title: "콘텐츠/Alert",
  component: AlertExample,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
