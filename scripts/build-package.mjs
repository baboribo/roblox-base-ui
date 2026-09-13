import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { componentNames, kitRoot } from "./registry-lib.mjs";

// 원본은 src에만 둡니다. dist/npm은 언제든 다시 만들 수 있는 배포 결과입니다.
const output = path.join(kitRoot, "dist/npm");
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
execFileSync("pnpm", ["exec", "tsc", "-p", "tsconfig.package.json"], {
  cwd: kitRoot,
  stdio: "inherit",
});

function visit(directory, callback) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file, callback);
    else callback(file);
  }
}

// ESM과 타입 선언의 상대 경로를 실제 .js 파일 이름에 맞춥니다.
// tsc를 사용하므로 각 파일의 'use client' 지시문도 유지됩니다.
visit(output, (file) => {
  if (!file.endsWith(".js") && !file.endsWith(".d.ts")) return;
  const text = readFileSync(file, "utf8").replace(
    /((?:from\s+|import\s*|import\s*\()(["']))(\.[^"']+)(["'])/g,
    (match, prefix, quote, specifier, end) =>
      path.extname(specifier) ? match : `${prefix}${specifier}.js${end}`,
  );
  writeFileSync(file, text);
});
visit(path.join(kitRoot, "src"), (file) => {
  if (!file.endsWith(".css")) return;
  const destination = path.join(
    output,
    path.relative(path.join(kitRoot, "src"), file),
  );
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(file, destination);
  // CSS를 side-effect import하는 .d.ts도 소비자 프로젝트에서 해석됩니다.
  writeFileSync(`${destination}.d.ts`, "export {};\n");
});
writeFileSync(
  path.join(output, "styles.css"),
  '@import "./styles/theme.css";\n',
);
writeFileSync(path.join(output, "styles.css.d.ts"), "export {};\n");

const manifest = JSON.parse(
  readFileSync(path.join(kitRoot, "packaging/ui/package.json"), "utf8"),
);
for (const name of componentNames) {
  manifest.exports[`./${name}`] = {
    types: `./components/ui/${name}.d.ts`,
    import: `./components/ui/${name}.js`,
  };
}
writeFileSync(
  path.join(output, "package.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
cpSync(
  path.join(kitRoot, "packaging/ui/README.md"),
  path.join(output, "README.md"),
);
for (const name of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
  cpSync(path.join(kitRoot, "packaging/ui", name), path.join(output, name));
}
console.log(
  `${manifest.name}@${manifest.version}: ${componentNames.length}개 컴포넌트를 dist/npm에 만들었습니다.`,
);
