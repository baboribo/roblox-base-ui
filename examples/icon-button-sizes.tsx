"use client";
import { IconButton } from "../src/components/ui/icon-button";

export function IconButtonSizesExample() {
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
        <IconButton
          icon="icon-regular-person-plus"
          aria-label="멤버 추가 xs"
          size="xs"
        />
        <span style={{ fontSize: 12 }}>xs · 24px</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <IconButton
          icon="icon-regular-person-plus"
          aria-label="멤버 추가 sm"
          size="sm"
        />
        <span style={{ fontSize: 12 }}>sm · 32px</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <IconButton
          icon="icon-regular-person-plus"
          aria-label="멤버 추가 md"
          size="md"
        />
        <span style={{ fontSize: 12 }}>md · 40px</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <IconButton
          icon="icon-regular-person-plus"
          aria-label="멤버 추가 lg"
          size="lg"
        />
        <span style={{ fontSize: 12 }}>lg · 48px</span>
      </div>
    </div>
  );
}
