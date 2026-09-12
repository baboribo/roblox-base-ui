import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonExample } from "../examples/skeleton";
const meta = {
  title: "콘텐츠/Skeleton",
  component: SkeletonExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SkeletonExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
