#!/usr/bin/env node
import { main } from "./add.mjs";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
if (!args.length || args.includes("--help") || args.includes("-h")) {
  console.log(`PLY UI — 컴포넌트 소스를 프로젝트에 추가합니다.

  pnpm dlx ply-ui add button select
  pnpm dlx ply-ui add --all
  pnpm dlx ply-ui list

  --cwd <경로>       대상 프로젝트 (기본: 현재 폴더)
  --src <경로>       소스 폴더 (기본: 프로젝트에서 자동 감지)
  --entry <경로>     스타일을 연결할 시작 파일
  --dry-run          파일과 의존성 변경 계획만 확인
  --overwrite        충돌하는 기존 소스까지 교체
  --no-install       의존성 설치 생략
  --no-setup         소스만 복사하고 시작 파일·의존성은 변경하지 않음

React 19 + TypeScript 프로젝트를 기준으로 합니다.
Next.js App Router와 Vite를 감지하며 다른 구조는 --entry로 지정합니다.
기존 파일에 다른 내용이 있으면 어떤 소스도 쓰기 전에 중단합니다.`);
} else if (args[0] === "--version") {
  console.log(
    JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ).version,
  );
} else {
  try {
    main(args, { setup: true });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
