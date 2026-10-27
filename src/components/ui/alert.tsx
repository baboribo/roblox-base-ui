import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./alert.css";

export type AlertTone = "neutral" | "success" | "warning" | "error";
export type AlertProps = ComponentProps<"div"> & {
  /** 안내의 종류입니다. 색만으로 뜻을 전하지 않도록 제목에도 상황을 적습니다. @defaultValue "neutral" */
  tone?: AlertTone;
};

/** 오류는 바로 읽히도록 `role="alert"`, 나머지는 `role="status"`가 기본입니다. `role`로 바꿀 수 있습니다. */
export function Alert({ tone = "neutral", className, ...props }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      {...props}
      data-tone={tone}
      className={cx("rbx-alert", className)}
    />
  );
}

export type AlertTitleProps = ComponentProps<"h3"> & {
  /** 페이지의 제목 계층에 맞게 선택합니다. 제목이 필요 없으면 "p"를 씁니다. @defaultValue "h3" */
  as?: "h2" | "h3" | "h4" | "h5" | "h6" | "p";
};
export function AlertTitle({
  as: Tag = "h3",
  className,
  ...props
}: AlertTitleProps) {
  return <Tag {...props} className={cx("rbx-alert-title", className)} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-alert-description", className)} />;
}
