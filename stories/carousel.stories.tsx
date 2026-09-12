import type { Meta, StoryObj } from "@storybook/react-vite";
import { CarouselExample } from "../examples/carousel";
const meta = {
  title: "콘텐츠/Carousel",
  component: CarouselExample,
  tags: ["autodocs"],
} satisfies Meta<typeof CarouselExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
