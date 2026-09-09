import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./textarea.css";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={cx("rbx-input rbx-textarea", className)} />
  );
}
