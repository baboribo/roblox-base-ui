"use client";

import type { ComponentProps } from "react";
import { PreviewCard as Primitive } from "@base-ui/react/preview-card";
import { withClassName } from "../../lib/cx";
import "./preview-card.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function PreviewCardTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-nav-link", className)}
    />
  );
}

function PreviewCardPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-popup rbx-padded", className)}
    />
  );
}

function PreviewCardPositioner({
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

function PreviewCardArrow({
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
export const PreviewCard = {
  ...Primitive,
  Trigger: PreviewCardTrigger,
  Popup: PreviewCardPopup,
  Positioner: PreviewCardPositioner,
  Arrow: PreviewCardArrow,
};
