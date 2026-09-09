"use client";

import type { ComponentProps } from "react";
import { Separator as Primitive } from "@base-ui/react/separator";
import { withClassName } from "../../lib/cx";
import "./separator.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
export function Separator({
  className,
  ...props
}: ComponentProps<typeof Primitive>) {
  return (
    <Primitive
      {...props}
      className={withClassName("rbx-separator", className)}
    />
  );
}
