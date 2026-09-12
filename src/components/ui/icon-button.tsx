"use client";
import type { ComponentProps } from "react";
import { Button as Primitive } from "@base-ui/react/button";
import { withClassName } from "../../lib/cx";
import { Icon, type IconName } from "./icon";
import "./icon-button.css";
export type IconButtonProps = Omit<
  ComponentProps<typeof Primitive>,
  "children"
> & {
  /** 스크린 리더가 읽을 작업 이름입니다. */
  "aria-label": string;
  /** 표시할 아이콘 이름입니다. */
  icon: IconName;
  /** 버튼 높이와 아이콘 크기입니다. @defaultValue "lg" */
  size?: "xs" | "sm" | "md" | "lg";
  /** 버튼의 색상과 강조 수준입니다. @defaultValue "emphasis" */
  variant?: "emphasis" | "standard" | "alert" | "utility" | "over-media";
  /** 원형으로 표시합니다. @defaultValue false */
  circular?: boolean;
  /** 선택한 상태의 스타일을 적용합니다. @defaultValue false */
  selected?: boolean;
};
/** 아이콘 전용 버튼은 텍스트 Button과 glyph 크기/utility 배경 규칙이 다릅니다. */
export function IconButton({
  icon,
  size = "lg",
  variant = "emphasis",
  circular = false,
  selected = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Primitive
      {...props}
      data-size={size}
      data-variant={variant}
      data-circular={circular || undefined}
      data-selected={selected || undefined}
      className={withClassName("rbx-icon-button", className)}
    >
      <Icon name={icon} size={{ xs: 16, sm: 20, md: 24, lg: 28 }[size]} />
    </Primitive>
  );
}
