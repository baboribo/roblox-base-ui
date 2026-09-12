import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/storybook",
  outputDir: "test-results-storybook",
  workers: 1,
  timeout: 90000,
  use: { baseURL: "http://127.0.0.1:6007", trace: "retain-on-failure" },
  webServer: {
    command:
      "pnpm exec vite preview --outDir storybook-static --host 127.0.0.1 --port 6007 --strictPort",
    url: "http://127.0.0.1:6007",
    reuseExistingServer: false,
  },
  reporter: "list",
});
