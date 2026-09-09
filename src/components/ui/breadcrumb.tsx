import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./breadcrumb.css";

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Breadcrumb"
      {...props}
      className={cx("rbx-breadcrumb", className)}
    />
  );
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return <ol {...props} className={cx("rbx-breadcrumb-list", className)} />;
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li {...props} className={cx("rbx-breadcrumb-item", className)} />;
}

export function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) {
  return <a {...props} className={cx("rbx-nav-link", className)} />;
}
