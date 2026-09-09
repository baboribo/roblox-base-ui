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
  "aria-label": string;
  icon: IconName;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "emphasis" | "standard" | "alert" | "utility" | "over-media";
  circular?: boolean;
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
