import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./table.css";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <table {...props} className={cx("rbx-table", className)} />;
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead {...props} className={cx("rbx-table-header", className)} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody {...props} className={cx("rbx-table-body", className)} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr {...props} className={cx("rbx-table-row", className)} />;
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return <th {...props} className={cx("rbx-table-head", className)} />;
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return <td {...props} className={cx("rbx-table-cell", className)} />;
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<"caption">) {
  return <caption {...props} className={cx("rbx-table-caption", className)} />;
}
