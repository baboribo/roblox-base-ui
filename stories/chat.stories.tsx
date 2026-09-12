import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatExample } from "../examples/chat";
const meta = {
  title: "콘텐츠/Chat",
  component: ChatExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ChatExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
