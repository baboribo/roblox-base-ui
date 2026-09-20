import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/resilience",
  testMatch: "*.spec.ts",
  outputDir: "test-results/resilience",
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:5198",
    viewport: { width: 1280, height: 800 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec vite --config tests/resilience/vite.config.ts",
    url: "http://127.0.0.1:5198",
    reuseExistingServer: false,
  },
  reporter: "list",
});
