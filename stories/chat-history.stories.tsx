import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatHistoryExample } from "../examples/chat-history";
export default {
  title: "조합/대화 기록",
  component: ChatHistoryExample,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChatHistoryExample>;
type Story = StoryObj<typeof ChatHistoryExample>;
export const Default: Story = { name: "기본" };
// 좁은 화면에서도 상태가 보이게 대화 기록을 연 채로 시작합니다.
export const Loading: Story = {
  name: "로딩",
  args: { state: "loading", sidebarOpen: true },
};
export const EmptyState: Story = {
  name: "빈 상태",
  args: { state: "empty", sidebarOpen: true },
};
export const ErrorState: Story = {
  name: "오류",
  args: { state: "error", sidebarOpen: true },
};
export const LongText: Story = {
  name: "긴 한국어",
  args: { longText: true, sidebarOpen: true },
};
