"use client";

import type { ComponentProps } from "react";
import { Meter as Primitive } from "@base-ui/react/meter";
import { withClassName } from "../../lib/cx";
import "./meter.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function MeterRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-meter", className)}
    />
  );
}

function MeterLabel({
  className,
  ...props
}: ComponentProps<typeof Primitive.Label>) {
  return (
    <Primitive.Label
      {...props}
      className={withClassName("rbx-label", className)}
    />
  );
}

function MeterValue({
  className,
  ...props
}: ComponentProps<typeof Primitive.Value>) {
  return (
    <Primitive.Value
      {...props}
      className={withClassName("rbx-description", className)}
    />
  );
}

function MeterTrack({
  className,
  ...props
}: ComponentProps<typeof Primitive.Track>) {
  return (
    <Primitive.Track
      {...props}
      className={withClassName("rbx-progress-track", className)}
    />
  );
}

function MeterIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  return (
    <Primitive.Indicator
      {...props}
      className={withClassName("rbx-progress-indicator", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Meter = {
  ...Primitive,
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
};
