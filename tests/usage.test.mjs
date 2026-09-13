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
  for (const file of readdirSync(path.join(kitRoot, "examples"))) {
    if (
      !file.endsWith(".tsx") ||
      ["settings.tsx", "renderer.tsx"].includes(file)
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
