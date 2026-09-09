"use client";

import type { ComponentProps } from "react";
import { Popover as Primitive } from "@base-ui/react/popover";
import { withClassName } from "../../lib/cx";
import "./popover.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function PopoverTrigger({
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

function PopoverPopup({
  variant = "standard",
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup> & {
  variant?: "standard" | "inverse";
}) {
  return (
    <Primitive.Popup
      {...props}
      data-variant={variant}
      className={withClassName("rbx-popup rbx-padded", className)}
    />
  );
}

function PopoverPositioner({
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

function PopoverTitle({
  className,
  ...props
}: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      {...props}
      className={withClassName("rbx-dialog-title", className)}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      {...props}
      className={withClassName("rbx-description", className)}
    />
  );
}

function PopoverClose({
  className,
  ...props
}: ComponentProps<typeof Primitive.Close>) {
  return (
    <Primitive.Close
      {...props}
      className={withClassName("rbx-button", className)}
    />
  );
}

function PopoverArrow({
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
export const Popover = {
  ...Primitive,
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Positioner: PopoverPositioner,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Arrow: PopoverArrow,
};
