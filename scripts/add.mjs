#!/usr/bin/env node
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { kitRoot, componentNames, filesFor } from "./registry-lib.mjs";

/** 1. 옵션 파싱 → 2. 전체 경로/충돌 검사 → 3. 복사. 검사 전에 파일을 쓰지 않습니다. */
function main(args) {
  const [command, ...rest] = args;
  if (command === "list") {
    console.log(componentNames.join("\n"));
    return;
  }
  if (command !== "add")
    throw new Error(
      "사용법: node scripts/add.mjs list | add button dialog [--all] --cwd ../my-app [--src src] [--overwrite] [--dry-run]",
    );
  const names = [];
  let target = process.cwd(),
    src = "src",
    overwrite = false,
    dryRun = false,
    all = false;
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--cwd" || arg === "--src") {
      const value = rest[++i];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} 값이 필요합니다.`);
      if (arg === "--cwd") target = path.resolve(value);
      else src = value;
    } else if (arg === "--overwrite") overwrite = true;
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--all") all = true;
    else if (arg.startsWith("-")) throw new Error(`알 수 없는 옵션: ${arg}`);
    else names.push(arg);
  }
  if (all) names.push(...componentNames);
  if (!names.length) throw new Error("컴포넌트 이름 또는 --all이 필요합니다.");
  if (path.isAbsolute(src) || src.split(/[\\/]/).includes(".."))
    throw new Error("--src는 대상 프로젝트 내부의 상대 경로여야 합니다.");
  target = realpathSync(target);
  const root = path.resolve(target, src);
  const plans = filesFor([...new Set(names)]).map((file) => {
    const dest = path.resolve(root, file.slice(4));
    if (!dest.startsWith(root + path.sep))
      throw new Error("대상 경로가 소스 폴더를 벗어났습니다.");
    // 심볼릭 링크를 따라 프로젝트 외부를 덮어쓰는 일이 없도록 검사합니다.
    for (
      let cursor = dest;
      cursor.startsWith(target + path.sep);
      cursor = path.dirname(cursor)
    ) {
      if (existsSync(cursor) && lstatSync(cursor).isSymbolicLink())
        throw new Error(`심볼릭 링크 경로는 지원하지 않습니다: ${cursor}`);
    }
    const content = readFileSync(path.join(kitRoot, file), "utf8");
    const same =
      existsSync(dest) &&
      lstatSync(dest).isFile() &&
      readFileSync(dest, "utf8") === content;
    if (existsSync(dest) && !same && !overwrite)
      throw new Error(
        `기존 파일을 보존했습니다: ${dest}\n변경 내용을 확인한 뒤 --overwrite를 명시하세요. 아직 어떤 파일도 복사하지 않았습니다.`,
      );
    if (existsSync(dest) && !lstatSync(dest).isFile())
      throw new Error(`파일이 아닌 대상 경로: ${dest}`);
    return { dest, content, same };
  });
  if (dryRun) {
    console.log(
      plans
        .map((item) => `${item.same ? "unchanged" : "copy"} ${item.dest}`)
        .join("\n"),
    );
    return;
  }
  for (const item of plans) {
    if (item.same) continue;
    mkdirSync(path.dirname(item.dest), { recursive: true });
    writeFileSync(item.dest, item.content);
  }
  console.log(
    `${plans.filter((item) => !item.same).length}개 파일 복사, ${plans.filter((item) => item.same).length}개 동일 파일 유지.\n대상: ${root}\n대상 앱에서 npm install @base-ui/react@1.8.0\n앱 진입점에서 styles/theme.css를 import하고 html에 data-theme를 지정하세요.`,
  );
}
try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
