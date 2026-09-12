import type { Meta, StoryObj } from "@storybook/react-vite";
import { OTPExample } from "../examples/otp-field";
const meta = {
  title: "입력/OTP Field",
  component: OTPExample,
  tags: ["autodocs"],
} satisfies Meta<typeof OTPExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
