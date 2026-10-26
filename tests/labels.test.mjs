import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// 컴포넌트 기본 문구는 한국어로 통일합니다. 다른 언어는 label props로 바꿉니다.
test("component sources do not hardcode English user-facing labels", () => {
  const directory = new URL("../src/components/ui/", import.meta.url);
  const pattern =
    /(?:aria-label|placeholder|[lL]abel)\s*[=:]\s*["'`]([A-Za-z][A-Za-z ]+)["'`]|^\s*([A-Z][a-z]+(?: [a-z]+)*)\s*$/gm;
  const found = [];
  for (const name of readdirSync(directory).filter((file) =>
    file.endsWith(".tsx"),
  )) {
    const source = readFileSync(new URL(name, directory), "utf8");
    for (const match of source.matchAll(pattern))
      found.push(`${name}: ${(match[1] ?? match[2]).trim()}`);
  }
  assert.deepEqual(found, []);
});
