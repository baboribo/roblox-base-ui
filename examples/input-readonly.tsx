"use client";
import { Input } from "../src/components/ui/input";

export function InputReadonlyExample() {
  return (
    <div>
      <Input aria-label="프로젝트 이름" readOnly value="project-001" />
    </div>
  );
}
