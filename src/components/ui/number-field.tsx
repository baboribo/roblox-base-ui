"use client";

import type { ComponentProps } from "react";
import { NumberField as Primitive } from "@base-ui/react/number-field";
import { withClassName } from "../../lib/cx";
import "./number-field.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function NumberFieldRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-field", className)}
    />
  );
}

function NumberFieldGroup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Group>) {
  return (
    <Primitive.Group
      {...props}
      className={withClassName("rbx-number-group", className)}
    />
  );
}

function NumberFieldInput({
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

function NumberFieldIncrement({
  className,
  ...props
}: ComponentProps<typeof Primitive.Increment>) {
  return (
    <Primitive.Increment
      {...props}
      className={withClassName("rbx-icon-button", className)}
    />
  );
}

function NumberFieldDecrement({
  className,
  ...props
}: ComponentProps<typeof Primitive.Decrement>) {
  return (
    <Primitive.Decrement
      {...props}
      className={withClassName("rbx-icon-button", className)}
    />
  );
}

function NumberFieldScrubArea({
  className,
  ...props
}: ComponentProps<typeof Primitive.ScrubArea>) {
  return (
    <Primitive.ScrubArea
      {...props}
      className={withClassName("rbx-label", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const NumberField = {
  ...Primitive,
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
  ScrubArea: NumberFieldScrubArea,
};
