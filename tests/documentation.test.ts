import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { exampleNames } from "../examples/names";
import manifest from "../examples/manifest.json";
import { getPreviewOptions } from "../examples/preview-options";

test("all documented cases resolve to real registered source files", () => {
  for (const item of manifest) {
    const doc = readFileSync(`docs/content/components/${item.id}.mdx`, "utf8");
    for (const [, name] of doc.matchAll(
      /<ComponentExample\s+name="([^"]+)"/g,
    )) {
      assert.ok(exampleNames.has(name), `${item.id}: missing preview ${name}`);
      assert.match(
        readFileSync(`examples/${name}.tsx`, "utf8"),
        /export function \w+Example/,
      );
    }
  }
  for (const name of [
    "select-sm",
    "select-lg",
    "menu-xs",
    "menu-lg",
    "dialog-lg",
    "combobox-multiple",
  ]) {
    assert.ok(
      getPreviewOptions(name).minHeight >= 440,
      `${name}: room to open overlay`,
    );
  }
});
