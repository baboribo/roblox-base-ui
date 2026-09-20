import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationExample } from "../examples/pagination";
const meta = { title: "탐색/Pagination", component: PaginationExample, tags: ["autodocs"] } satisfies Meta<typeof PaginationExample>;
export default meta;
export const Default: StoryObj<typeof meta> = { name: "기본" };
