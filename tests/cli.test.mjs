import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { kitRoot } from "../scripts/registry-lib.mjs";

function fixture(next = false) {
  const target = mkdtempSync(path.join(tmpdir(), "ply-cli-"));
  const entry = next ? "app/layout.tsx" : "src/main.tsx";
  const original =
    '"use client";\nexport default function App() { return null; }\n';
  mkdirSync(path.dirname(path.join(target, entry)), { recursive: true });
  writeFileSync(path.join(target, entry), original);
  writeFileSync(
    path.join(target, "package.json"),
    JSON.stringify({
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        ...(next ? { next: "^16.0.0" } : {}),
      },
    }),
  );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [
        path.join(kitRoot, "scripts/cli.mjs"),
        ...args,
        "--cwd",
        target,
        "--no-install",
      ],
      { encoding: "utf8" },
    );
  return { target, entry, original, run };
}
for (const next of [false, true]) {
  test(`CLI ${next ? "Next root app" : "Vite src"}: dry-run, style setup, saved paths and repeat install`, () => {
    const { target, entry, original, run } = fixture(next);
    try {
      const preview = run("add", "select", "--dry-run");
      assert.equal(preview.status, 0, preview.stderr);
      assert.match(preview.stdout, /install @base-ui\/react/);
      assert.equal(readFileSync(path.join(target, entry), "utf8"), original);
      assert.equal(existsSync(path.join(target, "ply-ui.json")), false);
      const result = run("add", "select");
      assert.equal(result.status, 0, result.stderr);
      const config = JSON.parse(
        readFileSync(path.join(target, "ply-ui.json"), "utf8"),
      );
      assert.equal(config.src, next ? "." : "src");
      for (const file of [
        "components/ui/select.tsx",
        "components/ui/icon.css",
        "components/ui/badge.tsx",
        "styles/theme.css",
        "assets.d.ts",
      ]) {
        assert.ok(existsSync(path.join(target, config.src, file)), file);
      }
      const first = readFileSync(path.join(target, entry), "utf8");
      assert.ok(first.startsWith(original.trimEnd()));
      assert.equal(run("add", "select", "button").status, 0);
      assert.equal(readFileSync(path.join(target, entry), "utf8"), first);
      const button = path.join(target, config.src, "components/ui/button.tsx");
      writeFileSync(button, "// user edit");
      assert.equal(run("add", "button", "dialog").status, 1);
      assert.equal(readFileSync(button, "utf8"), "// user edit");
      assert.equal(
        existsSync(path.join(target, config.src, "components/ui/dialog.tsx")),
        false,
      );
      assert.equal(run("add", "button", "--overwrite").status, 0);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  });
}
test("CLI rejects ambiguous entries and unsafe paths before writing", () => {
  const { target, entry, original, run } = fixture();
  try {
    writeFileSync(path.join(target, "src/index.tsx"), "export {};\n");
    assert.equal(run("add", "button").status, 1);
    assert.equal(run("add", "button", "--entry", "../outside.tsx").status, 1);
    assert.equal(existsSync(path.join(target, "ply-ui.json")), false);
    symlinkSync(path.join(target, entry), path.join(target, "linked.tsx"));
    assert.equal(run("add", "button", "--entry", "linked.tsx").status, 1);
    assert.equal(readFileSync(path.join(target, entry), "utf8"), original);
    symlinkSync(path.join(target, "missing.tsx"), path.join(target, "broken.tsx"));
    assert.equal(run("add", "button", "--entry", "broken.tsx").status, 1);
    assert.equal(existsSync(path.join(target, "missing.tsx")), false);
    assert.equal(run("add", "button", "--entry", entry).status, 0);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});
