import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabsExample } from "../examples/tabs";
const meta = {
  title: "탐색/Tabs",
  component: TabsExample,
  tags: ["autodocs"],
} satisfies Meta<typeof TabsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
