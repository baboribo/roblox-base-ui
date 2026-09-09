"use client";
import type { ComponentProps, ReactNode } from "react";
import { Input as Primitive } from "@base-ui/react/input";
import { withClassName } from "../../lib/cx";
import "./input.css";

export type InputProps = ComponentProps<typeof Primitive> & {
  /** native size(글자 수)와 달리 컨트롤 높이를 정합니다. */
  controlSize?: "xs" | "sm" | "md" | "lg";
  variant?: "standard" | "contrast" | "utility";
  leading?: ReactNode;
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
  if (!leading && !trailing) return input;
  return (
    <div
      className="rbx-input-group"
      data-size={controlSize}
      data-variant={variant}
      data-disabled={props.disabled || undefined}
      data-invalid={props["aria-invalid"] === true || undefined}
    >
      {leading && <span className="rbx-input-adornment">{leading}</span>}
      {input}
      {trailing && <span className="rbx-input-adornment">{trailing}</span>}
    </div>
  );
}
