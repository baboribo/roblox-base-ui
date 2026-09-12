import type { Meta, StoryObj } from "@storybook/react-vite";
import { MeterExample } from "../examples/meter";
const meta = {
  title: "콘텐츠/Meter",
  component: MeterExample,
  tags: ["autodocs"],
} satisfies Meta<typeof MeterExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
