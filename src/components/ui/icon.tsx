import type { ComponentProps, CSSProperties, ReactElement } from "react";
import { cx } from "../../lib/cx";
import "./icon.css";
/** ReactChat / Navigation 배포 CSS에서 확인한 glyph. 그림은 CSS mask, 색은 currentColor입니다. */
export type IconName =
  | "icon-regular-house"
  | "icon-regular-person"
  | "icon-regular-speech-bubble-align-center"
  | "icon-regular-two-people"
  | "icon-regular-person-standing"
  | "icon-regular-backpack"
  | "icon-regular-hand-two-arrows-horizontal"
  | "icon-regular-three-people"
  | "icon-regular-fountain-pen-nib"
  | "icon-regular-building-store"
  | "icon-regular-gift-card"
  | "icon-regular-chevron-large-up"
  | "icon-filled-arrow-spin-clockwise"
  | "icon-filled-calendar"
  | "icon-filled-check"
  | "icon-regular-chevron-large-down"
  | "icon-regular-chevron-large-left"
  | "icon-regular-chevron-large-right"
  | "icon-regular-circle-i"
  | "icon-filled-circle-i"
  | "icon-filled-clock"
  | "icon-regular-gear"
  | "icon-filled-globe-simplified"
  | "icon-filled-magnifying-glass"
  | "icon-regular-person-plus"
  | "icon-regular-plus-large"
  | "icon-filled-premium"
  | "icon-regular-roblox-plus"
  | "icon-filled-smartphone-portrait"
  | "icon-filled-speech-bubble-round"
  | "icon-regular-squares-grid-qr"
  | "icon-filled-three-dots-horizontal"
  | "icon-filled-tilt"
  | "icon-regular-triangle-exclamation"
  | "icon-filled-two-people"
  | "icon-filled-verified-backplate"
  | "icon-filled-verified-check"
  | "icon-regular-x";
export type IconProps = Omit<ComponentProps<"span">, "children"> & {
  size?: number;
} & (
    { name: IconName; render?: never } | { name?: never; render: ReactElement }
  );
export function Icon({
  name,
  render,
  size = 20,
  style,
  className,
  ...props
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      {...props}
      data-icon={name}
      data-custom={render ? "" : undefined}
      className={cx("rbx-icon", className)}
      style={{ "--rbx-icon-size": `${size}px`, ...style } as CSSProperties}
    >
      {render}
    </span>
  );
}
