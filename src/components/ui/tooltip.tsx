"use client";

import type { ComponentProps } from "react";
import { Tooltip as Primitive } from "@base-ui/react/tooltip";
import { withClassName } from "../../lib/cx";
import "./tooltip.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function TooltipTrigger({
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

function TooltipPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-tooltip", className)}
    />
  );
}

function TooltipPositioner({
  className,
  ...props
}: ComponentProps<typeof Primitive.Positioner>) {
  return (
    <Primitive.Positioner
      {...props}
      className={withClassName("rbx-positioner", className)}
    />
  );
}

function TooltipArrow({
  className,
  ...props
}: ComponentProps<typeof Primitive.Arrow>) {
  return (
    <Primitive.Arrow
      {...props}
      className={withClassName("rbx-popup-arrow", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Tooltip = {
  ...Primitive,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
  Positioner: TooltipPositioner,
  Arrow: TooltipArrow,
};
