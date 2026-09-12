"use client";

import { Separator } from "../src/components/ui/separator";

export function SeparatorExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span>프로젝트 정보</span>
      <Separator />
      <span>공개 설정</span>
    </div>
  );
}
