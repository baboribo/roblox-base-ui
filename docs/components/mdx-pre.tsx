"use client";
import { useId, type ComponentProps } from "react";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
export function MdxPre(props: ComponentProps<"pre">) {
  const id = useId();
  return (
    <CodeBlock {...props} viewportProps={{ "aria-label": `코드 ${id}` }}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
}
