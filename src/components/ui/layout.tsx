import type { ComponentProps, CSSProperties } from "react";
import { cx } from "../../lib/cx";
import "./layout.css";

type Spacing = 0 | 4 | 8 | 12 | 16 | 24 | 32 | 48;
type LayoutProps = ComponentProps<"div"> & {
  /** 4px 간격 체계를 사용합니다. */
  gap?: Spacing;
};
type Alignment = "start" | "center" | "end" | "stretch";
function spacing(gap: Spacing, style?: CSSProperties): CSSProperties {
  return { "--rbx-layout-gap": `${gap}px`, ...style } as CSSProperties;
}
/** 세로 흐름과 간격을 관리합니다. 버튼·배지는 고유 너비, 입력은 가용 너비를 사용합니다. */
export function Stack({
  gap = 16,
  align = "stretch",
  className,
  style,
  ...props
}: LayoutProps & { align?: Alignment }) {
  return (
    <div
      {...props}
      data-align={align}
      className={cx("rbx-stack", className)}
      style={spacing(gap, style)}
    />
  );
}
/** 액션·배지를 가로로 배치하고 공간이 부족하면 항목 단위로 다음 줄로 넘깁니다. */
export function Inline({
  gap = 8,
  align = "center",
  justify = "start",
  className,
  style,
  ...props
}: LayoutProps & {
  align?: Alignment;
  justify?: "start" | "center" | "end" | "space-between";
}) {
  return (
    <div
      {...props}
      data-align={align}
      data-justify={justify}
      className={cx("rbx-inline", className)}
      style={spacing(gap, style)}
    />
  );
}
/** 부모 너비에 맞춰 열을 나눕니다. 좁은 패널에서는 한 열로 전환됩니다. */
export function Grid({
  gap = 16,
  minItemWidth = "16rem",
  className,
  style,
  ...props
}: LayoutProps & { minItemWidth?: CSSProperties["minWidth"] }) {
  return (
    <div
      {...props}
      className={cx("rbx-grid", className)}
      style={
        {
          "--rbx-grid-min":
            typeof minItemWidth === "number"
              ? `${minItemWidth}px`
              : minItemWidth,
          ...spacing(gap, style),
        } as CSSProperties
      }
    />
  );
}
/** 입력·선택 영역이 남은 공간을 사용하고, 액션 버튼은 읽을 수 있는 너비를 유지합니다. */
export function ControlGroup({
  gap = 8,
  className,
  style,
  ...props
}: LayoutProps) {
  return (
    <div
      {...props}
      className={cx("rbx-control-group", className)}
      style={spacing(gap, style)}
    />
  );
}
