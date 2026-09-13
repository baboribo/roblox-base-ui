import { existsSync, lstatSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

function inside(target, relative, label) {
  if (
    typeof relative !== "string" ||
    path.isAbsolute(relative) ||
    relative.split(/[\\/]/).includes("..")
  )
    throw new Error(`${label}는 프로젝트 내부의 상대 경로여야 합니다.`);
  const result = path.resolve(target, relative);
  if (result !== target && !result.startsWith(target + path.sep))
    throw new Error(`${label}가 프로젝트를 벗어났습니다.`);
  for (
    let cursor = result;
    cursor.startsWith(target + path.sep);
    cursor = path.dirname(cursor)
  ) {
    if (lstatSync(cursor, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error(`심볼릭 링크 경로는 지원하지 않습니다: ${cursor}`);
  }
  return result;
}
function json(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw new Error(`JSON 파일을 읽을 수 없습니다: ${file}`);
  }
}

/** 대상 앱을 읽어 계획만 만듭니다. 파일 쓰기나 네트워크 요청은 하지 않습니다. */
export function planSetup({ target, src, entry, noInstall }) {
  const packageFile = inside(target, "package.json", "package.json");
  const configFile = inside(target, "ply-ui.json", "설정 파일");
  const pkg = json(packageFile);
  const dependencies = { ...pkg.devDependencies, ...pkg.dependencies };
  if (!dependencies.react || !dependencies["react-dom"])
    throw new Error(
      "React 19와 react-dom이 있는 프로젝트에서 실행하세요. 소스만 복사하려면 --no-setup을 사용하세요.",
    );
  const config = existsSync(configFile) ? json(configFile) : {};
  if (!config || typeof config !== "object" || Array.isArray(config))
    throw new Error("ply-ui.json은 설정 객체여야 합니다.");
  src ??=
    config.src ??
    (existsSync(path.join(target, "src"))
      ? "src"
      : existsSync(path.join(target, "app"))
        ? "."
        : "src");
  const sourceRoot = inside(target, src, "--src");
  entry ??= config.entry;
  if (!entry) {
    const candidates = dependencies.next
      ? [
          "src/app/layout.tsx",
          "app/layout.tsx",
          "src/pages/_app.tsx",
          "pages/_app.tsx",
        ]
      : ["src/main.tsx", "src/index.tsx", "main.tsx", "index.tsx"];
    const found = candidates.filter((file) =>
      existsSync(path.join(target, file)),
    );
    if (found.length !== 1)
      throw new Error(
        "스타일을 연결할 시작 파일을 하나로 판단할 수 없습니다. 예: --entry src/main.tsx 또는 --entry app/layout.tsx",
      );
    entry = found[0];
  }
  const entryFile = inside(target, entry, "--entry");
  if (!existsSync(entryFile) || !lstatSync(entryFile).isFile())
    throw new Error(`시작 파일이 없습니다: ${entry}`);
  if (!/\.[cm]?[jt]sx?$/.test(entry))
    throw new Error(
      "--entry에는 JavaScript 또는 TypeScript 시작 파일을 지정하세요.",
    );
  const require = createRequire(packageFile);
  for (const [name, minMajor, minMinor] of [
    ["react", 19, 0],
    ["react-dom", 19, 0],
    ["@base-ui/react", 1, 8],
  ]) {
    let version;
    try {
      version = require(`${name}/package.json`).version;
    } catch {}
    if (version) {
      const [major, minor] = version.split(".").map(Number);
      if (major < minMajor || (major === minMajor && minor < minMinor))
        throw new Error(
          `${name} ${version}은 지원하지 않습니다. 먼저 ${minMajor}.${minMinor} 이상으로 업데이트하세요.`,
        );
    }
  }
  const specifier = path
    .relative(
      path.dirname(entryFile),
      path.join(sourceRoot, "styles/theme.css"),
    )
    .split(path.sep)
    .join("/");
  const importPath = specifier.startsWith(".") ? specifier : `./${specifier}`;
  const before = readFileSync(entryFile, "utf8");
  const hasImport = [
    ...before.matchAll(/(?:^|\n)\s*import\s+["']([^"']+)["']/g),
  ].some(
    ([, value]) =>
      value.startsWith(".") &&
      path.resolve(path.dirname(entryFile), value) ===
        path.join(sourceRoot, "styles/theme.css"),
  );
  // 파일 끝에 top-level import를 추가하므로 'use client'와 기존 코드는 그대로 둡니다.
  const after = hasImport
    ? before
    : `${before.trimEnd()}\n\n// PLY 공통 토큰과 모션. 개별 컴포넌트 CSS는 해당 파일에서 불러옵니다.\nimport ${JSON.stringify(importPath)};\n`;
  const configText = JSON.stringify({ ...config, src, entry }, null, 2) + "\n";
  const sourceImport = path
    .relative(
      path.dirname(entryFile),
      path.join(sourceRoot, "components/ui/button"),
    )
    .split(path.sep)
    .join("/");
  return {
    target,
    src,
    entry,
    noInstall,
    exampleImport: sourceImport.startsWith(".")
      ? sourceImport
      : `./${sourceImport}`,
    dependency: dependencies["@base-ui/react"] ? null : "@base-ui/react@^1.8.0",
    files: [
      { dest: entryFile, content: after, same: before === after },
      {
        dest: configFile,
        content: configText,
        same:
          existsSync(configFile) &&
          readFileSync(configFile, "utf8") === configText,
      },
    ],
  };
}

export function installDependencies(plan) {
  if (plan.noInstall || !plan.dependency) return;
  const result = spawnSync("pnpm", ["add", plan.dependency], {
    cwd: plan.target,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error || result.status !== 0)
    throw new Error(
      "의존성 설치에 실패했습니다. 컴포넌트와 시작 파일은 변경하지 않았습니다. pnpm 설치 상태를 확인하고 다시 실행하세요.",
    );
}
