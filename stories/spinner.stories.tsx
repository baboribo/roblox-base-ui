import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpinnerExample } from "../examples/spinner";
const meta = { title: "피드백/Spinner", component: SpinnerExample, tags: ["autodocs"] } satisfies Meta<typeof SpinnerExample>;
export default meta;
export const Default: StoryObj<typeof meta> = { name: "기본" };
