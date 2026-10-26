import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  testIgnore: ["**/storybook/**", "**/resilience/**"],
  timeout: 60000,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:5174",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec next start --hostname 127.0.0.1 --port 5174",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
    timeout: 60000,
  },
  projects: [
    { name: "ui", grepInvert: /@isolated/ },
    // 무거운 검사는 다른 검사가 모두 끝난 뒤 혼자 실행해 서로의 시간 제한을 침범하지 않게 합니다.
    { name: "isolated", grep: /@isolated/, dependencies: ["ui"] },
  ],
  reporter: "list",
});
