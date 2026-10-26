import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemorySettingsExample } from "../examples/memory-settings";
export default {
  title: "조합/기억·설정",
  component: MemorySettingsExample,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MemorySettingsExample>;
type Story = StoryObj<typeof MemorySettingsExample>;
export const Default: Story = { name: "기본" };
export const Loading: Story = { name: "로딩", args: { state: "loading" } };
export const EmptyState: Story = { name: "빈 상태", args: { state: "empty" } };
export const ErrorState: Story = { name: "오류", args: { state: "error" } };
export const LongText: Story = {
  name: "긴 한국어",
  args: { longText: true },
};
export const WallpaperTab: Story = {
  name: "배경",
  args: { tab: "wallpaper" },
};
export const ProfileError: Story = {
  name: "입력 폼 오류",
  args: { state: "error", tab: "profile" },
};
