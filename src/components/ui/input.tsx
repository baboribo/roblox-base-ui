"use client";
import { hasContent } from "../../lib/content";
import type { ComponentProps, ReactNode } from "react";
import { Input as Primitive } from "@base-ui/react/input";
import { withClassName } from "../../lib/cx";
import "./input.css";

export type InputProps = ComponentProps<typeof Primitive> & {
  /** native size(글자 수)와 달리 컨트롤 높이를 정합니다. @defaultValue "lg" */
  controlSize?: "xs" | "sm" | "md" | "lg";
  /** 입력 영역의 배경과 테두리 표현입니다. @defaultValue "standard" */
  variant?: "standard" | "contrast" | "utility";
  /** 입력 영역 앞에 표시할 아이콘이나 내용입니다. */
  leading?: ReactNode;
  /** 입력 영역 뒤에 표시할 아이콘이나 내용입니다. */
  trailing?: ReactNode;
};
/** Base UI는 입력/Field 연동, 외부 래퍼는 아이콘과 테두리만 담당합니다. ref는 input에 전달됩니다. */
export function Input({
  controlSize = "lg",
  variant = "standard",
  leading,
  trailing,
  className,
  ...props
}: InputProps) {
  const input = (
    <Primitive
      {...props}
      data-size={controlSize}
      data-variant={variant}
      className={withClassName("rbx-input", className)}
    />
  );
  const hasLeading = hasContent(leading);
  const hasTrailing = hasContent(trailing);
  if (!hasLeading && !hasTrailing) return input;
  return (
    <div
      className="rbx-input-group"
      data-size={controlSize}
      data-variant={variant}
      data-disabled={props.disabled || undefined}
      data-invalid={
        props["aria-invalid"] === true ||
        props["aria-invalid"] === "true" ||
        undefined
      }
    >
      {hasLeading && <span className="rbx-input-adornment">{leading}</span>}
      {input}
      {hasTrailing && <span className="rbx-input-adornment">{trailing}</span>}
    </div>
  );
}
