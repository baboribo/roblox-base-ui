"use client";

import type { ComponentProps } from "react";
import { Autocomplete as Primitive } from "@base-ui/react/autocomplete";
import { withClassName } from "../../lib/cx";
import "./autocomplete.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function AutocompleteInput({
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

function AutocompleteTrigger({
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

function AutocompletePopup({
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

function AutocompletePositioner({
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

function AutocompleteItem({
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

function AutocompleteEmpty({
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

function AutocompleteGroupLabel({
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

function AutocompleteClear({
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
export const Autocomplete = {
  ...Primitive,
  Input: AutocompleteInput,
  Trigger: AutocompleteTrigger,
  Popup: AutocompletePopup,
  Positioner: AutocompletePositioner,
  Item: AutocompleteItem,
  Empty: AutocompleteEmpty,
  GroupLabel: AutocompleteGroupLabel,
  Clear: AutocompleteClear,
};
