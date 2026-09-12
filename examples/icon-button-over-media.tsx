"use client";
import { IconButton } from "../src/components/ui/icon-button";

export function IconButtonOverMediaExample() {
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
      <IconButton
        icon="icon-regular-person-plus"
        aria-label="멤버 추가"
        variant="over-media"
      />
    </div>
  );
}
