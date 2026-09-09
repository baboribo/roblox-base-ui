import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./empty.css";

export function Empty({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={cx("rbx-empty", className)} />;
}
