import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./skeleton.css";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cx("rbx-skeleton", className)}
    />
  );
}
