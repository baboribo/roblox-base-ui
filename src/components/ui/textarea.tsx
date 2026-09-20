import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./textarea.css";

export type TextareaProps = ComponentProps<"textarea"> & {
  /** Input과 동일한 글자 크기입니다. @defaultValue "lg" */
  controlSize?: "sm" | "md" | "lg";
  /** 입력 영역의 배경과 테두리입니다. @defaultValue "standard" */
  variant?: "standard" | "contrast" | "utility";
};

export function Textarea({
  className,
  controlSize = "lg",
  variant = "standard",
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      data-size={controlSize}
      data-variant={variant}
      className={cx("rbx-input rbx-textarea", className)}
    />
  );
}
