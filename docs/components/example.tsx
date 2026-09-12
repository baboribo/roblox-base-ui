import { getExampleFiles } from "@/docs/lib/example-files";
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { codeToHast } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ExampleCard, ExampleCode } from "./example-card";
import { exampleNames } from "@/examples/names";
import manifest from "@/examples/manifest.json";
const componentNames = new Set(manifest.map((x) => x.id));
async function Code({
  code,
  title,
  lang = "tsx",
  custom = false,
}: {
  code: string;
  title: string;
  lang?: string;
  custom?: boolean;
}) {
  const hast = await codeToHast(code, {
    lang,
    themes: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
  });
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props) =>
        custom ? (
          <ExampleCode title={title} code={code}>
            <pre {...props} />
          </ExampleCode>
        ) : (
          <CodeBlock title={title} viewportProps={{ "aria-label": title }}>
            <Pre {...props} />
          </CodeBlock>
        ),
    },
  });
}
export async function ComponentExample({
  name,
  title,
}: {
  name: string;
  title?: string;
}) {
  if (!exampleNames.has(name)) throw new Error("Unknown example: " + name);
  const files = await getExampleFiles(name);
  return (
    <ExampleCard name={name} title={title ?? name}>
      {files.map(({ file, code }) => (
        <Code
          key={file}
          code={code}
          title={`examples/${file}`}
          lang={file.endsWith(".css") ? "css" : "tsx"}
          custom
        />
      ))}
    </ExampleCard>
  );
}
export async function ComponentSource({ name }: { name: string }) {
  if (!componentNames.has(name)) throw new Error("Unknown component: " + name);
  return (
    <>
      {await Promise.all(
        ["tsx", "css"].map(async (ext) => (
          <details className="source-details" key={ext}>
            <summary>{`components/ui/${name}.${ext}`}</summary>
            <Code
              code={await readFile(
                path.join(process.cwd(), "src/components/ui", name + "." + ext),
                "utf8",
              )}
              title={`${name}.${ext}`}
              lang={ext}
            />
          </details>
        )),
      )}
    </>
  );
}
