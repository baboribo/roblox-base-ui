import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  kitRoot,
  componentNames,
  filesFor,
  makeItem,
} from "../scripts/registry-lib.mjs";
import postcss from "postcss";

test("copy installation includes CSS dependencies, rejects partial overwrite, and is idempotent", () => {
  const target = mkdtempSync(path.join(tmpdir(), "rbx-kit-"));
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [path.join(kitRoot, "scripts/add.mjs"), ...args, "--cwd", target],
      { encoding: "utf8" },
    );
  try {
    assert.equal(run("add", "button", "meter").status, 0);
    assert.ok(existsSync(path.join(target, "src/components/ui/progress.css")));
    assert.ok(existsSync(path.join(target, "src/styles/tokens.css")));
    assert.equal(run("add", "button", "meter").status, 0);
    const button = path.join(target, "src/components/ui/button.tsx");
    writeFileSync(button, "// my edits");
    assert.equal(run("add", "button", "dialog").status, 1);
    assert.equal(readFileSync(button, "utf8"), "// my edits");
    assert.ok(!existsSync(path.join(target, "src/components/ui/dialog.tsx")));
    assert.equal(run("add", "button", "--overwrite").status, 0);
    assert.equal(run("add", "unknown").status, 1);
    assert.equal(run("add", "button", "--src", "../outside").status, 1);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});
test("all registry entries have real self-contained sources", () => {
  assert.equal(componentNames.length, 58);
  for (const name of componentNames) {
    const item = makeItem(name);
    assert.ok(item.files.length >= 6);
    for (const file of item.files) {
      assert.equal(
        file.content,
        readFileSync(path.join(kitRoot, file.path), "utf8"),
      );
      assert.ok(file.target.startsWith("~/src/"));
    }
  }
  assert.ok(
    filesFor(["collapsible"]).includes("src/components/ui/accordion.css"),
  );
});
test("token snapshot generates valid CSS with no missing variable references", () => {
  const files = ["tokens.css", "theme.css", "motion.css"].map((name) =>
    readFileSync(path.join(kitRoot, "src/styles", name), "utf8"),
  );
  const declared = new Set();
  const used = new Set();
  for (const text of files) {
    postcss.parse(text).walkDecls((decl) => {
      if (decl.prop.startsWith("--")) declared.add(decl.prop);
      for (const match of decl.value.matchAll(/var\((--rbx-[\w-]+)/g))
        used.add(match[1]);
    });
  }
  assert.deepEqual(
    [...used].filter((name) => !declared.has(name)),
    [],
  );
  const snapshot = JSON.parse(
    readFileSync(path.join(kitRoot, "tokens/roblox.snapshot.json"), "utf8"),
  );
  assert.equal(snapshot.foundation["--color-extended-blue-700"], "#335fff");
  assert.equal(snapshot.foundation["--radius-medium"], "var(--size-200)");
});

test("composite installation follows TypeScript imports and only ships Default", () => {
  const sidebarFiles = filesFor(["sidebar"]);
  for (const name of ["navigation-item", "icon", "icon-button", "scroll-area"])
    for (const extension of ["tsx", "css"])
      assert.ok(
        sidebarFiles.includes(`src/components/ui/${name}.${extension}`),
      );
  assert.ok(!sidebarFiles.some((file) => file.includes("/demo/")));
  const files = filesFor(["chat"]);
  for (const name of ["button", "icon", "icon-button", "input", "checkbox"])
    for (const extension of ["tsx", "css"])
      assert.ok(files.includes(`src/components/ui/${name}.${extension}`));
  assert.ok(!files.includes("src/styles/corporate.css"));
  const css = readFileSync(path.join(kitRoot, "src/styles/tokens.css"), "utf8");
  assert.doesNotMatch(css, /classic-theme|\.\w+-theme/);
});
