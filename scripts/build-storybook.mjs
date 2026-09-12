import { cp, rm, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../storybook-static/", import.meta.url);
const published = new URL("../public/storybook/", import.meta.url);
const result = spawnSync(
  "pnpm",
  ["exec", "storybook", "build", "-o", "storybook-static"],
  {
    cwd: root,
    stdio: "inherit",
  },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// 빌드가 성공한 경우에만 교체합니다. 이전 빌드의 해시 파일도 함께 정리합니다.
await access(new URL("index.html", output));
await access(new URL("iframe.html", output));
await access(new URL("index.json", output));
await rm(published, { recursive: true, force: true });
await cp(output, published, { recursive: true });
console.log("Storybook을 public/storybook에 복사했습니다.");
