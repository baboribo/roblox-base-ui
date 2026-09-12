"use client";
import { Textarea } from "../src/components/ui/textarea";

export function TextareaDisabledExample() {
  return (
    <Textarea
      aria-label="프로젝트 설명"
      defaultValue="수정할 수 없는 설명입니다."
      disabled
    />
  );
}
