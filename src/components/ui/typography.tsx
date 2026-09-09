import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./typography.css";

export function Heading({ className, ...props }: ComponentProps<"h2">) {
  return <h2 {...props} className={cx("rbx-heading", className)} />;
}

export function Text({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-text", className)} />;
}

export function Code({ className, ...props }: ComponentProps<"code">) {
  return <code {...props} className={cx("rbx-code", className)} />;
}
