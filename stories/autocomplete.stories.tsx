import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutocompleteExample } from "../examples/autocomplete";
const meta = {
  title: "입력/Autocomplete",
  component: AutocompleteExample,
  tags: ["autodocs"],
} satisfies Meta<typeof AutocompleteExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
