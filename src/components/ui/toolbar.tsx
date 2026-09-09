"use client";

import type { ComponentProps } from "react";
import { Toolbar as Primitive } from "@base-ui/react/toolbar";
import { withClassName } from "../../lib/cx";
import "./toolbar.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function ToolbarRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-toolbar", className)}
    />
  );
}

function ToolbarButton({
  className,
  ...props
}: ComponentProps<typeof Primitive.Button>) {
  return (
    <Primitive.Button
      {...props}
      className={withClassName("rbx-button", className)}
    />
  );
}

function ToolbarLink({
  className,
  ...props
}: ComponentProps<typeof Primitive.Link>) {
  return (
    <Primitive.Link
      {...props}
      className={withClassName("rbx-nav-link", className)}
    />
  );
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Separator>) {
  return (
    <Primitive.Separator
      {...props}
      className={withClassName("rbx-separator", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Toolbar = {
  ...Primitive,
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
};
