import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { kitRoot, componentNames } from "../scripts/registry-lib.mjs";

test("every component has a complete independent usage example and specific Korean guidance", () => {
  for (const id of componentNames) {
    const source = readFileSync(
      path.join(kitRoot, `examples/${id}.tsx`),
      "utf8",
    );
    assert.match(source, /export function \w+Example/);
    assert.ok(
      source.includes(`components/ui/${id}"`),
      `${id}: imports its own component`,
    );
    const doc = readFileSync(
      path.join(kitRoot, `docs/content/components/${id}.mdx`),
      "utf8",
    );
    assert.ok(doc.includes(`name="${id}"`));
    assert.doesNotMatch(doc, /조합 가능한 사용 예제/);
  }
  // 대표 화면 조합은 화면 배치용 CSS를 함께 둡니다(docs/engineering/COMPOSITION-REVIEW.md).
  const screens = [
    "game-discovery.tsx",
    "game-detail.tsx",
    "chat-history.tsx",
    "memory-settings.tsx",
  ];
  for (const file of readdirSync(path.join(kitRoot, "examples"))) {
    if (
      !file.endsWith(".tsx") ||
      ["settings.tsx", "renderer.tsx", ...screens].includes(file)
    )
      continue;
    const source = readFileSync(path.join(kitRoot, "examples", file), "utf8");
    assert.doesNotMatch(
      source,
      /className="(?:stack|demo-row|muted|default-|variant-grid)|\/demo\/|\.\/.*\.css/,
    );
    for (const match of source.matchAll(/from "([^"]+)"/g)) {
      assert.ok(
        ["react", "lucide-react"].includes(match[1]) ||
          match[1].startsWith("../src/components/ui/"),
        `${file}: self-contained import ${match[1]}`,
      );
      if (match[1].startsWith("../"))
        assert.ok(
          existsSync(path.resolve(kitRoot, "examples", `${match[1]}.tsx`)),
        );
    }
  }
  // 대표 화면은 자기 화면 CSS 한 개까지만 허용하고, 라이브러리 클래스는 덮어쓰지 않습니다.
  for (const file of screens) {
    const source = readFileSync(path.join(kitRoot, "examples", file), "utf8");
    const own = `./${file.replace(".tsx", ".css")}`;
    for (const match of source.matchAll(/from "([^"]+)"/g))
      assert.ok(
        ["react", "lucide-react", own].includes(match[1]) ||
          match[1].startsWith("../src/components/ui/"),
        `${file}: self-contained import ${match[1]}`,
      );
    const css = readFileSync(
      path.join(kitRoot, "examples", file.replace(".tsx", ".css")),
      "utf8",
    );
    assert.doesNotMatch(
      css,
      /\.rbx-[a-z-]+[\s,{.:[]/,
      `${file}: 라이브러리 클래스를 덮어씁니다`,
    );
    assert.doesNotMatch(css, /!important/, `${file}: !important를 씁니다`);
    assert.doesNotMatch(
      css,
      /#[0-9a-fA-F]{3,8}\b|\brgb\(|\bhsl\(/,
      `${file}: 토큰 대신 색상 값을 직접 씁니다`,
    );
  }
});

test("documented install commands include every component imported by their examples", () => {
  for (const id of componentNames) {
    const doc = readFileSync(
      path.join(kitRoot, `docs/content/components/${id}.mdx`),
      "utf8",
    );
    const install = doc.match(/^pnpm dlx ply-ui add ([^\n]+)/m);
    assert.ok(install, `${id}: missing public CLI install command`);
    const command = install[1].trim().split(/\s+/);
    for (const [, name] of doc.matchAll(
      /<ComponentExample\s+name="([^"]+)"/g,
    )) {
      const source = readFileSync(
        path.join(kitRoot, `examples/${name}.tsx`),
        "utf8",
      );
      for (const [, dependency] of source.matchAll(/components\/ui\/([^"/]+)/g))
        assert.ok(command.includes(dependency), `${id}: missing ${dependency}`);
    }
  }
});
