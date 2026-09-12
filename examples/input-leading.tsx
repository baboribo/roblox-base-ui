"use client";
import { Input } from "../src/components/ui/input";
import { Icon } from "../src/components/ui/icon";

export function InputLeadingExample() {
  return (
    <Input
      aria-label="프로젝트 검색"
      placeholder="프로젝트 검색"
      leading={<Icon name="icon-filled-magnifying-glass" size={20} />}
    />
  );
}
