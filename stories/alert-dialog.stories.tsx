import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialogExample } from "../examples/alert-dialog";
const meta = {
  title: "피드백/Alert Dialog",
  component: AlertDialogExample,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialogExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
