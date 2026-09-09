import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { kitRoot, componentNames, makeItem } from "./registry-lib.mjs";
const out = path.join(kitRoot, "public/r");
mkdirSync(out, { recursive: true });
const items = [
  ...componentNames.map((name) => makeItem(name)),
  makeItem("all", componentNames),
];
for (const item of items)
  writeFileSync(
    path.join(out, `${item.name}.json`),
    JSON.stringify(item, null, 2) + "\n",
  );
writeFileSync(
  path.join(kitRoot, "public/registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "roblox-base-ui-local",
      homepage: "http://127.0.0.1:5173",
      items,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${componentNames.length}개 컴포넌트 + all 레지스트리를 만들었습니다.`,
);
