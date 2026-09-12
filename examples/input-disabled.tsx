"use client";
import { Input } from "../src/components/ui/input";

export function InputDisabledExample() {
  return (
    <div>
      <Input aria-label="프로젝트 이름" disabled defaultValue="프로젝트 A" />
    </div>
  );
}
