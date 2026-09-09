"use client";

import type { ComponentProps } from "react";
import { Field as Primitive } from "@base-ui/react/field";
import { withClassName } from "../../lib/cx";
import "./field.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function FieldRoot({
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

function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof Primitive.Label>) {
  return (
    <Primitive.Label
      {...props}
      className={withClassName("rbx-label", className)}
    />
  );
}

function FieldDescription({
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

function FieldError({
  className,
  ...props
}: ComponentProps<typeof Primitive.Error>) {
  return (
    <Primitive.Error
      {...props}
      className={withClassName("rbx-error", className)}
    />
  );
}

function FieldControl({
  className,
  ...props
}: ComponentProps<typeof Primitive.Control>) {
  return (
    <Primitive.Control
      {...props}
      className={withClassName("rbx-input", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Field = {
  ...Primitive,
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: FieldControl,
};
