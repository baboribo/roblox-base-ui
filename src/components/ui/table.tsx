import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./table.css";

export type TableProps = ComponentProps<"table"> & {
  /** 표의 의미와 ref는 table에 남기고, 가로 스크롤 영역만 별도로 설정합니다. */
  containerProps?: ComponentProps<"div">;
};
export function Table({ className, containerProps, ...props }: TableProps) {
  return (
    <div
      role="region"
      aria-label={props["aria-label"] ?? "표 가로 스크롤"}
      tabIndex={0}
      {...containerProps}
      className={cx("rbx-table-container", containerProps?.className)}
    >
      <table {...props} className={cx("rbx-table", className)} />
    </div>
  );
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
