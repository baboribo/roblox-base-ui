"use client";

import type { ComponentProps } from "react";
import { ContextMenu as Primitive } from "@base-ui/react/context-menu";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./context-menu.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function ContextMenuTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-context-trigger", className)}
    />
  );
}

function ContextMenuPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-popup", className)}
    />
  );
}

function ContextMenuPositioner({
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

function ContextMenuItem({
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

function ContextMenuSubmenuTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.SubmenuTrigger>) {
  return (
    <Primitive.SubmenuTrigger
      {...props}
      className={withClassName("rbx-option", className)}
    />
  );
}

function ContextMenuGroupLabel({
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

function ContextMenuCheckboxItem({
  className,
  ...props
}: ComponentProps<typeof Primitive.CheckboxItem>) {
  return (
    <Primitive.CheckboxItem
      {...props}
      className={withClassName("rbx-option", className)}
    />
  );
}

function ContextMenuCheckboxItemIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.CheckboxItemIndicator>) {
  return (
    <Primitive.CheckboxItemIndicator
      {...props}
      className={withClassName("rbx-option-indicator", className)}
    />
  );
}

function ContextMenuRadioItem({
  className,
  ...props
}: ComponentProps<typeof Primitive.RadioItem>) {
  return (
    <Primitive.RadioItem
      {...props}
      className={withClassName("rbx-option", className)}
    />
  );
}

function ContextMenuRadioItemIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.RadioItemIndicator>) {
  return (
    <Primitive.RadioItemIndicator
      {...props}
      className={withClassName("rbx-option-indicator", className)}
    />
  );
}

function ContextMenuSeparator({
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
export const ContextMenu = {
  ...Primitive,
  Portal: ThemedPortal,
  Separator: ContextMenuSeparator,
  Trigger: ContextMenuTrigger,
  Popup: ContextMenuPopup,
  Positioner: ContextMenuPositioner,
  Item: ContextMenuItem,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  GroupLabel: ContextMenuGroupLabel,
  CheckboxItem: ContextMenuCheckboxItem,
  CheckboxItemIndicator: ContextMenuCheckboxItemIndicator,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: ContextMenuRadioItemIndicator,
};
