"use client";

import { Avatar } from "../../components/ui/avatar";

export function AvatarExample() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {["AB", "CD", "EF"].map((name) => (
        <Avatar.Root key={name}>
          <Avatar.Fallback>{name}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
