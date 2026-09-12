"use client";
import { IconButton } from "../src/components/ui/icon-button";

export function IconButtonDisabledExample() {
  return (
    <IconButton
      icon="icon-regular-person-plus"
      aria-label="멤버 추가"
      disabled
    />
  );
}
