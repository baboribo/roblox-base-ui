import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastExample } from "../examples/toast";
const meta = {
  title: "피드백/Toast",
  component: ToastExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ToastExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
