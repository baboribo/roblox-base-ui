import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./card.css";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={cx("rbx-card", className)} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"header">) {
  return <header {...props} className={cx("rbx-card-header", className)} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 {...props} className={cx("rbx-card-title", className)} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-description", className)} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-card-content", className)} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"footer">) {
  return <footer {...props} className={cx("rbx-card-footer", className)} />;
}
