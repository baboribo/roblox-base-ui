"use client";

import type { ComponentProps } from "react";
import { Avatar as Primitive } from "@base-ui/react/avatar";
import { withClassName } from "../../lib/cx";
import "./avatar.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function AvatarRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-avatar", className)}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof Primitive.Image>) {
  return (
    <Primitive.Image
      {...props}
      className={withClassName("rbx-avatar-image", className)}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof Primitive.Fallback>) {
  return (
    <Primitive.Fallback
      {...props}
      className={withClassName("rbx-avatar-fallback", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Avatar = {
  ...Primitive,
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
