import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldsetExample } from "../examples/fieldset";
const meta = {
  title: "입력/Fieldset",
  component: FieldsetExample,
  tags: ["autodocs"],
} satisfies Meta<typeof FieldsetExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
