"use client";

import type { ComponentProps } from "react";
import { Progress as Primitive } from "@base-ui/react/progress";
import { withClassName } from "../../lib/cx";
import "./progress.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function ProgressRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-progress", className)}
    />
  );
}

function ProgressLabel({
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

function ProgressValue({
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

function ProgressTrack({
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

function ProgressIndicator({
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
export const Progress = {
  ...Primitive,
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
};
