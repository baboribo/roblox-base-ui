import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarExample } from "../examples/sidebar";
const meta = {
  title: "탐색/Sidebar",
  component: SidebarExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
import { SidebarResponsiveExample } from "../examples/sidebar-responsive";
export const Controlled: Story = {
  name: "반응형",
  render: () => <SidebarResponsiveExample />,
};
