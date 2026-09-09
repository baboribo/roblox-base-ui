"use client";

import type { ComponentProps } from "react";
import { Combobox as Primitive } from "@base-ui/react/combobox";
import { withClassName } from "../../lib/cx";
import "./combobox.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function ComboboxInput({
  className,
  ...props
}: ComponentProps<typeof Primitive.Input>) {
  return (
    <Primitive.Input
      {...props}
      className={withClassName("rbx-input", className)}
    />
  );
}

function ComboboxTrigger({
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

function ComboboxPopup({
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

function ComboboxPositioner({
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

function ComboboxItem({
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

function ComboboxItemIndicator({
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

function ComboboxEmpty({
  className,
  ...props
}: ComponentProps<typeof Primitive.Empty>) {
  return (
    <Primitive.Empty
      {...props}
      className={withClassName("rbx-description", className)}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: ComponentProps<typeof Primitive.Chips>) {
  return (
    <Primitive.Chips
      {...props}
      className={withClassName("rbx-chips", className)}
    />
  );
}

function ComboboxChip({
  className,
  ...props
}: ComponentProps<typeof Primitive.Chip>) {
  return (
    <Primitive.Chip
      {...props}
      className={withClassName("rbx-badge", className)}
    />
  );
}

function ComboboxChipRemove({
  className,
  ...props
}: ComponentProps<typeof Primitive.ChipRemove>) {
  return (
    <Primitive.ChipRemove
      {...props}
      className={withClassName("rbx-icon-button", className)}
    />
  );
}

function ComboboxGroupLabel({
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

function ComboboxClear({
  className,
  ...props
}: ComponentProps<typeof Primitive.Clear>) {
  return (
    <Primitive.Clear
      {...props}
      className={withClassName("rbx-icon-button", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Combobox = {
  ...Primitive,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Popup: ComboboxPopup,
  Positioner: ComboboxPositioner,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Empty: ComboboxEmpty,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  GroupLabel: ComboboxGroupLabel,
  Clear: ComboboxClear,
};
