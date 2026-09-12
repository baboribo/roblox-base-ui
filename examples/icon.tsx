"use client";

import { Icon } from "../src/components/ui/icon";

export function IconExample() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {(
        [
          "icon-regular-x",
          "icon-filled-magnifying-glass",
          "icon-regular-person-plus",
          "icon-filled-check",
          "icon-regular-gear",
        ] as const
      ).map((name) => (
        <Icon key={name} name={name} size={32} />
      ))}
    </div>
  );
}
