"use client";
import type { ComponentProps } from "react";
import { Switch as Primitive } from "@base-ui/react/switch";
import { withClassName } from "../../lib/cx";
import { Icon } from "./icon";
import "./switch.css";

type SwitchRootProps = ComponentProps<typeof Primitive.Root> & {
  size?: "xs" | "sm" | "md" | "lg";
};
/** 두 spacer의 flex-grow가 바뀌면서 손잡이가 이동합니다. RTL도 자연스럽게 반전됩니다. */
function SwitchRoot({
  size = "md",
  children,
  className,
  ...props
}: SwitchRootProps) {
  return (
    <Primitive.Root
      {...props}
      data-size={size}
      className={withClassName("rbx-switch", className)}
    >
      <span
        className="rbx-switch-spacer rbx-switch-spacer-start"
        aria-hidden="true"
      />
      {children}
      <span
        className="rbx-switch-spacer rbx-switch-spacer-end"
        aria-hidden="true"
      />
    </Primitive.Root>
  );
}
function SwitchThumb({
  children,
  className,
  ...props
}: ComponentProps<typeof Primitive.Thumb>) {
  return (
    <Primitive.Thumb
      {...props}
      className={withClassName("rbx-switch-thumb", className)}
    >
      {children ?? <Icon name="icon-filled-check" />}
    </Primitive.Thumb>
  );
}
export const Switch = { ...Primitive, Root: SwitchRoot, Thumb: SwitchThumb };
