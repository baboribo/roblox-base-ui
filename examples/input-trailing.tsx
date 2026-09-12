"use client";
import { Input } from "../src/components/ui/input";
import { Icon } from "../src/components/ui/icon";

export function InputTrailingExample() {
  return (
    <Input
      aria-label="프로젝트 검색"
      placeholder="프로젝트 검색"
      trailing={<Icon name="icon-regular-circle-i" size={20} />}
    />
  );
}
