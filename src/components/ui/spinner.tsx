import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";
import "./spinner.css";

export type SpinnerProps = Omit<ComponentProps<"span">, "children"> & {
  /** 표시 크기입니다. @defaultValue "md" */
  size?: "sm" | "md" | "lg";
  /** 스크린 리더가 읽을 진행 상태입니다. @defaultValue "처리 중" */
  label?: string;
};

/** 진행률을 모르는 짧은 작업에 사용합니다. 진행률이 있으면 Progress를 사용합니다. */
export function Spinner({
  size = "md",
  label = "처리 중",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      {...props}
      data-size={size}
      className={cx("rbx-spinner", className)}
    />
  );
}
