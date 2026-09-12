import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapsibleExample } from "../examples/collapsible";
const meta = {
  title: "탐색/Collapsible",
  component: CollapsibleExample,
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
