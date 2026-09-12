import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsExample } from "../examples/settings";
export default {
  title: "조합/설정 화면",
  component: SettingsExample,
} satisfies Meta<typeof SettingsExample>;
export const Default: StoryObj<typeof SettingsExample> = { name: "기본" };
