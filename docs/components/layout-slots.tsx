"use client";
import type { ComponentProps } from "react";
import { Header } from "fumadocs-ui/layouts/notebook/slots/header";
export function DocsHeader(props: ComponentProps<"header">) {
  return (
    <nav aria-label="문서 도구" style={{ display: "contents" }}>
      <Header {...props} role="none" />
    </nav>
  );
}
