"use client";

import { Badge } from "../../components/ui/badge";

export function BadgeExample() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <Badge>기본</Badge>
      <Badge
        style={{
          background: "var(--rbx-color-action-soft-emphasis-background)",
          color: "var(--rbx-color-action-soft-emphasis-foreground)",
        }}
      >
        업데이트
      </Badge>
      <Badge>비공개</Badge>
    </div>
  );
}
