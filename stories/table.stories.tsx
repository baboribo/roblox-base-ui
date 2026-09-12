import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableExample } from "../examples/table";
const meta = {
  title: "콘텐츠/Table",
  component: TableExample,
  tags: ["autodocs"],
} satisfies Meta<typeof TableExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
