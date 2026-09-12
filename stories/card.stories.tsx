import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardExample } from "../examples/card";
const meta = {
  title: "콘텐츠/Card",
  component: CardExample,
  tags: ["autodocs"],
} satisfies Meta<typeof CardExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
