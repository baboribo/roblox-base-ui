"use client";
import { Separator } from "../src/components/ui/separator";

export function SeparatorVerticalExample() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 48, gap: 12 }}>
      <span>프로젝트</span>
      <Separator orientation="vertical" />
      <span>설정</span>
    </div>
  );
}
