import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";
const withMDX = createMDX();
export default withMDX({
  reactStrictMode: true,
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.mdx?$/,
      enforce: "pre",
      use: [
        fileURLToPath(
          new URL("./scripts/mdx-source-dependencies.cjs", import.meta.url),
        ),
      ],
    });
    return config;
  },
  async redirects() {
    // index.html로 이동하면 Storybook의 상대 경로가 /storybook/ 아래에서 해석됩니다.
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: true,
      },
    ];
  },
});
