import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./badge.css";
export type BadgeProps = ComponentProps<"span"> & {
  size?: "xs" | "sm";
  variant?:
    | "standard"
    | "contrast"
    | "emphasis"
    | "success"
    | "warning"
    | "alert"
    | "over-media";
  shape?: "pill" | "box";
};
export function Badge({
  size = "sm",
  variant = "standard",
  shape = "pill",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      data-size={size}
      data-variant={variant}
      data-shape={shape}
      className={cx("rbx-badge", className)}
    />
  );
}
