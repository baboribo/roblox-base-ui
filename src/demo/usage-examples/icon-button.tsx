"use client";

import { IconButton } from "../../components/ui/icon-button";

export function IconButtonExample() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <IconButton
          key={size}
          icon="icon-regular-person-plus"
          aria-label={`Add ${size}`}
          size={size}
          variant="utility"
          circular
        />
      ))}
      <IconButton icon="icon-regular-x" aria-label="Disabled close" disabled />
    </div>
  );
}
