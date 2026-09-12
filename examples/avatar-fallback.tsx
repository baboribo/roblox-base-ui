"use client";
import { Avatar } from "../src/components/ui/avatar";

export function AvatarFallbackExample() {
  return (
    <Avatar.Root>
      <Avatar.Fallback>김</Avatar.Fallback>
    </Avatar.Root>
  );
}
