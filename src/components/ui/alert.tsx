import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./alert.css";

export function Alert({ className, ...props }: ComponentProps<"div">) {
  return (
    <div role="status" {...props} className={cx("rbx-alert", className)} />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 {...props} className={cx("rbx-card-title", className)} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-description", className)} />;
}
