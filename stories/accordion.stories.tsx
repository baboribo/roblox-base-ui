import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccordionExample } from "../examples/accordion";
const meta = {
  title: "탐색/Accordion",
  component: AccordionExample,
  tags: ["autodocs"],
} satisfies Meta<typeof AccordionExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
