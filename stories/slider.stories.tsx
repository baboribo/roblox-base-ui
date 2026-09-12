import type { Meta, StoryObj } from "@storybook/react-vite";
import { SliderExample } from "../examples/slider";
const meta = {
  title: "입력/Slider",
  component: SliderExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SliderExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
