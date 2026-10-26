import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameDiscoveryExample } from "../examples/game-discovery";
export default {
  title: "조합/게임 탐색",
  component: GameDiscoveryExample,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameDiscoveryExample>;
type Story = StoryObj<typeof GameDiscoveryExample>;
export const Default: Story = { name: "기본" };
export const Loading: Story = { name: "로딩", args: { state: "loading" } };
export const EmptyState: Story = { name: "빈 상태", args: { state: "empty" } };
export const ErrorState: Story = { name: "오류", args: { state: "error" } };
export const LongText: Story = {
  name: "긴 한국어",
  args: { longText: true },
};
