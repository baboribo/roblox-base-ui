"use client";

import type { ComponentProps } from "react";
import { ScrollArea as Primitive } from "@base-ui/react/scroll-area";
import { withClassName } from "../../lib/cx";
import "./scroll-area.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function ScrollAreaRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-scroll-area", className)}
    />
  );
}

function ScrollAreaViewport({
  className,
  ...props
}: ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport
      {...props}
      className={withClassName("rbx-scroll-viewport", className)}
    />
  );
}

function ScrollAreaScrollbar({
  className,
  ...props
}: ComponentProps<typeof Primitive.Scrollbar>) {
  return (
    <Primitive.Scrollbar
      {...props}
      className={withClassName("rbx-scrollbar", className)}
    />
  );
}

function ScrollAreaThumb({
  className,
  ...props
}: ComponentProps<typeof Primitive.Thumb>) {
  return (
    <Primitive.Thumb
      {...props}
      className={withClassName("rbx-scroll-thumb", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const ScrollArea = {
  ...Primitive,
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
};
