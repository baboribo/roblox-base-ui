import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatHistoryExample } from "../examples/chat-history";
export default {
  title: "조합/대화 기록",
  component: ChatHistoryExample,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatHistoryExample>;
type Story = StoryObj<typeof ChatHistoryExample>;
export const Default: Story = { name: "기본" };
export const Loading: Story = { name: "로딩", args: { state: "loading" } };
export const EmptyState: Story = { name: "빈 상태", args: { state: "empty" } };
export const ErrorState: Story = { name: "오류", args: { state: "error" } };
export const LongText: Story = {
  name: "긴 한국어",
  args: { longText: true },
};
