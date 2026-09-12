import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollAreaExample } from "../examples/scroll-area";
const meta = {
  title: "콘텐츠/Scroll Area",
  component: ScrollAreaExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollAreaExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
