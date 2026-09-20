"use client";
import type { ComponentProps, ReactElement } from "react";
import { Button as Primitive } from "@base-ui/react/button";
import { withClassName } from "../../lib/cx";
import { Icon, type IconName } from "./icon";
import { Spinner } from "./spinner";
import "./icon-button.css";
export type IconButtonProps = Omit<
  ComponentProps<typeof Primitive>,
  "children"
> & {
  /** 처리 중 표시를 켜고 재실행을 막습니다. @defaultValue false */
  loading?: boolean;
  /** 스크린 리더가 읽을 작업 이름입니다. */
  "aria-label": string;
  /** Roblox 아이콘 이름 또는 다른 아이콘팩의 SVG 요소입니다. */
  icon: IconName | ReactElement;
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
  loading = false,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Primitive
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"]}
      data-size={size}
      data-variant={variant}
      data-circular={circular || undefined}
      data-selected={selected || undefined}
      className={withClassName("rbx-icon-button", className)}
    >
      {loading ? (
        <Spinner size={size === "xs" ? "sm" : "md"} aria-hidden="true" />
      ) : typeof icon === "string" ? (
        <Icon name={icon} size={{ xs: 16, sm: 20, md: 24, lg: 28 }[size]} />
      ) : (
        <Icon render={icon} size={{ xs: 16, sm: 20, md: 24, lg: 28 }[size]} />
      )}
    </Primitive>
  );
}
