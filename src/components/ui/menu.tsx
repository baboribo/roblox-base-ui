"use client";

import type { ComponentProps } from "react";
import { Menu as Primitive } from "@base-ui/react/menu";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./menu.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function MenuTrigger({
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

export type MenuPopupProps = ComponentProps<typeof Primitive.Popup> & {
  /** 목록 항목의 글자 크기와 여백입니다. @defaultValue "md" */
  size?: "xs" | "sm" | "md" | "lg";
};
function MenuPopup({ size = "md", className, ...props }: MenuPopupProps) {
  return (
    <Primitive.Popup
      {...props}
      data-size={size}
      className={withClassName("rbx-popup", className)}
    />
  );
}

function MenuPositioner({
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

function MenuItem({
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

function MenuSubmenuTrigger({
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

function MenuGroupLabel({
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

function MenuCheckboxItem({
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

function MenuCheckboxItemIndicator({
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

function MenuRadioItem({
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

function MenuRadioItemIndicator({
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

function MenuSeparator({
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
export const Menu = {
  ...Primitive,
  Portal: ThemedPortal,
  Separator: MenuSeparator,
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Positioner: MenuPositioner,
  Item: MenuItem,
  SubmenuTrigger: MenuSubmenuTrigger,
  GroupLabel: MenuGroupLabel,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
};
