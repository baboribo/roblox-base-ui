"use client";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      업데이트 소식 받기
    </label>
  );
}
