"use client";

import type { ComponentProps } from "react";
import { Select as Primitive } from "@base-ui/react/select";
import { withClassName } from "../../lib/cx";
import "./select.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function SelectTrigger({
  size = "lg",
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger> & {
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <Primitive.Trigger
      {...props}
      data-size={size}
      className={withClassName("rbx-select-trigger", className)}
    />
  );
}

function SelectPopup({
  size = "lg",
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup> & {
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <Primitive.Popup
      {...props}
      data-size={size}
      className={withClassName("rbx-popup", className)}
    />
  );
}

function SelectPositioner({
  alignItemWithTrigger = false,
  sideOffset = 8,
  className,
  ...props
}: ComponentProps<typeof Primitive.Positioner>) {
  return (
    <Primitive.Positioner
      {...props}
      alignItemWithTrigger={alignItemWithTrigger}
      sideOffset={sideOffset}
      className={withClassName("rbx-positioner", className)}
    />
  );
}

function SelectItem({
  className,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      {...props}
      className={withClassName("rbx-option", className)}
    />
  );
}

function SelectItemIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.ItemIndicator>) {
  return (
    <Primitive.ItemIndicator
      {...props}
      className={withClassName("rbx-option-indicator", className)}
    />
  );
}

function SelectGroupLabel({
  className,
  ...props
}: ComponentProps<typeof Primitive.GroupLabel>) {
  return (
    <Primitive.GroupLabel
      {...props}
      className={withClassName("rbx-group-label", className)}
    />
  );
}

function SelectScrollUpArrow({
  className,
  ...props
}: ComponentProps<typeof Primitive.ScrollUpArrow>) {
  return (
    <Primitive.ScrollUpArrow
      {...props}
      className={withClassName("rbx-scroll-arrow", className)}
    />
  );
}

function SelectScrollDownArrow({
  className,
  ...props
}: ComponentProps<typeof Primitive.ScrollDownArrow>) {
  return (
    <Primitive.ScrollDownArrow
      {...props}
      className={withClassName("rbx-scroll-arrow", className)}
    />
  );
}

function SelectSeparator({
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
export const Select = {
  ...Primitive,
  Trigger: SelectTrigger,
  Popup: SelectPopup,
  Positioner: SelectPositioner,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  GroupLabel: SelectGroupLabel,
  ScrollUpArrow: SelectScrollUpArrow,
  ScrollDownArrow: SelectScrollDownArrow,
  Separator: SelectSeparator,
};
