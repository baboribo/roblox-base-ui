import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { kitRoot, componentNames } from "../scripts/registry-lib.mjs";

test("every component has a complete independent usage example and specific Korean guidance", () => {
  const notes = JSON.parse(
    readFileSync(path.join(kitRoot, "src/demo/usage-notes.json"), "utf8"),
  );
  assert.deepEqual(Object.keys(notes).sort(), componentNames);
  for (const id of componentNames) {
    const source = readFileSync(
      path.join(kitRoot, `src/demo/usage-examples/${id}.tsx`),
      "utf8",
    );
    assert.match(source, /export function \w+Example/);
    assert.ok(
      source.includes(`components/ui/${id}"`),
      `${id}: imports its own component`,
    );
    assert.ok(notes[id].intro.length > 8);
    assert.ok(notes[id].tips.length >= 2);
  }
  for (const file of readdirSync(
    path.join(kitRoot, "src/demo/usage-examples"),
  )) {
    const source = readFileSync(
      path.join(kitRoot, "src/demo/usage-examples", file),
      "utf8",
    );
    assert.doesNotMatch(
      source,
      /className="(?:stack|demo-row|muted|default-|variant-grid)|\/demo\/|\.\/.*\.css/,
    );
    for (const match of source.matchAll(/from "([^"]+)"/g)) {
      assert.ok(
        ["react", "lucide-react"].includes(match[1]) ||
          match[1].startsWith("../../components/ui/"),
        `${file}: self-contained import ${match[1]}`,
      );
      if (match[1].startsWith("../../"))
        assert.ok(
          existsSync(
            path.resolve(kitRoot, "src/demo/usage-examples", `${match[1]}.tsx`),
          ),
        );
    }
  }
});
