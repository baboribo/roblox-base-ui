import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import postcss from "postcss";

// 사용법: node scripts/extract-tokens.mjs /path/FoundationCss.css /path/corporate-0.css
// 확인한 소스 파일에서만 스냅샷을 재현합니다. 갱신 시 출처/해시를 먼저 검토하세요.
const [foundationPath, corporatePath] = process.argv.slice(2);
if (!foundationPath || !corporatePath)
  throw new Error("Foundation CSS와 회사 사이트 CSS의 로컬 경로가 필요합니다.");
const file = new URL("../tokens/roblox.snapshot.json", import.meta.url);
const existing = JSON.parse(readFileSync(file, "utf8"));
const foundationCss = readFileSync(foundationPath, "utf8");
const corporateCss = readFileSync(corporatePath, "utf8");
const hash = (value) => createHash("sha256").update(value).digest("hex");
if (hash(foundationCss) !== existing.provenance.foundationSha256)
  throw new Error("Foundation 파일의 해시가 검증된 출처와 다릅니다.");
if (hash(corporateCss) !== existing.provenance.corporateSha256)
  throw new Error("회사 CSS 파일의 해시가 검증된 출처와 다릅니다.");
const declarations = (rule) =>
  Object.fromEntries(
    rule.nodes
      .filter(
        (node) =>
          node.type === "decl" &&
          node.prop.startsWith("--") &&
          !node.prop.includes("lightningcss"),
      )
      .map((node) => [node.prop, node.value]),
  );
const rules = [];
postcss.parse(foundationCss).walkRules((rule) => rules.push(rule));
const foundation = declarations(rules[0]);
for (const rule of rules.filter((rule) => rule.selector === ":root")) {
  for (const [key, value] of Object.entries(declarations(rule))) {
    if (
      /^--(?:light-mode-|dark-mode-|alpha-light-mode-|alpha-dark-mode-)/.test(
        key,
      )
    )
      foundation[key] = value;
  }
}
const modes = { light: {}, dark: {} };
for (const mode of ["light", "dark"])
  for (const rule of rules.filter((rule) => rule.selector === `.${mode}-theme`))
    Object.assign(modes[mode], declarations(rule));
let corporateDesktopDark;
postcss.parse(corporateCss).walkRules(":root", (rule) => {
  corporateDesktopDark ??= declarations(rule);
});
writeFileSync(
  file,
  JSON.stringify(
    {
      provenance: existing.provenance,
      foundation,
      modes,
      themeScope: "Default only; additional theme selectors are excluded",
      corporateDesktopDark,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "검증된 공개 CSS에서 스냅샷을 재현했습니다. 다음: node scripts/build-tokens.mjs",
);
