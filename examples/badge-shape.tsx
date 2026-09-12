"use client";
import { Badge } from "../src/components/ui/badge";

export function BadgeShapeExample() {
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
        <Badge shape="pill">준비</Badge>
        <span style={{ fontSize: 12 }}>pill · 기본값</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Badge shape="box">준비</Badge>
        <span style={{ fontSize: 12 }}>box</span>
      </div>
    </div>
  );
}
