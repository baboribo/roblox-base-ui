import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// Figma 변수와 코드가 같은 값을 쓰도록 간격·모서리는 토큰으로만 지정합니다. 1px 선은 예외입니다.
test("component spacing and radius use tokens instead of raw px", () => {
  const files = [
    ...readdirSync(new URL("../src/components/ui/", import.meta.url))
      .filter((name) => name.endsWith(".css"))
      .map((name) => `src/components/ui/${name}`),
    "src/styles/theme.css",
  ];
  const declaration =
    /([a-z-]*(?:gap|padding|radius)[a-z-]*)\s*:\s*([^;{}]+);/g;
  const found = [];
  for (const file of files) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    for (const [, property, value] of source.matchAll(declaration))
      for (const [raw, number] of value.matchAll(/(?<![\w.-])(\d+)px\b/g))
        if (Number(number) > 1) found.push(`${file}: ${property}: ${raw}`);
  }
  assert.deepEqual(found, []);
});
