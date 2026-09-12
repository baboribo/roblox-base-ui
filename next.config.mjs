import { createMDX } from "fumadocs-mdx/next";
const withMDX = createMDX();
export default withMDX({
  reactStrictMode: true,
  devIndicators: false,
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
