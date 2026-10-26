import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameDetailExample } from "../examples/game-detail";
export default {
  title: "조합/게임 상세",
  component: GameDetailExample,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GameDetailExample>;
type Story = StoryObj<typeof GameDetailExample>;
export const Default: Story = { name: "기본" };
export const Loading: Story = { name: "로딩", args: { state: "loading" } };
export const EmptyState: Story = { name: "빈 상태", args: { state: "empty" } };
export const ErrorState: Story = { name: "오류", args: { state: "error" } };
export const LongText: Story = {
  name: "긴 한국어",
  args: { longText: true },
};
