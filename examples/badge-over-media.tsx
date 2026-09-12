"use client";
import { Badge } from "../src/components/ui/badge";

export function BadgeOverMediaExample() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 176,
        display: "grid",
        placeItems: "center",
        borderRadius: 8,
        background: "linear-gradient(135deg,#b9c4ce,#6d8496,#344b60)",
      }}
    >
      <Badge variant="over-media">재생 중</Badge>
    </div>
  );
}
