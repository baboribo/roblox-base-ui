import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchExample } from "../examples/switch";
const meta = {
  title: "입력/Switch",
  component: SwitchExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SwitchExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
import { SwitchControlledExample } from "../examples/switch-controlled";
export const Controlled: Story = {
  name: "외부 상태 연결",
  render: () => <SwitchControlledExample />,
};
