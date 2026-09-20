import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import { preview } from "vite";
import { componentNames, kitRoot } from "./registry-lib.mjs";

const sourceMode = process.argv.includes("--source");
const manifest = JSON.parse(
  readFileSync(path.join(kitRoot, "dist/npm/package.json"), "utf8"),
);
const project = JSON.parse(
  readFileSync(path.join(kitRoot, "package.json"), "utf8"),
);
const tarball = path.join(
  kitRoot,
  "dist",
  `${manifest.name.replace(/^@/, "").replaceAll("/", "-")}-${manifest.version}.tgz`,
);
assert.ok(existsSync(tarball), "먼저 pnpm package:pack을 실행하세요.");

// 파일 링크가 아닌 실제 배포 압축파일을, 저장소 밖에 새로 설치합니다.
const fixture = mkdtempSync(path.join(os.tmpdir(), "ply-consumer-"));
const run = (args) =>
  execFileSync("pnpm", args, { cwd: fixture, stdio: "inherit" });
const write = (name, content) => {
  const file = path.join(fixture, name);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
};
write(
  "package.json",
  JSON.stringify(
    {
      name: "ply-package-consumer",
      private: true,
      type: "module",
      dependencies: {
        [manifest.name]: `file:${tarball}`,
        react: project.dependencies.react,
        "react-dom": project.dependencies["react-dom"],
      },
      devDependencies: Object.fromEntries(
        [
          "vite",
          "typescript",
          "@types/react",
          "@types/react-dom",
          "@types/node",
        ]
          .map((name) => [name, project.devDependencies[name]])
          .concat([["next", project.dependencies.next]]),
      ),
    },
    null,
    2,
  ),
);
run(["install", "--ignore-scripts"]);

const installed = path.join(fixture, "node_modules", manifest.name);
const files = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
  .trim()
  .split("\n");
assert.equal(
  files.some((file) =>
    /\/(node_modules|\.next|docs|examples|tests)\//.test(file),
  ),
  false,
);
assert.equal(
  Object.keys(manifest.dependencies).some((name) =>
    /next|fumadocs|storybook/.test(name),
  ),
  false,
);
for (const name of componentNames) {
  assert.ok(
    existsSync(path.join(installed, manifest.exports[`./${name}`].import)),
  );
  assert.ok(
    existsSync(path.join(installed, manifest.exports[`./${name}`].types)),
  );
  const source = readFileSync(
    path.join(kitRoot, `src/components/ui/${name}.tsx`),
    "utf8",
  );
  if (source.startsWith('"use client"')) {
    assert.match(
      readFileSync(path.join(installed, `components/ui/${name}.js`), "utf8"),
      /^"use client"/,
    );
  }
}
assert.ok(files.includes("package/LICENSE"));
assert.ok(files.includes("package/THIRD_PARTY_NOTICES.md"));

cpSync(
  path.join(kitRoot, "tests/package-fixture/demo.tsx"),
  path.join(fixture, "demo.tsx"),
);
write("style-imports.d.ts", 'declare module "*.css";\n');
write(
  "tsconfig.json",
  JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      lib: ["ESNext", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      esModuleInterop: true,
    },
    include: ["*.tsx", "*.d.ts", "app/**/*.tsx"],
  }),
);
write(
  "types-check.tsx",
  `import { Select, type SelectProps, Button } from '${manifest.name}';
import { Select as DirectSelect } from '${manifest.name}/select';
const a: SelectProps = { label: 'a', options: [], value: null };
const b: SelectProps<true> = { label: 'b', options: [], multiple: true, value: [] };
// @ts-expect-error 다중 선택 값은 문자열 배열이어야 합니다.
const c: SelectProps<true> = { label: 'c', options: [], multiple: true, value: 'wrong' };
export const sample = <><Select {...a}/><DirectSelect {...b}/><Button>저장</Button></>;
`,
);
write(
  "main.tsx",
  `import { createRoot } from 'react-dom/client';\nimport Demo from './demo';\nimport '${manifest.name}/styles.css';\ncreateRoot(document.getElementById('root')!).render(<Demo/>);\n`,
);
write(
  "index.html",
  '<html lang="ko" data-theme="light"><head><meta charset="UTF-8"><title>PLY 설치 검사</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
);
if (sourceMode) {
  let demo = readFileSync(path.join(fixture, "demo.tsx"), "utf8")
    .replace(
      'import { Button, Switch } from "ply-ui";',
      'import { Button } from "./src/components/ui/button";\nimport { Switch } from "./src/components/ui/switch";',
    )
    .replace(/from "ply-ui\/([a-z-]+)"/g, 'from "./src/components/ui/$1"');
  write("demo.tsx", demo);
  write(
    "main.tsx",
    readFileSync(path.join(fixture, "main.tsx"), "utf8").replace(
      `import '${manifest.name}/styles.css';\n`,
      "",
    ),
  );
  const args = [
    "exec",
    "ply-ui",
    "add",
    "button",
    "select",
    "switch",
    "badge",
    "dialog",
    "pagination",
    "textarea",
    "tooltip",
    "table",
    "--entry",
    "main.tsx",
    "--src",
    "src",
  ];
  run([...args, "--dry-run"]);
  assert.equal(
    existsSync(path.join(fixture, "src/components/ui/button.tsx")),
    false,
  );
  run(args);
  assert.ok(
    JSON.parse(readFileSync(path.join(fixture, "package.json"), "utf8"))
      .dependencies["@base-ui/react"],
  );
  const first = readFileSync(path.join(fixture, "main.tsx"), "utf8");
  run(args);
  assert.equal(readFileSync(path.join(fixture, "main.tsx"), "utf8"), first);
}
run(["exec", "tsc", "--noEmit"]);
run(["exec", "vite", "build"]);

const browser = await chromium.launch();
const vite = await preview({
  root: fixture,
  preview: { host: "127.0.0.1", port: 0 },
  logLevel: "error",
});
let next;
async function check(url) {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const fonts = [];
  page.on("request", (request) => {
    if (/rbxcdn/.test(request.url())) fonts.push(request.url());
  });
  await page.goto(url);
  await page.getByRole("button", { name: "저장" }).click();
  await expect(page.getByRole("status")).toHaveText("저장 1회");
  await page.getByRole("switch", { name: "알림" }).click();
  await expect(page.getByRole("switch", { name: "알림" })).toBeChecked();
  const select = page.getByRole("combobox", { name: /공개 범위/ });
  await select.click();
  await page.getByRole("option", { name: "비공개", exact: true }).click();
  await expect(select).toContainText("비공개");
  await page.getByRole("combobox", { name: /분야/ }).click();
  await page.getByRole("option", { name: "개발", exact: true }).click();
  await expect(
    page.getByRole("option", { name: "개발", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(select).toHaveCSS("height", "48px");
  // 문서 밖에 설치한 패키지/복사한 소스도 영역별 테마를 Portal까지 유지합니다.
  await select.evaluate((el) => {
    el.closest(".rbx-attached-field").setAttribute("data-theme", "dark");
  });
  await select.click();
  const surface = await select.evaluate((el) => {
    const css = getComputedStyle(el);
    return { background: css.backgroundColor, color: css.color };
  });
  const popup = page.locator(".rbx-attached-popup[data-open]");
  await expect(popup).toHaveCSS("background-color", surface.background);
  await expect(popup).toHaveCSS("color", surface.color);
  await expect(popup).toHaveCSS("box-shadow", /rgba\(4, 4, 8, 0\.25\)/);
  await page.keyboard.press("Escape");
  // docs의 여백 없이 사용하는 Next/Vite 앱에서도 버튼과 목록이 붙어 있어야 합니다.
  for (const edge of ["left", "right", "full"]) {
    await select.evaluate((el, edge) => {
      const field = el.closest(".rbx-attached-field");
      Object.assign(field.style, {
        position: "fixed",
        top: "40px",
        width: edge === "full" ? "100vw" : "320px",
        left: edge === "right" ? "auto" : "0px",
        right: edge === "right" ? "0px" : "auto",
      });
    }, edge);
    await select.click();
    await expect(select).toHaveAttribute("aria-expanded", "true");
    await expect
      .poll(async () => {
        const button = await select.boundingBox();
        const panel = await popup.boundingBox();
        return button && panel
          ? Math.max(
              Math.abs(button.x - panel.x),
              Math.abs(button.width - panel.width),
            )
          : Infinity;
      })
      .toBeLessThan(1);
    await page.keyboard.press("Escape");
    await expect(select).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".rbx-attached-popup[data-open]")).toHaveCount(0);
    await expect(page.getByRole("listbox")).toHaveCount(0);
  }
  await select.evaluate((el) =>
    el.closest(".rbx-attached-field").removeAttribute("style"),
  );
  const dialogTrigger = page.getByRole("button", { name: "설치 대화상자" });
  await dialogTrigger.click();
  await expect(page.getByRole("dialog")).toHaveCSS(
    "background-color",
    "rgb(25, 26, 31)",
  );
  await page.keyboard.press("Escape");
  await expect(dialogTrigger).toBeFocused();
  await page.getByRole("button", { name: "다음 페이지" }).click();
  await expect(page.getByTestId("page-result")).toHaveText("2");
  await expect(
    page.getByRole("button", { name: "처리 중인 버튼" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "설치 설명" }),
  ).toHaveAttribute("rows", "8");
  const pageInput = page.getByRole("textbox", { name: "이동할 페이지" });
  await pageInput.fill("20");
  await pageInput.press("Enter");
  await expect(page.getByTestId("page-result")).toHaveText("20");
  await expect(page.locator('a[href="#destination"]')).toHaveAccessibleName(
    "설치 링크",
  );
  const help = page.getByRole("button", { name: "설치 도움말" });
  await help.focus();
  await expect(help).toHaveAccessibleDescription("패키지 도움말 설명");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("table").locator("..")).toHaveCSS(
    "overflow-x",
    "auto",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(
    fonts,
    [],
    "기본 설치에서 선택 사항인 외부 폰트를 요청하지 않습니다.",
  );
  await page.close();
}
try {
  await check(`http://127.0.0.1:${vite.httpServer.address().port}`);
  // Next 앱에서는 서버 페이지가 패키지의 정적 컴포넌트와 클라이언트 컴포넌트를 함께 import합니다.
  write(
    "app/layout.tsx",
    `import '${manifest.name}/styles.css';\nexport default function Layout({children}: {children: React.ReactNode}) { return <html lang="ko" data-theme="light"><body>{children}</body></html>; }`,
  );
  write(
    "app/page.tsx",
    `import Demo from '../demo';\nimport { Badge, Button } from '${manifest.name}';\nexport default function Page() { return <><Badge>설치 확인</Badge><Button>서버 페이지 버튼</Button><Demo/></>; }`,
  );
  if (sourceMode) {
    write(
      "app/layout.tsx",
      readFileSync(path.join(fixture, "app/layout.tsx"), "utf8").replace(
        `import '${manifest.name}/styles.css';\n`,
        "",
      ),
    );
    write(
      "app/page.tsx",
      "import Demo from '../demo';\nimport { Badge } from '../src/components/ui/badge';\nexport default function Page() { return <><Badge>설치 확인</Badge><Demo/></>; }",
    );
    run(["exec", "ply-ui", "add", "badge", "--entry", "app/layout.tsx"]);
  }
  write("next.config.mjs", "export default { experimental: { cpus: 2 } };\n");
  run(["exec", "next", "build", "--webpack"]);
  next = spawn(
    "pnpm",
    ["exec", "next", "start", "--hostname", "127.0.0.1", "--port", "5197"],
    { cwd: fixture, stdio: "inherit", detached: true },
  );
  await expect
    .poll(
      async () => {
        try {
          return (await fetch("http://127.0.0.1:5197")).status;
        } catch {
          return 0;
        }
      },
      { timeout: 30000 },
    )
    .toBe(200);
  await check("http://127.0.0.1:5197");
  console.log(
    `PASS (${sourceMode ? "source CLI" : "package imports"}): ${manifest.name}@${manifest.version}, ${componentNames.length} exports, TypeScript, Vite, Next.js, browser interactions. Fixture: ${fixture}`,
  );
} finally {
  if (next?.pid) {
    try {
      process.kill(-next.pid, "SIGTERM");
    } catch {}
  }
  await new Promise((resolve) => vite.httpServer.close(resolve));
  await browser.close();
}
