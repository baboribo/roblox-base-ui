import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListExample } from "../examples/list";
const meta = {
  title: "콘텐츠/List",
  component: ListExample,
  tags: ["autodocs"],
} satisfies Meta<typeof ListExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
