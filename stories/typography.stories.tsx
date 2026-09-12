import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypographyExample } from "../examples/typography";
const meta = {
  title: "콘텐츠/Typography",
  component: TypographyExample,
  tags: ["autodocs"],
} satisfies Meta<typeof TypographyExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
