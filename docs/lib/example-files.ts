import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
/** Follow only sibling example imports. UI dependencies are installed through the kit CLI. */
export async function getExampleFiles(name: string) {
  const files = new Map<string, string>();
  async function visit(file: string) {
    if (files.has(file)) return;
    const source = await readFile(
      path.join(process.cwd(), "examples", file),
      "utf8",
    );
    files.set(file, source.replaceAll("../src/components/", "@/components/"));
    for (const match of source.matchAll(
      /(?:from\s+|import\s*)['"]\.\/([a-z0-9-]+(?:\.css)?)['"]/g,
    )) {
      await visit(match[1].endsWith(".css") ? match[1] : match[1] + ".tsx");
    }
  }
  await visit(name + ".tsx");
  return [...files].map(([file, code]) => ({ file, code }));
}
