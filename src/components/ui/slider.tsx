"use client";

import type { ComponentProps } from "react";
import { Slider as Primitive } from "@base-ui/react/slider";
import { withClassName } from "../../lib/cx";
import "./slider.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function SliderRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-slider", className)}
    />
  );
}

function SliderLabel({
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

function SliderValue({
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

function SliderControl({
  className,
  ...props
}: ComponentProps<typeof Primitive.Control>) {
  return (
    <Primitive.Control
      {...props}
      className={withClassName("rbx-slider-control", className)}
    />
  );
}

function SliderTrack({
  className,
  ...props
}: ComponentProps<typeof Primitive.Track>) {
  return (
    <Primitive.Track
      {...props}
      className={withClassName("rbx-slider-track", className)}
    />
  );
}

function SliderIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  return (
    <Primitive.Indicator
      {...props}
      className={withClassName("rbx-slider-indicator", className)}
    />
  );
}

function SliderThumb({
  className,
  ...props
}: ComponentProps<typeof Primitive.Thumb>) {
  return (
    <Primitive.Thumb
      {...props}
      className={withClassName("rbx-slider-thumb", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Slider = {
  ...Primitive,
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
};
