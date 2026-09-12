"use client";

import { Textarea } from "../src/components/ui/textarea";

export function TextareaExample() {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      소개
      <Textarea placeholder="설명을 입력하세요" />
    </label>
  );
}
