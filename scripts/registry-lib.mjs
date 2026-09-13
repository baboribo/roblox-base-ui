import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const baseRoot = fileURLToPath(new URL("..", import.meta.url));
// npm CLI에는 원본 TSX/CSS를 templates 아래에 함께 제공합니다.
export const kitRoot = existsSync(path.join(baseRoot, "templates/src"))
  ? path.join(baseRoot, "templates")
  : baseRoot;
export const componentNames = readdirSync(
  path.join(kitRoot, "src/components/ui"),
)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => name.slice(0, -4))
  .sort();
const shared = [
  "src/assets.d.ts",
  "src/lib/cx.ts",
  "src/styles/theme.css",
  "src/styles/motion.css",
  "src/styles/tokens.css",
  "src/styles/fonts.css",
];

/** CSS에서 실제 참조하는 파일까지 수집하므로 의존성 목록이 소스와 어긋나지 않습니다. */
export function filesFor(names) {
  const files = new Set(shared);
  function visit(file) {
    if (files.has(file)) return;
    files.add(file);
    const text = readFileSync(path.join(kitRoot, file), "utf8");
    const imports = file.endsWith(".css")
      ? [...text.matchAll(/@import\s+['"](\.[^'"]+)['"]/g)]
      : [...text.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)];
    for (const match of imports) {
      const base = path.posix.normalize(
        path.posix.join(path.posix.dirname(file), match[1]),
      );
      const resolved = [base, `${base}.tsx`, `${base}.ts`, `${base}.css`].find(
        (candidate) => existsSync(path.join(kitRoot, candidate)),
      );
      if (!resolved)
        throw new Error(`Unresolved local dependency: ${file} → ${match[1]}`);
      visit(resolved);
    }
  }
  for (const name of names) {
    if (!componentNames.includes(name))
      throw new Error(`알 수 없는 컴포넌트: ${name}`);
    visit(`src/components/ui/${name}.tsx`);
    visit(`src/components/ui/${name}.css`);
  }
  return [...files].sort();
}
export function makeItem(name, names = [name]) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:block",
    title: `Roblox Base UI · ${name}`,
    description:
      "Public Roblox tokens with independently implemented Base UI components.",
    dependencies: ["@base-ui/react@1.8.0"],
    files: filesFor(names).map((file) => ({
      path: file,
      type: "registry:file",
      target: `~/${file}`,
      content: readFileSync(path.join(kitRoot, file), "utf8"),
    })),
    docs: 'Import src/styles/theme.css in the app entry. Set data-theme="dark" or "light" on html. Optional fonts: src/styles/fonts.css. These are independent components, not an official Roblox package.',
  };
}
