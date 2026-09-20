import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutExample } from "../examples/layout";
const meta = {
  title: "레이아웃/Layout",
  component: LayoutExample,
  tags: ["autodocs"],
} satisfies Meta<typeof LayoutExample>;
export default meta;
export const Default: StoryObj<typeof meta> = { name: "기본" };
