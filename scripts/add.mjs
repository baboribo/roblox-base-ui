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
import { fileURLToPath } from "node:url";
import { planSetup, installDependencies } from "./install-setup.mjs";
import { kitRoot, componentNames, filesFor } from "./registry-lib.mjs";

/** 1. 옵션 파싱 → 2. 전체 경로/충돌 검사 → 3. 복사. 검사 전에 파일을 쓰지 않습니다. */
export function main(args, { setup = false } = {}) {
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
    src,
    entry,
    noInstall = false,
    overwrite = false,
    dryRun = false,
    all = false;
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--cwd" || arg === "--src" || arg === "--entry") {
      const value = rest[++i];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} 값이 필요합니다.`);
      if (arg === "--cwd") target = path.resolve(value);
      else if (arg === "--entry") entry = value;
      else src = value;
    } else if (arg === "--no-install") noInstall = true;
    else if (arg === "--no-setup") setup = false;
    else if (arg === "--overwrite") overwrite = true;
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--all") all = true;
    else if (arg.startsWith("-")) throw new Error(`알 수 없는 옵션: ${arg}`);
    else names.push(arg);
  }
  if (all) names.push(...componentNames);
  if (!names.length) throw new Error("컴포넌트 이름 또는 --all이 필요합니다.");
  target = realpathSync(target);
  const setupPlan = setup ? planSetup({ target, src, entry, noInstall }) : null;
  src = setupPlan?.src ?? src ?? "src";
  if (path.isAbsolute(src) || src.split(/[\\/]/).includes(".."))
    throw new Error("--src는 대상 프로젝트 내부의 상대 경로여야 합니다.");
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
      if (lstatSync(cursor, { throwIfNoEntry: false })?.isSymbolicLink())
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
  // 시작 파일·설정 파일도 복사 대상과 함께 검사하고 dry-run에 표시합니다.
  for (const item of setupPlan?.files ?? []) {
    if (plans.some((plan) => plan.dest === item.dest))
      throw new Error(
        "시작 파일을 설치할 컴포넌트 파일과 같은 경로로 지정할 수 없습니다.",
      );
    for (
      let cursor = item.dest;
      cursor.startsWith(target + path.sep);
      cursor = path.dirname(cursor)
    ) {
      if (lstatSync(cursor, { throwIfNoEntry: false })?.isSymbolicLink())
        throw new Error(`심볼릭 링크 경로는 지원하지 않습니다: ${cursor}`);
    }
    if (existsSync(item.dest) && !lstatSync(item.dest).isFile())
      throw new Error(`파일이 아닌 대상 경로: ${item.dest}`);
    plans.push(item);
  }
  if (dryRun) {
    console.log(
      plans
        .map((item) => `${item.same ? "unchanged" : "copy"} ${item.dest}`)
        .join("\n"),
    );
    if (setupPlan?.dependency) console.log(`install ${setupPlan.dependency}`);
    return;
  }
  // 의존성 설치에 실패하면 소스와 시작 파일은 쓰지 않습니다.
  if (setupPlan) installDependencies(setupPlan);
  for (const item of plans) {
    if (item.same) continue;
    mkdirSync(path.dirname(item.dest), { recursive: true });
    writeFileSync(item.dest, item.content);
  }
  if (setupPlan) {
    const first = [...new Set(names)][0];
    const source = readFileSync(
      path.join(kitRoot, `src/components/ui/${first}.tsx`),
      "utf8",
    );
    const symbol = source.match(/\bexport\s+(?:const|function)\s+(\w+)/)?.[1];
    const importPath = setupPlan.exampleImport.replace(
      /\/button$/,
      `/${first}`,
    );
    console.log(
      `PLY: ${plans.filter((item) => !item.same).length}개 파일 반영. ${setupPlan.entry}에 스타일 연결.\n소스: ${root}\n예: import { ${symbol ?? "컴포넌트"} } from "${importPath}";`,
    );
    if (noInstall)
      console.log("의존성 설치 생략: @base-ui/react@^1.8.0을 직접 설치하세요.");
    return;
  }
  console.log(
    `${plans.filter((item) => !item.same).length}개 파일 복사, ${plans.filter((item) => item.same).length}개 동일 파일 유지.\n대상: ${root}\n대상 앱에서 pnpm add @base-ui/react@1.8.0\n앱 진입점에서 styles/theme.css를 import하고 html에 data-theme를 지정하세요.`,
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
