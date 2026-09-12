import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbExample } from "../examples/breadcrumb";
const meta = {
  title: "탐색/Breadcrumb",
  component: BreadcrumbExample,
  tags: ["autodocs"],
} satisfies Meta<typeof BreadcrumbExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
