"use client";

import type { ComponentProps } from "react";
import { OTPField as Primitive } from "@base-ui/react/otp-field";
import { withClassName } from "../../lib/cx";
import "./otp-field.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function OTPFieldRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-otp", className)}
    />
  );
}

function OTPFieldInput({
  className,
  ...props
}: ComponentProps<typeof Primitive.Input>) {
  return (
    <Primitive.Input
      {...props}
      className={withClassName("rbx-otp-input", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const OTPField = {
  ...Primitive,
  Root: OTPFieldRoot,
  Input: OTPFieldInput,
};
