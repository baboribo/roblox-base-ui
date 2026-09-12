import type { StorybookConfig } from "@storybook/react-vite";
export default {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
} satisfies StorybookConfig;
