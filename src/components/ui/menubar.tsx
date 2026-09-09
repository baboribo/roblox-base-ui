"use client";

import type { ComponentProps } from "react";
import { Menubar as Primitive } from "@base-ui/react/menubar";
import { withClassName } from "../../lib/cx";
import "./menubar.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
export function Menubar({
  className,
  ...props
}: ComponentProps<typeof Primitive>) {
  return (
    <Primitive {...props} className={withClassName("rbx-menubar", className)} />
  );
}
