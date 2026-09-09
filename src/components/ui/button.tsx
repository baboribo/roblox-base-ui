"use client";
import type { ComponentProps } from "react";
import { Button as Primitive } from "@base-ui/react/button";
import { withClassName } from "../../lib/cx";
import "./button.css";

export type ButtonVariant =
  | "emphasis"
  | "standard"
  | "soft-emphasis"
  | "sub-emphasis"
  | "subtle"
  | "utility"
  | "over-media"
  | "alert"
  | "link";
export type ButtonProps = ComponentProps<typeof Primitive> & {
  variant?: ButtonVariant;
  size?: "xs" | "sm" | "md" | "lg";
};
/** variant는 색상 역할, size는 높이를 고릅니다. 원본 Base UI props/ref도 전달합니다. */
export function Button({
  variant = "emphasis",
  size = "lg",
  className,
  ...props
}: ButtonProps) {
  return (
    <Primitive
      {...props}
      data-variant={variant}
      data-size={size}
      className={withClassName("rbx-button", className)}
    />
  );
}
