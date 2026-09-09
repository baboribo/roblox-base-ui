"use client";

import type { ComponentProps } from "react";
import { Radio as Primitive } from "@base-ui/react/radio";
import { withClassName } from "../../lib/cx";
import "./radio.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function RadioRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-radio", className)}
    />
  );
}

function RadioIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  return (
    <Primitive.Indicator
      {...props}
      className={withClassName("rbx-radio-indicator", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Radio = {
  ...Primitive,
  Root: RadioRoot,
  Indicator: RadioIndicator,
};
