import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusMeterExample } from "../examples/status-meter";
const meta = {
  title: "피드백/Status Meter",
  component: StatusMeterExample,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusMeterExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
