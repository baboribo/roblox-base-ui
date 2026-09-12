import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaExample } from "../examples/textarea";
const meta = {
  title: "입력/Textarea",
  component: TextareaExample,
  tags: ["autodocs"],
} satisfies Meta<typeof TextareaExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
