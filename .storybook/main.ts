import type { StorybookConfig } from "@storybook/react-vite";
export default {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  // 이미지는 import 또는 data URI로 제공합니다. public/storybook 재복사를 막습니다.
  staticDirs: [],
  async viteFinal(config, { configType }) {
    return {
      ...config,
      base: "./",
      publicDir: false,
      // 별도 개발 서버에서도 예제의 /docs 링크는 문서 서버로 연결합니다.
      server:
        configType === "DEVELOPMENT"
          ? {
              ...config.server,
              proxy: {
                ...config.server?.proxy,
                ...Object.fromEntries(
                  [
                    "/docs",
                    "/_next",
                    "/api/search",
                    "/preview",
                    "/r",
                    "/storybook",
                  ].map((prefix) => [
                    prefix,
                    { target: "http://127.0.0.1:5173", changeOrigin: true },
                  ]),
                ),
              },
            }
          : config.server,
    };
  },
  core: { disableTelemetry: true },
} satisfies StorybookConfig;
