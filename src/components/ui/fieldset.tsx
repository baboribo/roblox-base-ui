"use client";

import type { ComponentProps } from "react";
import { Fieldset as Primitive } from "@base-ui/react/fieldset";
import { withClassName } from "../../lib/cx";
import "./fieldset.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function FieldsetRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-fieldset", className)}
    />
  );
}

function FieldsetLegend({
  className,
  ...props
}: ComponentProps<typeof Primitive.Legend>) {
  return (
    <Primitive.Legend
      {...props}
      className={withClassName("rbx-legend", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Fieldset = {
  ...Primitive,
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};
