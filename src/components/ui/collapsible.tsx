"use client";

import type { ComponentProps } from "react";
import { Collapsible as Primitive } from "@base-ui/react/collapsible";
import { withClassName } from "../../lib/cx";
import "./collapsible.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function CollapsibleTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-button", className)}
    />
  );
}

function CollapsiblePanel({
  className,
  ...props
}: ComponentProps<typeof Primitive.Panel>) {
  return (
    <Primitive.Panel
      {...props}
      className={withClassName("rbx-accordion-panel", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Collapsible = {
  ...Primitive,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
