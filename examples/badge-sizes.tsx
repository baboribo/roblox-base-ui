"use client";
import { Badge } from "../src/components/ui/badge";

export function BadgeSizesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Badge size="xs">업데이트</Badge>
        <span style={{ fontSize: 12 }}>xs · 16px</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Badge size="sm">업데이트</Badge>
        <span style={{ fontSize: 12 }}>sm · 24px</span>
      </div>
    </div>
  );
}
