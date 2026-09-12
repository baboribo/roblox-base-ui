"use client";

import type { ComponentProps } from "react";
import { Checkbox as Primitive } from "@base-ui/react/checkbox";
import { withClassName } from "../../lib/cx";
import "./checkbox.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
export type CheckboxRootProps = ComponentProps<typeof Primitive.Root> & {
  /** 체크 영역 크기입니다. @defaultValue "sm" */
  size?: "xs" | "sm" | "md" | "lg";
};
function CheckboxRoot({ size = "sm", className, ...props }: CheckboxRootProps) {
  return (
    <Primitive.Root
      {...props}
      data-size={size}
      className={withClassName("rbx-checkbox", className)}
    />
  );
}

function CheckboxIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  return (
    <Primitive.Indicator
      {...props}
      className={withClassName("rbx-checkbox-indicator", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Checkbox = {
  ...Primitive,
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};
